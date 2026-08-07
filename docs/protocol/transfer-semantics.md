# Transfer semantics

Exact behavior of a State Zero transfer, as implemented in
`StateZero._update` and `RevenueDistributor.handleTransfer`. Prototype
code; nothing deployed. Holder-facing narrative:
`docs/state-zero/transfer-model.md`. Accounting math:
`docs/protocol/revenue-accounting.md`.

## The checkpoint rule

Distributions belong to the holder entitled at the moment of funding.
Mechanically: before any ownership change, the token's accrued-but-
unclaimed value settles to the *current* (outgoing) holder, and the
token's cursor advances to the present index — so the incoming holder
accrues only from this point forward.

## Exact `_update` ordering

OpenZeppelin v5's `_update` is the single choke point for mint and
transfer, and StateZero overrides it:

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal override whenNotPaused returns (address from)
{
    if (to == address(0)) revert BurnDisabled();          // (1)
    address previousOwner = _ownerOf(tokenId);            // (2)
    if (address(distributor) != address(0) && previousOwner != address(0)) {
        distributor.handleTransfer(previousOwner, to, tokenId);  // (3)
    }
    from = super._update(to, tokenId, auth);              // (4)
}
```

1. **Burns revert unconditionally** — checked before anything else.
2. The true current owner is read *before* any state changes.
3. **The checkpoint runs BEFORE the ownership change.** Inside
   `handleTransfer` (callable only by the StateZero address —
   `OnlyStateZero` otherwise), for each approved asset:
   cursor-gap → `amount`; `tokenCursor = cumulativePerArtifact`
   (cursor advances **first**); then, if `amount > 0` and
   `from != address(0)`, credit `withdrawable[from][asset]` and emit
   `Settled`.
4. Only then does `super._update` move ownership (and run the ERC-721
   auth check for the transfer path).

Why this order matters: if ownership changed first, the settlement would
read the buyer as owner and the seller's accrual would be
misattributed — the entire checkpoint rule hangs on (3) preceding (4).
Note `handleTransfer` writes only the distributor's own bookkeeping and
pays nothing out (settlement credits a pull balance), so no external
value transfer happens mid-`_update`.

## Edge cases

**Mint (`from == address(0)`).**
Mint flows through the same `_update`. `previousOwner` is zero, so branch
(3) is skipped when the token has no prior owner — but even if
`handleTransfer` were reached, its own `from != address(0)` guard
prevents crediting the zero address. A fresh token's cursors start at 0;
combined with seeds fixed at mint, a newly minted token accrues from the
first funding after its mint. (`mint` also uses `_safeMint`, so the
receiver-callback reentrancy surface is considered in
`docs/protocol/threat-model.md`.)

**Burn — does not exist.**
`to == address(0)` reverts with `BurnDisabled` before any accounting.
Consequences: the cohort can never shrink, `totalMinted()` never
decreases (funding denominators are stable), and there is no path where
accrued value belongs to a destroyed token.

**Transfer with no distributor wired.**
Before `setDistributor` is called, branch (3) is skipped entirely —
transfers work, and no accrual exists to lose because funding requires
the distributor. Wiring order at deployment must still set the
distributor before any funding occurs; this is a deployment-gate runbook
item, not a contract-enforced ordering.

**Self-transfer / repeated transfers.**
Each transfer settles and advances the cursor; a second transfer in the
same block settles zero (cursor already current). Nothing double-pays —
held by the `neverOverDistributes` fuzz property.

**Zero accrual.**
If nothing was funded since the cursor last advanced, `amount == 0`: the
cursor still advances (idempotent), no `Settled` event, no storage
write to `withdrawable`.

## Interplay with pause

`_update` carries `whenNotPaused`: **pausing StateZero freezes mint and
all transfers** — and therefore also freezes checkpoint settlements,
since they only run inside transfers. Separately, pausing the
*distributor* freezes `fundETH`/`fundToken` and `claim`, but **not**
`withdraw` (already-settled balances stay withdrawable) and not
`handleTransfer` (unpaused StateZero transfers still checkpoint
correctly into a paused distributor).

The matrix:

| Paused | Transfers | Checkpoint | Funding | claim() | withdraw() |
|---|---|---|---|---|---|
| StateZero | ✗ | ✗ (no transfers) | ✓ | ✓ | ✓ |
| Distributor | ✓ | ✓ | ✗ | ✗ | ✓ |
| Both | ✗ | ✗ | ✗ | ✗ | ✓ |

`withdraw` being pause-immune is deliberate: an admin cannot trap value
that has already settled to a person. Pause abuse as an attack surface is
assessed in `docs/protocol/threat-model.md`.
