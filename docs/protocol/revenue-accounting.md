# Revenue accounting

The `RevenueDistributor` prototype implements the classic
funds-distribution (cumulative index) pattern with a transfer checkpoint.
This page is the math; transfer semantics have their own page
(`docs/protocol/transfer-semantics.md`). Nothing here is deployed or
promised — see `docs/state-zero/economic-gates.md`.

## The cumulative index

Per asset (ETH is asset `address(0)`; ERC-20s must be approved, bounded
by `MAX_ASSETS = 16`):

```
MAGNITUDE = 2^128            // fixed-point precision magnifier

fund(amount):                // FUNDER_ROLE, O(1)
    cumulativePerArtifact += amount * MAGNITUDE / totalMinted()

accruedOf(tokenId):          // view, O(1)
    (cumulativePerArtifact - tokenCursor[tokenId]) / MAGNITUDE
```

- **Funding is O(1)**: it bumps one number. No loop over tokens exists
  anywhere in the contract, so distribution cost is independent of supply.
- **Each token's cursor** records the index value already accounted for.
  A token's entitlement is always "index now minus index at my cursor" —
  claims and checkpoints advance the cursor to the current index, which
  is why nothing can be distributed twice.
- `MAGNITUDE = 2^128` keeps integer division losses far below one wei per
  funding event (error in the index increment is `< 1` magnified unit,
  i.e. `< supply / 2^128` wei of value).
- ERC-20 funding uses the received **balance delta**, so fee-on-transfer
  tokens distribute what actually arrived. Funding reverts if
  `totalMinted() == 0` (`NoArtifacts`) — value can never enter with no
  one entitled to it.

## Payout paths (both pull, both reentrancy-guarded)

- `claim(tokenId, asset)` — current holder only
  (`ownerOf(tokenId) == msg.sender`), O(1) per token per asset: pays
  `accruedOf`, advances the cursor.
- `withdraw(asset)` — pays out `withdrawable[msg.sender][asset]`,
  balances settled to a *former* holder by transfer checkpoints.

`totalFunded` / `totalPaid` are tracked per asset for the solvency
invariants.

## Worked example — 2 tokens, fund 10 ETH, transfer, fund 4 ETH

Cohort: token 0 held by Ada, token 1 held by Ben. `totalMinted() = 2`.
(Writing `M` for MAGNITUDE.)

**1. Fund 10 ETH.**
`cumulative += 10e18·M / 2 = 5e18·M`. State: index `5e18·M`; both
cursors 0. Accrued: token 0 → 5 ETH, token 1 → 5 ETH.

**2. Ben sells token 1 to Cyn.**
`_update` runs the checkpoint before ownership changes:
token 1's accrued 5 ETH settles → `withdrawable[Ben][ETH] = 5e18`;
`tokenCursor[1] = 5e18·M`. Then ownership moves to Cyn.
Token 1's accrual from here starts at zero — Cyn bought the future, Ben
kept the past.

**3. Fund 4 ETH.**
`cumulative += 4e18·M / 2 = 2e18·M` → index `7e18·M`.

**Final entitlements:**

| Party | Path | Amount |
|---|---|---|
| Ada (token 0, cursor 0) | `claim(0)` | (7e18·M − 0)/M = **7 ETH** (5 + 2) |
| Ben (former holder) | `withdraw()` | **5 ETH** (settled at checkpoint) |
| Cyn (token 1, cursor 5e18·M) | `claim(1)` | (7e18·M − 5e18·M)/M = **2 ETH** |

Total: 7 + 5 + 2 = **14 ETH = 10 + 4 funded**. Fully allocated, nothing
double-paid, and the transfer's timing relative to fundings changed no
one's entitlement — the checkpoint removes distribution-date games.

## Dust behavior

Two flooring points, both in the contract's favor:

1. **At funding**: `amount·M / supply` floors; untracked value is below
   `supply / 2^128` wei per funding — negligible but real.
2. **At settlement/claim**: `Δindex / M` floors; up to just-under-one wei
   per token per settlement can remain represented in the cursor gap.

Dust therefore stays in the contract balance, counted in `totalFunded`
but never in `totalPaid`. The invariant suite makes this a checked
property, not a hope:

- fuzz: `neverOverDistributes` (payouts never exceed funding),
- invariant: `paidNeverExceedsFunded`,
- invariant: solvency — `balance == totalFunded − totalPaid`.

There is no dust-sweep function; adding one would create an extraction
path, and the amounts are bounded to wei-scale by construction. (The
router layer has its own, different dust rule — remainder to reserve —
see `docs/treasury/allocation-framework.md`.)

## Multi-asset bounds

Assets are a bounded append-only list: ETH at construction plus
admin-approved ERC-20s, hard-capped at `MAX_ASSETS = 16`
(`TooManyAssets`). The bound exists because the transfer checkpoint
iterates every asset (`handleTransfer` loops the list to settle each);
capping the list caps transfer gas forever. Asset approval is one-way in
the prototype (no removal), so a token's settlement loop can never skip
an asset it previously accrued.
