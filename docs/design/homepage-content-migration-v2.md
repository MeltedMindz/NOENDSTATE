# Homepage content migration — Visual System V2

Date: 2026-08-07. Companion to `docs/reference/tokenworks-design-study.md`.

V1 homepage: ten explanatory sections. V2 homepage: five surfaces (introduction,
current work, chronicle, operating model, state zero → footer). This map shows
where every V1 block went. Nothing is silently destroyed; text that leaves the
homepage either already exists at its destination route or was moved there in
this change set.

| # | V1 section | Kept on homepage | Removed from homepage | Destination / rationale |
|---|---|---|---|---|
| 1 | Hero | "Founded once. Building indefinitely." (now the dominant declaration); one supporting sentence; links to Studio and Chronicle | Eyebrow paragraph ("An internet-native studio building protocols, products, and experiments"); bordered frame; SCROLL cue; "A permanent record of an unfinished company" footline | Category line compressed into the hero metadata strip (`INDEPENDENT PRODUCT + PROTOCOL STUDIO`). "A permanent record…" moves to the footer, where it was already duplicated. Frame/cue were furniture, not content. |
| 2 | Thesis ("The company has no final form." + 2 ¶) | The line itself — now the heading of the operating-model surface | Both paragraphs (exit-shape argument; chapters/compounding/failure kept visible) | `/studio` §"How it works" already carries this argument nearly verbatim; the one missing idea ("history treated as a product") was added there. Homepage repetition removed. |
| 3 | Operating principles (3 diagrams + 3 ¶) | Three one-sentence ruled lines (Build / Record / Compound) | The three SVG diagrams; the longer paragraph per principle | Long-form principle text lives in `/studio` and `docs/studio/operating-principles.md`. Diagrams retired entirely (see components-removed list) — layout and status now do that work. |
| 4 | Projects zero state ("The registry is open. Nothing is in it yet." + 2 ¶) | One index row: `P-REGISTRY — Project registry — 0 registered — open` | Display heading and both paragraphs | `/projects` already explains entry rules, lifecycle, and permanence in full. The honest zero state remains visible on the homepage as a live count, not an essay. |
| 5 | State Zero (heading + 2 ¶ + CTA) | Compact founding-system statement: what it is + no tokens / mint closed / terms unpublished / architecture preview + one link | Both long paragraphs (three layers, no-second-cohort, gates) | `/state-zero` carries all of it in §03.1–03.4, unchanged. |
| 6 | Chronicle (heading + 4-row list + CTA) | Kept — trimmed to the ruled index (id, date, type, title, verification) + one link | "Every event, appended." display heading; summaries per row | Summaries remain on `/chronicle` and each event page. |
| 7 | Transparency ("Facts carry their own labels." + ¶ + 4 badges) | Nothing (verification classes still appear live on chronicle rows) | Entire section | `/treasury` §05.2 is the canonical classification table; `/chronicle` §04.2 covers integrity. Homepage duplication removed. |
| 8 | Build in public (BUILD-000 card) | One index row: `BUILD-000 — Studio foundation — building` | Card with hypothesis/current-state text | `/build` is the full ledger entry, unchanged. |
| 9 | Community (4 surface cards) | Nothing above the footer; footer lists each surface with its honest state | Card grid and role sentences | `/community` keeps roles, states, and the security note in full. |
| 10 | Final CTA frame ("This is State Zero. Everything else comes after.") | Nothing | The framed block and its three buttons | The line is strong but was the third framed declaration on one page. It remains available in the voice doc; the footer close ("The work continues.") stays. Removal, not relocation. |

## Copy accounting

Measured on rendered `main` text at 1440×1000 (Playwright, includes visible
labels/statuses): V1 production homepage **592 words** → V2 homepage
**222 words** → **62.5% reduction**, within the 50–65% target.

## Lines deliberately preserved verbatim

- "Founded once. Building indefinitely." — hero declaration
- "The company has no final form." — operating-model heading
- "A permanent record of an unfinished company." — footer
- "The work continues." — footer close (single serif intervention)
