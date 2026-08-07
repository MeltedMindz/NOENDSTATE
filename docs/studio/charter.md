# Studio charter

NO END STATE is an internet-native, onchain product and protocol studio.
Founded 2026-08-07 (Chronicle NES-0000). Founded once, building
indefinitely: the company has no final form, no exit thesis, and no
version of "done."

Identity strings are canonical in `config/studio.ts`; this charter
explains them.

## What the studio is

- **A persistent company that ships many things.** Products, protocols,
  and experiments are created *under* the studio. Each one — including the
  ones that fail — expands the studio's body of work, operating knowledge,
  and public record.
- **A record, kept in public.** The Chronicle (`/chronicle`) is the
  append-only history of everything material: foundings, launches,
  incidents, sunsets, corrections. "A permanent record of an unfinished
  company" is a literal description of the website.
- **Onchain by conviction, gated by discipline.** The protocol layer
  (State Zero, the registries, the treasury router) is designed and
  prototyped in `contracts/`, but nothing is deployed and no economic
  value is set until every gate in `docs/legal/launch-gates.md` and
  `docs/protocol/deployment-gates.md` closes.

## What the studio is not

- **Not a fund, not an accelerator, not an agency.** It does not invest in
  or incubate outside teams, and it does not take client work.
- **Not a DAO.** There is no governance token and no pretense of
  decentralized control. Decisions are the studio's, made in public.
- **Not a promise of returns.** State Zero is a founding-cohort artifact
  architecture with every economic parameter deliberately unset
  (`config/economics.ts` is all nulls). Nothing here is an offer,
  solicitation, or financial advice.
- **Not finished, ever.** There is no roadmap terminus. "End state" is the
  thing the name refuses.

## How it operates

Three verbs, expanded in `docs/studio/operating-principles.md`:

1. **Build** — small, real things shipped under stable IDs
   (`BUILD-NNN` experiments graduating to `P-NNN` projects per
   `docs/studio/project-lifecycle.md`).
2. **Record** — every material event becomes a Chronicle entry with an
   honest verification label; failures are recorded in the same register
   as wins (`docs/studio/failure-policy.md`,
   `docs/studio/transparency-policy.md`).
3. **Compound** — the record, the code, the infrastructure, and the
   lessons accumulate under one roof so each project starts further ahead
   than the last.

## Studio ↔ projects ↔ record

```
            creates                    appends to
  STUDIO ─────────────▶ PROJECTS ─────────────────▶ CHRONICLE
    │      (P-NNN, own repos,           (every material event,
    │       own lifecycle)               append-only, labeled)
    │                                           ▲
    └───────────────────────────────────────────┘
      studio-level events (founding, governance,
      treasury, corrections) append directly
```

- The **studio** is permanent; **projects** are mortal. A project can
  sunset without wounding the studio — its ID, its entries, and its
  postmortem remain forever.
- The **record** outranks both. No studio or project interest ever
  justifies editing, hiding, or prettifying an entry; corrections append,
  they never rewrite.
- Projects relate to studio economics only through explicitly approved
  policies (`ProjectRegistry.setPolicy`, mirrored in project content
  fields) — nothing is implied by default. Today no project exists:
  `content/projects/` is empty by design, and the registry page says so
  honestly.

## Amendments

This charter can change — the studio is allowed to learn. Amendments land
as reviewed PRs, and material ones are recorded as `governance` Chronicle
events. What cannot change: the append-only record, the refusal to invent
history, and the gates standing between the studio and anyone's money.
