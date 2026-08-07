# Treasury allocation framework

How revenue *would* be split, routed, and withdrawn — the model
implemented by the `TreasuryRouter` prototype
(`contracts/src/TreasuryRouter.sol`). **Every actual value is currently
unset**: all four allocation bps are `null` in `config/economics.ts`, no
schedule exists, no sinks exist, nothing is deployed. This document
describes machinery, not commitments.

## The schedule model

Revenue arrives attributed to a project (`receiveRevenue(projectId)` for
ETH, `receiveTokenRevenue(projectId, token, amount)` for approved ERC-20s)
and is split by a basis-point schedule across four sinks:

```
            Schedule { stateZeroBps, treasuryBps, operatingBps, reserveBps }
                          — must total exactly 10_000 —

  revenue (ETH / approved ERC-20, attributed to projectId)
      │
      ▼  _split()
  ┌───────────────┬──────────────┬──────────────┬─────────────────────┐
  │ stateZeroBps  │ treasuryBps  │ operatingBps │ reserveBps (+ dust) │
  ▼               ▼              ▼              ▼
  RevenueDistributor  treasury      operating      reserve
  (holder layer)      (long-term)   (running the   (buffer)
                                     studio)
```

- `setSchedule` **reverts unless the four values sum to exactly 10,000**
  (`BpsMustTotal10000`) — there is no configuration in which revenue can
  be partially allocated or over-allocated.
- `setSinks` rejects any zero address; intake reverts while sinks are
  unset (`SinkUnset`), so the router cannot accept revenue it has nowhere
  to put.
- ERC-20 intake is fee-on-transfer safe: the router splits the **actually
  received balance delta**, not the stated amount, so deflationary tokens
  can't inflate accounting. Only explicitly approved assets are accepted;
  ETH is always implicitly approved.

## The four sinks

| Sink | Purpose |
|---|---|
| `stateZeroDistributor` | The holder layer — feeds `RevenueDistributor` funding (`docs/protocol/revenue-accounting.md`) |
| `treasury` | Long-term studio treasury |
| `operating` | Running costs |
| `reserve` | Buffer — and the dust sink (below) |

Sinks **pull**; the router never pushes. Each sink's share accumulates in
`ethBalance` / `tokenBalance` mappings and is withdrawn by the sink
itself (`withdrawETH()` / `withdrawToken()`), reentrancy-guarded. There
are no arbitrary external calls and no owner-extraction path outside the
published schedule — an admin cannot route funds anywhere the schedule
doesn't.

## The dust-to-reserve rule

Integer division truncates: `(amount × bps) / 10_000` rounds down for the
first three sinks. The reserve's share is computed as the **remainder** —
`amount − stateZero − treasury − operating` — so rounding dust (at most a
few wei per intake) lands in the reserve and **the full amount is always
allocated**. The Foundry fuzz test `fullAmountAlwaysAllocated` holds this
property across arbitrary amounts and schedules. No revenue is ever
stranded in the router by rounding.

## Policy approval flow (per-project allocations)

A project's participation in revenue sharing is an explicit, recorded
policy — never a default:

1. **Decision offchain**: governance/legal approval of the project's
   revenue policy, recorded as a Chronicle `governance` event.
2. **Onchain record**: `ProjectRegistry.setPolicy(id, bps, approved)` —
   admin-only, bps capped at 10,000 (`BpsOutOfRange`). The registry entry
   carries `stateZeroAllocationBps` + `policyApproved`; the router reads
   this value as the published truth of what was approved.
3. **Offchain mirror**: the project's content entry sets
   `stateZeroAllocationBps` and `stateZeroAllocationApproved: true`
   (`lib/schemas/project.ts`) so the site displays exactly what the
   registry records.

A bps value without `approved`/`policyApproved` is meaningless by
definition, on both sides of the mirror.

## Currently unset — the complete list

- Schedule bps (all four): `null` in config; no `setSchedule` ever called
  (nothing deployed to call it on). Deciding them is open decision #5.
- Sinks: no addresses exist (`treasuryAddresses: []`; custody is open
  decision #10).
- Approved assets: none.
- Per-project policies: no projects exist.
- `eligibleRevenueDefinition` (what revenue even enters the router):
  `null`, requiring counsel review — open decision #6.

Until these close (plus the deployment and legal gates), this framework
is a tested prototype and a page on the site that honestly says: not yet
initialized. See `docs/treasury/data-methodology.md` for how that page
behaves.
