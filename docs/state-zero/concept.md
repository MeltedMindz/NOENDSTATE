# State Zero — concept

State Zero is the founding cohort of NO END STATE: a single, fixed set of
onchain artifacts that witness the company's entire history from day zero.
One cohort, minted once, never expanded, never burned. Each artifact is an
open frame accumulating strata — one stratum per Chronicle event witnessed
— rendered deterministically onchain. Company history accumulates; the
frame never closes.

Status, plainly: State Zero is an **architecture, not an offering**. The
contracts are local prototypes (`contracts/src/StateZero.sol` and
companions), nothing is deployed, and every economic parameter — supply,
price, currency, chain, allocations, dates — is deliberately unset
(`config/economics.ts` is all nulls; see
`docs/state-zero/economic-gates.md`). Nothing in this document is an
offer or a promise of value.

## The three layers

The model keeps three kinds of history strictly separated
(`lib/schemas/state-zero.ts`):

**1. Company history — shared by every artifact.**
Every artifact witnesses the same Chronicle. The StateZero contract holds
a rolling `chronicleRoot` and `eventsWitnessed` count, synced from the
append-only ChronicleRegistry; the artwork's strata grow as events
accumulate. This layer never resets, never forks, and is identical across
the cohort — owning any artifact is witnessing the whole company. Details:
`docs/state-zero/history-model.md`.

**2. Token provenance — travels with the token.**
Each token's mint seed (fixed forever at mint from
`keccak(tokenId, chronicleRoot, address(this))`), its transfer history,
and its custody periods belong to the token and move with it. Buying an
artifact means acquiring its provenance.

**3. Holder participation — stays with the wallet.**
Votes, contributions, testing, grants — participation attaches to the
wallet that did the participating. It does **not** become the buyer's
history after a transfer. You can buy an artifact's provenance; you cannot
buy someone else's participation. The revenue architecture mirrors this
exactly: accruals settle to the holder entitled at the checkpoint
(`docs/state-zero/transfer-model.md`).

The separation is the concept. Most NFT designs collapse these layers into
"the token"; State Zero refuses to, so that history — company, object, and
person — always reads truthfully.

## Founding-cohort properties (committed in the prototype)

- **Fixed supply**: `MAX_SUPPLY` is immutable in the constructor; no
  function anywhere can raise it. The *number* is unset — an open decision
  — but its immutability is already committed.
- **No burn**: `_update` reverts on burn attempts. The founding cohort is
  permanent; the record cannot shrink.
- **No payment logic in the prototype**: mint terms are gated product
  decisions, not defaults to be inherited silently.
- **Holds no funds**: the NFT contract cannot receive value; economics
  live in separate, auditable contracts.

## The no-second-cohort commitment

There will never be a second founding cohort. Not a "series two," not a
"genesis extension," not a wrapped variant with founding claims. The
commitment is structural as well as stated:

- `MAX_SUPPLY` is immutable and StateZero has no expansion path.
- "Founding" is defined by witnessing from sequence 0 — a property later
  cohorts could not have even if minted, because the Chronicle's early
  history has already happened.
- Any future artifact program (if one ever exists) would be a different
  thing under a different name with no founding claims, and its creation
  would itself be a Chronicle event subject to the same public scrutiny.

The studio is permanent and unfinished; the founding cohort is the one
part of it that is complete the day it exists. That tension — a closed set
witnessing an open company — is what the open frame draws.
