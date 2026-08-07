# Failure policy

The studio's premise — a permanent record of an unfinished company — is
only credible if failure is recorded with the same care as success. This
policy makes that mechanical rather than aspirational.

## What counts as failure

- A build entry resolved as `failed` (hypothesis disproven or abandoned).
- A project moved to `sunset` for cause (didn't work, couldn't be
  sustained, shouldn't exist).
- An incident: something the studio shipped broke, misled, or lost
  something (`incident` Chronicle events, handled per
  `docs/security/incident-response.md`).
- A published claim that turned out wrong (`correction` events, per
  `docs/studio/transparency-policy.md`).

Ordinary iteration — redesigns, refactors, pauses — is not failure and
should not be dramatized into it.

## What happens on failure

1. **It is recorded promptly.** A Chronicle event (`project_sunset`,
   `incident`, or `correction`) is appended with honest
   `occurredAt`/`recordedAt` dates — including when recording is
   embarrassingly later than occurrence; the gap itself stays visible.
2. **Status changes tell the truth.** `failed` and `sunset` are set in
   content the moment they are true. No project lingers as `building` to
   avoid a coral label.
3. **A postmortem follows** for sunset projects (required before
   `archived` — see `docs/studio/project-lifecycle.md`) and for
   significant incidents. Small failed builds need only their `outcome`
   field filled honestly.
4. **Obligations are settled explicitly.** Anything users or holders
   depended on gets a stated disposition in the event — never silence.

## What is preserved — everything

- The project/build ID, page, and every Chronicle entry, forever. IDs are
  never reused; pages are never unpublished.
- The repository (archived, not deleted) and links to it.
- The failure's visual identity: sunset/failed work wears coral
  (`--signal-coral`) at full contrast. The design system explicitly
  forbids dimming it (`docs/brand/brand-system.md`).
- Superseded claims: a correction appends beside the error; the error
  remains readable.

Nothing about a failure is ever deleted, reworded in place, or quietly
de-linked. The only permitted removals are the ones transparency policy
carves out for everyone (secrets, personal data — see
`docs/studio/transparency-policy.md`), and those are handled as visible
corrections, not silent edits.

## Postmortem content

Required sections, in order:

1. **Thesis** — what we believed when we started (quote the original
   `thesis`/`hypothesis` verbatim).
2. **What happened** — dated, specific narrative. Numbers where they
   exist, labeled per verification policy; no vague "traction was
   limited."
3. **What was wrong** — the actual causal analysis: wrong thesis, wrong
   execution, wrong timing, or wrong to start. Pick honestly; "the market
   wasn't ready" requires evidence, not injury.
4. **What the studio keeps** — code, patterns, infrastructure, and
   specific operating lessons that transfer (the Compound principle).
5. **Disposition** — what happens to the code, any users, any funds.

## Tone rules for postmortems

- **Plain past tense, active voice.** "We built X. It didn't retain
  users." Not "mistakes were made," not "the decision was taken to."
- **No euphemism.** Banned framings: "pivoting to new opportunities,"
  "sunsetting to focus on our core mission," "graduating the
  experiment." The word "failed" is allowed and usually correct.
- **No self-flagellation either.** A postmortem is analysis, not
  penance. State causes, not character judgments — of the studio or
  anyone else.
- **No scapegoats.** Individuals are never named as causes. The studio
  shipped it; the studio failed at it.
- **Failure gets launch-quality writing.** Same voice principles, same
  editing pass, same design treatment as a launch announcement
  (`docs/brand/voice.md`). If the postmortem is the least-crafted page on
  the site, the record is lying about what the studio values.
