# 04 — Product architecture (The Product Engineer)

Canonical reference: `docs/architecture/*.md`.

## Application

Next.js 16 App Router, TypeScript strict, single app at repo root, pnpm. Static-first: every route prerenders except `/chronicle` (searchParams filter → dynamic). No database; content is typed TypeScript in `content/` validated by Zod schemas (`lib/schemas/`) through `lib/content.ts` — invalid content fails the build. Server components by default; client components only where interaction demands (`SiteHeader` menu, `StateField`, `Reveal`).

## Routes shipped (all complete, no placeholders)

`/` (10-section narrative), `/studio`, `/projects` (+ `[slug]` detail with record table, chronicle trail, postmortem slot), `/state-zero` (+ `[tokenId]` — dev-fixture-only, 404s in production, noindexed), `/chronicle` (filterable list + integrity rules; `[eventId]` detail with supersede links both directions), `/treasury` (uninitialized state + methodology + prototype contract table), `/build` (BUILD-000), `/manifesto`, `/community`, `/faq` (FAQPage schema), `/legal` (14 open gates), `/privacy` `/terms` `/risk` (labeled drafts), `/status` (build-time truth, no fake uptime), custom 404. Machine layer: `sitemap.xml`, `robots.txt` (fixture paths disallowed), `feed.xml` RSS, `/api/projects` `/api/chronicle` `/api/status`, `public/llms.txt`, OG image, manifest, Organization JSON-LD.

## Honesty mechanics

- Feature flags double-gated: env var AND `legalApprovalStatus === "approved"` (a reviewed code change) — mint/claims cannot be enabled by environment alone.
- `VerificationBadge` four-class labeling (onchain/disclosed/external/estimate) used wherever facts render.
- Zero states are designed content: empty registry, uninitialized treasury, tokenless explorer, not-yet-public community surfaces.
- Generators (`studio:new-project`, `studio:new-event`) allocate stable IDs but write nothing — records enter by review; unit tests enforce Chronicle invariants.

## Performance posture

System-font-free custom stack via next/font (self-hosted, swap); canvas hero is the only ambient animation (single rAF, ~2.4 appends/s, pauses on hidden); CSS modules + tokens, no runtime CSS-in-JS; no third-party scripts, no analytics, no external requests at runtime (CSP `connect-src 'self'`).
