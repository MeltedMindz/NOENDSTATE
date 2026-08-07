# Chronicle event template

Single-post template for announcing a Chronicle entry on X. Placeholders in
{braces} fill from the recorded event (created with `scripts/new-event.mjs`,
rendered at noendstate.com/chronicle). The post is written after the entry
is recorded, never before — the record leads, the account follows.

---

**Standard event**

```
{NES-NNNN} is in the record.

{one-sentence plain statement of what happened}

{optional second sentence of context — why it matters, no adjectives doing the work}

noendstate.com/chronicle
```

---

**Correction event**

Corrections append; the original entry stands. The post says so.

```
{NES-NNNN} corrects {NES-MMMM}.

{what was wrong, stated plainly}. {what is actually true}.

The original entry stays in the record — corrections append, nothing is rewritten. noendstate.com/chronicle
```

---

**Milestone event** (thread of 2 if one post can't carry it honestly)

```
Post 1:
{NES-NNNN}: {the milestone, as fact}.

Post 2:
{what it took, per the build log — real steps, real dates}. Recorded, like everything: noendstate.com/chronicle
```

---

## Rules

- One post per event as the default. An event that needs a thread is
  usually a launch (use `project-launch-template.md`) or an incident (use
  `incident-template.md`).
- The event ID always appears — it is the checkable claim.
- Never post an event that is not yet on the site.
- Tone check before posting: would the sentence survive being read in five
  years as part of a permanent record? Strip anything that wouldn't.
