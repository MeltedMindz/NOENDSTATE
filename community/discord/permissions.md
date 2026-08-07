# Discord permission matrix

Least-privilege permission design for the NO END STATE server. This matrix is
the source of truth; the server is configured to match it, and drift is a bug.

Hard rules, enforced no matter what the table says:

1. **No public role** (Visitor, Verified, Contributor, Builder, State Zero,
   project roles) may mention @everyone or @here, manage webhooks, manage
   roles, manage the server, or create integrations/applications.
2. @everyone (Visitor) has posting disabled server-wide. All participation
   hangs off Verified.
3. @everyone/@here mentions are disabled in every channel except
   #security-alerts, where only Security and Founder may use them.
4. Administrator is held by exactly one account: Founder. No bot gets it.
5. Moderation staff (Moderator, Security, Operator) require 2FA.

## Matrix

`Y` = granted, `–` = denied. Channel-level overwrites (read-only channels,
gated STATE ZERO channels) further restrict what a role can do in a specific
channel; nothing at channel level ever expands beyond this table.

| Capability                          | Visitor | Verified | Contributor | Builder | State Zero | Project | Moderator | Security | Operator | Core | Founder | Bot |
| ----------------------------------- | ------- | -------- | ----------- | ------- | ---------- | ------- | --------- | -------- | -------- | ---- | ------- | --- |
| View START HERE channels            | Y       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | Y   |
| View all public channels            | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | Y   |
| View gated STATE ZERO channels      | –       | –        | –           | –       | Y          | –       | Y         | Y        | Y        | Y    | Y       | –   |
| Send messages (open channels)       | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | Y*  |
| Create forum posts / public threads | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | –   |
| Send messages in threads            | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | Y*  |
| Add reactions                       | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | –   |
| Embed links / attach files          | –       | Y        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | Y*  |
| Use external emoji / stickers       | –       | –        | Y           | Y       | Y          | Y       | Y         | Y        | Y        | Y    | Y       | –   |
| Post in THE LAB working channels    | –       | –        | RFC only    | Y       | –          | –       | –         | –        | Y        | Y    | Y       | –   |
| Post in #contributors               | –       | –        | Y           | Y       | –          | –       | Y         | Y        | Y        | Y    | Y       | –   |
| Post in read-only/official channels | –       | –        | –           | –       | –          | –       | rules only| alerts   | Y        | Y    | Y       | Y*  |
| Mention @everyone / @here           | –       | –        | –           | –       | –          | –       | –         | Y**      | –        | –    | Y**     | –   |
| Mention roles                       | –       | –        | –           | –       | –          | –       | Y         | Y        | Y        | Y    | Y       | –   |
| Manage messages (delete/pin)        | –       | –        | –           | –       | –          | –       | Y         | Y        | Y        | –    | Y       | –   |
| Manage threads                      | –       | –        | –           | –       | –          | –       | Y         | Y        | Y        | –    | Y       | –   |
| Timeout members                     | –       | –        | –           | –       | –          | –       | Y         | Y        | Y        | –    | Y       | –   |
| Kick members                        | –       | –        | –           | –       | –          | –       | Y         | Y        | Y        | –    | Y       | –   |
| Ban members                         | –       | –        | –           | –       | –          | –       | –         | Y        | Y        | –    | Y       | –   |
| Create invites                      | –       | –        | –           | –       | –          | –       | –         | –        | Y        | –    | Y       | –   |
| Manage channels                     | –       | –        | –           | –       | –          | –       | –         | –        | Y        | –    | Y       | –   |
| Manage webhooks                     | –       | –        | –           | –       | –          | –       | –         | –        | Y        | –    | Y       | –   |
| Manage roles (below own)            | –       | –        | –           | –       | –          | –       | –         | –        | Y        | –    | Y       | –   |
| Manage server / integrations        | –       | –        | –           | –       | –          | –       | –         | –        | –        | –    | Y       | –   |
| Administrator                       | –       | –        | –           | –       | –          | –       | –         | –        | –        | –    | Y       | –   |

`Y*` — Bot posting is scoped per bot to the specific channels it mirrors
(#build-log, #shipping, THE CHRONICLE channels, verification flows). A bot has
no send permission anywhere else.

`Y**` — Only inside #security-alerts, via channel overwrite. Denied
server-wide for everyone else and everywhere else.

## Notes

- **Moderator** deliberately lacks ban. Bans are an escalation to Security,
  Operator, or Founder — see `community/discord/moderation.md`. Moderator's
  "rules only" posting covers #rules updates.
- **Core** deliberately lacks moderation and plumbing permissions. Building
  and moderating are different jobs; a Core member who also moderates holds
  both roles.
- **Operator** is the ceiling for non-Founder plumbing (channels, webhooks,
  roles, invites) but cannot touch server settings or integrations.
- **State Zero and project roles** grant visibility and posting in their own
  areas only. Holding an NFT will never grant moderation or management power.
- Gated STATE ZERO channels are hidden from everyone except the roles listed,
  and remain hidden until wallet verification exists (no mint is active).
- Review cadence: Operator re-audits the live server against this matrix
  monthly and after any incident, and records the check in the build log.
