# X

How the NO END STATE X system works.

**Status: no account exists.** X is `not_yet_public` in
`config/community.ts`. **Handle availability has not been checked** — the
preferred handles in the launch package are preferences, not claims. Any
account using the name today is not us, and the site says so.

## The launch package

Everything needed to launch and run the account lives in `community/x/`:

| File | Role |
| ---- | ---- |
| `profile.md` | Display name, handle preference order (availability unchecked), bio direction, link, pinned strategy, account hygiene. |
| `bio-options.md` | Eight bio variants within the 160-char limit. |
| `launch-thread.md` | The first thread: the studio, the record, STATE ZERO stated honestly, the site. |
| `pinned-post.md` | Standing pinned-post options and rotation rules. |
| `content-pillars.md` | The ten content pillars and cadence guidance. |
| `30-day-calendar.md` | Thirty days of prompts tied only to real artifacts; skipping beats inventing. |
| `project-launch-template.md` | Launch thread per project, from registry fields. |
| `chronicle-template.md` | Posting Chronicle events (NES-NNNN). |
| `postmortem-template.md` | Publishing failures with full production quality. |
| `security-announcement-template.md` | Scam warnings, surface changes, compromise notices. |
| `incident-template.md` | Operational incidents: first notice, updates, resolution. |

Copy is reviewed in the repo before it is posted. Posts themselves are not
mirrored back into the repo; the Chronicle and site remain the record.

## Manual account creation steps

A human does all of this. No automation, no scripted signup, no CAPTCHA
bypass — none is acceptable, and none is needed for a single account.

1. Final-review `community/x/profile.md`, the chosen bio, and
   `launch-thread.md`; reverify every factual claim against the site that
   day (especially the STATE ZERO status lines).
2. Create the account at x.com using a studio email address. Complete
   whatever verification X requires, as a human.
3. Try handles in the preference order in `profile.md`; take the first
   available. This is the moment availability becomes known.
4. Enable app-based two-factor authentication before doing anything else.
   Connect no third-party apps.
5. Set display name `NO END STATE`, the chosen bio, link
   `https://noendstate.com`, and the brand avatar/banner.
6. Post the launch thread from `launch-thread.md`; pin post 1.
7. Record the launch and the actual handle as a Chronicle event
   (`scripts/new-event.mjs`).
8. Set the x surface's `url` (the actual claimed handle URL) and
   `status: "live"` in `config/community.ts`; ship through review. The
   site linking the account is what makes it verifiable — until then,
   no account is official.
9. If the claimed handle differs from first preference, update
   `community/x/profile.md` to record what was actually claimed.

## Operating rules

The short form of the package's standing rules: the account never DMs
first; the profile link is only ever noendstate.com; no countdowns, teasers,
or invented metrics; failures are posted with the same quality as launches;
security notices preempt everything and always name the site as the root of
trust. Details live in the package files above.
