# Project category template

Template for creating a Discord category when a project launches. This is a
labeled template: text in {braces} is a placeholder filled from the project's
registry record in `content/projects/index.ts` (schema:
`lib/schemas/project.ts`). `scripts/community-sync.mjs` plans these categories
from the registry; the registry is currently empty, so no project category
exists yet.

## Category

- **Name:** `PROJECT {NNN} — {NAME}`
  - `{NNN}` — digits of the registry `id` (`P-NNN`), e.g. `P-000` → `000`.
  - `{NAME}` — registry `name`, uppercased.
- **Position:** under the PROJECTS heading, ordered by project id.
- **Created when:** the registry entry has `public: true` and status
  `building` or later. Research-stage work stays in THE LAB.

## Channels

Per `community/discord/server-blueprint.yaml` (PROJECTS template):

| Channel        | Type         | Read-only | Posted by            |
| -------------- | ------------ | --------- | -------------------- |
| #overview      | text         | yes       | Founder, Core, Operator |
| #announcements | announcement | yes       | Founder, Core, Operator |
| #discussion    | text         | no        | verified members     |
| #development   | text         | no        | verified members     |
| #feedback      | forum        | no        | verified members     |
| #support       | text         | no        | verified members     |

Optional: a self-assignable notification role named `{NAME}` for members who
want project pings.

## #overview copy (from registry fields)

Post the following as the channel's first message and pin it:

---

**{NAME}** ({id})

{oneLine}

**Thesis:** {thesis}

**Status:** {status} · **Category:** {category} · **Started:** {startedAt}
**Chain:** {chain, or "not published"}

**Links:**
- Site: {websiteUrl, or "none yet"}
- Repository: {repositoryUrl, or "none yet"}
- Social: {socialUrl, or "none yet"}

**Contract addresses:** {contractAddresses as "label — address (chain)" list,
or: "None published. Addresses appear here, in #official-links, and on
noendstate.com simultaneously — any address from another source is a scam."}

**Audits:** {audits as "auditor — date — url" list, or "none yet"}

**Revenue policy:** {revenuePolicy, or "not defined"}

**Chronicle:** {chronicleEventIds as list of NES-NNNN ids with links to
noendstate.com/chronicle}

This channel mirrors the project registry. If it disagrees with
noendstate.com/projects/{slug}, the site is correct and this pin gets fixed.

---

## Field mapping reference

| Registry field                | Where it lands                                  |
| ----------------------------- | ----------------------------------------------- |
| `id`, `name`                  | Category name, #overview title, role name       |
| `slug`                        | Site URL in #overview                           |
| `oneLine`, `thesis`, `status`, `category`, `startedAt`, `chain` | #overview body |
| `websiteUrl`, `repositoryUrl`, `socialUrl` | #overview links; also mirrored to #official-links when live |
| `contractAddresses`           | #overview and #official-links only — nowhere else |
| `audits`                      | #overview                                       |
| `revenuePolicy`, `stateZeroAllocationBps`, `stateZeroAllocationApproved` | #overview only if approved; never stated as a promise |
| `chronicleEventIds`           | #overview Chronicle section                     |
| `launchedAt`                  | Launch announcement in #announcements           |
| `sunsetAt`, `postmortemUrl`   | Sunset flow below                               |

## Lifecycle

- **Launch:** create category and channels, post and pin #overview, announce
  in the project's #announcements and the server-wide #announcements, add
  live links to #official-links.
- **Update:** when the registry record changes, update the #overview pin in
  the same change set (drift between registry and pin is a bug).
- **Sunset/archive:** when status becomes `sunset` or `archived`, post the
  reason and {postmortemUrl} in #announcements, make all channels read-only,
  and move the category under THE LAB's #graveyard reference. Channels are
  never deleted — the record stays.
