# Web threat model

Attack surface of the website itself. Context that shrinks most threats:
the site is static-first, has **no database, no sessions, no forms, no
secrets at runtime, and no third-party scripts** — there is very little
to steal from the site directly. The real prize is *trust*: a compromised
site could show fake addresses or fake economics to real people. That
framing drives the priorities below.

## Surfaces and mitigations

### Supply chain (highest practical risk)

- **Threat**: malicious or compromised npm packages executing at build
  time or shipping to the client; the classic path to defacing a static
  site.
- **Mitigations**: pnpm with a committed lockfile (`pnpm-lock.yaml`);
  deliberately small dependency surface (no Tailwind, no CSS-in-JS, no
  analytics, no wallet libs today — see ADRs 001/003); TypeScript strict;
  builds run only in Vercel's pipeline from repo state.
- **Gaps**: no automated dependency audit/pinning policy documented yet
  (no Dependabot/audit gate wired); adding wallet-connect libraries later
  (`walletConnectEnabled` flag exists) would be a major surface expansion
  requiring its own review.

### XSS and CSP posture

- **Threat**: script injection rewriting displayed addresses/figures.
- **Mitigations**: no user-generated content anywhere — all rendered data
  comes from typed, Zod-validated repo content; React's default escaping;
  CSP in `next.config.ts`: `default-src 'self'`, images self/data/blob,
  fonts self (self-hosted via `next/font`), `connect-src 'self'`,
  `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `upgrade-insecure-requests`. **No external hosts
  are allowed at all** — any injected reference to an attacker's origin
  fails at the browser.
- **The `unsafe-inline` tradeoff, stated honestly**: `script-src` and
  `style-src` allow `'unsafe-inline'` because Next.js streaming/hydration
  requires inline bootstrap scripts and styles without a nonce pipeline.
  This weakens CSP's value *against injected inline code*. Accepted
  because the injection prerequisites barely exist (no UGC, no query
  reflection, no third-party scripts) — but it is a real gap: moving to
  nonce/hash-based CSP is the known hardening step if the site ever
  renders less-trusted content.

### Headers (all set in `next.config.ts`, single source of truth)

HSTS two years + includeSubDomains + preload; `X-Content-Type-Options:
nosniff`; `X-Frame-Options: DENY` (+ CSP frame-ancestors) against
clickjacking; `Referrer-Policy: strict-origin-when-cross-origin`;
minimal `Permissions-Policy` (camera, mic, geolocation, payment, usb all
denied); `poweredByHeader` off.

### API abuse

- Surface: three read-only JSON routes (`/api/projects`,
  `/api/chronicle`, `/api/status`) + the OG image renderer. No writes, no
  auth, no user input beyond route params; they serve the same validated
  build-time content as the pages.
- Threats are availability-shaped (scraping, request floods) and land on
  Vercel's platform limits. **Gap**: no explicit rate limiting; accepted
  while endpoints are cheap and static-backed. The OG image route does
  per-request rendering — watch it first if abuse appears.

### DNS / domain

- **Threat**: nameserver or registrar takeover — the cleanest full-site
  hijack, no code compromise needed.
- **Mitigations**: `noendstate.com` registered *and* served at Vercel
  (registrar = host removes a transfer seam); HSTS preload limits
  downgrade tricks.
- **Gaps**: registrar-level lock/monitoring not yet configured or
  documented; domain expiry monitoring is manual. DNSSEC depends on
  Vercel support — decide and document.

### Vercel account (the keys to everything)

- **Threat**: account/team compromise → deploy anything, read/set env
  vars, move the domain. This is the web equivalent of key compromise.
- **Mitigations**: the env-var double-gate means even a hostile deployer
  cannot enable mint/claims without a code change landing in the repo
  (`config/economics.ts` requires `legalApprovalStatus === "approved"` in
  committed code); rollback is instant
  (`docs/architecture/deployment.md`).
- **Required practice**: hardware-key 2FA, minimal membership, no shared
  accounts, production promotions only from the default branch. GitHub
  account compromise is the sibling risk (push access = deploy access):
  same 2FA bar, branch protection on the default branch.

## What the site cannot lose

Worth stating: the site holds no funds, no keys, no user data, and no
credentials. The worst web compromise is a *lying site* — which is why
incident response for website compromise
(`docs/security/incident-response.md`) is about fast rollback and loud
correction, and why the permanent record lives in git history and (in
future) onchain mirrors rather than only on the deployed page.

## Review triggers

Reassess this model when any of these change: wallet-connect enabling,
any form or user input, any third-party script or font host, any new API
route with parameters, adoption of a CMS (rejected in ADR 002), or the
first real contract addresses appearing on the site.
