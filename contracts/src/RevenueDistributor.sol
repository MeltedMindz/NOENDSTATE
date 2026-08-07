// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IStateZero} from "./interfaces.sol";

/// @title RevenueDistributor — checkpointed distributions to State Zero holders
/// @notice PROTOTYPE. Cumulative per-artifact accounting (funds-distribution
/// pattern) with a transfer checkpoint:
///  - A distribution is attributable to the holder entitled at the moment it
///    was funded (the checkpoint).
///  - On transfer, everything accrued to the token settles into the SELLER's
///    withdrawable balance; the buyer starts accruing from the checkpoint.
///  - Nothing is ever distributed twice: claims move the token's cursor to
///    the current cumulative index.
///  - No distribution iterates over tokens; funding is O(1) and claiming is
///    O(1) per token per asset.
contract RevenueDistributor is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant FUNDER_ROLE = keccak256("FUNDER_ROLE");

    /// @dev Precision magnifier for per-artifact cumulative indices.
    uint256 private constant MAGNITUDE = 2 ** 128;

    /// @dev ETH is modeled as asset address(0).
    address public constant ETH_ASSET = address(0);

    IStateZero public immutable stateZero;

    /// @notice Approved assets (bounded list — transfers iterate it).
    address[] public assets;
    mapping(address asset => bool) public assetApproved;
    uint256 public constant MAX_ASSETS = 16;

    /// @notice Cumulative distribution index per asset (magnified).
    mapping(address asset => uint256) public cumulativePerArtifact;
    /// @notice Per-token cursor into the cumulative index (magnified).
    mapping(address asset => mapping(uint256 tokenId => uint256)) public tokenCursor;
    /// @notice Settled balances (from transfers) awaiting withdrawal.
    mapping(address holder => mapping(address asset => uint256)) public withdrawable;

    /// @notice Lifetime accounting for the over-payment invariant.
    mapping(address asset => uint256) public totalFunded;
    mapping(address asset => uint256) public totalPaid;

    event AssetAdded(address indexed asset);
    event Funded(address indexed asset, uint256 amount, uint256 perArtifactIndex);
    event Settled(uint256 indexed tokenId, address indexed holder, address indexed asset, uint256 amount);
    event Claimed(uint256 indexed tokenId, address indexed holder, address indexed asset, uint256 amount);
    event Withdrawn(address indexed holder, address indexed asset, uint256 amount);

    error OnlyStateZero();
    error NoArtifacts();
    error NotTokenOwner();
    error AssetNotApproved();
    error TooManyAssets();
    error ZeroAmount();
    error NothingToWithdraw();

    constructor(address stateZero_, address admin) {
        stateZero = IStateZero(stateZero_);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        // ETH is always an approved asset.
        assets.push(ETH_ASSET);
        assetApproved[ETH_ASSET] = true;
    }

    // ── configuration ──────────────────────────────────────────────────

    function addAsset(address asset) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (assetApproved[asset]) return;
        if (assets.length >= MAX_ASSETS) revert TooManyAssets();
        assets.push(asset);
        assetApproved[asset] = true;
        emit AssetAdded(asset);
    }

    function assetCount() external view returns (uint256) {
        return assets.length;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ── funding ────────────────────────────────────────────────────────

    /// @notice Fund an ETH distribution across all minted artifacts.
    function fundETH() external payable onlyRole(FUNDER_ROLE) whenNotPaused {
        if (msg.value == 0) revert ZeroAmount();
        uint256 supply = stateZero.totalMinted();
        if (supply == 0) revert NoArtifacts();
        cumulativePerArtifact[ETH_ASSET] += (msg.value * MAGNITUDE) / supply;
        totalFunded[ETH_ASSET] += msg.value;
        emit Funded(ETH_ASSET, msg.value, cumulativePerArtifact[ETH_ASSET]);
    }

    /// @notice Fund a token distribution. Caller must have approved this
    /// contract; the received balance delta is what gets distributed.
    function fundToken(IERC20 token, uint256 amount) external onlyRole(FUNDER_ROLE) whenNotPaused nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (!assetApproved[address(token)]) revert AssetNotApproved();
        uint256 supply = stateZero.totalMinted();
        if (supply == 0) revert NoArtifacts();
        uint256 before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = token.balanceOf(address(this)) - before;
        cumulativePerArtifact[address(token)] += (received * MAGNITUDE) / supply;
        totalFunded[address(token)] += received;
        emit Funded(address(token), received, cumulativePerArtifact[address(token)]);
    }

    // ── views ──────────────────────────────────────────────────────────

    /// @notice Unclaimed accrual attached to a token for an asset.
    function accruedOf(uint256 tokenId, address asset) public view returns (uint256) {
        return (cumulativePerArtifact[asset] - tokenCursor[asset][tokenId]) / MAGNITUDE;
    }

    // ── transfer checkpoint ────────────────────────────────────────────

    /// @notice Called by StateZero before ownership changes. Settles every
    /// asset's accrual into the seller's withdrawable balance so history
    /// stays with the holder entitled at the checkpoint.
    function handleTransfer(address from, address, /* to */ uint256 tokenId) external {
        if (msg.sender != address(stateZero)) revert OnlyStateZero();
        uint256 n = assets.length; // bounded by MAX_ASSETS
        for (uint256 i = 0; i < n; ++i) {
            address asset = assets[i];
            uint256 amount = accruedOf(tokenId, asset);
            tokenCursor[asset][tokenId] = cumulativePerArtifact[asset];
            if (amount > 0 && from != address(0)) {
                withdrawable[from][asset] += amount;
                emit Settled(tokenId, from, asset, amount);
            }
        }
    }

    // ── claims ─────────────────────────────────────────────────────────

    /// @notice Claim a token's accrual directly to its current holder.
    function claim(uint256 tokenId, address asset) external nonReentrant whenNotPaused {
        if (stateZero.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (!assetApproved[asset]) revert AssetNotApproved();
        uint256 amount = accruedOf(tokenId, asset);
        if (amount == 0) revert NothingToWithdraw();
        tokenCursor[asset][tokenId] = cumulativePerArtifact[asset];
        totalPaid[asset] += amount;
        _payout(msg.sender, asset, amount);
        emit Claimed(tokenId, msg.sender, asset, amount);
    }

    /// @notice Withdraw balances settled by transfer checkpoints.
    function withdraw(address asset) external nonReentrant {
        uint256 amount = withdrawable[msg.sender][asset];
        if (amount == 0) revert NothingToWithdraw();
        withdrawable[msg.sender][asset] = 0;
        totalPaid[asset] += amount;
        _payout(msg.sender, asset, amount);
        emit Withdrawn(msg.sender, asset, amount);
    }

    function _payout(address to, address asset, uint256 amount) private {
        if (asset == ETH_ASSET) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "eth send failed");
        } else {
            IERC20(asset).safeTransfer(to, amount);
        }
    }
}
