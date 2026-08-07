// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StateZero} from "../src/StateZero.sol";
import {StateRenderer} from "../src/StateRenderer.sol";
import {RevenueDistributor} from "../src/RevenueDistributor.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract StateZeroTest is Test {
    StateZero sz;
    StateRenderer renderer;
    address admin = makeAddr("admin");
    address minter = makeAddr("minter");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        sz = new StateZero(100, admin);
        renderer = new StateRenderer();
        vm.startPrank(admin);
        sz.grantRole(sz.MINTER_ROLE(), minter);
        sz.setRenderer(address(renderer));
        vm.stopPrank();
    }

    function test_maxSupplyIsImmutableAndEnforced() public {
        StateZero small = new StateZero(2, admin);
        vm.startPrank(admin);
        small.grantRole(small.MINTER_ROLE(), minter);
        vm.stopPrank();
        vm.startPrank(minter);
        small.mint(alice);
        small.mint(alice);
        vm.expectRevert(StateZero.MaxSupplyReached.selector);
        small.mint(alice);
        vm.stopPrank();
        assertEq(small.totalMinted(), 2);
    }

    function test_onlyMinterCanMint() public {
        vm.prank(alice);
        vm.expectRevert();
        sz.mint(alice);
    }

    function test_mintAssignsDeterministicSeed() public {
        vm.prank(minter);
        uint256 id = sz.mint(alice);
        bytes32 expected = keccak256(abi.encodePacked(id, sz.chronicleRoot(), address(sz)));
        assertEq(sz.tokenSeed(id), expected);
    }

    function test_burnIsDisabled() public {
        vm.prank(minter);
        uint256 id = sz.mint(alice);
        // OZ's transferFrom rejects the zero receiver before our hook; the
        // BurnDisabled guard in _update is defense-in-depth. Either way, no
        // path to burning exists — the contract exposes no burn function.
        vm.prank(alice);
        vm.expectRevert();
        sz.transferFrom(alice, address(0), id);
        assertEq(sz.ownerOf(id), alice);
    }

    function test_pauseBlocksMintAndTransfer() public {
        vm.prank(minter);
        uint256 id = sz.mint(alice);
        vm.prank(admin);
        sz.pause();
        vm.prank(minter);
        vm.expectRevert();
        sz.mint(alice);
        vm.prank(alice);
        vm.expectRevert();
        sz.transferFrom(alice, bob, id);
        vm.prank(admin);
        sz.unpause();
        vm.prank(alice);
        sz.transferFrom(alice, bob, id);
        assertEq(sz.ownerOf(id), bob);
    }

    function test_transferRunsDistributorCheckpoint() public {
        RevenueDistributor d = new RevenueDistributor(address(sz), admin);
        vm.startPrank(admin);
        sz.setDistributor(address(d));
        d.grantRole(d.FUNDER_ROLE(), admin);
        vm.stopPrank();

        vm.prank(minter);
        uint256 id = sz.mint(alice);

        vm.deal(admin, 10 ether);
        vm.prank(admin);
        d.fundETH{value: 10 ether}();

        // Transfer settles alice's accrual into her withdrawable balance.
        vm.prank(alice);
        sz.transferFrom(alice, bob, id);
        assertEq(d.withdrawable(alice, address(0)), 10 ether);
        assertEq(d.accruedOf(id, address(0)), 0);
    }

    function test_chronicleSyncRequiresRole() public {
        vm.prank(alice);
        vm.expectRevert();
        sz.syncChronicle(bytes32(uint256(1)), 5);

        bytes32 role = sz.RECORDER_ROLE();
        vm.prank(admin);
        sz.grantRole(role, alice);
        vm.prank(alice);
        sz.syncChronicle(bytes32(uint256(1)), 5);
        assertEq(sz.eventsWitnessed(), 5);
    }

    function test_tokenURIRendersFromRenderer() public {
        vm.prank(minter);
        uint256 id = sz.mint(alice);
        string memory uri = sz.tokenURI(id);
        assertTrue(bytes(uri).length > 100);
        assertEq(_prefix(uri), "data:application/json;base64,");
    }

    function _prefix(string memory s) private pure returns (string memory) {
        bytes memory b = bytes(s);
        bytes memory p = new bytes(29);
        for (uint256 i = 0; i < 29; i++) p[i] = b[i];
        return string(p);
    }
}
