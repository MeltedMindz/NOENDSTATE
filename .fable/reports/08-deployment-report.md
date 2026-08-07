# 08 — Deployment report (The Adversarial Launch Operator)

Date: 2026-08-07

## GitHub

- Repo created: **github.com/MeltedMindz/NOENDSTATE** (public).
- `main` = baseline → PR #1 (feature branch `fable5/no-end-state-foundation-2026-08-07`, all workstreams) → merge `c6dd93d` → fix commits `80f4c6d` (a11y scrollable regions), `173e82a` (gitignore scoping + reports), `<launch record commit>` (NES-0003).
- CI: `.github/workflows/ci.yml` — web job (lint/typecheck/unit/build/Playwright) + contracts job (forge, submodules).

## Vercel

- Project **melteds-projects/noendstate** created this session (`vercel link`), GitHub repo connected — pushes to `main` auto-deploy to production.
- No prior project served the domain; nothing was overwritten. `noendstate.com` was registered through Vercel by the account owner ~30 min before the build began and was unattached.
- Deployment protection (Vercel SSO on \*.vercel.app URLs) disabled via API so the public site is verifiable; the site holds no secrets.
- Deployments verified in sequence: `gmxihzprx` (merge) → found scrollable-region a11y defect → `oku5z26kn` (fix) → found `/build` 404 (root cause: generic `build/` gitignore pattern had excluded `app/build/` from git) → `ahfnn7ta2` (fix) → **full suite green against the deployment**.

## Production promotion

Gates checked before domain attachment: build/lint/typecheck/unit/contract/e2e all green; no secrets in repo; env documented; no fake links; mint + claims disabled (double-gated); no contract addresses; fixtures 404 + noindex in production; legal drafts labeled; correct project confirmed; domain unattached (nothing to destroy).

- `noendstate.com` and `www.noendstate.com` attached to the project.
- **https://noendstate.com serving over HTTPS** with full security headers (CSP, HSTS preload, nosniff, DENY, referrer/permissions policies).
- `www` → apex via 308 redirect (set via API).
- Post-promotion verification against https://noendstate.com: **111 Playwright tests passed, 0 failed** (3 mobile keyboard tests skipped by design); sitemap (18 URLs), robots (fixtures disallowed), RSS, llms.txt, JSON APIs, OG image (200), canonical URLs — all verified on the live domain. No preview URLs leak into canonical metadata (canonicals are hardcoded to the production domain).

## Rollback

Vercel keeps every deployment; promote any previous one from the dashboard or `vercel rollback`. Content errors roll forward by appending corrections — never by rewriting the Chronicle.
