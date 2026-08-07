# Telegram launch sequence

Manual checklist for launching the Telegram surfaces. A human runs this
start to finish; there is no automation. Prerequisites: a Telegram account
controlled by the founder with two-factor authentication enabled, and this
repo's telegram/ files reviewed and final.

Nothing below exists yet — Telegram is `not_yet_public` in
`config/community.ts` until step 10 flips it.

## Sequence

1. **Create the announcements channel.**
   - Telegram → New Channel.
   - Name: `NO END STATE — Announcements`.
   - Type: public. Claim a username as close to `noendstate` as is
     available (availability cannot be known until this moment; record what
     was actually claimed in step 9).
   - Enable post signatures (channel settings → Sign messages).

2. **Create the discussion group.**
   - Telegram → New Group.
   - Name: `NO END STATE — Discussion`.
   - Convert to public; claim a username consistent with the channel's
     (e.g. channel name + `chat` suffix if needed).

3. **Enable topics in the group.**
   - Group settings → Topics → enable.
   - Create topics in this order: `General` (default), `State Zero`,
     `Projects`, `Build Log`, `Chronicle`, `Support`, `Security` —
     purposes per `community/telegram/structure.yaml`.

4. **Link channel and group.**
   - Channel settings → Discussion → select the group. Posts in the channel
     now open comments in the group.

5. **Set both descriptions.**
   - Channel "About": the short version from
     `community/telegram/channel-description.md` (must be ≤255 chars —
     verify it wasn't edited past the limit).
   - Group "About": the short version from
     `community/telegram/group-description.md`.

6. **Set permissions.**
   - Group permissions: members can send messages and media; pinning,
     changing info, and adding admins restricted to admins.
   - Admin list: founder account only at launch (Operator accounts added
     when they exist), rights scoped per `structure.yaml` admin_policy.
   - No bots.

7. **Post and pin the pinned message.**
   - Post the copy from `community/telegram/pinned-message.md` verbatim in
     the channel, pin it.
   - Post the same copy as the first message in the group's General topic,
     pin it group-wide.

8. **Dry-run the surfaces.**
   - Post a first channel announcement: launch note linking
     https://noendstate.com and the Chronicle. Confirm it appears in the
     group's comment thread.
   - Confirm each topic exists, the pin renders correctly on mobile, and an
     alt (non-admin) account cannot post in the channel.

9. **Record reality back into the repo.**
   - Write the actual claimed usernames/URLs into a short note in
     `community/telegram/` docs if they differ from assumptions, and record
     the launch as a Chronicle event (NES-NNNN) via `scripts/new-event.mjs`.

10. **Link from the site.**
    - In `config/community.ts`, set the telegram surface's `url` to the
      claimed t.me link and `status` to `"live"`.
    - Ship through the normal review flow. The site's community page and the
      cross-links in Discord's #official-links (when Discord exists) update
      from this config.

11. **Announce.**
    - Once the site is live with the link: announce the Telegram launch on
      every surface that is live at that time (site; GitHub release notes if
      appropriate; Discord and X only if they exist by then).

## Order with other surfaces

Telegram can launch before or after Discord and X; the only hard rule is
step 10 — a surface is announced only after noendstate.com links it, so the
site remains the root of trust that members verify against.
