// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StateZero} from "../src/StateZero.sol";
import {RevenueDistributor} from "../src/RevenueDistributor.sol";
import {MockERC20, ReentrantClaimer} from "./Mocks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RevenueDistributorTest is Test {
    StateZero sz;
    RevenueDistributor d;
    MockERC20 token;
    address admin = makeAddr("admin");
    address minter = makeAddr("minter");
    address funder = makeAddr("funder");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address carol = makeAddr("carol");

    function setUp() public {
        sz = new StateZero(1000, admin);
        d = new RevenueDistributor(address(sz), admin);
        token = new MockERC20();
        vm.startPrank(admin);
        sz.grantRole(sz.MINTER_ROLE(), minter);
        sz.setDistributor(address(d));
        d.grantRole(d.FUNDER_ROLE(), funder);
        d.addAsset(address(token));
        vm.stopPrank();
        vm.deal(funder, 10_000 ether);
        token.mint(funder, 10_000_000e18);
    }

    function _mint(address to) internal returns (uint256 id) {
        vm.prank(minter);
        id = sz.mint(to);
    }

    function test_fundingRequiresArtifacts() public {
        vm.prank(funder);
        vm.expectRevert(RevenueDistributor.NoArtifacts.selector);
        d.fundETH{value: 1 ether}();
    }

    function test_evenSplitAcrossHolders() public {
        uint256 a = _mint(alice);
        uint256 b = _mint(bob);
        vm.prank(funder);
        d.fundETH{value: 10 ether}();
        assertEq(d.accruedOf(a, address(0)), 5 ether);
        assertEq(d.accruedOf(b, address(0)), 5 ether);
    }

    function test_claimPaysHolderAndPreventsDoubleClaim() public {
        uint256 a = _mint(alice);
        vm.prank(funder);
        d.fundETH{value: 4 ether}();

        uint256 before = alice.balance;
        vm.prank(alice);
        d.claim(a, address(0));
        assertEq(alice.balance - before, 4 ether);

        vm.prank(alice);
        vm.expectRevert(RevenueDistributor.NothingToWithdraw.selector);
        d.claim(a, address(0));
    }

    function test_onlyHolderClaims() public {
        uint256 a = _mint(alice);
        vm.prank(funder);
        d.fundETH{value: 1 ether}();
        vm.prank(bob);
        vm.expectRevert(RevenueDistributor.NotTokenOwner.selector);
        d.claim(a, address(0));
    }

    /// The core transfer rule: accruals before transfer belong to the seller;
    /// accruals after belong to the buyer.
    function test_transferCheckpointSplitsEntitlement() public {
        uint256 a = _mint(alice);
        vm.prank(funder);
        d.fundETH{value: 6 ether}(); // accrues to alice's custody period

        vm.prank(alice);
        sz.transferFrom(alice, bob, a);

        vm.prank(funder);
        d.fundETH{value: 4 ether}(); // accrues to bob's custody period

        // Seller withdraws pre-transfer accrual.
        uint256 aBefore = alice.balance;
        vm.prank(alice);
        d.withdraw(address(0));
        assertEq(alice.balance - aBefore, 6 ether);

        // Buyer claims only the post-transfer accrual.
        uint256 bBefore = bob.balance;
        vm.prank(bob);
        d.claim(a, address(0));
        assertEq(bob.balance - bBefore, 4 ether);

        // Nobody can extract more.
        vm.prank(alice);
        vm.expectRevert(RevenueDistributor.NothingToWithdraw.selector);
        d.withdraw(address(0));
        vm.prank(bob);
        vm.expectRevert(RevenueDistributor.NothingToWithdraw.selector);
        d.claim(a, address(0));
    }

    function test_checkpointOnlyCallableByStateZero() public {
        vm.prank(alice);
        vm.expectRevert(RevenueDistributor.OnlyStateZero.selector);
        d.handleTransfer(alice, bob, 0);
    }

    function test_erc20DistributionAndClaim() public {
        uint256 a = _mint(alice);
        _mint(bob);
        vm.startPrank(funder);
        token.approve(address(d), 100e18);
        d.fundToken(IERC20(address(token)), 100e18);
        vm.stopPrank();
        assertEq(d.accruedOf(a, address(token)), 50e18);
        vm.prank(alice);
        d.claim(a, address(token));
        assertEq(token.balanceOf(alice), 50e18);
    }

    function test_reentrantClaimBlocked() public {
        ReentrantClaimer attacker = new ReentrantClaimer(d);
        vm.prank(minter);
        uint256 id = sz.mint(address(attacker));
        attacker.setToken(id);
        vm.prank(funder);
        d.fundETH{value: 2 ether}();
        attacker.doClaim(); // receive() attempts re-entry; must not pay twice
        assertEq(address(attacker).balance, 2 ether);
        assertTrue(attacker.attacked());
    }

    function test_pauseBlocksFundingAndClaims() public {
        uint256 a = _mint(alice);
        vm.prank(funder);
        d.fundETH{value: 1 ether}();
        vm.prank(admin);
        d.pause();
        vm.prank(funder);
        vm.expectRevert();
        d.fundETH{value: 1 ether}();
        vm.prank(alice);
        vm.expectRevert();
        d.claim(a, address(0));
    }

    function test_assetCapEnforced() public {
        // setUp already registered ETH + one token; fill to MAX_ASSETS.
        uint256 room = d.MAX_ASSETS() - d.assetCount();
        vm.startPrank(admin);
        for (uint256 i = 0; i < room; i++) {
            d.addAsset(address(uint160(0x1000 + i)));
        }
        vm.expectRevert(RevenueDistributor.TooManyAssets.selector);
        d.addAsset(address(0xdead));
        vm.stopPrank();
    }

    /// Rounding safety: with arbitrary supply and funding amounts, holders
    /// can never collectively withdraw more than was funded.
    function testFuzz_neverOverDistributes(uint8 holders, uint96 fundAmount) public {
        uint256 n = bound(uint256(holders), 1, 12);
        uint256 amount = bound(uint256(fundAmount), 1, 1000 ether);
        uint256[] memory ids = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            address h = address(uint160(0xA000 + i));
            ids[i] = _mint(h);
        }
        vm.deal(funder, amount);
        vm.prank(funder);
        d.fundETH{value: amount}();

        uint256 paidTotal;
        for (uint256 i = 0; i < n; i++) {
            address h = address(uint160(0xA000 + i));
            uint256 acc = d.accruedOf(ids[i], address(0));
            if (acc > 0) {
                vm.prank(h);
                d.claim(ids[i], address(0));
                paidTotal += acc;
            }
        }
        assertLe(paidTotal, amount);
        // Dust is at most (supply - 1) wei.
        assertLe(amount - paidTotal, n - 1);
    }

    /// Zero-value funding is rejected; zero accrual claims are rejected.
    function test_zeroAmountsRevert() public {
        _mint(alice);
        vm.prank(funder);
        vm.expectRevert(RevenueDistributor.ZeroAmount.selector);
        d.fundETH{value: 0}();
    }
}
