# Protocol threat model

Threat analysis for the six prototype contracts in `contracts/src/`.
Context that bounds every threat here: **nothing is deployed, no value
exists, and deployment is gated** (`docs/protocol/deployment-gates.md`).
This model exists so the audit starts from our homework, not instead of
an audit.

## Assets at risk (once deployed)

1. Funds held by `TreasuryRouter` (undistributed sink balances) and
   `RevenueDistributor` (funded, unclaimed distributions).
2. Integrity of the record: Chronicle root, project status history,
   token seeds and provenance.
3. The cohort itself: ownership records of a fixed, unexpandable set.
4. Trust: the studio's one non-replaceable asset.

## Actors

- External attacker (no roles): malicious tokens, reentrancy, griefing.
- Token holder / trader: accounting games around transfers and claims.
- Compromised or malicious role holder: admin, minter, recorder,
  registrar, funder.
- Compromised deployment/ops keys (covered operationally in
  `docs/security/protocol-threat-model.md`).

## Surface-by-surface

### RevenueDistributor (holds funds — highest value surface)

| Threat | Mitigation in code | Residual |
|---|---|---|
| Reentrancy via ETH payout (`claim`/`withdraw` `.call`) | `nonReentrant` on claim/withdraw/fundToken; state (cursor, withdrawable, totalPaid) updated before `_payout` | Cross-contract read-only reentrancy views; audit item |
| Double-claim / claim-then-sell games | Cursor advances atomically with every claim and checkpoint; fuzz `neverOverDistributes`, invariants `paidNeverExceedsFunded` + solvency (`balance == funded − paid`) | — |
| Malicious ERC-20 (revert/fee/reentrant hooks) | Assets are admin-allowlisted only; SafeERC20; funding uses balance delta (fee-on-transfer safe); `MAX_ASSETS = 16` bounds the checkpoint loop | A later-misbehaving approved asset can make `handleTransfer` revert and **block transfers** (no asset removal exists) — approval is forever; asset vetting is a deployment-gate obligation |
| Fake checkpoint calls | `handleTransfer` reverts unless `msg.sender == stateZero` | — |
| Funder manipulation (dust rounding, zero supply) | `NoArtifacts` on zero supply; `ZeroAmount` check; MAGNITUDE 2^128 keeps rounding sub-wei | Funder chooses timing/amounts — but checkpoint semantics make timing games pointless |

### StateZero

| Threat | Mitigation | Residual |
|---|---|---|
| Supply expansion / second cohort | `MAX_SUPPLY` immutable; no function can raise it | — |
| Burn / cohort shrinkage | `_update` reverts on `to == address(0)` | — |
| Checkpoint bypass or misordering | Single `_update` choke point calls distributor **before** ownership change (`docs/protocol/transfer-semantics.md`) | — |
| `_safeMint` receiver-callback reentrancy | Mint is `MINTER_ROLE`-gated; supply increments before external callback | Mint-mechanism design (future, gated) must re-examine |
| Funds trapped in NFT contract | No payable paths; contract holds no funds by design | — |
| MINTER_ROLE compromise | Mints only up to `MAX_SUPPLY`, no payment path to steal; pause halts minting | Unwanted mints to attacker addresses within cap — custody gate requires multisig + monitoring |
| RECORDER_ROLE compromise | `syncChronicle` only overwrites root/count on the *token view*; ChronicleRegistry history itself is untouched; sync is re-doable | Renderer briefly shows wrong stratum count; detect + resync, disclose as incident |

### ChronicleRegistry / ProjectRegistry (record integrity, no funds)

- **No mutation surface**: append-only by construction (no edit/delete
  functions exist; ProjectRegistry keeps full `statusHistory`, no
  deregistration). A compromised RECORDER/REGISTRAR can append garbage or
  flip statuses but can never rewrite or erase — recovery is corrective
  appends plus disclosure, which the offchain correction model already
  practices.
- `supersedes` must reference an existing sequence; bogus supersedes
  reverts.
- ProjectRegistry `setPolicy` is admin-only, bps ≤ 10000 enforced.

### TreasuryRouter (holds funds)

| Threat | Mitigation | Residual |
|---|---|---|
| Schedule manipulation (sum ≠ 100%) | `setSchedule` reverts unless exactly 10,000 bps | Admin can still *change* the split — custody gate: multisig + public schedule changes as Chronicle events |
| Owner extraction | No arbitrary calls; funds leave only via per-sink pull withdrawals of schedule-allocated balances | Admin changing sinks redirects **future** allocations (accrued balances stay with recorded sinks) — same custody controls |
| Fee-on-transfer / malicious ERC-20 | Balance-delta accounting; asset allowlist; SafeERC20; `nonReentrant` intake and withdrawals | Reverting sink token strands that sink's pulls for that asset |
| Rounding theft | Remainder-to-reserve rule; fuzz `fullAmountAlwaysAllocated` | — |
| Unset wiring | Intake reverts while sinks unset (`SinkUnset`) | — |

### StateRenderer

Pure and stateless — no storage, no calls, no roles. Gas is the surface:
the strata loop is capped (`MAX_STRATA = 48`) so `tokenURI` stays
renderable no matter how large `eventsWitnessed` grows. Residual: output
is consumed by offchain indexers; malformed-SVG edge cases are an audit
item, not a fund risk.

### Cross-cutting: pause abuse

Admin pause can freeze transfers (StateZero) and funding/claims
(distributor, router intake). Designed limit: **`withdraw` paths for
already-settled/allocated balances are not pausable** — an admin cannot
trap value that already belongs to someone. Residual: a hostile admin
could pause indefinitely (markets frozen, claims of *unclaimed* accruals
delayed); mitigation is custody (multisig, disclosed signers policy) and
the incident-response commitment to Chronicle every pause.

## Mitigations implemented — summary

Checks-effects-interactions + `nonReentrant` on every value path; pull
payments everywhere (no pushes); allowlisted, bounded assets;
balance-delta accounting; immutability of supply/seeds/records; single
choke-point transfer hook; role separation with narrow powers; pausability
with withdraw carve-out; 42 passing tests including fuzz + invariants.

## Residual risks — stated plainly

Unaudited code (gate ❌); no external review yet; permanent asset
approvals; admin trust concentrated until custody gate closes; economic
parameters unset, so economic-attack analysis (e.g., value of timing
games under a real cadence) can only be finished once terms exist. These
are reasons deployment is gated, and the gates are the response.
