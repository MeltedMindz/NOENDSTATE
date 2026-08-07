# Decision 000 — Repository Baseline

Date: 2026-08-07
Status: Recorded

## Baseline state

- Working directory: `/Users/melted/Documents/NOENDSTATE`
- State at discovery: **completely empty directory** (no files, no `.git`, no lockfile, no framework, no prior work to preserve)
- Git: initialized fresh at `main` on 2026-08-07; there is no prior history
- GitHub: no repository named `NOENDSTATE` (or similar) existed under `MeltedMindz` at discovery time
- Vercel: authenticated as `meltedmindz` (team `melteds-projects`); **no existing Vercel project** serves noendstate.com
- Domain: `noendstate.com` registered through Vercel on 2026-08-07 (~30 minutes before this build began), nameservers `ns1/ns2.vercel-dns.com` verified, **not attached to any project**

Because the directory was empty, no unrelated work required preservation. The production-promotion risk of overwriting an existing application is nil: the domain has never served a deployment.

## Toolchain at discovery

- Node.js v26.0.0
- pnpm 10.28.1 (chosen package manager — no lockfile existed, pnpm is fastest and produces a single `pnpm-lock.yaml`)
- npm 11.19.0 (available, unused)
- Foundry forge 1.5.1-stable (used for the local contract workspace)
- GitHub CLI authenticated as `MeltedMindz` (active) with repo/workflow scopes
- Vercel CLI 54.6.1 authenticated as `meltedmindz`

## Architecture decisions made at baseline

1. **Single Next.js application at the repository root** rather than a pnpm-workspace monorepo (`apps/web` + `packages/*`). Rationale: one deployable site, one lockfile, zero-config Vercel root, simpler CI, no cross-package versioning overhead. Schemas, config, and content live in typed top-level directories (`lib/`, `config/`, `content/`). This is reversible: if a second app appears, the site moves to `apps/web` and shared code to `packages/`.
2. **Next.js App Router + TypeScript strict**, hand-scaffolded (no `create-next-app` template residue).
3. **No Tailwind, no component kit.** Design tokens are CSS custom properties in `app/tokens.css`; components use CSS Modules. This is a deliberate anti-generic choice: the visual system is custom-built.
4. **Structured TypeScript content validated with Zod** instead of MDX. Projects, Chronicle events, and Build entries are typed records in `content/`, validated at build time by unit tests. MDX can be added later if long-form prose outgrows this.
5. **Foundry** for the contract workspace at `contracts/` (forge already installed). Contracts are local prototypes only — no deployment.
6. **All economic feature flags default off** (`config/economics.ts`): mint disabled, claims disabled, wallet connect disabled, no contract addresses, no supply/price invented.

## Branch plan

- `main`: baseline commit only, then receives the feature branch by merge/PR.
- Feature branch: `fable5/no-end-state-foundation-2026-08-07` — all build work.

## Risks recorded at baseline

- Vercel CLI is outdated (54.6.1 vs 58.x); deployment commands verified to work before relying on newer flags.
- `noendstate.com` DNS is live at Vercel but unattached — until production promotion, the apex serves nothing.
- No social accounts, legal entity, or contract deployments exist. These are launch gates, not build blockers (see `docs/decisions/open-decisions.md`).
