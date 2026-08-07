# 03 — Brand system (The Art Director)

Canonical reference: `docs/brand/brand-system.md`, `docs/brand/voice.md`, `docs/brand/social-assets.md`. Tokens: `app/tokens.css`.

## Identity

- **Symbol:** the state cell — a rectangular frame whose top boundary is permanently open, with one cyan tick escaping the gap. Implemented in `components/Marks.tsx`, `app/icon.svg` (favicon/app icon), the CSS `.open-frame` motif, the OG card, and the onchain `StateRenderer.sol`. Not an infinity sign; the mark literally cannot close.
- **Wordmark:** symbol + "NO END STATE" in Schibsted Grotesk 700 with 0.06em tracking.
- **Palette:** warm ink `#0e0d0b` ground with sub-perceptual ledger ruling; bone `#e9e4d8` type; bone-dim `#c9c4b6` prose; ash `#98948a` secondary (AA on ink at all sizes); graphite `#24221d`. Signal spectrum bound to meaning, never decorative: cyan `#59d9c3` founding/system/live, green `#8be08a` launch, yellow `#e3e05a` milestone/release, ember `#e39a5a` incident/caution, coral `#e37a6a` sunset/failure.
- **Type:** Newsreader (editorial serif; italic = the voice of declaration — the deliberate risk on a category that is grotesk-only), Schibsted Grotesk (UI/body), IBM Plex Mono (the registry layer: serials, timestamps, event types, labels). clamp()-based scale from 11px mono to ~100px hero.
- **Geometry:** rectilinear; border-radius exists only on 6px status dots.
- **Motion:** state change only — StateField strata accumulation (seeded with history, pauses when hidden, static under reduced motion), one-shot scroll reveals, arrow micro-shifts. No parallax, no scroll hijack, no particles.

## Generated assets

In repo: favicon/app icon (`app/icon.svg`), site-wide OG card (`app/opengraph-image.tsx`, 1200×630, drawn from tokens), web manifest, generative State Zero artwork prototype (`lib/state-art.ts`, deterministic per seed). Specified for generation at account-creation time (specs in `docs/brand/social-assets.md`): X banner 1500×500, square avatars, project/chronicle/state-zero cards.
