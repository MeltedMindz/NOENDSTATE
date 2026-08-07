# Discord security and anti-scam policy

The threat model is simple: NFT-adjacent communities get attacked constantly,
mostly through impersonation, fake mint links, and compromised bots or staff
accounts. Every policy below exists to make the real thing verifiable and the
fake thing detectable in seconds.

## The invariants

Members can rely on these without exception. Breaking one of these is an
incident by definition.

1. **The team never initiates DMs.** Not for support, not for verification,
   not for "you won something," not during an incident. All team contact
   happens in public channels. Anyone DMing you first while claiming to be
   NO END STATE is an attacker.
2. **Official links live in exactly one channel: #official-links** (and on
   noendstate.com, which #official-links mirrors). A link that is not in both
   places is not official. Currently live: https://noendstate.com and
   https://github.com/MeltedMindz/NOENDSTATE. Everything else — X, Telegram,
   any mint page — does not exist yet, and #official-links says so explicitly.
3. **Contract addresses live in exactly one channel: #official-links.**
   Current truth: **no contract exists and no address has been published,
   for STATE ZERO or anything else.** The channel states this in plain text.
   When a contract is ever published, it appears on noendstate.com and in
   #official-links simultaneously, announced in #announcements and
   #security-alerts. Any address that arrives any other way is a scam.
4. **We never ask for seed phrases or private keys.** Not staff, not bots,
   not "verification," not ever. There is no exception.
5. **We never instruct blind signing.** We will never tell members to sign a
   transaction or message they cannot read and understand, never push
   "urgent" signature requests, and never gate anything on signing an
   unexplained payload. Wallet verification, when it exists, will use a
   reviewed provider and a plain-text signature message that costs nothing.
6. **Nothing is urgent.** We do not do surprise mints, stealth drops, or
   countdown pressure. If a message manufactures urgency, that alone marks
   it fake.

## Incident announcements

- Security-relevant events are announced in **#security-alerts** — the only
  channel where @everyone may be used, and only by Security or Founder.
- An alert states: what happened, what is affected, what members should do,
  and what we are doing. It is mirrored to noendstate.com and recorded in
  the Chronicle (NES event) once the facts are stable.
- During an active incident, absence of an alert in #security-alerts means a
  claim circulating elsewhere is unverified. When in doubt, the site is the
  root of trust.

## Wallet verification (future)

- The State Zero role will only ever be granted through wallet verification
  via a **reviewed provider** — reviewed before adoption for: signature
  scheme (message signing only, no transactions, no approvals, no spending
  permissions), data handling, breach history, and permission footprint in
  our server.
- Verification will be announced in #announcements before it goes live, with
  the provider named, so members can verify the flow itself.
- Until a mint exists, **all wallet verification claims are scams.** There is
  nothing to verify.

## Bots

- Every bot is added by Operator after a review: publisher, permissions
  requested (least privilege — no Administrator, ever), what it can read,
  what it can post, and where. Findings are noted in the build log.
- Bot tokens are credentials: never committed, never shared, rotated on any
  suspicion. The community-sync tool (scripts/community-sync.mjs) is dry-run
  only today and requires DISCORD_BOT_TOKEN, DISCORD_SERVER_ID, and --apply
  for any future apply mode.

## Compromised-bot playbook

If a bot posts something unexpected, or a bot token may be exposed:

1. **Contain** — Operator or Founder removes the bot from the server
   (kick/deauthorize) immediately. Do not debug first.
2. **Revoke** — rotate the bot token at the developer portal; revoke any
   OAuth grants.
3. **Alert** — Security posts in #security-alerts: the bot is compromised or
   suspect, ignore anything it posted after the stated time, links and
   addresses it posted are void.
4. **Clean** — delete the malicious messages, audit webhooks and recent
   channel/permission changes in the server audit log, revert anything the
   bot changed.
5. **Verify** — confirm #official-links content is intact before pointing
   members back at it.
6. **Record** — Chronicle incident entry and, if member harm was possible, a
   postmortem in #postmortems. Reinstate the bot only after the token path
   and permission scope are re-reviewed.

The same shape applies to a compromised staff account: remove roles first,
alert, clean, then investigate.

## Reporting

- Members report scams in **#scam-reports** (impersonators, fake links, fake
  mints, suspicious DMs — screenshots help). Security triages every report.
- Security vulnerabilities in anything we ship are **not** reported in public
  channels — use the security contact published on noendstate.com. We do not
  yet run a bug bounty; honest disclosure is credited in the Chronicle.
