# Project lifecycle

Projects carry stable `P-NNN` IDs and move through six statuses defined in
`lib/schemas/project.ts` (mirrored onchain by `ProjectRegistry.Status`).
`content/projects/` is currently empty by design — the first project will
enter through this exact process.

## The six statuses

| Status | Meaning | Typical signals |
|---|---|---|
| `research` | Question being explored; no committed build | notes, spikes, a build entry |
| `prototype` | Something runs, nothing is promised | demo code, fixtures |
| `building` | Committed: shipping toward public use | repo activity, dated entries |
| `live` | In public use | `launchedAt` set, `project_launched` event |
| `sunset` | Deliberately wound down | `sunsetAt` set, postmortem required |
| `archived` | Fully dormant; record retained | no activity, page remains |

Transitions are forward-tending but not one-way (a `live` project can
return to `building`; `sunset` can only go to `archived`). Every
transition appends: a Chronicle event offchain, and — once the registry is
deployed — a `setStatus` call whose `statusHistory` array preserves every
prior state. Nothing is ever deregistered.

## Entry: generator + review

1. **Allocate.** Run `node scripts/new-project.mjs`. It computes the next
   `P-NNN`, prints a complete project scaffold plus a paired Chronicle
   draft (`project_proposed`/`project_started`), and **writes nothing** —
   allocation is a proposal, not a fact.
2. **Complete.** Fill the scaffold honestly: `thesis` (why this should
   exist), `oneLine`, nullable fields left null until true. No placeholder
   URLs, no invented dates.
3. **Review.** The PR is reviewed against: does the thesis say something
   falsifiable? are all economic fields null/unapproved
   (`stateZeroAllocationApproved: false` until an explicit policy
   decision)? does the Chronicle draft carry the right verification
   label?
4. **Merge = registration.** The build gate (Zod + `validateChronicle`)
   runs; on deploy the project exists publicly at `/projects/[slug]`.

## Adoption of pre-existing work — never automatic

Work that predates the studio (or lives in a personal repo) is **never
auto-adopted** into the registry. Adoption is an explicit decision:

- It goes through the same generator + review path as new work.
- The project entry states plainly that the work predates adoption, with
  `startedAt` reflecting the *true* start date and the adoption recorded
  in its own Chronicle event — the record never implies the studio built
  something it merely took in.
- The studio takes responsibility for what it adopts: security posture,
  maintenance intent, and honest status. If it can't take that
  responsibility, it doesn't adopt.

## Sunset procedure

Sunsetting is a first-class operation, not a quiet abandonment:

1. **Decide and date it.** Set `status: "sunset"` and `sunsetAt` in
   content (and `setStatus(id, Sunset)` onchain once deployed).
2. **Chronicle it.** Append a `project_sunset` event stating what is
   shutting down, when, what happens to anything users depend on, and why
   — in the failure-policy register, not PR language.
3. **Wind down obligations.** If the project ever had approved revenue
   policies or contracts, their disposition is stated explicitly in the
   event (funds routed per the published schedule; nothing silently
   redirected).
4. **Postmortem** (below), then eventually `archived`.

The project's page, ID, entries, and links remain up permanently. Sunset
removes the project's future, never its past.

## Postmortem requirement

Every sunset project gets a postmortem, published and linked via
`postmortemUrl`, plus a `postmortem` Chronicle event. Required content and
tone rules live in `docs/studio/failure-policy.md`; the short version —
what was the thesis, what happened, what was wrong, what the studio keeps.
A project is not `archived` until its postmortem is published. There is no
exception for embarrassing failures; those are the ones the record exists
for.
