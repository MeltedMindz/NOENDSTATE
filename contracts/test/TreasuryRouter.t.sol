// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {TreasuryRouter} from "../src/TreasuryRouter.sol";
import {MockERC20, RevertingToken, FeeToken} from "./Mocks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreasuryRouterTest is Test {
    TreasuryRouter router;
    MockERC20 token;
    address admin = makeAddr("admin");
    address distributor = makeAddr("distributor");
    address treasury = makeAddr("treasury");
    address operating = makeAddr("operating");
    address reserve = makeAddr("reserve");
    address payer = makeAddr("payer");

    function setUp() public {
        router = new TreasuryRouter(admin);
        token = new MockERC20();
        vm.startPrank(admin);
        router.setSchedule(TreasuryRouter.Schedule(2000, 4000, 3000, 1000));
        router.setSinks(TreasuryRouter.Sinks(distributor, treasury, operating, reserve));
        router.setAssetApproval(address(token), true);
        vm.stopPrank();
        vm.deal(payer, 1000 ether);
        token.mint(payer, 1_000_000e18);
    }

    function test_scheduleMustTotalExactly10000() public {
        vm.startPrank(admin);
        vm.expectRevert(TreasuryRouter.BpsMustTotal10000.selector);
        router.setSchedule(TreasuryRouter.Schedule(2000, 4000, 3000, 999));
        vm.expectRevert(TreasuryRouter.BpsMustTotal10000.selector);
        router.setSchedule(TreasuryRouter.Schedule(3000, 4000, 3000, 1000));
        vm.stopPrank();
    }

    function test_ethSplitMatchesSchedule() public {
        vm.prank(payer);
        router.receiveRevenue{value: 100 ether}(bytes32("P-000"));
        assertEq(router.ethBalance(distributor), 20 ether);
        assertEq(router.ethBalance(treasury), 40 ether);
        assertEq(router.ethBalance(operating), 30 ether);
        assertEq(router.ethBalance(reserve), 10 ether);
    }

    function test_zeroValueReverts() public {
        vm.prank(payer);
        vm.expectRevert(TreasuryRouter.ZeroAmount.selector);
        router.receiveRevenue{value: 0}(bytes32("P-000"));
    }

    function testFuzz_fullAmountAlwaysAllocated(uint96 amount) public {
        vm.assume(amount > 0);
        vm.deal(payer, amount);
        vm.prank(payer);
        router.receiveRevenue{value: amount}(bytes32("P-000"));
        uint256 total = router.ethBalance(distributor) + router.ethBalance(treasury)
            + router.ethBalance(operating) + router.ethBalance(reserve);
        // Reserve absorbs dust: allocation is exact, nothing stranded.
        assertEq(total, amount);
    }

    function test_tokenRevenueRequiresApproval() public {
        MockERC20 unapproved = new MockERC20();
        unapproved.mint(payer, 100e18);
        vm.startPrank(payer);
        unapproved.approve(address(router), 100e18);
        vm.expectRevert(TreasuryRouter.AssetNotApproved.selector);
        router.receiveTokenRevenue(bytes32("P-000"), IERC20(address(unapproved)), 100e18);
        vm.stopPrank();
    }

    function test_feeOnTransferAccountsReceivedNotSent() public {
        FeeToken fee = new FeeToken();
        fee.mint(payer, 100e18);
        vm.prank(admin);
        router.setAssetApproval(address(fee), true);
        vm.startPrank(payer);
        fee.approve(address(router), 100e18);
        router.receiveTokenRevenue(bytes32("P-000"), IERC20(address(fee)), 100e18);
        vm.stopPrank();
        uint256 received = 90e18; // 10% fee burned in transit
        uint256 total = router.tokenBalance(distributor, address(fee))
            + router.tokenBalance(treasury, address(fee))
            + router.tokenBalance(operating, address(fee))
            + router.tokenBalance(reserve, address(fee));
        assertEq(total, received);
    }

    function test_maliciousTokenCannotCorruptState() public {
        RevertingToken bad = new RevertingToken();
        bad.mint(payer, 100e18);
        vm.prank(admin);
        router.setAssetApproval(address(bad), true);
        vm.startPrank(payer);
        bad.approve(address(router), 100e18);
        vm.expectRevert();
        router.receiveTokenRevenue(bytes32("P-000"), IERC20(address(bad)), 100e18);
        vm.stopPrank();
        assertEq(router.tokenBalance(treasury, address(bad)), 0);
    }

    function test_pullWithdrawals() public {
        vm.prank(payer);
        router.receiveRevenue{value: 10 ether}(bytes32("P-000"));
        uint256 before = treasury.balance;
        vm.prank(treasury);
        router.withdrawETH();
        assertEq(treasury.balance - before, 4 ether);
        assertEq(router.ethBalance(treasury), 0);
        vm.prank(treasury);
        vm.expectRevert(TreasuryRouter.NothingToWithdraw.selector);
        router.withdrawETH();
    }

    function test_pauseBlocksIntake() public {
        vm.prank(admin);
        router.pause();
        vm.prank(payer);
        vm.expectRevert();
        router.receiveRevenue{value: 1 ether}(bytes32("P-000"));
    }

    function test_intakeRevertsWithoutSinks() public {
        TreasuryRouter fresh = new TreasuryRouter(admin);
        vm.prank(admin);
        fresh.setSchedule(TreasuryRouter.Schedule(2500, 2500, 2500, 2500));
        vm.prank(payer);
        vm.expectRevert(TreasuryRouter.SinkUnset.selector);
        fresh.receiveRevenue{value: 1 ether}(bytes32("P-000"));
    }
}
