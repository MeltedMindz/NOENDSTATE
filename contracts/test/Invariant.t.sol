// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StateZero} from "../src/StateZero.sol";
import {RevenueDistributor} from "../src/RevenueDistributor.sol";

/// Handler that performs random mints, fundings, transfers, claims, and
/// withdrawals against the distributor.
contract DistributorHandler is Test {
    StateZero public sz;
    RevenueDistributor public d;
    address[] public actors;

    constructor(StateZero sz_, RevenueDistributor d_) {
        sz = sz_;
        d = d_;
        for (uint256 i = 0; i < 5; i++) {
            actors.push(address(uint160(0xB000 + i)));
        }
    }

    function mint(uint256 actorSeed) external {
        if (sz.totalMinted() >= 40) return;
        address to = actors[actorSeed % actors.length];
        vm.prank(address(this));
        sz.mint(to);
    }

    function fund(uint96 amount) external {
        if (sz.totalMinted() == 0) return;
        uint256 amt = bound(uint256(amount), 1, 50 ether);
        vm.deal(address(this), amt);
        d.fundETH{value: amt}();
    }

    function transfer(uint256 tokenSeed, uint256 actorSeed) external {
        uint256 minted = sz.totalMinted();
        if (minted == 0) return;
        uint256 id = tokenSeed % minted;
        address owner = sz.ownerOf(id);
        address to = actors[actorSeed % actors.length];
        if (to == owner) return;
        vm.prank(owner);
        sz.transferFrom(owner, to, id);
    }

    function claim(uint256 tokenSeed) external {
        uint256 minted = sz.totalMinted();
        if (minted == 0) return;
        uint256 id = tokenSeed % minted;
        address owner = sz.ownerOf(id);
        if (d.accruedOf(id, address(0)) == 0) return;
        vm.prank(owner);
        d.claim(id, address(0));
    }

    function withdrawSettled(uint256 actorSeed) external {
        address actor = actors[actorSeed % actors.length];
        if (d.withdrawable(actor, address(0)) == 0) return;
        vm.prank(actor);
        d.withdraw(address(0));
    }
}

contract DistributorInvariantTest is Test {
    StateZero sz;
    RevenueDistributor d;
    DistributorHandler handler;
    address admin = makeAddr("admin");

    function setUp() public {
        sz = new StateZero(1000, admin);
        d = new RevenueDistributor(address(sz), admin);
        handler = new DistributorHandler(sz, d);
        vm.startPrank(admin);
        sz.setDistributor(address(d));
        sz.grantRole(sz.MINTER_ROLE(), address(handler));
        d.grantRole(d.FUNDER_ROLE(), address(handler));
        vm.stopPrank();
        targetContract(address(handler));
    }

    /// The distributor can never pay out more than it was funded.
    function invariant_paidNeverExceedsFunded() public view {
        assertLe(d.totalPaid(address(0)), d.totalFunded(address(0)));
    }

    /// The contract always holds enough ETH to cover what it still owes.
    function invariant_solvent() public view {
        assertEq(
            address(d).balance,
            d.totalFunded(address(0)) - d.totalPaid(address(0))
        );
    }
}
