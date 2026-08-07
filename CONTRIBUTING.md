# Contributing

NO END STATE builds in public, and outside contributions are welcome within
the rules that keep the record honest.

## Ground rules

1. **The Chronicle is append-only.** Never renumber, edit, or delete a
   published event. Corrections are new events that reference what they
   supersede. CI enforces this.
2. **No invented facts.** No fake metrics, placeholder partners, invented
   dates, or speculative economic terms. Unknown values stay `null` and the
   UI renders honestly around them.
3. **Economic features stay locked.** Do not wire mint, claims, payments, or
   wallet flows to anything live. The gates in `docs/legal/launch-gates.md`
   are closed by legal review, not by pull request.
4. **No secrets.** `.env*` is gitignored; tokens and keys never enter the
   repository, including in tests and docs.

## Workflow

- Branch from `main`; use focused commits with conventional-commit style
  subjects (`feat(web): …`, `fix: …`, `docs: …`).
- Run `pnpm verify` before opening a PR (lint, typecheck, unit, build, e2e).
  Contract changes also need `pnpm test:contracts`.
- New routes need: complete copy, metadata via `pageMetadata`, keyboard
  operability, reduced-motion safety, and coverage in `tests/e2e/`.
- Design changes consume tokens from `app/tokens.css` — no raw hex values in
  components. The signal spectrum is semantic; do not use it decoratively.

## Reporting

- Bugs and ideas: GitHub issues.
- Security: see `SECURITY.md` — not the public tracker.
