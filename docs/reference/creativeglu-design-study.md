# Reference study — creativeglu.ai

Date: 2026-08-07. Captured with Playwright (Chromium) at 1440×1000, 1728×1117, 1024×768, 768×1024, 390×844, 360×800 across `/home`, `/ai-transformation`, `/portfolio`, `/contact-us`. Raw captures live in `artifacts/reference/creativeglu/` (gitignored — third-party assets are never committed). Structural probe results in `structural-probe.json`.

This is a study of *principles*, not a source of assets. Nothing visual, verbal, or structural is copied. The "NO END STATE reinterpretation" column below is the design contract for our own build.

## Measured facts

- Near-black textured ground (`lab(3 -1.5 1.2)` ≈ #060707) with a persistent film-grain/noise overlay.
- Single typeface (Inter) at extreme scale contrast: H1 ≈ 109px/700, H2 48px/500, H3 28px/500, body 20px/300 with generous 1.75 line-height.
- 10 background videos and 1 canvas on the home page alone; ~9,083px tall.
- Floating pill nav bar: wordmark left, one CTA + menu icon right. Menu opens as a panel of full-width uppercase links with rule separators.
- Zero console errors on home at every viewport (portfolio has CORS-blocked S3 images — a defect worth *not* replicating).

## Pattern-by-pattern analysis

### 1. Cinematic hero: giant centered headline over one moving object
- **What it accomplishes:** Immediate confidence. One sentence, one object, no competing UI.
- **Why it works:** Extreme type scale plus a single luminous focal object (iridescent glass orb video) against near-black. The eyebrow ("AI transformation for leaders") and CTA are pushed to the fold's corners, keeping the center pure.
- **NO END STATE reinterpretation:** Same *confidence*, different *substance*: our hero is a procedural canvas — an accumulating field of state strata and an open-edged frame — not a rendered video. Headline is our own ("Founded once. Building indefinitely."). Corners carry the studio descriptor and two CTAs.
- **Must not copy:** the orb/glass-refraction motif, the headline text, the background videos.

### 2. Floating pill navigation
- **What it accomplishes:** Persistent identity + single action without a heavy header.
- **Why it works:** Detached rounded bar reads as an object floating above the cinematic ground; keeps chrome minimal.
- **NO END STATE reinterpretation:** We keep a minimal fixed header but reject the pill: ours is a full-width hairline-ruled bar — a "registry header" with wordmark, sequence marker, and a menu control. Squared, not rounded: our geometry language is the open frame, not the capsule.
- **Must not copy:** the pill shape treatment, the rainbow menu glyph.

### 3. Full-screen menu as typographic list
- **What it accomplishes:** Navigation becomes a moment, not a dropdown.
- **Why it works:** Few items, huge uppercase type, full-width rule separators; nothing else.
- **NO END STATE reinterpretation:** Full-screen overlay menu with our seven destinations, each rendered as a *registry row*: index number (01–07), name, one-line role, rule separator. Keyboard operable, Escape closes, focus trapped.
- **Must not copy:** exact layout/transition; we add index numbers and role lines, which they don't have.

### 4. Editorial two-column thesis sections
- **What it accomplishes:** Long-form conviction without walls of text.
- **Why it works:** Bold declarative statement left (or as heading), supporting prose right in a narrower measure; big vertical rhythm between sections.
- **NO END STATE reinterpretation:** Adopted as a *principle* (declaration + evidence), executed with our own grid: section label + serial number top-left (`02 / THESIS`), declaration in display type, prose capped at ~65ch.

### 5. Card stack with technical blueprint illustrations
- **What it accomplishes:** Makes abstract services feel engineered.
- **Why it works:** Thin-line schematic drawings, one per card, monochrome, generous padding.
- **NO END STATE reinterpretation:** Our three operating principles (Build / Record / Compound) get thin-line *state diagrams* drawn as inline SVG — accumulation strata, append arrows, closed-loop routing — in our own visual language. No blueprint-figure illustrations.

### 6. Visual break: full-width abstract ribbon
- **What it accomplishes:** Breathing room; cinematic pacing between arguments.
- **NO END STATE reinterpretation:** Full-width *chronicle strip*: a thin horizontal band of accumulated event ticks (SVG), quiet and structural rather than lush.
- **Must not copy:** the iridescent ribbon render.

### 7. Logo wall / quote carousel
- **What it accomplishes:** Social proof.
- **NO END STATE reinterpretation:** **Omitted.** We have no clients, partners, or quotes, and inventing them is forbidden. The equivalent trust surface is the Chronicle itself — verifiable records instead of logos.

### 8. FAQ accordion
- **What it accomplishes:** Handles objections without cluttering the narrative.
- **NO END STATE reinterpretation:** Native `<details>/<summary>` disclosures on `/faq` — accessible by default, styled to our rules, honest answers including "not yet decided" ones.

### 9. Giant bordered final CTA
- **What it accomplishes:** Ends the page with a single unmissable action.
- **Why it works:** One huge outlined block, uppercase label, arrow.
- **NO END STATE reinterpretation:** Final block uses our open-frame motif — a bordered block whose top edge has a deliberate gap (the open boundary), labeled "This is State Zero. Everything else comes after."

### 10. Responsive behavior
- **Measured:** headline scales from ~109px to ~40px on 360px; stacked columns; pill nav persists; carousels become swipe.
- **NO END STATE reinterpretation:** clamp()-based type scale, single-column stacking, drawer menu on mobile with the same registry rows, no horizontal overflow at 320px (tested).

### 11. Motion and pacing
- **Observed:** slow video loops, scroll reveals, hover lifts on cards; no scroll hijacking; reduced motion not meaningfully handled (videos keep playing) — a gap we will do better on.
- **NO END STATE reinterpretation:** Motion = state change only: hero field accumulates over time, cards reveal once on scroll, counters settle. `prefers-reduced-motion` renders a static completed field and disables reveals. Animation pauses when the document is hidden.

## Originality guarantees

We do not use: their words, videos, orb/ribbon renders, client logos, quotes, Inter-only identity, pill nav, rainbow glyphs, section order, or grain texture as-shot. Our grammar — open frames, serial numbers, append-only strata, registry rows, state-transition accents — appears nowhere on the reference site.
