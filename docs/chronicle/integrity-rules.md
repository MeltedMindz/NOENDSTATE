# Chronicle integrity rules

The Chronicle is append-only. That property is not a policy statement —
it is enforced at three points, and a violation cannot reach production.

## The invariants

1. **Dense, unique sequences from 0.** Every sequence number appears
   exactly once; there are no gaps and no forks. The record has one
   spine.
2. **IDs equal their sequence.** `eventId` must be `NES-` + zero-padded
   `sequence` (`NES-0007` ⇔ sequence 7). An ID can never be reassigned to
   different content without breaking this equality somewhere visible.
3. **Published IDs never change.** Appending is the only write.
4. **Corrections append, never rewrite.** A `correction` event carries
   `supersedesEventId`; the superseded event remains in the record and on
   the site, rendered as superseded and linked to its correction.
5. **Supersedes must resolve.** A `supersedesEventId` pointing at a
   nonexistent event is an integrity violation.
6. **Two honest timestamps.** `occurredAt` (when it happened) and
   `recordedAt` (when it was written) are separate; late recording shows
   its lag rather than faking contemporaneity.
7. **Proof matches label.** `onchain_verified` requires
   `transactionHashes` — a claim of onchain proof without the proof fails
   review (and test coverage backs the convention).

## Enforcement points

**1. Schema + validator (build-time, blocking).**
`lib/schemas/chronicle.ts` — Zod validates every field shape;
`validateChronicle(events)` checks duplicates, ID↔sequence equality, and
supersedes resolution across the whole record. `lib/content.ts` runs both
on every load and **throws**, so `pnpm build` fails; invalid history
cannot deploy (`docs/architecture/content-model.md`).

**2. Unit tests (CI, blocking).**
`tests/unit/content.test.ts` exercises the invariants — dense unique
sequences, ID equality, supersedes resolution, superseded-stays-visible,
verification-status rules — against the real content, so a bad entry
fails `pnpm test` before it even reaches a build.

**3. Onchain mirror (future, structural).**
`contracts/src/ChronicleRegistry.sol` (prototype, not deployed) makes the
invariants physical: `append` is the only state-changing record function
— **no mutation function exists in the contract** — sequences increment
atomically, `supersedes` must reference an existing sequence
(`SupersedesUnknown` otherwise), and each record folds its `contentHash`
into a rolling root (`root = keccak256(root, contentHash)`). Once
mirrored, rewriting history would require the root to match a history
that didn't happen — it can't. `StateZero.syncChronicle` then carries
that root to the artifacts (`docs/state-zero/history-model.md`).

## Correction walkthrough

Suppose NES-0005 said a release shipped on 2026-09-14, and it actually
shipped 2026-09-15.

1. `node scripts/new-event.mjs` → next free sequence, say 9 → `NES-0009`.
2. Author the correction in `content/chronicle/events.ts`:

```ts
{
  eventId: "NES-0009",
  sequence: 9,
  type: "correction",
  title: "Correction: NES-0005 release date",
  summary: "NES-0005 stated the release shipped 2026-09-14; the correct date is 2026-09-15. The entry was drafted from a staging deploy timestamp.",
  body: null,
  occurredAt: "2026-09-15",        // when the true fact occurred
  recordedAt: "2026-09-20",        // when this correction was written
  projectId: "P-001",              // same linkage as the corrected event
  epochId: "epoch-0",
  sourceUrls: [/* the evidence for the right date */],
  transactionHashes: [],
  contractAddresses: [],
  repositoryCommit: null,
  contentHash: null,
  supersedesEventId: "NES-0005",   // the link that makes it a correction
  verificationStatus: "studio_disclosed",
  visibility: "public",
  tags: ["correction"],
}
```

3. What must **not** happen: editing NES-0005's date in place, deleting
   it, or reusing its ID. If someone tries the sneaky version — removing
   NES-0005 entirely — sequence 5 goes missing and `validateChronicle`
   fails the build with a density violation; if they renumber to hide the
   gap, ID↔sequence equality breaks instead. The invariants are shaped so
   every tampering path trips at least one check.
4. `pnpm test && pnpm build`, review, merge. The site now shows NES-0005
   marked superseded, linking forward to NES-0009; both are permanent.

What qualifies for in-place fixes (typos in prose asserting nothing) vs.
corrections is defined in `docs/studio/transparency-policy.md` — when in
doubt, append.
