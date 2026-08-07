# 07 — Playwright verification (The Adversarial Launch Operator)

## Configuration

Chromium via @playwright/test 1.62. Two projects: desktop (1440×1000) and mobile (iPhone 14 emulation: 390×844, DPR 3, touch). Suite boots its own production server (`next build` output, port 3105). Console errors and page errors fail tests — zero allowlist. Screenshots on failure, traces on retry.

## Coverage

- **Routes (×2 viewports):** all 16 primary routes render 200 with exactly one h1, visible header/footer, no horizontal overflow, zero console/runtime errors; 404 page; fixture-token 404 in production.
- **Interaction:** fullscreen menu open/navigate/close, Escape + focus return, focus trap (16-tab cycle), body scroll lock, skip link, FAQ disclosures, chronicle type filter, internal-link crawl (every `/`-prefixed href on `/`, `/community`, `/legal` fetched and asserted 200).
- **Honesty checks as tests:** empty registry copy, "Treasury not yet initialized", no `$` figures on treasury, "Mint not active" with no buy/mint CTA, community "Not yet public" states, GitHub as only live external link.
- **Accessibility:** axe-core WCAG 2A/AA/2.2-AA on all 16 routes × both projects + menu-open state; serious/critical must be zero.
- **Reduced motion:** emulated; all reveals visible, canvas static, page interactive.
- **Machine surfaces:** sitemap (fixture paths excluded), robots, RSS shape + real records, llms.txt claims, JSON APIs (counts, disabled flags), canonical URLs, OG tags, security headers.

## Defects found → fixed (each verified by re-run)

1. Reveal-on-scroll masked by `scroll-behavior: smooth` in capture tooling — instant-scroll in tooling; reveals verified real.
2. Hero field empty at first paint — StateField now seeds 26 strata ("the record predates the viewer").
3. axe color-contrast unrezolvable: translucent header + background-image ground → opaque body ground (ruling moved to fixed overlay), header to 0.96 opacity, ash brightened `#8a867c`→`#98948a`, footer pending entries to full ash.
4. WCAG 2.2 target-size on mobile — footer/menu links padded to 24px+, status-pill min-height.
5. CSP `upgrade-insecure-requests` broke all assets under mobile emulation (https upgrade on localhost) — removed, redundant with HSTS.
6. `scrollable-region-focusable` on mobile /status (found on the **deployed** run) — all `.table-scroll` regions given `tabIndex=0` + region role/label.
7. Test-side: ambiguous filter selector (exact match), keyboard-trap specs gated off touch project.

## Results

- Local production build: **111 passed, 3 skipped** (mobile keyboard tests), 0 failed.
- Vercel deployment (post-fix): full suite green against the live URL.
- Evidence: verification screenshots in `artifacts/verification/` (gitignored) — home/chronicle/state-zero/manifesto/studio at desktop+mobile, fold+full; HTML report `playwright-report/` on failures.
