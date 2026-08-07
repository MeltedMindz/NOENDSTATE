# Brand system

The NO END STATE identity is a ledger: a dark, warm ground on which state is
recorded in ruled lines, monospaced serials, and editorial serif statements.
Every token below is implemented in `app/tokens.css`; components consume CSS
custom properties, never raw values. If this document and `app/tokens.css`
disagree, the code is right and this file must be fixed.

## Color

### Ground (neutral scale)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0e0d0b` | The ground. Page background. Warm near-black. |
| `--ink-raised` | `#14130f` | Raised surfaces, cards. |
| `--graphite` | `#24221d` | Borders on surfaces, deep neutral fills. |
| `--ash` | `#8a867c` | Secondary text, quiet strokes, mono labels. |
| `--bone` | `#e9e4d8` | Primary type. Warm off-white — never pure white. |
| `--bone-dim` | `#c9c4b6` | Long-form body text. |

### Signal spectrum (semantic — never decorative)

Each hue is bound to a meaning. A color may only appear where its meaning
applies. This binding is the brand's core discipline.

| Token | Hex | Meaning |
|---|---|---|
| `--signal-cyan` | `#59d9c3` | Founding, system, live/interactive state |
| `--signal-green` | `#8be08a` | Launch, growth |
| `--signal-yellow` | `#e3e05a` | Milestone, release |
| `--signal-ember` | `#e39a5a` | Incident, caution |
| `--signal-coral` | `#e37a6a` | Sunset, failure — preserved, not hidden |

Rules:

- Signal colors mark **state transitions and status**, nothing else. No cyan
  gradients, no green accents "for energy."
- Coral is not shameful. Failed and sunset work keeps its color and stays
  visible; the spectrum exists so failure can be shown plainly.
- Cyan doubles as the interactive/focus color (`--focus-ring`), because
  "live" is a system state.

### Strokes

`--rule` (hairline, 14% bone), `--rule-strong` (32% bone), and
`--ledger-line` (2.5% bone) — the last draws the faint horizontal "ledger
ruling" across page backgrounds. Ruling is ambient texture; it never carries
information.

## Typography

Three faces, three jobs, loaded via `next/font` (see `app/layout.tsx`):

| Token | Face | Job |
|---|---|---|
| `--font-display` | Newsreader (serif) | Editorial display: heroes, statements, long-form headings |
| `--font-ui` | Schibsted Grotesk | UI and body text |
| `--font-mono` | IBM Plex Mono | The registry layer: serials (`NES-0002`, `P-000`), timestamps, labels, status chips |

Scale is fluid, defined once in tokens: `--text-hero`
(`clamp(2.75rem, 7.5vw, 6.25rem)`), `--text-display`, `--text-title`,
`--text-body` (1.0625rem), `--text-small`, `--text-mono` (0.8125rem),
`--text-mono-xs`. Mono text is uppercase with `--tracking-mono` (0.08em);
wide labels use `--tracking-wide` (0.14em). Body copy uses `--leading-body`
(1.72) and is capped at `--measure` (65ch).

Anything that identifies a record — an event ID, a serial, a date, a
verification label — is set in mono. Anything that makes a claim in prose is
serif or grotesk. Do not mix the registers.

## Spacing and layout

Spacing is a fixed ramp: `--space-1` (0.25rem) through `--space-9` (7rem),
plus `--space-section` (`clamp(4.5rem, 10vw, 8.5rem)`) between page
sections. Container is `--container` (76rem) with `--container-pad`
(`clamp(1.25rem, 4vw, 3rem)`). Use ramp values only; no ad-hoc margins.

## Geometry

The system is **rectilinear**. No rounded corners anywhere — the only radius
token is `--radius-dot` (999px), reserved for tiny status dots. No drop
shadows; depth comes from `--ink-raised` surfaces and rules.

### The open frame (signature motif)

A rectangular state cell whose **top edge has a permanent gap**, with a
single cyan tick escaping upward through the opening. Meaning: the system
can always receive another event; the frame never closes.

Canonical implementations (copy these, do not redraw freehand):

- CSS: `.open-frame` in `app/globals.css` — full left/bottom/right border,
  top edge drawn as two segments (62% from the left, 38% from the right,
  each shortened 2.25rem to form the gap), with a 1px cyan `.frame-tick`
  rising 0.85rem above the top at the 62% mark.
- Symbol: `Symbol` in `components/Marks.tsx` — 32×32 viewBox, frame
  `M6 8 V26 H26 V8`, top segments `6→16` and `23→26`, cyan tick at
  x 19.5 rising from the gap to y 2.5.
- App icon: `app/icon.svg`. OG card: `app/opengraph-image.tsx`.

Frame rules: the gap is always on the **top** edge, off-center (roughly
55–70% across); exactly one tick, always cyan, always escaping upward. Never
close the frame, never put the gap on another edge, never multiply ticks.

## Motion

`--ease-state` (`cubic-bezier(0.22, 1, 0.36, 1)`), `--duration-fast`
(160ms) for controls, `--duration-reveal` (640ms) for scroll reveals.
Reveal-on-scroll uses IntersectionObserver and must be disabled under
`prefers-reduced-motion`, as must the `StateField` hero canvas (it renders a
static field instead). Motion communicates state change; it never loops
decoratively.

## Do / don't

**Do**

- Use tokens for every color, size, and space value.
- Set every identifier, timestamp, and status label in IBM Plex Mono.
- Show failed/sunset work in coral at full visibility.
- Keep pages quiet: ink ground, ledger ruling, sparse signal color.

**Don't**

- Introduce white (`#fff`), pure black, or any hue outside the palette.
- Use a signal color for decoration, or a meaning's color for another meaning.
- Round corners, add shadows or gradients, or close the open frame.
- Use Tailwind or utility classes — this repo is tokens + CSS Modules by
  decision (see `docs/decisions/003-design-system-choices.md`).
