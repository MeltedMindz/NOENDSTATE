# Data sources and verification

Every figure the site shows carries a verification classification, and the
set of places data can come from is deliberately small. Today there is
exactly one source: the repository itself, at build time.

## Verification classification

Defined in `lib/schemas/chronicle.ts` (`verificationStatusSchema`) and used
across Chronicle events, treasury figures, and any future stat:

| Status | Meaning | Requirement |
|---|---|---|
| `onchain_verified` | Provable against a public chain | Must carry `transactionHashes` (and addresses where relevant); anyone can recompute it |
| `studio_disclosed` | Asserted by the studio | Sourced where possible (`sourceUrls`); honest default for offchain facts |
| `external` | Reported by a third party | Source link required; the studio does not adopt it as its own claim |
| `estimate` | Explicitly an estimate | Must be labeled as such wherever displayed — never presented as fact |

Rules of use:

- A claim without a classification does not ship.
- `onchain_verified` is earned, not asserted: no deployed contracts means
  **nothing** is currently `onchain_verified`, and the three existing
  Chronicle events are correctly `studio_disclosed`.
- Estimates are for forward-looking or approximated quantities only, and
  UI must render the label with the number, not in a footnote.

## Current sources (build time only)

| Data | Source | Freshness |
|---|---|---|
| Projects, Chronicle, Builds | `content/*.ts` via `lib/content.ts` | as of last deploy |
| Identity, economics (all null), community, contracts (all null) | `config/*.ts` | as of last deploy |
| State Zero explorer tokens | `lib/fixtures/` — dev only, 404 in production | n/a |
| JSON APIs (`/api/projects`, `/api/chronicle`, `/api/status`) | same loaders | as of last deploy |

There are no runtime fetches, no RPC calls, no price feeds, no analytics.
Consequence: the site can never show a number fresher than its last deploy,
and it says so — the treasury page's per-figure labeling contract
(`docs/treasury/data-methodology.md`) requires source + timestamp on every
figure, and the uninitialized treasury renders its honest empty state.

## Future adapters (designed, not built)

When contracts deploy (gated — see `docs/protocol/deployment-gates.md`),
two adapters are anticipated. Both are read-only and both are gated:

**1. Onchain reads (viem RPC)**
- Reads: `ChronicleRegistry.root` / `nextSequence` (to cross-check the
  repo Chronicle against the onchain mirror), `StateZero.totalMinted` /
  `chronicleRoot` / `eventsWitnessed`, `TreasuryRouter` balances and
  events, `RevenueDistributor.totalFunded/totalPaid`.
- Gate: an adapter may only be pointed at addresses present in
  `config/contracts.ts` with status `"deployed"` — and that file accepts
  only real, verified deployments (never placeholders). Until then the
  adapter has nothing to read, by construction.
- Data read this way is what upgrades figures to `onchain_verified`.

**2. Price provider**
- Purpose: fiat-denominating treasury balances. Output is always labeled
  `estimate` with provider name and quote timestamp — a price is an
  estimate by definition here.
- Gate: requires the treasury to exist (`treasuryAddresses` in
  `config/contracts.ts` is `[]` today) and a monitoring/provider decision
  recorded in `docs/decisions/open-decisions.md`. Until then, no price
  appears anywhere; the site never converts a number it doesn't have.

Adapter rules, whenever they land:

- Read-only, no keys with write or spend authority anywhere near the site.
- Failures degrade to the build-time value with its original label and a
  visible staleness note — never a spinner pretending liveness, never a
  cached number relabeled as fresh.
- Every adapter-sourced figure still carries the full labeling contract:
  source, timestamp, currency, verification status.

## Wallet connectivity

`walletConnectEnabled` in `config/economics.ts` exists as a flag and is off
(env-gated, default false). Even when enabled it is a read/identity
convenience, not a data source, and it grants the site no authority over
funds. Mint and claims remain double-gated separately
(`docs/state-zero/economic-gates.md`).
