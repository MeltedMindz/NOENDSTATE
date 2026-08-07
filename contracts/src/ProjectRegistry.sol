// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ProjectRegistry — stable onchain project identities
/// @notice PROTOTYPE. Projects register once with a stable id. Status
/// transitions and policy changes only ever append to history and emit
/// events; prior states remain readable. Deregistration does not exist —
/// sunset projects stay in the registry.
contract ProjectRegistry is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    enum Status {
        Research,
        Prototype,
        Building,
        Live,
        Sunset,
        Archived
    }

    struct Project {
        bytes32 id;
        Status status;
        bytes32 metadataHash;
        string uri;
        uint16 stateZeroAllocationBps; // 0 unless an approved policy exists
        bool policyApproved;
        uint64 registeredAt;
        uint64 updatedAt;
        bool exists;
    }

    mapping(bytes32 id => Project) private _projects;
    mapping(bytes32 id => Status[]) private _statusHistory;
    bytes32[] private _ids;

    event ProjectRegistered(bytes32 indexed id, bytes32 metadataHash, string uri);
    event StatusChanged(bytes32 indexed id, Status indexed from, Status indexed to);
    event MetadataUpdated(bytes32 indexed id, bytes32 metadataHash, string uri);
    event PolicySet(bytes32 indexed id, uint16 stateZeroAllocationBps, bool approved);

    error AlreadyRegistered();
    error UnknownProject();
    error BpsOutOfRange();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function register(bytes32 id, bytes32 metadataHash, string calldata uri)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        if (_projects[id].exists) revert AlreadyRegistered();
        _projects[id] = Project({
            id: id,
            status: Status.Research,
            metadataHash: metadataHash,
            uri: uri,
            stateZeroAllocationBps: 0,
            policyApproved: false,
            registeredAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp),
            exists: true
        });
        _statusHistory[id].push(Status.Research);
        _ids.push(id);
        emit ProjectRegistered(id, metadataHash, uri);
    }

    function setStatus(bytes32 id, Status to) external onlyRole(REGISTRAR_ROLE) {
        Project storage p = _projects[id];
        if (!p.exists) revert UnknownProject();
        Status from = p.status;
        p.status = to;
        p.updatedAt = uint64(block.timestamp);
        _statusHistory[id].push(to);
        emit StatusChanged(id, from, to);
    }

    function updateMetadata(bytes32 id, bytes32 metadataHash, string calldata uri)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        Project storage p = _projects[id];
        if (!p.exists) revert UnknownProject();
        p.metadataHash = metadataHash;
        p.uri = uri;
        p.updatedAt = uint64(block.timestamp);
        emit MetadataUpdated(id, metadataHash, uri);
    }

    /// @notice Record an approved revenue policy. Approval here mirrors an
    /// offchain governance/legal decision; the router reads this value.
    function setPolicy(bytes32 id, uint16 stateZeroAllocationBps, bool approved)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Project storage p = _projects[id];
        if (!p.exists) revert UnknownProject();
        if (stateZeroAllocationBps > 10_000) revert BpsOutOfRange();
        p.stateZeroAllocationBps = stateZeroAllocationBps;
        p.policyApproved = approved;
        p.updatedAt = uint64(block.timestamp);
        emit PolicySet(id, stateZeroAllocationBps, approved);
    }

    function project(bytes32 id) external view returns (Project memory p) {
        p = _projects[id];
        if (!p.exists) revert UnknownProject();
    }

    function statusHistory(bytes32 id) external view returns (Status[] memory) {
        if (!_projects[id].exists) revert UnknownProject();
        return _statusHistory[id];
    }

    function count() external view returns (uint256) {
        return _ids.length;
    }

    function idAt(uint256 index) external view returns (bytes32) {
        return _ids[index];
    }
}
