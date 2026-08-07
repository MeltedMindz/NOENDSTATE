# State Zero — transfer model

> **Architecture, not terms.** This document describes what the prototype
> contracts implement (`contracts/src/StateZero.sol`,
> `contracts/src/RevenueDistributor.sol`). It is not a promise of
> distributions, not an offer, and not the binding transfer rule — the
> published rule (`transferTreatment` in `config/economics.ts`) is null
> and remains an open decision requiring legal approval
> (`docs/decisions/open-decisions.md` #8). Nothing is deployed.

## The checkpoint rule in one sentence

A distribution belongs to whoever held the token at the moment it was
funded; transferring the token moves the future, never the past.

## What happens on transfer, exactly

`StateZero._update` runs the checkpoint **before** ownership changes: it
calls `distributor.handleTransfer(previousOwner, to, tokenId)`, then
completes the transfer. For every approved asset (bounded list, max 16),
`handleTransfer`:

1. Computes the token's unclaimed accrual:
   `accrued = (cumulativePerArtifact − tokenCursor[tokenId]) / MAGNITUDE`.
2. Advances the token's cursor to the current cumulative index — the
   token now accrues only from this point forward.
3. Credits the accrued amount to the **seller's** `withdrawable` balance
   (skipped when `from` is the zero address, i.e., mint).

Full ordering, edge cases, and pause interplay:
`docs/protocol/transfer-semantics.md`. The index math:
`docs/protocol/revenue-accounting.md`.

## Consequences, stated plainly

**The seller keeps what accrued while they held.**
Unclaimed accruals do not travel with the token. Selling doesn't forfeit
them; they settle into the seller's withdrawable balance automatically at
transfer, claimable later via `withdraw(asset)` from the same wallet. No
one needs to "claim before selling."

**The buyer accrues from the checkpoint forward.**
A buyer's economic history with the artifact starts at acquisition.
Distributions funded after the transfer accrue to the buyer (claimable via
`claim(tokenId, asset)`, holder-only); nothing funded before it does. A
token is never bought "pregnant" with someone else's unclaimed value —
which also removes the incentive to strip-mine tokens around distribution
dates: transferring immediately before or after a funding changes nothing
about who gets it.

**Nothing is ever distributed twice.** The cursor advance and the
settlement are one atomic step; the same funded value cannot be paid to
both seller and buyer. Fuzz and invariant tests
(`neverOverDistributes`, `paidNeverExceedsFunded`, solvency) hold this.

**Provenance travels with the token.**
The transfer itself becomes part of the object's history — custody
periods, transfer records, the mint seed. The buyer acquires the artifact
and everything the artifact *is*, including its record of having been
held.

**Participation stays with the wallet.**
The seller's votes, contributions, and other participation
(`lib/schemas/state-zero.ts`) remain attached to the seller's wallet
forever. The buyer does not inherit them, and the seller does not lose
them. This mirrors the checkpoint exactly: history — economic or
participatory — belongs to whoever made it.

## The three layers at the moment of sale

| Layer | Where it goes |
|---|---|
| Company history (chronicle root, events witnessed) | Unaffected — shared by all artifacts, identical before and after |
| Token provenance (seed, transfers, custody) | Travels with the token to the buyer |
| Seller's accrued distributions | Settle to seller's withdrawable balance |
| Future distributions | Accrue to the buyer from the checkpoint |
| Seller's participation record | Stays with the seller's wallet |

## What this is not

- Not a yield promise: whether *any* distribution ever occurs depends on
  unset economics and unclosed legal gates
  (`docs/state-zero/economic-gates.md`). The architecture defines *how*
  value would flow, never *that* it will.
- Not the final rule: `transferTreatment` could in principle be decided
  as something other than checkpoint (`"snapshot"`, `"other"` are legal
  schema values). If the decided rule differs from this architecture, the
  contracts change before anything deploys — the docs and code are kept
  from contradicting each other by changing the code, not the label.
