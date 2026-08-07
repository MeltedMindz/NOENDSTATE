# Incident response

Every incident follows the same spine — **detect → contain → communicate
→ recover → postmortem** — with communication anchored in the record: a
Chronicle `incident` event (append-only, honest timestamps), corrections
pushed to every live surface (today: the site and GitHub; social
channels as they launch — the "security-alerts" duty travels to each new
surface), and a `recovery`/`postmortem` event to close. Tone rules:
`docs/studio/failure-policy.md` — active voice, no euphemism, exploit
details deferred until remediated (`docs/studio/transparency-policy.md`).

## Severity

| Level | Definition | Examples | Response clock |
|---|---|---|---|
| SEV-1 | People losing money, or an official surface actively lying | fake mint spreading, compromised account posting scam, contract exploit | now; everything else stops |
| SEV-2 | Trust surface compromised, no active victim flow | defaced site caught early, rogue webhook contained, discrepancy in published figures | same day |
| SEV-3 | Contained/attempted incidents, impersonation at small scale | fake account with low reach, failed phishing on a maintainer | days; batch disclosure acceptable |

Public communication is required for SEV-1 and SEV-2 always; SEV-3 gets
Chronicled when it teaches something or touched anything user-facing.

## Scenario runbooks

**Fake accounts / impersonation.**
Detect: periodic handle searches; community reports. Contain: platform
impersonation reports; document (screenshot + URL) before takedown.
Communicate: SEV-3 usually — warn on live surfaces if the fake gained
any traction; restate the canonical line ("if it isn't on
noendstate.com, it isn't us"). Recover: takedown confirmed. Postmortem:
only if victims or scale.

**Fake contract addresses / fake mint announcements (assume SEV-1).**
Detect: monitoring for the studio name + "mint"/addresses; reports.
Contain: report the scam infrastructure (platform, hosting, explorer
flags). Communicate — the critical step: immediate, pinned warning on
every live surface + site notice; state plainly that **no contract
addresses exist and no mint exists** (`config/contracts.ts` is the
proof); Chronicle `incident` event if it reached real people. Recover:
takedowns; keep the warning pinned past the scam's lifetime.
Postmortem: what let it spread; feed
`docs/security/community-threat-model.md`.

**Compromised official social account (SEV-1).**
Detect: unexpected posts, login alerts, community reports ("did you
really post this?"). Contain: platform account-recovery + session
revocation; delete scam posts the moment access returns; if recovery is
slow, declare the account compromised from every *other* live surface
and the site. Communicate: correction pinned on the recovered account;
Chronicle event with timeline (what was posted, when, for how long).
Recover: rotate credentials, audit authorized apps, re-verify 2FA
hardware. Postmortem: required — how access was lost.

**Compromised Discord bot (SEV-1 if it announced; SEV-2 contained).**
Detect: bot posts/DMs outside its pattern; audit-log anomalies. Contain:
kick the bot, revoke its token, lock announcement channels; assume DMs
were sent — say so. Communicate: server-wide notice + other surfaces;
remind users the studio never DMs first, never asks for wallets.
Recover: rotate tokens, re-scope to least privilege before re-adding.
Postmortem: required.

**Malicious webhook (SEV-2; SEV-1 if scam content shipped).**
Detect: posts not traceable to a studio process. Contain: delete the
webhook (rotation = deletion + recreation); audit who could read the
URL. Communicate: correction in affected channels; Chronicle if
anything user-harming posted. Recover: treat webhook URLs as secrets —
never in repo, rotated on any suspicion. Postmortem: how the URL leaked.

**Website compromise (SEV-1 — the site is the source of truth).**
Detect: content not matching the repo (the site is fully deterministic
from git — any divergence is compromise), CSP violation reports, Vercel
deploy history anomalies. Contain: Vercel instant rollback to a known-
good deployment (`docs/architecture/deployment.md`); revoke suspect
sessions/tokens on Vercel + GitHub; freeze deploys until the entry path
is known. Communicate: notice on the site itself post-recovery + all
live surfaces; Chronicle event stating exactly what the site showed and
for how long — especially any falsified addresses or figures. Recover:
rotate all deploy credentials; audit repo history for injected commits.
Postmortem: required; feeds `docs/security/web-threat-model.md`.

**Contract incident (future — no contracts are deployed today).**
Detect: monitoring per deployment gate #7 (role grants, pauses,
schedule/sink changes, funding, anomalous transfers). Contain: pause
affected contracts (StateZero transfers; distributor funding/claims;
router intake) — noting settled `withdraw` paths stay open by design
(`docs/protocol/transfer-semantics.md`); convene signers. Communicate:
**every pause is publicly Chronicled when it happens, not after** — an
unexplained pause is its own trust incident; then status updates at
honest intervals; exploit detail after remediation. Recover: audited
fix or wind-down per the threat model's assumptions; funds disposition
stated explicitly. Postmortem: required, launch-quality
(`docs/studio/failure-policy.md`).

**Data discrepancy (SEV-2 default).**
Definition: a published figure or record that doesn't match its source —
site vs. repo, label vs. evidence, (future) displayed balance vs. chain,
role map vs. chain state. Detect: the labeling contract makes every
figure recomputable (`docs/treasury/data-methodology.md`); tests catch
schema-level drift. Contain: correct the display or mark it stale —
never quietly patch a number that was wrong in public. Communicate: a
Chronicle `correction` event superseding the wrong record
(`docs/chronicle/integrity-rules.md`) — discrepancies route through the
correction machinery, which *is* their disclosure. Recover: fix the
producing process. Postmortem: for repeat or systemic cases.

## After any incident

1. `recovery` event when stable; `postmortem` event + published
   postmortem for SEV-1 and any required case above.
2. Update the relevant threat model in the same change set — an incident
   that changes no document is an incident waiting to repeat.
3. Reporting channel for outsiders who find something: `SECURITY.md`.
