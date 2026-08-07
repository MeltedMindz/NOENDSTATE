# Discord

How the NO END STATE Discord system works.

**Status: no server exists.** Discord is `not_yet_public` in
`config/community.ts`. Everything below is built and reviewed in this repo
first; the server, when launched, is an execution of these files.

## The pieces

| File | Role |
| ---- | ---- |
| `community/discord/server-blueprint.yaml` | Source of truth for server structure: categories, channels, types, posting rules. |
| `community/discord/roles.md` | Role set and how each is obtained. |
| `community/discord/permissions.md` | Least-privilege permission matrix. Drift between it and the live server is a bug. |
| `community/discord/onboarding.md` | Join flow, verification, first-day path. |
| `community/discord/moderation.md` | Rules, escalation ladder, moderator playbook. |
| `community/discord/security.md` | Anti-scam policy, invariants, compromised-bot playbook. |
| `community/discord/welcome-copy.md` | Verbatim copy for the START HERE channels. |
| `community/discord/project-template.md` | Per-project category template, mapped to registry fields. |
| `community/discord/pinned-messages.md` | Pinned copy for key channels. |

Copy changes flow one direction: edit the repo file through review, then
update the server to match. The server is never the master copy.

## The sync tool

`scripts/community-sync.mjs` reads the project registry
(`content/projects/index.ts`) and plans the PROJECT categories the blueprint
defines.

- **Dry-run is the default and, today, the only mode.** Running it prints
  the plan and changes nothing. With the registry empty, the plan is
  honestly empty.
- **Apply mode is gated** behind all of: the `--apply` flag, a
  `DISCORD_BOT_TOKEN` env var, and a `DISCORD_SERVER_ID` env var. None are
  configured; the tool refuses without them, and apply mode itself is not
  yet implemented. When it is, it must print a diff and require
  confirmation before touching the server.
- Tokens are credentials: never committed, rotated on suspicion, per
  `community/discord/security.md`.

```
node scripts/community-sync.mjs          # dry-run plan
node scripts/community-sync.mjs --apply  # refuses without credentials
```

## Manual launch steps

When the decision to launch is made:

1. Final-review the nine `community/discord/` files; they must be current.
2. Create the server from the founder's account (2FA on). Enable Community
   features; set verification level, rules screening, and the settings in
   the blueprint's `server:` block.
3. Create roles top-to-bottom per `roles.md`, then categories and channels
   per the blueprint, applying `permissions.md` as channel overwrites.
   Gated STATE ZERO channels are created hidden.
4. Post the START HERE copy from `welcome-copy.md` and the pins from
   `pinned-messages.md`, verbatim.
5. Configure onboarding per `onboarding.md` (screening plus verification).
6. Dry-run with an alt account: verify a Visitor sees only START HERE,
   verification grants the Verified role, and read-only channels reject
   posts.
7. Record the launch as a Chronicle event (`scripts/new-event.mjs`).
8. Set the Discord `url` and `status: "live"` in `config/community.ts` and
   ship through review. Only then is the invite announced, on the site
   first.

## Security policy

`community/discord/security.md` is the binding document. The short form:
the team never DMs first; official links and (future) contract addresses
live in #official-links only — and today no contract exists and none is
published; no seed phrases, no blind signing, ever; wallet verification for
the State Zero role happens only through a reviewed provider, and does not
exist until a mint does.
