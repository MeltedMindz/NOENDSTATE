# ADR 002 — Content as typed TypeScript

- **Status**: accepted, 2026-08-07

## Decision

All site content — projects, Chronicle events, build entries — is plain
TypeScript data in `content/`, typed by Zod schemas in `lib/schemas/` and
loaded through `lib/content.ts`. No MDX, no headless CMS, no database, no
markdown-with-frontmatter pipeline.

## Context

The Chronicle is an append-only public record with hard invariants (dense
sequences, ID↔sequence equality, supersedes references, permanent
visibility of superseded entries — `docs/chronicle/integrity-rules.md`).
The candidates:

1. **CMS** (headless or hosted) — editing convenience, but content lives
   outside the repo, outside review, and outside the build's guarantees.
2. **MDX / markdown + frontmatter** — file-based, but frontmatter is
   stringly-typed; schema enforcement is a bolt-on and rich fields
   (arrays of tx hashes, nullable dates, cross-references) get awkward.
3. **Typed TS modules validated by Zod** — content is code.

## Rationale

- **Invalid content must be unable to ship.** With TS + Zod, a malformed
  entry or a Chronicle integrity violation throws at import time and fails
  `pnpm build`. That is the entire enforcement model
  (`docs/architecture/content-model.md`); options 1–2 make it advisory.
- **Content changes are commits.** Every Chronicle entry arrives via PR,
  gets a preview deploy, and lands in git history — the record of the
  record. A CMS would put the studio's most important data behind a vendor
  login and outside version control.
- **The types are the documentation.** `ChronicleEvent` has 18 fields with
  precise semantics (two timestamps, verification enums, supersedes
  links). A TS literal gets editor autocomplete and type errors while you
  write it; frontmatter gets you a typo discovered in production.
- **No runtime dependency.** No CMS outage, no API keys, no webhook sync.
  The site builds from a checkout, forever — appropriate for a permanent
  record.
- **Zod at runtime, TS at compile time.** Zod re-parses at build even
  though TS already type-checks, because type assertions can lie and
  regex/format constraints (`NES-\d{4}`, date shapes, bps ranges) are not
  expressible in the type system alone.

## Trade-offs accepted

- **Writing content requires a developer workflow.** Mitigated by
  generators (`scripts/new-event.mjs`, `scripts/new-project.mjs`) that
  compute the next ID and print a complete scaffold. Acceptable: today the
  studio's authors are its builders.
- **Long-form prose in TS strings is unglamorous.** `body` fields hold
  plain text; if long-form needs grow, the reversal path below exists.
- **Content edits redeploy the site.** That is the point — publication
  *is* deployment, and the build gate runs on every publication.

## Reversal path

If content volume or non-developer authorship ever demands it: keep the
schemas and loaders exactly as they are, and swap the storage layer to
files (JSON/MDX) parsed *through the same Zod schemas* at build time, still
throwing on violation. The invariant that survives any migration: nothing
renders that didn't pass `lib/schemas/*` + `validateChronicle`, and no
content lives outside the repository.
