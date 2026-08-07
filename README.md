# NO END STATE

**Founded once. Building indefinitely.**

NO END STATE is an internet-native, onchain product and protocol studio. It
builds independent projects — protocols, AI-native products, developer
infrastructure, experiments — under one persistent company, and preserves the
complete record, including failures, in an append-only Chronicle.

This repository is the studio's foundation: the public site at
[noendstate.com](https://noendstate.com), the content systems that enforce the
record's integrity, and local prototypes of the protocol contracts.

**STATE ZERO** is the studio's fixed founding cohort. Minting is not active,
no contract is deployed, and no participation terms have been published.
Economic features are disabled in code (`config/economics.ts`) and gated
behind `docs/legal/launch-gates.md`.

## Repository structure

```
app/                Next.js 16 App Router — all routes, metadata, OG, feeds
components/         Design system components (open frame, StateField, menu…)
config/             studio / economics / community / contracts configuration
content/            Typed content: chronicle events, projects, build entries
lib/                Zod schemas, content loaders, generative state art
contracts/          Foundry workspace — protocol prototypes + tests (NOT deployed)
community/          Discord / Telegram / X launch systems (no accounts exist yet)
docs/               Brand, architecture, studio, protocol, legal, security docs
scripts/            Generators (new-project, new-event), community sync (dry-run)
tests/              Vitest unit tests + Playwright e2e/a11y suites
.fable/reports/     Build-time workstream reports
```

## Local setup

Requirements: Node ≥ 24, pnpm ≥ 10, Foundry (for contracts).

```bash
pnpm install
pnpm exec playwright install chromium   # once, for e2e tests
pnpm dev                                # http://localhost:3000
```

## Environment variables

None are required to run the site. The flags that exist default to off, and
mint/claims cannot be enabled by environment alone — they also require
`legalApprovalStatus === "approved"` in `config/economics.ts`, which is a
reviewed code change:

| Variable | Default | Meaning |
| --- | --- | --- |
| `NEXT_PUBLIC_STATE_ZERO_MINT_ENABLED` | `false` | Half of the mint gate |
| `NEXT_PUBLIC_REVENUE_CLAIMS_ENABLED` | `false` | Half of the claims gate |
| `NEXT_PUBLIC_WALLET_CONNECT_ENABLED` | `false` | Wallet UI (none shipped) |
| `NEXT_PUBLIC_STATE_ZERO_FIXTURES` | `false` | Dev-only explorer fixtures |

Never commit secrets. `.env*` is gitignored.

## Development

```bash
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest unit tests (content integrity, gates)
pnpm test:contracts   # forge test (42 tests: unit + fuzz + invariant)
pnpm build            # production build
pnpm test:e2e         # playwright e2e + axe (builds must exist: run build first)
pnpm verify           # all of the above in sequence
```

Playwright runs two projects (desktop Chrome 1440×1000, iPhone 14) against a
production server it boots itself on port 3105.

## Adding content

- **Chronicle event:** `pnpm studio:new-event <type> "Title"` prints a scaffold
  with the next `NES-####` id. Append it to `content/chronicle/events.ts`.
  Append-only: never renumber, never delete; corrections reference the record
  they supersede. `pnpm test` enforces the invariants.
- **Project:** `pnpm studio:new-project "Name"` prints a registry record with
  the next stable `P-NNN` id plus its Chronicle draft. Projects enter with
  `public: false` until reviewed.
- **Community sync:** `pnpm community:sync` prints the Discord/Telegram plan
  derived from the registry. Dry-run is the only mode; applying requires
  credentials that intentionally do not exist yet.

## Contracts

`contracts/` is a Foundry workspace containing prototypes of StateZero,
ChronicleRegistry, ProjectRegistry, TreasuryRouter, RevenueDistributor, and
StateRenderer. They compile with solc 0.8.28 (`via_ir`) and carry unit, fuzz,
and invariant tests (`forge test`).

**Nothing is deployed to any chain, and deployment is not authorized** until
every gate in `docs/protocol/deployment-gates.md` and
`docs/legal/launch-gates.md` is closed.

## Deployment

The site deploys to Vercel; `noendstate.com` is registered through Vercel with
nameservers on the Vercel edge network. Pushes build via CI; production
promotion is deliberate, not automatic on day one. See
`docs/architecture/deployment.md`.

## Security

See `SECURITY.md` for reporting. There are no official social accounts yet —
treat any account claiming to be NO END STATE as fake until this repository
and noendstate.com say otherwise.

## License

© 2026 NO END STATE. Source is public for transparency; licensing terms are
an open decision recorded in `docs/decisions/open-decisions.md`.
