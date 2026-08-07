# Chronicle event schema

Field-by-field reference for `chronicleEventSchema` in
`lib/schemas/chronicle.ts`. Events live in
`content/chronicle/events.ts`; scaffold new ones with
`node scripts/new-event.mjs` (computes the next `NES-####`, writes
nothing). Integrity rules across events:
`docs/chronicle/integrity-rules.md`.

## Identity

| Field | Type | Semantics |
|---|---|---|
| `eventId` | `string` — `/^NES-\d{4}$/` | Permanent public identifier. Must equal `NES-` + zero-padded `sequence` (validator-enforced). Never changes, never reused. |
| `sequence` | `int ≥ 0` | Position in the append-only record. Dense and unique from 0 — no gaps, no forks. |
| `type` | enum (below) | What kind of event this is. Drives signal color on cards and pages. |

## Content

| Field | Type | Semantics |
|---|---|---|
| `title` | `string` (min 1) | Headline, voice rules apply (`docs/brand/voice.md`). |
| `summary` | `string` (min 1) | One-to-two sentence account; what feeds/cards show. |
| `body` | `string \| null` | Optional long-form narrative. `null` is fine for minor events (NES-0001 has none). |
| `tags` | `string[]` | Free-form lowercase tags for navigation. |

## Time — two timestamps, on purpose

| Field | Semantics |
|---|---|
| `occurredAt` | When the thing actually happened. |
| `recordedAt` | When the record was written. Kept separate so late recording is honest — a backfilled event shows its lag instead of faking contemporaneity. Never set `recordedAt` earlier than reality. |

## Linkage

| Field | Type | Semantics |
|---|---|---|
| `projectId` | `string \| null` | `P-NNN` when the event belongs to a project; `null` for studio-level events. |
| `epochId` | `string \| null` | Era grouping (current: `"epoch-0"`). |
| `supersedesEventId` | `string \| null` | Set only on `correction` events; points at the earlier event being corrected. Must reference an existing event; the superseded event stays visible forever. |

## Evidence

| Field | Type | Semantics |
|---|---|---|
| `sourceUrls` | `string[]` | Where a reader can check the claim. |
| `transactionHashes` | `string[]` | Onchain proof. **Required non-empty for `onchain_verified` events**; empty today since nothing is deployed. |
| `contractAddresses` | `string[]` | Addresses the event concerns. Real addresses only — never placeholders. |
| `repositoryCommit` | `string \| null` | Commit hash anchoring the event to repo history. |
| `contentHash` | `string \| null` | Hash of the event content — the value the onchain `ChronicleRegistry` folds into its rolling root when the mirror exists. |

## Classification

| Field | Type | Semantics |
|---|---|---|
| `verificationStatus` | enum | `onchain_verified` (provable on a public chain; needs tx hashes) · `studio_disclosed` (studio's own assertion, sourced where possible) · `external` (third-party report) · `estimate` (explicitly approximate — never rendered as fact). Full usage rules: `docs/studio/transparency-policy.md`. |
| `visibility` | `"public" \| "internal"` | The loader (`lib/content.ts`) filters `internal` from the site and APIs. Internal events still obey every invariant — they occupy their sequence forever. |

## Event types

From `chronicleEventTypeSchema`, grouped by concern:

- **Studio**: `studio_founded` · `state_zero_created` · `governance` ·
  `partnership` · `acquisition` · `grant` · `milestone`
- **Project lifecycle**: `project_proposed` · `project_started` ·
  `project_launched` · `project_updated` · `project_sunset` · `release`
- **Trust**: `audit` · `incident` · `recovery` · `postmortem` ·
  `correction`
- **Money**: `treasury_inflow` · `treasury_outflow` · `distribution`
- **Eras**: `epoch_started` · `epoch_closed`

Signal-color bindings for display (per `docs/brand/brand-system.md`):
founding/system → cyan, launch/growth → green, milestone/release →
yellow, incident/caution → ember, sunset/failure → coral.

## Minimal honest example

The real NES-0001 (domain registration): a `milestone` with a `summary`,
no `body`, `occurredAt === recordedAt` (recorded same day), one source
URL, empty evidence arrays, `studio_disclosed`, `public`. Empty arrays
and nulls are correct when there is nothing to put in them — the schema
is a container for what is true, not a form to be filled impressively.
