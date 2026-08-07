# Treasury data methodology

How the treasury page (`/treasury`) is allowed to present numbers. The
short version: every figure carries its full provenance or it doesn't
render, and an empty treasury renders as an honest empty state — which is
exactly what it does today.

## Current state: uninitialized, and shown as such

`config/contracts.ts` has `treasuryAddresses: []` and every contract at
`address: null`. Consequently the treasury page shows:

- A plain statement that the treasury is **not yet initialized** — no
  addresses exist, no balances exist, nothing is deployed.
- The allocation framework with **all values unset**
  (`docs/treasury/allocation-framework.md`) — the *shape* of the model,
  never invented numbers.
- No charts, no zero-balance widgets pretending to be live, no "coming
  soon" counters. An empty treasury is a fact, and facts get stated.

Unit tests assert the economic gates stay closed; policy
(`config/contracts.ts` header comment) forbids placeholder addresses
outright.

## Classification

Treasury figures use the same four verification statuses as the Chronicle
(`docs/studio/transparency-policy.md`):

- `onchain_verified` — balance or flow provable against a public chain
  (requires deployed contracts/addresses; currently impossible).
- `studio_disclosed` — the studio's own accounting assertion.
- `external` — a third party's figure, presented as theirs.
- `estimate` — approximations and fiat conversions. **Every
  price-denominated figure is an estimate by definition** — prices come
  from a provider, at a moment, with spread; the label is not optional.

## Per-figure labeling contract

Every rendered figure carries all four of:

| Component | Requirement |
|---|---|
| **Source** | What produced the number: chain + address, config file, or provider name. A figure with no nameable source doesn't render. |
| **Timestamp** | When the number was true — block time or query time for future adapters; last-deploy time for build-time values. Never "now." |
| **Currency/unit** | Explicit asset (ETH, token symbol) — never a bare number. Fiat conversions additionally name the price provider and quote time, and are labeled `estimate`. |
| **Status** | One of the four classifications, rendered with the figure, not in a footnote. |

Aggregates inherit the weakest component: a total that includes one
estimate is an estimate. Verified and estimated figures are never summed
into a single unlabeled number.

## Staleness handling

All data today is build-time (`docs/architecture/data-sources.md`), so a
figure can never be fresher than the last deploy — and its timestamp says
so. When live adapters exist (viem reads, price provider):

- Every figure shows its observation time; the UI never implies liveness
  it doesn't have.
- On adapter failure, the display degrades to the last-known value **with
  its original timestamp and an explicit stale marker** — never a
  spinner, never a silently cached number relabeled fresh.
- A figure past its stated refresh expectation renders as stale even if
  nothing failed; honesty about age beats apparent liveness.
- Persistent discrepancy between displayed and recomputable values is a
  data-discrepancy incident (`docs/security/incident-response.md`), not a
  cosmetic bug.

## When funds ever exist

The obligations that activate the moment `treasuryAddresses` gains its
first real entry:

1. Addresses render with chain and label; anyone can verify balances
   independently — that's what makes `onchain_verified` honest.
2. Inflows/outflows are recorded as Chronicle `treasury_inflow` /
   `treasury_outflow` events with transaction hashes.
3. Distribution events (`distribution`) reference the router schedule
   they executed under (`docs/treasury/allocation-framework.md`).
4. Any accounting figure that can't be tied to chain data is labeled
   `studio_disclosed` and sourced — the treasury page never launders an
   assertion into a verified-looking number.

Until then, the methodology's whole output is one honest sentence: there
is no treasury yet.
