// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IRevenueDistributor, IStateRenderer} from "./interfaces.sol";

/// @title StateZero — the fixed founding cohort of NO END STATE
/// @notice PROTOTYPE. Not deployed, not audited, and gated behind
/// docs/protocol/deployment-gates.md. Economic terms are unset by design.
///
/// Invariants this contract commits to:
///  - `MAX_SUPPLY` is immutable: no post-launch expansion path exists.
///  - Artifacts cannot be burned: the founding cohort is permanent.
///  - Every transfer runs the distributor checkpoint BEFORE ownership
///    changes, so allocations accrued up to that moment settle to the
///    holder entitled at the time.
///  - There is no owner withdrawal backdoor: the contract cannot receive
///    or hold funds.
contract StateZero is ERC721, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");

    uint256 public immutable MAX_SUPPLY;

    /// @notice Immutable per-token seed fixed at mint; drives the artwork.
    mapping(uint256 tokenId => bytes32) public tokenSeed;

    /// @notice Rolling root of the Chronicle at last sync — the shared
    /// company-history layer every artifact witnesses.
    bytes32 public chronicleRoot;

    /// @notice Count of Chronicle events witnessed (for rendering).
    uint256 public eventsWitnessed;

    uint256 private _minted;

    IRevenueDistributor public distributor;
    IStateRenderer public renderer;

    event ChronicleSynced(bytes32 indexed root, uint256 eventsWitnessed);
    event DistributorSet(address indexed distributor);
    event RendererSet(address indexed renderer);
    event ArtifactMinted(uint256 indexed tokenId, address indexed to, bytes32 seed);

    error MaxSupplyReached();
    error BurnDisabled();
    error ZeroAddress();

    constructor(uint256 maxSupply, address admin) ERC721("STATE ZERO", "SZ") {
        if (admin == address(0)) revert ZeroAddress();
        require(maxSupply > 0, "supply=0");
        MAX_SUPPLY = maxSupply;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // ── minting ────────────────────────────────────────────────────────

    /// @notice Mint the next artifact. Payment, allowlists, and sale terms
    /// are intentionally absent from the prototype: they are gated product
    /// decisions, not defaults.
    function mint(address to) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256 tokenId) {
        if (_minted >= MAX_SUPPLY) revert MaxSupplyReached();
        tokenId = _minted;
        unchecked {
            _minted += 1;
        }
        tokenSeed[tokenId] = keccak256(abi.encodePacked(tokenId, chronicleRoot, address(this)));
        _safeMint(to, tokenId);
        emit ArtifactMinted(tokenId, to, tokenSeed[tokenId]);
    }

    function totalMinted() external view returns (uint256) {
        return _minted;
    }

    // ── chronicle sync ─────────────────────────────────────────────────

    function syncChronicle(bytes32 root, uint256 events_) external onlyRole(RECORDER_ROLE) {
        chronicleRoot = root;
        eventsWitnessed = events_;
        emit ChronicleSynced(root, events_);
    }

    // ── wiring ─────────────────────────────────────────────────────────

    function setDistributor(address d) external onlyRole(DEFAULT_ADMIN_ROLE) {
        distributor = IRevenueDistributor(d);
        emit DistributorSet(d);
    }

    function setRenderer(address r) external onlyRole(DEFAULT_ADMIN_ROLE) {
        renderer = IStateRenderer(r);
        emit RendererSet(r);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ── transfer checkpoint ────────────────────────────────────────────

    /// @dev Settles the distributor checkpoint before ownership changes.
    /// Burning is disabled: the founding record is permanent.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        whenNotPaused
        returns (address from)
    {
        if (to == address(0)) revert BurnDisabled();
        address previousOwner = _ownerOf(tokenId);
        if (address(distributor) != address(0) && previousOwner != address(0)) {
            distributor.handleTransfer(previousOwner, to, tokenId);
        }
        from = super._update(to, tokenId, auth);
    }

    // ── metadata ───────────────────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (address(renderer) == address(0)) return "";
        return renderer.tokenURI(tokenId, tokenSeed[tokenId], eventsWitnessed);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
