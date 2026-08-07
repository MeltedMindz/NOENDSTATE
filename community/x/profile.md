# X profile

Profile package for the official NO END STATE account on X.

**Status: no account exists.** X is `not_yet_public` in
`config/community.ts`. Handle availability has **not** been checked — the
variants below are preferences to try at creation time, not claims. A human
creates the account manually (see docs/community/x.md); nothing is automated.

## Display name

```
NO END STATE
```

All caps, matching the brand. No emoji, no decorations, no "| something"
suffix.

## Handle preferences (availability NOT checked)

Try in this order at account creation; take the first available. Record the
actual handle claimed in `config/community.ts` and the Chronicle.

1. `@NoEndState` — cleanest; first choice.
2. `@NoEndStateHQ` — acceptable studio-account convention.
3. `@NoEndStateStudio` — longer but unambiguous.
4. `@NoEndState_` — trailing underscore; workable, slightly weaker against
   impersonation (attackers use underscore variants), so prefer the above.
5. `@StateZero` — strong name but brands the cohort rather than the studio;
   use only if the studio-name variants are all taken, and even then
   consider a different fallback first.

Whatever is claimed: never change it later. A changed handle would be
treated as an incident, because members verify us by handle.

## Bio

Recommended direction (fits 160 chars; full option set in
`community/x/bio-options.md`):

```
Founded once. Building indefinitely. / An onchain studio. / STATE ZERO records everything that follows.
```

## Profile fields

- **Link:** `https://noendstate.com` — the only link, ever. The site is the
  root of trust; the bio link never points anywhere else.
- **Location:** leave empty, or `noendstate.com`. No fake geography.
- **Birth date:** not set.
- **Avatar / banner:** from the brand assets (docs/brand). No laser eyes, no
  event overlays.

## Pinned strategy

- **At launch:** pin the launch thread's first post
  (`community/x/launch-thread.md`).
- **Steady state:** pin the standing post from `community/x/pinned-post.md`
  — who we are, the site, and the safety facts (no contract, no mint, no
  DMs). The pin is the impersonation defense: anyone checking the real
  account gets the truth in one screen.
- **During incidents:** the security announcement
  (`community/x/security-announcement-template.md`) temporarily replaces the
  pin, then the standing pin returns.
- Never pin engagement-bait, countdowns, or anything with a deadline.

## Account hygiene

- Two-factor authentication (app-based, not SMS) from day one.
- Email on the account is a studio address, not a personal one.
- No third-party apps connected; no scheduling tools with post permissions
  until reviewed.
- The account follows sparingly and never DMs first — the no-DM invariant
  applies on X exactly as on Discord and Telegram.
