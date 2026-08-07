# Deployment

Target platform: **Vercel**. The domain `noendstate.com` was registered
through Vercel on 2026-08-07 and its nameservers point at the Vercel edge
network (Chronicle NES-0001). The Vercel project itself has not been
created yet; this document is the runbook for when it is.

## Build pipeline

```
pnpm install          # lockfile: pnpm-lock.yaml
pnpm test             # 17 vitest unit tests (content integrity, gates)
pnpm build            # next build — Zod parses ALL content; any invalid
                      # entry or Chronicle violation throws and fails here
```

The build is the last gate: invalid content cannot produce an artifact
(see `docs/architecture/content-model.md`). Output is static-first — almost
every route is prerendered; only the OG image and the three `/api/*` JSON
handlers execute per request (`docs/architecture/system-overview.md`).

Contracts (`contracts/`, Foundry) are **not** part of the web build and are
never deployed by this pipeline. Contract deployment is a separate,
fully-gated process: `docs/protocol/deployment-gates.md`.

## Vercel setup

- Framework preset: Next.js; root directory: repository root; package
  manager: pnpm. No build-command overrides needed.
- Git integration on `MeltedMindz/NOENDSTATE`: pushes to the default
  branch build Production; every other branch/PR builds a Preview.
- Domain: attach `noendstate.com` (already registered in the account,
  currently unattached) + `www` redirect to apex.
- Security headers ship from `next.config.ts` (CSP, HSTS w/ preload,
  nosniff, DENY, referrer-policy, permissions-policy) — do not duplicate
  or override them in Vercel config; one source of truth.
- Vercel account hygiene (2FA, minimal members) is part of the web threat
  model: `docs/security/web-threat-model.md`.

## Environment variables

The site runs correctly with **zero** environment variables set. Every
flag defaults to off; env vars can only matter in the enabling direction
after a code change (below).

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_STATE_ZERO_MINT_ENABLED` | unset (false) | Half of the mint double-gate |
| `NEXT_PUBLIC_REVENUE_CLAIMS_ENABLED` | unset (false) | Half of the claims double-gate |
| `NEXT_PUBLIC_WALLET_CONNECT_ENABLED` | unset (false) | Wallet-connect UI convenience |
| `NEXT_PUBLIC_STATE_ZERO_FIXTURES` | unset (false) | Fixture explorer override — **must never be set in Production** |

**The double-gate** (in `config/economics.ts`): `stateZeroMintEnabled` and
`revenueClaimsEnabled` are true only when the env var is `"true"` **and**
`economics.legalApprovalStatus === "approved"` in committed code. Approval
is currently `"not_started"`, so setting the env vars does nothing —
enabling mint or claims requires a reviewed code change that flips the
approval status, which is itself a legal launch gate
(`docs/legal/launch-gates.md`). No one with mere Vercel access can turn on
economics.

Fixtures are the inverse case: enabled automatically when
`NODE_ENV !== "production"` so local dev has an explorer to render. The
`NEXT_PUBLIC_STATE_ZERO_FIXTURES` escape hatch exists for preview
debugging only; leave it unset in the Production environment so fixture
token pages 404 there (robots.txt disallows the paths as well).

## Production promotion

- Default flow: merge to the default branch → Vercel builds → automatic
  promotion to Production once the build (and therefore all content
  validation) succeeds.
- Review flow: every content or code change lands via PR and gets a
  Preview URL; the preview is the place to eyeball rendered Chronicle
  entries before they become part of the public record.
- Manual promotion (promoting a specific successful deployment to
  Production from the dashboard/CLI) is acceptable for hotfix timing, but
  the commit must already be on the default branch — Production never runs
  code that isn't in the repo's main history, because the site *is* the
  record of the repo.

## Rollback

Vercel keeps every Production deployment immutable. To roll back:
dashboard → Deployments → select the last good deployment → "Promote to
Production" (or `vercel rollback`). This is instant and safe because the
site has no database and no runtime state — any previous deployment is
fully self-consistent.

Rollback etiquette for the record: rolling back the site does not rewrite
the Chronicle. If a published entry was wrong, the fix is a `correction`
event that supersedes it (`docs/chronicle/integrity-rules.md`), not a
rollback that pretends it never shipped. Rollbacks are for broken builds
and rendering regressions; if one is user-visible for long enough to
matter, it gets an incident entry per
`docs/security/incident-response.md`.
