// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ChronicleRegistry — the onchain append-only company record
/// @notice PROTOTYPE. Records can only be appended, never edited or
/// deleted. A correction appends a new record whose `supersedes` field
/// points at the earlier sequence; the earlier record stays readable
/// forever. A rolling root commits to the entire history.
contract ChronicleRegistry is AccessControl {
    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");

    uint64 public constant NO_SUPERSEDES = type(uint64).max;

    struct Record {
        uint64 sequence;
        uint8 eventType;
        bytes32 contentHash;
        bytes32 projectId; // 0x0 for studio-level records
        uint64 occurredAt; // when it happened
        uint64 recordedAt; // when it was written (block time)
        uint64 supersedes; // NO_SUPERSEDES if not a correction
        string uri; // offchain content pointer
    }

    uint64 public nextSequence;
    bytes32 public root;
    mapping(uint64 sequence => Record) private _records;

    event Appended(
        uint64 indexed sequence,
        uint8 indexed eventType,
        bytes32 contentHash,
        bytes32 indexed projectId,
        uint64 supersedes,
        string uri
    );

    error SupersedesUnknown();
    error RecordMissing();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Append the next record. Storage for a sequence is written
    /// exactly once; there is no function anywhere in this contract that
    /// mutates an existing record.
    function append(
        uint8 eventType,
        bytes32 contentHash,
        bytes32 projectId,
        uint64 occurredAt,
        uint64 supersedes,
        string calldata uri
    ) external onlyRole(RECORDER_ROLE) returns (uint64 sequence) {
        if (supersedes != NO_SUPERSEDES && supersedes >= nextSequence) {
            revert SupersedesUnknown();
        }
        sequence = nextSequence;
        unchecked {
            nextSequence = sequence + 1;
        }
        _records[sequence] = Record({
            sequence: sequence,
            eventType: eventType,
            contentHash: contentHash,
            projectId: projectId,
            occurredAt: occurredAt,
            recordedAt: uint64(block.timestamp),
            supersedes: supersedes,
            uri: uri
        });
        root = keccak256(abi.encodePacked(root, contentHash));
        emit Appended(sequence, eventType, contentHash, projectId, supersedes, uri);
    }

    function record(uint64 sequence) external view returns (Record memory r) {
        if (sequence >= nextSequence) revert RecordMissing();
        r = _records[sequence];
    }
}
