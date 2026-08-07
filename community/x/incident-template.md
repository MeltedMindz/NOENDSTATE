# Incident template

Templates for operational incident posts on X — outages, degraded services,
bad deploys, data problems. Security-driven incidents use
`security-announcement-template.md`; this one covers things breaking.
Placeholders in {braces}. The site's status page leads; posts mirror it.

---

## First notice

Posted as soon as the incident is confirmed, even with incomplete
information. Saying "we don't know yet" early beats saying everything late.

```
Incident: {what is affected, e.g. "noendstate.com is returning errors" / "{project name} transactions are failing"} since {time, UTC}.

{what we know in one sentence, or "Cause not yet known."}

Updates here and at noendstate.com/status. No action is required from you{ — unless there is, stated plainly}.
```

---

## Update (repeat as needed)

```
Incident update ({time, UTC}): {current state — what changed since last post}.

{next expected update time, or "Next update when we know more."}
```

Rules for updates: post at the promised time even if the update is "no
change." A missed update is a second incident.

---

## Resolution

```
Resolved ({time, UTC}): {what was broken} is back to normal. Duration: {actual duration}.

Cause, briefly: {one honest sentence}.

Full postmortem to follow{ if warranted}: it will be {NES-NNNN} in the record.
```

---

## Post-incident

Within a reasonable interval (days, not weeks), one of:

- A postmortem thread via `postmortem-template.md`, if the incident
  warranted one.
- A closing reply on the resolution post linking the Chronicle entry, if it
  did not.

Either way the incident gets a Chronicle entry — incidents are part of the
record by definition.

---

## Rules

- Times in UTC, always stated.
- No minimizing vocabulary: "degraded" only if actually partial; if it is
  down, the word is "down."
- Threads stay unlocked; member reports in replies are triaged, and useful
  ones are acknowledged.
- If member funds or data could be affected, escalate to the security
  template immediately — that dimension outranks the operational one.
