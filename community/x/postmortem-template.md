# Postmortem template

Thread template for publishing a postmortem on X. Placeholders in {braces}.
Used when a published postmortem exists — the thread summarizes it and
links it; it is never the only copy. Failures get the same production
quality as launches: that is the policy that makes the record credible.

---

**Post 1**

Postmortem: {what failed, in one plain sentence}.

Full writeup: {postmortem url on noendstate.com}

**Post 2**

What happened: {factual sequence, 1-3 sentences, no softening}.

**Post 3**

Impact: {who and what was affected, honestly quantified only with real
numbers from the postmortem; if impact was none, say none}.

**Post 4**

Cause: {root cause in plain language. If the cause was our mistake, the
sentence starts with "We"}.

**Post 5**

What changes: {concrete changes made or committed to, from the postmortem's
action items — only ones actually decided}.

**Post 6**

This is {NES-NNNN} in the Chronicle. It stays in the record permanently,
next to everything that worked.

noendstate.com/chronicle

---

## Rules

- Post only after the postmortem is live on the site and the Chronicle
  entry exists.
- No euphemisms: "failed," "broke," "we were wrong" are the vocabulary.
  "Learnings" and "sunsetting our journey" are not.
- Never assign blame to an individual in public — "we" owns every cause.
- If the failure involved member harm or security, the incident and
  security templates precede this one; the postmortem thread is the
  considered follow-up, not the first notice.
- Timing: posted when the postmortem is ready, at a normal hour. Never
  buried late on a Friday — burying it would be the second failure.
