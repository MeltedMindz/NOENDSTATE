# ADR 003 — Design system choices

- **Status**: accepted, 2026-08-07
- **Companion**: `docs/brand/brand-system.md` (the system itself)

Three linked choices: no Tailwind, a serif display face, and a color
spectrum bound to semantics.

## 1. No Tailwind — tokens + CSS Modules

**Decision.** The complete visual vocabulary lives as CSS custom
properties in `app/tokens.css`; components style themselves with CSS
Modules (plus a small `app/globals.css` for primitives like
`.open-frame`). No Tailwind, no CSS-in-JS runtime.

**Rationale.**
- The brand's discipline is that components consume *named tokens*, never
  raw values. Tailwind's utility vocabulary is a parallel token system
  that would compete with ours and invite arbitrary values
  (`text-[#59d9c3]`) that bypass the semantic bindings.
- The identity is unusual on purpose (ledger ruling, open frame, fluid
  clamp() scale, one radius token). Little of Tailwind's default scale
  survives that; we'd be configuring away most of what it ships.
- One fewer build-time dependency in the supply chain of a site whose job
  is being trustworthy; zero runtime style cost.

**Trade-off.** Slower to prototype than utilities; contributors must learn
the token sheet. Accepted — the token sheet *is* the brand, and it fits on
one screen.

**Reversal.** None planned. If a future need arises, any framework adopted
must be configured to emit only these tokens; introducing a second visual
vocabulary is the thing this ADR forbids.

## 2. The serif risk — Newsreader for display

**Decision.** Newsreader (editorial serif) carries heroes and statements;
Schibsted Grotesk carries UI/body; IBM Plex Mono carries the registry
layer (serials, timestamps, labels). All via `next/font`, self-hosted —
no external font hosts (the CSP allows none).

**Rationale.** Crypto-native sites default to grotesk-only or mono-only;
an editorial serif is the visible claim that this is a *publication of
record*, closer to a ledger or a newspaper archive than a landing page.
The risk — reading as old-fashioned or unserious for a protocol studio —
is contained by the division of labor: the serif never renders data or UI,
only statements. Data always gets the mono; controls get the grotesk.

**Trade-off accepted.** Serif display type is unforgiving at low quality:
it demands the restrained layout the brand mandates anyway. If a surface
looks wrong in Newsreader, the fix is fewer words, not another font.

## 3. Signal spectrum as semantics

**Decision.** Five signal colors, each *bound to a meaning*: cyan
founding/system/live, green launch/growth, yellow milestone/release,
ember incident/caution, coral sunset/failure. A hue may appear only where
its meaning applies; there is no decorative accent color at all.

**Rationale.**
- The studio's premise is that the record includes failure. That needs a
  color failure can wear in public (coral) without being the generic
  "error red" that UIs teach users to dread and designers to hide.
- Binding color to meaning makes the whole site scannable as a state
  ledger: a coral entry in the Chronicle *is* a sunset before you read a
  word. Decorative use anywhere would corrupt that channel everywhere.
- It removes an entire class of design decisions ("what color should this
  be?" is answered by "what does it mean?").

**Enforcement.** The bindings are documented in `app/tokens.css` comments
and `docs/brand/brand-system.md`; review treats a mis-bound signal color
as a correctness bug, not a taste note. Color is never the *only* channel
(labels always accompany it) — the spectrum is semantic, not a
substitute for accessible text.

**Trade-off accepted.** Pages are chromatically quiet — ink, bone, ash,
with rare signal marks. That restraint is the brand; "add some color" is
not a valid design request here.
