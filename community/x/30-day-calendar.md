# 30-day calendar

Post prompts for the first 30 days after the X account launches. Days are
relative to launch day, whenever that is. These are prompts, not final copy
— each is tied to something that actually exists in the repo or on
noendstate.com, and each assumes the human posting verifies the referenced
thing on the day of posting. If a day's subject has no real substance that
day, skip the day. Skipping is always correct; inventing is never.

Standing rules: no invented metrics, no fake milestones, no countdowns, no
engagement bait. Templates referenced are in `community/x/`.

| Day | Prompt |
| --- | ------ |
| 1  | Post the launch thread (`launch-thread.md`). Pin post 1. |
| 2  | Single post: the Chronicle exists and starts at NES-0000, the founding entry. Link noendstate.com/chronicle and say what append-only means: corrections append, nothing is rewritten. |
| 3  | Post on the manifesto: pull the strongest paragraph from noendstate.com/manifesto and let it stand nearly alone with a link. No added hype. |
| 4  | BUILD-000 post: what "the studio is the first build" means concretely — site, record, tooling, community systems, all public at github.com/MeltedMindz/NOENDSTATE. |
| 5  | Post on the empty project registry: screenshot noendstate.com/projects showing zero projects, and explain why an honest empty registry beats an invented portfolio. |
| 6  | STATE ZERO status post: restate the facts from noendstate.com/state-zero — no mint, no contract, no supply/price/chain published, one founding collection ever. Frame as protection against scams, because it is. |
| 7  | Builder recruitment post: the repo is public; a merged PR earns Contributor status in the community systems. Link the GitHub repo. Written to developers, plainly. |
| 8  | Technical post: how the Chronicle is implemented — numbered NES events in a public content file, rendered by the site, corrections as new entries. Link the chronicle page and the repo path. |
| 9  | Post on the risk page: noendstate.com/risk exists on day one. Quote its most honest line. Companies rarely publish risk before product; say why we did. |
| 10 | Build-log roundup: summarize the week's actual entries from noendstate.com/build. If the log was quiet, skip. |
| 11 | Design-decision post: pick one real recorded decision (docs/decisions in the repo) and explain the tradeoff in 2-3 posts. |
| 12 | Post on the FAQ: noendstate.com/faq answers what most projects dodge. Pull one blunt question-answer pair, link the rest. |
| 13 | Technical post: the community systems are code-reviewed files in the repo (community/), and the Discord structure is a YAML blueprint with a dry-run sync tool. Building community infrastructure like software — link the directory. |
| 14 | Two-week reflection thread (3-4 posts): what BUILD-000 shipped in two weeks, per the build log and Chronicle — only items actually recorded. What didn't get done is included. |
| 15 | Treasury post: noendstate.com/treasury and its current honest state. No numbers exist to invent; the point is that the page exists before the money does. |
| 16 | Contract-prototype post: the contracts/ directory in the repo — Foundry toolchain, prototype work, tests, nothing deployed. Make "nothing deployed" the headline fact. |
| 17 | Why-it-exists post: no-exit design. A company with no end state can make commitments a company built to flip cannot. Manifesto-adjacent; keep it short. |
| 18 | Chronicle event post: if any new NES entry was recorded since launch, post it via `chronicle-template.md`. If none, skip — do not manufacture an event. |
| 19 | Post on the status page: noendstate.com/status — what the studio publishes about its own operational state, and why self-reporting beats silence. |
| 20 | STATE ZERO history post: why the founding cohort is fixed and why there will never be a second founding collection. Scarcity as fact, not as marketing — no urgency language. |
| 21 | Build-log roundup: the week's real entries. Same rule: quiet week, no post. |
| 22 | Technical post: walk through one real piece of the site's implementation from the public repo (e.g. how the project registry schema in lib/schemas/project.ts forces honesty — nullable launch dates, explicit sunset fields, postmortem URLs as first-class data). |
| 23 | Failure post: the first entry in the failed-experiments record, if one exists in the repo or build log. If nothing has failed yet, post that the failure record exists and is empty, and that it will not stay empty — that is what building in public costs. |
| 24 | Builder recruitment: point at a concrete open task — an open GitHub issue or RFC if one exists. If none exist, skip. |
| 25 | Post on the community model: support happens in public, the team never DMs first, official links live in one place. Link noendstate.com/community. |
| 26 | Design post: one real brand or interface decision (docs/brand, or the site's generative state artwork in lib/state-art.ts) — what it looks like and why. Screenshot from the live site. |
| 27 | Chronicle event post: any new NES entry since day 18, via the template. None, skip. |
| 28 | Mechanism post: pick one mechanism under real consideration in the repo's docs (docs/protocol or docs/state-zero) and write it up as thinking-in-public, labeled as not-yet-decided. |
| 29 | Question post: ask one genuine question the studio is actually weighing (drawn from an open RFC or decision doc). Engage with serious replies. Ask only if the answer will actually inform work. |
| 30 | Month-one thread (4-6 posts): what the record shows after 30 days — Chronicle entries by number, build-log highlights, what slipped, what's next. Every claim checkable against the site. End on the core line: founded once, building indefinitely. |

## After day 30

Fall back to `content-pillars.md` cadence. The calendar's job is to build
the habit of posting only what is real; the pillars carry it from there.
