# Telegram moderation

Operational moderation policy for "NO END STATE — Discussion". Same
principles as Discord (`community/discord/moderation.md`); this file is the
Telegram-specific version. Moderation protects members and conversation, not
the studio's image — criticism stays up.

## Rules (enforced)

1. **No scams.** Fake links, fake mints, impersonation, drainer links,
   "support" DM solicitation. Instant ban, no ladder.
2. **No harassment or hate.** People are off-limits; ideas are fair game.
3. **No financial advice or price content.** STATE ZERO is not an
   investment; "when mint"/price spam is removed.
4. **No unsolicited promotion.** No shilling tokens, groups, or products.
5. **No spam.** Forwarded chain-mail, repeated messages, mass-tagging.
6. **Right topic.** Moderators redirect before removing.

## Escalation ladder

1. **Redirect** — point to the right topic or the pinned message.
2. **Warning** — explicit, in-topic, logged in the admin channel.
3. **Restrict** — Telegram mute (read-only) for 1 hour to 7 days.
4. **Ban** — for scams (immediately), ban evasion, or a pattern restriction
   did not fix. Bans are logged with reason and evidence.

Scams skip straight to ban plus cleanup. When a scam wave hits, enable slow
mode (30-60 seconds) until it passes.

## Admin playbook

- **Delete fast, log always.** Screenshot or copy the offending message into
  the private admin log before deleting when practical; one-line reason.
- **Impersonator in the group:** ban, delete their messages, post a short
  note in the Security topic naming the pattern (not a member-shaming post),
  and report the account to Telegram.
- **Scam links:** delete, ban, and if members likely clicked, escalate to a
  notice in the announcements channel per
  `community/telegram/security.md`.
- **Never moderate by DM.** All moderation happens in the group or in the
  logged admin channel. Admins never DM members first — the anti-scam
  invariant depends on this being absolute.
- **Heated argument:** slow it down, don't erase it. Delete rule breaks only.
- **Appeals:** via the Support topic or the contact email on noendstate.com,
  reviewed by an admin who did not take the original action.

## Admin hygiene

- Admins: Founder and Operator accounts only at launch. 2FA mandatory.
- Admin rights are scoped — delete/restrict/pin, not "add admins." Only
  Founder manages the admin list.
- No moderation bots at launch. Any future bot passes the review checklist
  in `community/discord/security.md` and gets delete/restrict rights only.
- If an admin account is compromised: another admin strips its rights
  immediately, then follows the incident steps in
  `community/telegram/security.md`.
