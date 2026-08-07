# ADR 001 — Single app at the repository root

- **Status**: accepted, 2026-08-07
- **Context**: `docs/decisions/000-repository-baseline.md`

## Decision

One Next.js 16 App Router application lives at the repository root. No
monorepo tooling (no Turborepo/Nx, no `apps/` + `packages/` split). The
Foundry workspace sits beside it in `contracts/` as a plain subdirectory
with its own toolchain, not a workspace package.

## Context

The studio ships one public surface: the website that *is* the record.
The candidates were:

1. **Monorepo** (`apps/web`, `packages/content`, `packages/ui`,
   `packages/contracts`) — the default reflex for a studio that expects
   many products.
2. **Single app at root** with plain directories (`app/`, `content/`,
   `lib/`, `config/`, `contracts/`).

## Rationale

- **The record's integrity depends on one build.** Content validation must
  fail the *site's* build (`lib/content.ts` throws → `pnpm build` fails).
  In a monorepo that guarantee smears across package boundaries, versioned
  internal dependencies, and pipeline caching; at root it is a single
  import graph with no seams.
- **Projects will not live in this repo.** Studio projects (`P-NNN`) get
  their own repositories; this repo is the studio's own record and site.
  The monorepo's main benefit — shared code across deployables — has no
  second deployable to serve.
- **Less machinery to trust.** Every workspace tool added is supply-chain
  and configuration surface for the thing whose whole job is being
  trustworthy. pnpm + Next + Foundry side by side is the smallest honest
  setup.
- **Vercel simplicity.** Root app means zero root-directory/monorepo
  configuration in the deploy pipeline (`docs/architecture/deployment.md`).

## Consequences

- Web tests (vitest/Playwright), content, config, and components share one
  `tsconfig` and one dependency tree — upgrades are atomic.
- `contracts/` is intentionally *not* integrated: `forge test` runs
  separately, and the web app knows contracts only through
  `config/contracts.ts` (all null today). This is a feature — the site
  cannot accidentally depend on unaudited prototypes.
- Design system stays local (`app/tokens.css`, CSS Modules) instead of a
  shared package; if a second surface ever needs it, extraction is the
  reversal path, not premature packaging.

## Reversal path

If a second deployable emerges from *this* repo (unlikely — see above):
introduce pnpm workspaces, move the app to `apps/web/` and shared code to
`packages/`, and set the Vercel root directory accordingly. The content
loaders' throw-on-invalid behavior must move with `content/` and keep
failing the site build — that property is non-negotiable regardless of
layout. Record the change as ADR 00X plus a Chronicle event; the repo
layout is part of the public record's provenance.
