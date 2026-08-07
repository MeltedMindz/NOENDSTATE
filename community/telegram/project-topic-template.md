# Project topic template

Template for adding a Telegram discussion topic when a project launches.
Text in {braces} is a placeholder filled from the project's registry record
in `content/projects/index.ts`. `scripts/community-sync.mjs` plans these
topics from the registry; the registry is currently empty, so no project
topic exists yet.

## Topic setup

- **Topic name:** `{NAME}` (registry `name`; keep it short — Telegram topic
  names truncate in narrow clients).
- **Created when:** the registry entry is `public: true` and status is
  `building` or later — same threshold as the Discord category.
- **Posting:** everyone; project announcements still go through the
  announcements channel, not the topic.
- On creation, announce the topic in the announcements channel and move
  existing discussion from the general Projects topic.

## First message (posted by admin, then linked from the Projects topic)

---

**{NAME}** ({id})

{oneLine}

**Status:** {status} · **Chain:** {chain, or "not published"}

**Links** (also on noendstate.com/projects/{slug} — verify there):
- Site: {websiteUrl, or "none yet"}
- Repository: {repositoryUrl, or "none yet"}

**Contract addresses:** {contractAddresses as "label — address (chain)"
list, or: "None published. Addresses appear on noendstate.com and in
official channels simultaneously. Any address from another source is a
scam."}

This topic is for {NAME} discussion and support — in public, never by DM.
Official announcements land in "NO END STATE — Announcements". If anything
here disagrees with noendstate.com, the site is correct.

---

## Lifecycle

- **Update:** when the registry record changes materially (status, links,
  addresses, audits), post the change in the topic and update this first
  message; the site changes in the same change set.
- **Sunset/archive:** post the closing note with {postmortemUrl} if one
  exists, announce in the announcements channel, and close the topic
  (Telegram "close topic" keeps it readable). Topics are never deleted —
  the record stays.
