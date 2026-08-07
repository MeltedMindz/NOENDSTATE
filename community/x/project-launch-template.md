# Project launch template

Thread template for announcing a project launch on X. Placeholders in
{braces} fill from the project's registry record (`content/projects/index.ts`).
Used only when a project actually launches — the registry is currently
empty, so this template has never been used.

Rules: no countdown before, no teaser campaign, no "something is coming."
The launch thread is the first public mention, posted when the thing is
live and the registry entry, site page, and Chronicle event already exist.

---

**Post 1**

{NAME} is live.

{oneLine}

{websiteUrl}

**Post 2**

What it is: {two-sentence plain description drawn from the registry
description field}.

**Post 3**

Why we built it: {thesis, compressed to 1-2 sentences}.

**Post 4**

How it works: {the core mechanism in 2-3 sentences, technically honest,
linking docs or code for the rest}.

**Post 5** — include only if contracts are involved

Contracts: deployed on {chain}. Addresses are published in exactly two
places — noendstate.com/projects/{slug} and our official channels, simultaneously.
Verify there. Any address from any other source is a scam.

{audit line: "Audited by {auditor} ({audit url})." or, honestly:
"Not yet audited. Treat it accordingly." — never omit the audit status}

**Post 6**

What it costs and what it pays: {fees/revenue policy in plain terms from
revenuePolicy, or "Free to use. No token, no fee." — whatever is true}.

**Post 7**

This is project {id} in the registry — the record of it starts now:
noendstate.com/projects/{slug} and Chronicle entry {chronicle event id}.

Like everything we ship, it stays in the record whether it succeeds or not.

**Post 8**

{NAME}: {websiteUrl}
Code: {repositoryUrl, or omit this line if the repo is not public}
Questions: answered in public, never by DM.

---

## Checklist before posting

- [ ] Registry entry live and `public: true`; site page renders.
- [ ] Chronicle event recorded; ID in hand.
- [ ] Contract addresses (if any) on the site's project page first.
- [ ] Audit status stated truthfully in post 5.
- [ ] Discord category / Telegram topic created per their templates, if
      those surfaces are live.
- [ ] No claim in the thread that is not checkable on the site.
