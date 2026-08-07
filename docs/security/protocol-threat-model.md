# Protocol threat model — summary and operational gates

The full contract-level threat analysis lives at
**`docs/protocol/threat-model.md`** — assets, actors, per-contract attack
surfaces (reentrancy, malicious ERC-20s, fee-on-transfer, role
compromise, renderer gas, pause abuse), implemented mitigations, and
residual risks. This page is the security-team summary plus the
*operational* half the code can't provide: key management.

## Summary of the code posture

- Six prototype contracts (`contracts/src/`), solc 0.8.28, OZ v5.7.
  **Nothing deployed anywhere, ever**; every address in
  `config/contracts.ts` is null.
- Funds-touching contracts (`TreasuryRouter`, `RevenueDistributor`) use
  pull payments exclusively, reentrancy guards, allowlisted + bounded
  assets (`MAX_ASSETS = 16`), and balance-delta accounting against
  fee-on-transfer tokens.
- Record-keeping contracts (`ChronicleRegistry`, `ProjectRegistry`) have
  **no mutation functions** — compromise can append lies but can never
  rewrite history.
- `StateZero` cannot expand supply, cannot burn, cannot hold funds, and
  runs the distributor checkpoint before every ownership change.
- 42 forge tests pass, including fuzz (`fullAmountAlwaysAllocated`,
  `neverOverDistributes`) and invariants (`paidNeverExceedsFunded`,
  solvency `balance == funded − paid`).
- Honest caveats: unaudited; asset approvals are permanent; admin powers
  (pause, schedule, sinks, roles) concentrate trust until custody
  hardens. Details and residuals: the full threat model.

## Operational key management gates

Contract security collapses to key security the day roles exist on a
real chain. These gates are part of
`docs/protocol/deployment-gates.md` (custody #5, multisig #6, monitoring
#7) — all ❌ — and they are *security* requirements, not paperwork:

| Gate | Requirement before any deployment |
|---|---|
| **No production EOAs** | Every `DEFAULT_ADMIN_ROLE` and long-lived operational role (`RECORDER`, `REGISTRAR`, `FUNDER`, `MINTER`) held by a multisig; the deploying EOA renounces everything, verified onchain after setup |
| **Signer policy** | Documented threshold, signer set, hardware-key requirement, and geographic/device separation; a signer-loss recovery procedure that does not weaken the threshold |
| **Role inventory** | A written map of which key holds which role on which contract, kept current; drift between the map and chain state is a data-discrepancy incident |
| **Least privilege** | Operational roles (recorder, funder) on separate, smaller-blast-radius signers than admin; no role granted "temporarily" outside the documented map |
| **Ceremony discipline** | Deployment and role grants are scripted, rehearsed on testnet (soak gate #9), executed from the audited commit, and Chronicle-recorded with tx hashes |
| **Monitoring on keys** | Alerts on every role grant/revoke, pause, schedule/sink change, and funding event — role misuse must be *detected*, not discovered (`docs/security/incident-response.md`) |

## Today's actual key surface

Because nothing is deployed, the current protocol-adjacent secrets are
mundane and must stay that way:

- **No deployer keys exist yet** — none should be generated until the
  custody gate's ceremony, and never stored in this repo (`.env*` is
  gitignored; the web build needs no secrets at all).
- The real present-day risk concentrations are the **GitHub repo** (the
  record and the code that will someday be audited) and the **Vercel
  account** — covered in `docs/security/web-threat-model.md`. Protecting
  those *is* protocol security right now: the audited artifact is only as
  trustworthy as the history that produced it.

## Escalation

Contract-incident and data-discrepancy procedures — including who can
pause what, and the commitment that every pause is publicly Chronicled —
are defined in `docs/security/incident-response.md`. Vulnerability
reports: see `SECURITY.md` (GitHub security advisories on
`MeltedMindz/NOENDSTATE`).
