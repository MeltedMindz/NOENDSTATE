# Operating principles

Three verbs — Build, Record, Compound — expanded into how work actually
runs day to day. The charter (`docs/studio/charter.md`) says what the
studio is; this says what it does on a Tuesday.

## Build

**Start smaller than feels respectable.** Work enters as a `BUILD-NNN`
entry with an explicit `hypothesis` and `currentState`
(`lib/schemas/build.ts`). A build is cheap to open, cheap to pause, cheap
to fail. BUILD-000 — building the studio itself — is the template: scope
stated, status honest, nothing promised.

**Graduate deliberately.** A build becomes a project (`P-NNN`) only
through the generator + review path in
`docs/studio/project-lifecycle.md`. Most builds shouldn't graduate;
`failed` and `archived` are successful outcomes of cheap experiments.

**Ship real, gate money.** "Real" means deployed sites, working code,
published records — not economic features. Anything touching value sits
behind the double-gate in `config/economics.ts` and the launch gates. The
studio would rather ship ten inert-but-honest things than one live thing
it can't stand behind.

**Prefer boring, own the weird.** Infrastructure choices are conservative
(one app, typed content, pull-payment contracts, no clever proxies). The
creative budget is spent where it compounds: the record, the identity, the
artifact design.

## Record

**If it mattered, it's an entry.** Foundings, launches, releases,
incidents, sunsets, treasury movements, governance decisions — each
becomes a Chronicle event via `scripts/new-event.mjs`, with the
`occurredAt`/`recordedAt` distinction kept honest when recording lags the
event.

**Label before you publish.** Every claim carries a verification status —
`onchain_verified`, `studio_disclosed`, `external`, or `estimate` — and
nothing gets a stronger label than it has earned
(`docs/studio/transparency-policy.md`). Today everything is
`studio_disclosed`, because nothing is onchain. That's the honest label,
so it's the one used.

**Never rewrite.** Errors are fixed by appending a `correction` event
that supersedes the wrong one; the wrong one stays visible
(`docs/chronicle/integrity-rules.md`). The discipline is mechanical —
schema validation and unit tests fail the build on violations — precisely
so it doesn't depend on anyone's mood during a bad week.

**Record failure at launch quality.** A sunset entry gets the same care
as a launch entry: specifics, dates, causes, a postmortem
(`docs/studio/failure-policy.md`). The record's value comes from the
entries a normal company would delete.

## Compound

**Stable IDs are compound interest.** `P-NNN`, `NES-####`, `BUILD-NNN` are
never reused or renumbered. Ten years of cross-references only work if
identity is permanent — which is also why sunset projects keep their
numbers and their pages.

**Every project leaves residue on purpose.** Code patterns, deployment
scripts, audits, postmortems, and Chronicle entries all accrue to the
studio. A project may die; what it taught doesn't. The
`chronicleEventIds` cross-references on projects and builds exist to make
the residue navigable.

**One vocabulary everywhere.** The same design tokens, voice, schemas, and
verification labels apply to every surface the studio ever ships. New
projects inherit the system instead of reinventing it — that's the
mechanism by which the tenth project costs less than the first.

**The record compounds trust.** The bet underneath everything: years of
visible, uneditable, failure-inclusive history is an asset no marketing
spend can buy and no competitor can copy quickly. Protecting the record's
integrity therefore outranks any short-term interest, including looking
good.

## Tie-breakers

When principles collide, in order:

1. **Integrity of the record** beats looking good.
2. **Gates** beat momentum — no economic feature ships early because
   enthusiasm is high.
3. **Small and real** beats large and speculative.
4. **The permanent** (IDs, entries, commitments) beats the convenient.
