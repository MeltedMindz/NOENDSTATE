# Telegram

How the NO END STATE Telegram system works.

**Status: neither surface exists.** Telegram is `not_yet_public` in
`config/community.ts`. The structure is defined in this repo and executed
manually at launch.

## The model

Two deliberately separate surfaces:

1. **"NO END STATE — Announcements"** — a broadcast channel. Read-only,
   admin posts only, low volume. Everything posted also lives on
   noendstate.com; the site is always the root of trust.
2. **"NO END STATE — Discussion"** — a public supergroup with forum topics:
   General, State Zero, Projects, Build Log, Chronicle, Support, Security.

The separation is a security property: an announcement is only real if it
is in the channel and on the site, and the group can be lively without
anything in it ever being mistaken for official.

## The pieces

| File | Role |
| ---- | ---- |
| `community/telegram/structure.yaml` | Source of truth: both surfaces, all topics, posting rules, admin policy. |
| `community/telegram/channel-description.md` | Channel "About" copy — short version within Telegram's 255-char limit, plus the long version. |
| `community/telegram/group-description.md` | Same for the group. |
| `community/telegram/pinned-message.md` | The pinned message for both surfaces: canonical domain, surface status (X and Discord not yet public), scam warnings, no-DM policy, contract-address policy (none exist). |
| `community/telegram/moderation.md` | Rules, escalation ladder, admin playbook. |
| `community/telegram/security.md` | Invariants, clone defense, incident handling. |
| `community/telegram/project-topic-template.md` | Per-project topic template, mapped to registry fields. |
| `community/telegram/launch-sequence.md` | The step-by-step manual launch checklist. |

Copy flows one direction: repo first, through review, then Telegram is
updated to match.

## Project topics and the sync tool

Per-project topics are generated from the project registry
(`content/projects/index.ts`) using the template. `scripts/community-sync.mjs`
includes Telegram topics in its dry-run plan; with the registry empty, the
plan is empty. There is no Telegram apply automation — topics are created
by hand from the template when a project launches.

## Manual launch steps

The full checklist is `community/telegram/launch-sequence.md`. In brief:
create the channel, create the group, enable topics and create the seven,
link channel to group, set both descriptions (verify the 255-char limit),
configure admin rights and permissions, post and pin the pinned message,
dry-run with a non-admin account, record a Chronicle event, then set
`url` and `status: "live"` for telegram in `config/community.ts` and ship
through review. The surface is announced only after the site links it.

## Security policy

`community/telegram/security.md` is the binding document. The short form:
admins never DM first; announcements are only real in the channel plus the
site; no contract addresses exist or are published, and any circulating
address is a scam; no seed phrases, no urgency, ever; clone surfaces are
expected and members self-verify via noendstate.com.
