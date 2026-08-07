# Social asset specifications

Composition rules for every external-facing image, written so a designer or
an agent can generate them consistently. All assets draw only from the
tokens in `app/tokens.css` and the open-frame spec in
`docs/brand/brand-system.md`. No photography, no gradients, no stock art.

## Status: what exists vs. to be generated

| Asset | Status | Source |
|---|---|---|
| App icon / favicon | **In repo** | `app/icon.svg` |
| Site-wide OG card (1200×630) | **In repo** | `app/opengraph-image.tsx` |
| Social avatar (400×400+) | To be generated | derive from `components/Marks.tsx` `Symbol` |
| X banner (1500×500) | To be generated | spec below |
| Project / Chronicle / State Zero share cards | To be generated | specs below |

## Avatar

Square, minimum 400×400 (export 1024×1024).

- Ground: solid ink `#0e0d0b`, edge to edge. No border, no ruling.
- Mark: the open-frame symbol exactly as drawn in `components/Marks.tsx`
  `Symbol` — frame `M6 8 V26 H26 V8` in bone `#e9e4d8`, top edge broken
  (`6→16`, `23→26`), cyan `#59d9c3` tick at x 19.5 rising out of the gap.
  Scale the 32×32 viewBox to occupy ~55% of the canvas width, optically
  centered (nudge up slightly so the escaping tick reads inside the circle
  crop most platforms apply).
- Nothing else. No wordmark in the avatar — it dies at small sizes.

## X banner — 1500×500

Concept: a strip of the ledger with the frame opening at the right third.

- Ground: ink `#0e0d0b` with ledger ruling — horizontal 1px lines at
  `rgba(233,228,216,0.025)`, spaced ~28px, full width.
- Left: wordmark "NO END STATE" in IBM Plex Mono, uppercase, tracked
  (0.14em), ash `#8a867c`, ~28px, positioned at the left with generous
  margin (~80px). Below it, the core line "Founded once. Building
  indefinitely." in Newsreader, bone `#e9e4d8`, ~44px, "Building
  indefinitely." in cyan italic (mirroring the OG card treatment).
- Right third: a large open frame (2px bone strokes, top gap at ~62% of its
  width, single cyan tick escaping ~26px above the top edge). Inside the
  frame, 8–14 horizontal strata lines in ash with ~30% of them cyan,
  echoing `components/StateField.tsx` and the onchain renderer.
- Keep all text inside the central 1500×360 safe zone; X crops banners
  aggressively on mobile.

## OG card (implemented — reference composition)

`app/opengraph-image.tsx`, 1200×630, generated at request time by
`next/og`, no external assets. Its composition is the template every other
card derives from:

- 64px outer padding on ink; content sits inside a 2px bone frame that has
  **no top border** — the top edge is drawn as two segments (58% from left,
  26% from right) leaving the gap, with a 2px cyan tick rising 26px above
  the top at 66% across.
- Top-left inside the frame: "NO END STATE" mono, ash, letter-spaced.
- Center-left: the core line in two 76px lines — "Founded once." bone,
  "Building indefinitely." cyan italic.
- Bottom: mono footer strip in ash, uppercase — "A PERMANENT RECORD OF AN
  UNFINISHED COMPANY — NOENDSTATE.COM".

## Derived card templates (to be generated)

All three reuse the OG frame construction (open top edge + cyan tick) and
change only the interior. Fixed slots, no freeform layouts:

**Project card** — for `/projects/[slug]` shares:
- Slot 1 (top-left, mono ash): `P-NNN · CATEGORY`.
- Slot 2 (center, Newsreader bone, max 2 lines): project name.
- Slot 3 (under name, grotesk bone-dim, 1 line): the project's `oneLine`.
- Slot 4 (bottom-left, mono): status chip — text in the status's signal
  color (live → green, sunset → coral, building → cyan, milestone events →
  yellow) with dates. Failure cards keep full contrast; coral is never
  dimmed.

**Chronicle card** — for `/chronicle/[eventId]` shares:
- Slot 1: `NES-#### · EVENT_TYPE` mono ash; the tick and the type text take
  the event type's signal color (founding → cyan, launch → green,
  release/milestone → yellow, incident → ember, sunset → coral).
- Slot 2: event title, Newsreader bone.
- Slot 3 (bottom): `OCCURRED <date> · RECORDED <date> · <VERIFICATION
  STATUS>` in mono. The verification label is mandatory — a share card
  never states a fact without its status.

**State Zero card** — for `/state-zero/[tokenId]`:
- Interior mirrors the onchain renderer (`contracts/src/StateRenderer.sol`):
  horizontal strata (one per witnessed event, capped), ash with sparse cyan
  accents, inside the open cell.
- Slot 1: `STATE ZERO NNNN` mono bone. Slot 2 (bottom): `EVENTS WITNESSED:
  N` mono ash. While nothing is minted, cards may only show fixture tokens
  clearly labeled `FIXTURE` in ember — never an image implying a real mint.

## Hard rules for all assets

- Colors only from the token palette; ink ground always.
- No invented numbers anywhere (supply, price, dates) — see
  `docs/state-zero/economic-gates.md`.
- The frame gap is always on top, one cyan tick, never closed.
- Type: Newsreader for statements, Schibsted Grotesk for supporting prose,
  IBM Plex Mono for every identifier, date, and label.
