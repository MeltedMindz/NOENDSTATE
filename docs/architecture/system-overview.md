# System overview

One Next.js 16 App Router application at the repository root (TypeScript
strict, pnpm). No CMS, no database, no external services at runtime: the
site is a build of the repository's own typed content. Contract prototypes
live in `contracts/` (Foundry) and are compiled and tested independently;
nothing on the site reads from a chain because nothing is deployed.

## Layout

```
app/            routes, layout, tokens.css, globals.css, opengraph-image
components/     shared UI (Marks, StateField, reveal primitives)
config/         studio.ts · economics.ts · community.ts · contracts.ts
content/        typed TS content: projects/ · chronicle/ · builds/
lib/            content.ts loaders · schemas/ (Zod) · fixtures/
contracts/      Foundry prototypes + tests (not deployed anywhere)
scripts/        generators (new-project, new-event, community-sync)
tests/          unit/ (vitest) · e2e/ (Playwright)
public/         llms.txt
```

## Data flow

```
content/*.ts ──▶ lib/schemas/*.ts (Zod) ──▶ lib/content.ts loaders
                        │ parse fails ⇒ BUILD FAILS
                        ▼
        pages (app/**) · /api/{projects,chronicle,status} · feed.xml
                        · sitemap.xml · opengraph-image
config/*.ts ──▶ same pages (identity, nulls, flags — economics.ts is
                itself Zod-parsed at import)
```

Everything rendered passes through `lib/content.ts`, which parses every
entry against its schema and runs `validateChronicle` integrity checks.
Invalid content throws at import time, which fails `pnpm build` — the deploy
pipeline is the enforcement point. See
`docs/architecture/content-model.md`.

## Rendering strategy

Static-first. Content is imported TypeScript, so nearly every route is
statically generated at build time:

- **Static**: `/`, `/studio`, `/projects`, `/projects/[slug]` (via
  `generateStaticParams`), `/chronicle`, `/chronicle/[eventId]`,
  `/state-zero`, `/treasury`, `/build`, `/manifesto`, `/community`, `/faq`,
  `/legal`, `/privacy`, `/terms`, `/risk`, `/status`, the 404 page,
  `sitemap.xml`, `robots.txt`, `feed.xml`, `public/llms.txt`, the web
  manifest.
- **Dynamic at request time**: only where a static file can't do the job —
  `app/opengraph-image.tsx` (rendered by `next/og`) and the JSON routes
  `/api/projects`, `/api/chronicle`, `/api/status` (route handlers serving
  the same validated content; they exist so external tools get JSON, not so
  the site has a backend).
- **Environment-dependent**: `/state-zero/[tokenId]` renders fixture tokens
  from `lib/fixtures/` in development only. In production the fixture flag
  is off and these paths 404; `robots.txt` additionally disallows them.

There is no server state, no session, no cookie, no form handler. A page
can only show what the repo contains — which is the transparency model,
not a limitation.

## Client-side behavior

Kept deliberately small:

- `components/StateField.tsx` — the procedural hero canvas. Accumulates
  horizontal strata (seeded with 26 at load, one per founding-era ledger
  line), pauses when the tab is hidden, and renders a single static field
  under `prefers-reduced-motion`.
- Reveal-on-scroll via IntersectionObserver, also reduced-motion safe.
- No analytics scripts, no third-party embeds — the CSP in
  `next.config.ts` allows no external hosts at all (see
  `docs/security/web-threat-model.md`).

## Feature gating

`config/economics.ts` exports `featureFlags`. Mint and claims flags require
**both** an env var and `legalApprovalStatus === "approved"` in code;
approval is `"not_started"`, so they are false regardless of environment.
UI renders honest locked states around every null. Full mapping:
`docs/state-zero/economic-gates.md` and
`docs/architecture/deployment.md`.

## Relationship to the contracts

`contracts/` is a sibling world: Foundry, solc 0.8.28, OpenZeppelin v5.7,
42 passing tests, gas snapshot at `contracts/.gas-snapshot`. The web app's
only knowledge of it is `config/contracts.ts`, where every address is
`null` and every status is `"prototype"`. When a real deployment ever
happens (gated by `docs/protocol/deployment-gates.md`), that file is the
single place addresses enter the site — never hardcoded in pages.
