# 06 — Security review (The Adversarial Launch Operator)

Canonical reference: `docs/security/*.md`, `SECURITY.md`.

## Web

- Headers on every route (verified by e2e): CSP `default-src 'self'` with no external hosts (`'unsafe-inline'` for styles/scripts is the accepted Next.js tradeoff, documented in the threat model; `upgrade-insecure-requests` was removed as redundant with HSTS after it broke localhost emulation), HSTS 2y preload, nosniff, frame DENY, strict referrer policy, minimal permissions policy, `poweredByHeader` off.
- No secrets in repo (`.env*` gitignored; grep-audited). No forms, no cookies, no analytics, no third-party scripts, no wallet code shipped.
- APIs are static JSON of already-public validated content — no user input paths beyond a searchParams enum parse (Zod `safeParse`, invalid → unfiltered view).

## Economic-feature lockdown

Mint/claims flags AND on `legalApprovalStatus === "approved"` in code — environment variables alone cannot enable them (unit-tested). No contract addresses exist anywhere in config or content. Fixture tokens are dev-only, 404 in production, robots-disallowed, noindexed.

## Community

Anti-scam architecture written before any account exists: single read-only official-links channels, no team-initiated DMs, no seed-phrase requests, reviewed-provider wallet verification only, least-privilege Discord permission matrix, incident runbooks for fake accounts/addresses, compromised social/bot/webhook, site compromise, contract incident, data discrepancy.

## Protocol

Threat model in `docs/protocol/threat-model.md`; mitigations exercised by tests (reentrancy, malicious ERC20, fee-on-transfer, role separation, pause behavior, bounded loops). Residual risks and operational key-management gates documented; deployment blocked on all of them.

## Known gaps (documented, not hidden)

CSP `'unsafe-inline'`; no external uptime monitoring (status page says so); no security email until studio accounts exist (GitHub advisories in the interim); Vercel account 2FA is operator responsibility, outside repo control.
