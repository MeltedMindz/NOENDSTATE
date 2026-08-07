// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title TreasuryRouter — routes eligible project revenue by approved schedule
/// @notice PROTOTYPE. Revenue arrives attributed to a project id and is split
/// across four sinks (State Zero distributor, treasury, operating, reserve)
/// according to a basis-point schedule that must always total exactly 10_000.
/// Sinks withdraw via pull. There are no arbitrary external calls and no
/// owner extraction path outside the published schedule.
contract TreasuryRouter is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Schedule {
        uint16 stateZeroBps;
        uint16 treasuryBps;
        uint16 operatingBps;
        uint16 reserveBps;
    }

    struct Sinks {
        address stateZeroDistributor;
        address treasury;
        address operating;
        address reserve;
    }

    Schedule public schedule;
    Sinks public sinks;

    /// @notice Approved revenue assets. ETH is always implicitly approved.
    mapping(address token => bool) public approvedAsset;

    /// @notice Pull balances: sink → ETH amount.
    mapping(address sink => uint256) public ethBalance;
    /// @notice Pull balances: sink → token → amount.
    mapping(address sink => mapping(address token => uint256)) public tokenBalance;

    event ScheduleSet(uint16 stateZeroBps, uint16 treasuryBps, uint16 operatingBps, uint16 reserveBps);
    event SinksSet(address stateZeroDistributor, address treasury, address operating, address reserve);
    event AssetApproved(address indexed token, bool approved);
    event RevenueReceived(bytes32 indexed projectId, address indexed token, uint256 amount);
    event Withdrawn(address indexed sink, address indexed token, uint256 amount);

    error BpsMustTotal10000();
    error SinkUnset();
    error AssetNotApproved();
    error NothingToWithdraw();
    error ZeroAmount();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // ── configuration ──────────────────────────────────────────────────

    function setSchedule(Schedule calldata s) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (uint256(s.stateZeroBps) + s.treasuryBps + s.operatingBps + s.reserveBps != 10_000) {
            revert BpsMustTotal10000();
        }
        schedule = s;
        emit ScheduleSet(s.stateZeroBps, s.treasuryBps, s.operatingBps, s.reserveBps);
    }

    function setSinks(Sinks calldata s) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (
            s.stateZeroDistributor == address(0) || s.treasury == address(0)
                || s.operating == address(0) || s.reserve == address(0)
        ) revert SinkUnset();
        sinks = s;
        emit SinksSet(s.stateZeroDistributor, s.treasury, s.operating, s.reserve);
    }

    function setAssetApproval(address token, bool approved) external onlyRole(DEFAULT_ADMIN_ROLE) {
        approvedAsset[token] = approved;
        emit AssetApproved(token, approved);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ── revenue intake ─────────────────────────────────────────────────

    /// @notice Receive ETH revenue attributed to a project.
    function receiveRevenue(bytes32 projectId) external payable whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();
        if (sinks.treasury == address(0)) revert SinkUnset();
        _split(msg.value, address(0));
        emit RevenueReceived(projectId, address(0), msg.value);
    }

    /// @notice Receive ERC-20 revenue attributed to a project. Uses the
    /// actually-received balance delta so fee-on-transfer tokens cannot
    /// inflate accounting.
    function receiveTokenRevenue(bytes32 projectId, IERC20 token, uint256 amount)
        external
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        if (!approvedAsset[address(token)]) revert AssetNotApproved();
        if (sinks.treasury == address(0)) revert SinkUnset();
        uint256 before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = token.balanceOf(address(this)) - before;
        _split(received, address(token));
        emit RevenueReceived(projectId, address(token), received);
    }

    function _split(uint256 amount, address token) private {
        Schedule memory s = schedule;
        Sinks memory k = sinks;
        uint256 toStateZero = (amount * s.stateZeroBps) / 10_000;
        uint256 toTreasury = (amount * s.treasuryBps) / 10_000;
        uint256 toOperating = (amount * s.operatingBps) / 10_000;
        // Reserve absorbs rounding dust so the full amount is always allocated.
        uint256 toReserve = amount - toStateZero - toTreasury - toOperating;
        if (token == address(0)) {
            ethBalance[k.stateZeroDistributor] += toStateZero;
            ethBalance[k.treasury] += toTreasury;
            ethBalance[k.operating] += toOperating;
            ethBalance[k.reserve] += toReserve;
        } else {
            tokenBalance[k.stateZeroDistributor][token] += toStateZero;
            tokenBalance[k.treasury][token] += toTreasury;
            tokenBalance[k.operating][token] += toOperating;
            tokenBalance[k.reserve][token] += toReserve;
        }
    }

    // ── pull withdrawals ───────────────────────────────────────────────

    function withdrawETH() external nonReentrant {
        uint256 amount = ethBalance[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        ethBalance[msg.sender] = 0;
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "eth send failed");
        emit Withdrawn(msg.sender, address(0), amount);
    }

    function withdrawToken(IERC20 token) external nonReentrant {
        uint256 amount = tokenBalance[msg.sender][address(token)];
        if (amount == 0) revert NothingToWithdraw();
        tokenBalance[msg.sender][address(token)] = 0;
        token.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, address(token), amount);
    }
}
