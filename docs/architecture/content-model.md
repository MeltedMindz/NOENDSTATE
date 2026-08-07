# Content model

All site content is typed TypeScript in `content/`, validated by Zod
schemas in `lib/schemas/`, and loaded exclusively through `lib/content.ts`.
There are three content types. No page imports `content/` directly.

## Why validation gates the build

`lib/content.ts` calls `schema.parse()` on every entry and runs
`validateChronicle()` over the whole Chronicle. A parse failure or
integrity violation **throws during module evaluation**, so `pnpm build`
fails and nothing invalid can reach production. There is no runtime
fallback, no "render what we can" mode: the deploy pipeline is the
enforcement point. This is deliberate — a public record that silently drops
malformed entries is not a record.

## Type 1 — Project (`lib/schemas/project.ts`)

- **ID**: `P-NNN` (regex `^P-\d{3}$`), stable forever. Allocated by
  `scripts/new-project.mjs`, which prints a scaffold and a paired Chronicle
  draft but writes nothing — a human commits the result after review.
- **Slug**: `[a-z0-9-]+`, the URL identity (`/projects/[slug]`).
- **Status**: `research → prototype → building → live → sunset → archived`
  (semantics in `docs/studio/project-lifecycle.md`).
- **Notable fields**: `thesis` (why this exists), nullable
  `launchedAt`/`sunsetAt`, `contractAddresses[]` and `audits[]` (empty
  until real), `revenuePolicy` + `stateZeroAllocationBps` +
  `stateZeroAllocationApproved` (the offchain mirror of the onchain policy
  gate — bps mean nothing unless `approved` is true), `postmortemUrl`
  (required in practice once sunset, see failure policy), `public`
  (loader filters non-public), `featured`.
- **Current state**: `content/projects/` is empty **by design**. The site
  renders an honest empty registry; nothing is faked to look busier.

## Type 2 — Chronicle event (`lib/schemas/chronicle.ts`)

- **ID**: `NES-####`, and `eventId` must equal its zero-padded `sequence`
  — `validateChronicle` rejects any mismatch.
- **Append-only**: sequences are dense and unique from 0; corrections
  append a new event with `supersedesEventId`; superseded events remain
  visible forever. Full invariants:
  `docs/chronicle/integrity-rules.md`; field reference:
  `docs/chronicle/event-schema.md`.
- **Two timestamps**: `occurredAt` (when it happened) vs `recordedAt`
  (when it was written down) — kept separate so late recording is honest.
- **Verification**: every event carries one of `onchain_verified`,
  `studio_disclosed`, `external`, `estimate`.
- **Current state**: three real events — NES-0000 (studio founded),
  NES-0001 (domain registered), NES-0002 (BUILD-000 begins). All dated
  2026-08-07. No invented history.

## Type 3 — Build entry (`lib/schemas/build.ts`)

The working log: what is being attempted right now, before it deserves a
project ID.

- **ID**: `BUILD-NNN`. **Status**: `research | testing | building | paused
  | shipped | failed | archived` — note `failed` is a first-class status.
- **Fields**: `hypothesis` (what we think is true), `currentState`,
  `outcome` (filled when it resolves), optional `projectId` link once a
  build graduates into a project, `chronicleEventIds` cross-references.
- **Current state**: one entry, BUILD-000 "Building NO END STATE", status
  `building`.

There is also a fourth, non-content schema: `lib/schemas/state-zero.ts`
types the State Zero explorer's token model (three layers: shared company
history / per-token provenance / wallet-bound participation). It currently
types only dev fixtures in `lib/fixtures/` — `status: "fixture"` — since
nothing is minted.

## ID discipline

| Type | Pattern | Allocator | Mutable? |
|---|---|---|---|
| Project | `P-NNN` | `scripts/new-project.mjs` | never — survives sunset |
| Chronicle | `NES-####` | `scripts/new-event.mjs` | never — append-only |
| Build | `BUILD-NNN` | manual, next integer | never |

IDs are never reused, renumbered, or deleted. A project that dies keeps its
number; the gap tells the truth.

## Lifecycle of a content change

1. Run the relevant generator (`node scripts/new-event.mjs` /
   `new-project.mjs`) — it computes the next ID and prints a scaffold;
   generators never write files.
2. Paste and complete the scaffold in `content/`; fill `verificationStatus`
   and sources honestly.
3. `pnpm test` — 17 vitest unit tests cover chronicle integrity, registry
   rules, economic gates staying closed, and community surfaces staying
   honest.
4. `pnpm build` — Zod + `validateChronicle` gate the artifact.
5. Review and merge. The deploy is the publication; the commit is part of
   the record.
