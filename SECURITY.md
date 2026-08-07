# Security policy

## Reporting a vulnerability

Report privately via **GitHub security advisories** on this repository:

https://github.com/MeltedMindz/NOENDSTATE/security/advisories/new

Please do not open public issues for security reports. A dedicated
security email does not exist yet; when one does, it will be listed here
and on noendstate.com.

## Scope

- The website and its build pipeline (`app/`, `lib/`, `config/`,
  `content/`, `next.config.ts`, deployment configuration).
- The API routes (`/api/projects`, `/api/chronicle`, `/api/status`) and
  generated surfaces (feed, sitemap, OG images).
- The contract prototypes in `contracts/src/`. Note: **these are
  undeployed, unaudited prototypes** — findings are very welcome and
  will be credited, but there are no funds at risk anywhere. Nothing is
  deployed to any chain, and there are no official contract addresses
  (`config/contracts.ts` is the authoritative — currently empty — list).
- Impersonation of the studio (fake accounts, fake mints, lookalike
  domains): reports appreciated through the same channel.

Out of scope: denial-of-service volumetrics against Vercel, findings in
third-party platforms themselves (GitHub, Vercel), and reports that a
null/unset value is null — that is by design.

## No bug bounty (yet)

There is currently **no bug bounty program** and no monetary reward for
reports. Saying so plainly beats implying otherwise. If a bounty is ever
established — expected no earlier than contract deployment, per
`docs/protocol/deployment-gates.md` — it will be announced in the
Chronicle and documented here first.

## Response expectations

- Acknowledgment within **72 hours**, an initial assessment within
  **7 days**.
- Coordinated disclosure: we ask for reasonable time to remediate before
  publication; we commit to not sitting on reports.
- Confirmed incidents are disclosed in the studio's append-only Chronicle
  per `docs/security/incident-response.md` — including what happened and
  when, permanently.
- Reporters are credited if they wish (and not, if they don't).

## Related documents

- `docs/security/web-threat-model.md` — website surfaces
- `docs/security/protocol-threat-model.md` — contracts summary + key gates
- `docs/security/community-threat-model.md` — impersonation and social
- `docs/security/incident-response.md` — what happens after a report
