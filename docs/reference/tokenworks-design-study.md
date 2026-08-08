# Reference study — token.works (Visual System V2)

Date: 2026-08-07. Captured with Playwright (Chromium) at 1600×1000, 1440×1000,
1280×800, 1024×768, 768×1024, 390×844, 360×800. Raw captures and structural
probe live in `artifacts/reference/tokenworks/` (gitignored — third-party
assets are never committed). The earlier CreativeGlu study
(`creativeglu-design-study.md`) remains part of the historical build record;
this study supersedes its *direction*, not its existence.

## What Token Works does effectively (measured)

- **One viewport carries the whole argument.** The home page is a single
  composition: header, a mono metadata cluster top-left, a numbered
  Selected Works index center-right with grayscale thumbnails, a quiet
  "Archive →" link, and one enormous bottom-anchored declaration
  ("A playground for onchain financialized ideas™"). Total page height ≈ one
  screen plus footer. Nothing explains itself before the work appears.
- **Metadata as furniture-free navigation.** The top-left block is five 14px
  mono rows (`X:`, `GITHUB:`, `FARCASTER:`, `ETHEREUM:`, `INQUIRE:`) with
  dotted leader lines to values — contact, proof, and identity in ~90×240px.
- **Index rows, not cards.** Works are `01 Name (status)` with a hairline rule
  running from the title to a small thumbnail. No borders, no panels, no
  descriptions. Space between rows (~160px) does the separating.
- **True monochrome.** Pure black ground, white type, grayscale imagery. The
  only "color" is a live-status parenthetical. A theme toggle is the entire
  header chrome beyond the mark.
- **Two voices only.** A custom mono for everything operational (14–16px) and
  a grotesk solely for the declaration (~110px, tight leading, regular cut).
  No intermediate sizes fighting for attention.
- **Mobile keeps the order honest.** Declaration first, metadata second, index
  stacked with inline thumbnails, archive, mono copyright. Nothing collapses
  into hamburger ceremony.
- **Empty space is load-bearing.** Roughly half the desktop viewport is empty
  ink; the composition reads as deliberate because every occupied region is
  hard-aligned to the grid.

## What NO END STATE should adapt (principles, not pixels)

- One-viewport confidence: the homepage becomes an operating index — the
  declaration, live studio metadata, a current-work index, and the Chronicle,
  with explanation living on routes.
- Compact mono metadata clusters driven by *live content-layer values*
  (chronicle count, build status, registry count) — our version of their
  contact block is a systems readout, which Token Works doesn't have.
- Numbered ruled index rows for work and records; hairlines instead of cards.
- Near-monochrome discipline: bone on warm ink; color only when the system
  reports state (chronicle semantics, status dots, one cyan interactive
  accent).
- Two dominant voices (grotesk display + mono registry), serif demoted to rare
  archival interventions.
- Giant type with deliberate line breaks; interface chrome reduced to a
  wordmark, a short route index, and a text "Menu".

## What NO END STATE must not copy

Not copied, by decision and verified against captures: the TW circular
mark/wordmark; its pure-black/white palette (ours stays warm ink/bone); the
custom mono identity; the bottom-anchored headline position (ours declares at
the top and ends in a live metadata rule); the dotted-leader contact block
format; the Selected Works label, row interaction, or thumbnail treatment (we
ship no thumbnails at all — our registry is honestly empty and our rows carry
status, not imagery); the archive presentation; the theme toggle; its copy;
its footer; its grid coordinates; its animation timing; any source or assets.

## What makes the resulting system original

- **Warm ink + bone + semantic signal spectrum** — Token Works has no state
  semantics; our color exists only to report system state, which is the
  studio's actual product.
- **The record is the interface.** Our index rows are Chronicle records and
  studio systems with sequence numbers that mean something (NES-####,
  BUILD-###, P-###); TW's numbers are ordinal decoration by comparison.
- **The open state cell** survives as mark, favicon, State Zero artwork, and a
  single page marker (the broken rule with escaping cyan tick under the hero)
  — a geometry TW has no analogue for.
- **Live truth in the chrome**: metadata strip values (records count, build
  status, STATE ZERO / LOCKED) are computed from the content layer at build,
  and the footer carries the deploy commit. The site visibly accumulates.
- **Inverted composition**: declaration top-left closing into a ruled live
  readout, vs TW's contact-first / declaration-last single page.
- The final visual test: with the logo removed, the warm ground, ledger
  ruling, semantic status dots, serif footer close, and record numbering keep
  the page unmistakably NO END STATE.
