# Discord roles

Role design for the NO END STATE server. Least privilege throughout: a role
grants only what its job requires. The full capability matrix is in
`community/discord/permissions.md`.

No server exists yet. When it launches, roles are created top-to-bottom in the
order listed here (Discord role hierarchy matters for moderation actions).

## Staff roles

### Founder
- **Purpose:** The founder. Server owner. The only account with full
  administrative control, and the account of last resort for recovery.
- **Obtained:** Held by the founder's account only. Never granted.

### Core
- **Purpose:** Core team members building NO END STATE. Post in official and
  read-only channels, run the studio-facing categories.
- **Obtained:** Granted by Founder to core team members. Removed when someone
  leaves the team. There is currently no core team beyond the founder; the
  role exists so the structure does not need to change when that changes.

### Operator
- **Purpose:** Server operations — channel upkeep, invites, webhooks, the sync
  tooling, bot configuration. The only non-Founder role that touches server
  plumbing.
- **Obtained:** Granted by Founder. Requires 2FA on the account (Discord's
  server-wide moderator 2FA requirement is enabled).

### Security
- **Purpose:** Anti-scam and incident response. Posts in #security-alerts,
  triages #scam-reports, runs the compromised-bot playbook, and is the only
  role besides Founder that may use @everyone (in #security-alerts only).
- **Obtained:** Granted by Founder. Requires 2FA.

### Moderator
- **Purpose:** Keeps conversation within the rules. Deletes rule-breaking
  content, manages threads, applies timeouts, escalates per
  `community/discord/moderation.md`. No server-management power.
- **Obtained:** Granted by Founder or Operator to trusted, active members
  after a track record in the server. Requires 2FA. There are no moderators
  yet because there is no server yet; early moderation is done by the team.

## Member roles

### Builder
- **Purpose:** Recognized builders — people who have shipped meaningful work
  in or around NO END STATE. Can post in THE LAB working channels
  (#experiments, #prototypes, #requests-for-comment).
- **Obtained:** Granted by Core or Founder based on demonstrated work
  (contributions, prototypes, sustained useful presence in BUILDERS channels).
  Not sold, not automated, not tied to holding anything.

### Contributor
- **Purpose:** People actively contributing — code, design, research, docs,
  translations. Can post in #contributors and open RFCs.
- **Obtained:** Granted by Core, Operator, or Founder after a first accepted
  contribution (for code, a merged PR on github.com/MeltedMindz/NOENDSTATE
  counts).

### State Zero
- **Purpose:** Verified holders of the STATE ZERO founding cohort NFT. Grants
  access to the gated STATE ZERO channels.
- **Obtained:** CANNOT BE OBTAINED YET. Minting is not active, no contract is
  deployed, and wallet verification is not configured. When a mint exists,
  this role will be granted exclusively through wallet verification via a
  reviewed provider — never by a moderator manually, never by DM, never by
  anyone asking you to sign something unexpected. Anyone offering this role
  today is a scammer.

### Project roles (one per project, named for the project)
- **Purpose:** Optional per-project roles (e.g. a role matching a P-NNN
  registry entry) used for notification opt-in and, if a project has its own
  gated needs, access. Created by the sync process alongside the project
  category.
- **Obtained:** Self-assigned for notification roles; project-specific rules
  otherwise, documented in that project's #overview. None exist — the project
  registry is empty.

### Verified
- **Purpose:** The baseline participation role. Everything a normal member
  does (posting in open channels, creating threads in forums) hangs off
  Verified, not @everyone.
- **Obtained:** Automatically, by completing membership screening (accepting
  the rules) and the verification step described in
  `community/discord/onboarding.md`.

### Visitor
- **Purpose:** The state before verification — effectively @everyone. Can
  read START HERE and nothing else. Exists so unverified accounts and raid
  bots have no surface to post on.
- **Obtained:** Automatic on join. Replaced by Verified after onboarding.

### Bot
- **Purpose:** The studio's own bots (Chronicle mirror, community-sync when
  apply mode exists, verification). Scoped to exactly the channels they post
  in. Never given Administrator.
- **Obtained:** Assigned by Operator when a bot is added. Every bot addition
  follows the review checklist in `community/discord/security.md`.
