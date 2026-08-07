// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Distributor hook used by StateZero on every transfer so accrued
/// allocations settle to the holder entitled at the checkpoint.
interface IRevenueDistributor {
    function handleTransfer(address from, address to, uint256 tokenId) external;
}

/// @notice Deterministic metadata renderer for State Zero artifacts.
interface IStateRenderer {
    function tokenURI(
        uint256 tokenId,
        bytes32 seed,
        uint256 eventsWitnessed
    ) external view returns (string memory);
}

/// @notice Minimal surface the distributor needs from the artifact contract.
interface IStateZero {
    function ownerOf(uint256 tokenId) external view returns (address);
    function totalMinted() external view returns (uint256);
}
