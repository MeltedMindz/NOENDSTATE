# State Zero — history model

How company history reaches the artifacts, and exactly what is shared
across the cohort versus particular to one token. Contracts referenced are
prototypes (`contracts/src/`), deployed nowhere.

## The accrual pipeline

```
content/chronicle/events.ts        (offchain record, append-only)
        │  append (RECORDER_ROLE)
        ▼
ChronicleRegistry.append(...)      per record: root = keccak256(root, contentHash)
        │                          nextSequence++ — no mutation functions exist
        ▼
StateZero.syncChronicle(root, eventsWitnessed)   (RECORDER_ROLE)
        │  stores chronicleRoot + eventsWitnessed, emits ChronicleSynced
        ▼
StateRenderer.tokenURI(tokenId, seed, eventsWitnessed)
           → base64 JSON + SVG: one stratum per witnessed event (capped 48)
```

- The **rolling root** commits to the entire history: each appended record
  folds its `contentHash` into `root = keccak256(root, contentHash)`.
  Verifying the root means replaying every record — the root cannot be
  made to match a history that didn't happen.
- **Sync is a witnessing act, not a rewrite.** `syncChronicle` only ever
  moves the artifacts' view forward to the registry's current state.
  History accrues; it never reverts, because the registry has no function
  that could produce an earlier-but-different root.
- **Rendering is pure.** `StateRenderer.tokenURI` is a pure function of
  `(tokenId, seed, eventsWitnessed)` — same inputs, same image, forever.
  No stored images, no mutable metadata, no external calls. Strata are
  capped at 48 so rendering stays bounded no matter how long the company
  lives; the artwork saturates, the root keeps accumulating regardless.

## Shared by all artifacts (the company layer)

Identical for every token at any moment, by construction — these live on
the StateZero contract, not per token:

- `chronicleRoot` — the rolling commitment to all history witnessed so far.
- `eventsWitnessed` — the stratum count every artifact renders.
- The strata's *meaning*: every artifact's lines grow from the same
  events. No token witnesses a private history; no token can be excluded
  from the shared one.

Owning artifact #0007 and artifact #0413 means witnessing exactly the same
company. The cohort differs in expression, never in history.

## Per-token (the object layer)

- **Seed** — `tokenSeed[tokenId] = keccak256(tokenId, chronicleRoot,
  address(this))`, fixed at mint, immutable. Two consequences worth
  noting: the seed binds the token to *this specific contract* (a copycat
  deployment cannot reproduce seeds), and it binds it to the Chronicle
  state at mint time — an artifact's visual identity is stamped by where
  in company history it was born.
- **Expression** — the renderer derives each token's gap position and
  strata geometry from its seed, so shared history renders uniquely per
  artifact.
- **Provenance** — transfers and custody periods, which travel with the
  token (`docs/state-zero/transfer-model.md`).
- **Accounting cursor** — the RevenueDistributor's per-token cursor, part
  of the economic architecture, also per token.

## Per-wallet (the person layer)

Holder participation — votes, contributions, testing, grants — attaches to
the wallet that acted (`lib/schemas/state-zero.ts`,
`holderParticipation[].wallet`). It is displayed alongside a token while
that wallet holds it, but it does not transfer: selling an artifact hands
over the object and its provenance, never the seller's participation
record.

## Current state

Nothing is minted and nothing is deployed; the explorer at
`/state-zero/[tokenId]` renders labeled fixtures in development only
(404 in production). The offchain Chronicle — three events, NES-0000
through NES-0002 — is the history a future cohort would witness from
sequence 0. The pipeline above is implemented and tested in the Foundry
suite; wiring it to a real chain is gated by
`docs/protocol/deployment-gates.md`.
