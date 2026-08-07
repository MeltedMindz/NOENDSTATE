# Community threat model

Threats that live in social channels rather than code. Current posture
makes this mostly *pre-positioning*: per `config/community.ts`, X,
Discord, and Telegram are all `null` / `"not_yet_public"` — only GitHub
(`MeltedMindz/NOENDSTATE`) is live. Unit tests keep the site honest about
this (no fake links, no fake buttons). Surface-specific runbooks belong
in `community/x/`, `community/discord/`, and `community/telegram/`
alongside each surface's operating docs as those launch; this page is the
shared model they inherit.

## The core asymmetry

The studio's community surface will say, for years: *nothing is for
sale, nothing is deployed, all economics are unset.* Scammers exploit
exactly that vacuum — fake "stealth mints" and fake contract addresses
work best against projects whose real answer is "nothing yet." The
countermeasure is a bright canonical line, stated constantly:

> If it isn't on noendstate.com, in `config/contracts.ts`, or in the
> Chronicle, it is not us. There is no mint. Anyone announcing one is a
> scammer.

## Threats

### Impersonation (accounts and domains)

- Fake X/Discord/Telegram accounts using the name and open-frame mark —
  especially dangerous *now*, while official handles don't exist and
  can't be pointed to.
- Lookalike domains (noendstate.io, no-endstate.com, etc.).
- Mitigations: register official handles deliberately and early even if
  unused (open decision #11); the site's `/community` page is the single
  source of truth for what is official — a surface not listed there is
  fake by definition; report/take-down playbook in
  `docs/security/incident-response.md` (fake accounts).

### Fake mints and fake contract addresses (highest harm)

- The scam: an urgent "mint is live" post with an attacker's contract.
  Victims lose real money; the studio's name absorbs the blame.
- Structural mitigations already in place: no mint exists; every address
  in `config/contracts.ts` is null; the double-gate means no sudden
  legitimate mint *can* appear — so **any mint announcement is
  automatically fake**, and the community can be taught that invariant
  today. When deployment ever happens it will be Chronicle-first with
  transaction hashes, never announcement-first.
- Response: incident runbook "fake contract address" — loud correction on
  every live surface, pinned, plus a Chronicle `incident` event if
  victims exist.

### Compromised official social account

- Worst case: the *real* account posts the fake mint. Highest-trust
  attack; the runbook assumes it will be tried.
- Mitigations: hardware-key 2FA everywhere, no credential sharing, no
  SMS-based recovery, minimal third-party app authorizations; the
  canonical-line discipline gives followers a verification habit (check
  the site) that survives account compromise.

### Bots and webhooks (Discord/Telegram, when live)

- A compromised announcement bot or leaked webhook URL posts "official"
  scam messages inside the studio's own house.
- Mitigations to build into `community/discord/` setup: least-privilege
  bot scopes, webhook URLs treated as secrets (rotatable, never in
  repo), separation between chat bots and announcement rights, admin
  action logging. Announcement channels locked so only verified
  processes post.

### Moderation abuse

- Compromised or rogue moderators: pinning scam links, banning
  questioners, "official support" DM scams (the classic: mod DMs victim
  asking them to "verify wallet").
- Mitigations: public rule that the studio **never DMs first and never
  asks for keys/funds**, stated in every channel description;
  least-privilege mod roles; audit logs; two-person rule for pins and
  announcement posts where the platform allows.

## Standing defenses (all surfaces)

1. Canonical-source discipline: every bio links only noendstate.com;
   announcements originate on the site/Chronicle and are *echoed* to
   social, never the reverse.
2. Voice as authentication: the studio's restrained register
   (`docs/brand/voice.md`) is hard to fake convincingly — urgency,
   hype, or countdowns in a "NO END STATE" post are themselves fraud
   signals, and the community should be told so explicitly.
3. No urgency, ever: the studio never posts time-pressure calls to
   action, so any time-pressure post is fake by policy.
4. Security-alerts path: incidents are disclosed per
   `docs/security/incident-response.md` — Chronicle event plus
   corrections on every live surface.

## Review triggers

Launching any surface (X, Discord, Telegram), engaging any bot/webhook,
appointing moderators, or approaching any real deployment — each
requires revisiting this model and writing the surface's own runbook in
`community/<surface>/`.
