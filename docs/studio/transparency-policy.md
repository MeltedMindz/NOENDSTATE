# Transparency policy

Transparency here is not a vibe; it is a labeling contract, a correction
procedure, and a short list of things that are never published. The
mechanics are enforced in code wherever possible.

## Verification labels

Every factual claim on a studio surface carries one of the four statuses
from `lib/schemas/chronicle.ts`:

| Label | Use when | Hard requirement |
|---|---|---|
| `onchain_verified` | The claim is provable against a public chain | `transactionHashes` present; anyone can recheck. Currently unused — nothing is deployed, so nothing may wear this label |
| `studio_disclosed` | The studio asserts it from its own knowledge | Sourced via `sourceUrls` where possible; the honest default today |
| `external` | A third party reported it | Source linked; presented as their claim, not ours |
| `estimate` | The number is approximate or forward-looking | The label renders **with** the figure, everywhere it appears |

Rules:

- No claim ships unlabeled, and no claim wears a stronger label than it
  has earned. Upgrading a label (e.g., to `onchain_verified` after a
  future deployment) happens by appending events/data with the new
  status — never by editing the old record.
- Treasury figures carry the fuller per-figure contract (source,
  timestamp, currency, status) defined in
  `docs/treasury/data-methodology.md`.

## Estimate rules

- An estimate states its basis ("based on X, as of DATE") or it doesn't
  ship.
- Estimates are never aggregated with verified figures into a single
  unlabeled number.
- A resolved estimate is superseded by a new labeled entry; the estimate
  stays visible with its label, which is how the studio's forecasting
  honesty stays auditable.
- Absent values are stated as absent. "Not yet decided" and "not yet
  initialized" are complete answers; an estimate is never used to paper
  over a null (`config/economics.ts` stays all-null until decisions are
  real).

## Correction procedure

Errors are corrected by **appending, never rewriting** — enforced by
`validateChronicle` and the unit tests (see
`docs/chronicle/integrity-rules.md` for a worked example):

1. Draft a `correction` Chronicle event via `scripts/new-event.mjs`.
2. Set `supersedesEventId` to the wrong entry's ID; state what was wrong,
   what is right, and how the error happened.
3. Label the correction itself honestly (`studio_disclosed` unless
   provable).
4. Merge via reviewed PR. The superseded entry remains published and is
   rendered as superseded — visible, linked to its correction, never
   hidden.

Typos and formatting slips in prose that assert nothing (a broken link, a
misspelled word) may be fixed in place by PR; anything that changes what a
record *claims* — dates, numbers, statuses, attributions — takes the
correction path. When in doubt, correct by appending.

## What is never published

Transparency is about the studio's conduct, not about publishing
everything. The following never appear in the repo, the site, the
Chronicle, or social surfaces:

- **Keys and secrets**: private keys, seed phrases, API keys, signer
  identities' credentials, `.env` contents (`.env*` is gitignored; the
  site needs no secrets to build).
- **Personal data**: names, contact details, wallet-to-identity links of
  users, holders, or contributors, except a person's own deliberate
  public self-identification. Team names are themselves an open decision
  (`docs/decisions/open-decisions.md`) — until made deliberately, entries
  don't name individuals.
- **Security details that arm attackers**: unremediated vulnerability
  specifics, monitoring blind spots, operational key ceremonies.
  Incidents are disclosed per `docs/security/incident-response.md` —
  promptly, but with exploit details deferred until remediation.
- **Other people's confidential information**, full stop.

If something in this list is ever published by mistake, that is an
incident (rotate/contain first), and the removal itself is recorded as a
correction — the record notes *that* something was removed and why,
without republishing it.

## Where this is enforced in code

- Schema: every Chronicle event requires a `verificationStatus`
  (`lib/schemas/chronicle.ts`).
- Build gate: invalid or integrity-violating content cannot deploy
  (`lib/content.ts`).
- Tests: `tests/unit/` covers chronicle integrity, economic gates staying
  closed, and community surfaces staying honest (no fake links, no
  invented numbers).
- Config: unset values are typed nullable and rendered as honest empty
  states; `config/contracts.ts` forbids placeholder addresses by policy.
