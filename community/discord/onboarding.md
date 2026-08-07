# Discord onboarding

How a new member goes from invite link to participating. Designed so that an
unverified account can read who we are but cannot post anywhere, and so that
the first ten minutes teach the two things that keep people safe here: where
official links live, and that the team never DMs first.

## Join flow

1. **Invite.** The member arrives via the canonical invite link, published
   only on noendstate.com and in #official-links. We do not run invite
   campaigns or use third-party invite sites.
2. **Membership screening.** Discord's built-in rules screen shows the server
   rules (copy in `community/discord/welcome-copy.md`). The member must
   accept to proceed. Until then they can see nothing.
3. **Visitor state.** After accepting, the member holds only the implicit
   Visitor state: they can read the START HERE category and nothing else,
   and can post nowhere.
4. **Verification step.** The member completes a simple human check —
   a button interaction in a verification channel run by our own bot or a
   reviewed verification provider (provider review checklist in
   `community/discord/security.md`). This is an anti-bot gate, not identity
   verification. No wallet, no personal data, no payment. On success the bot
   grants the **Verified** role.
5. **Verified.** The full server opens: all public categories, posting in
   open channels, thread creation in forums.

Wallet verification for the State Zero role is a separate, future flow and is
not part of onboarding. It does not exist yet because there is nothing to
hold. Anyone presenting a "verify your wallet to join" step today is a
scammer.

## First-day path

What we point new members through, in order. This is also the copy structure
of #welcome.

1. **#welcome** — what NO END STATE is in three sentences, and this list.
2. **#rules** — short, already accepted at screening, worth an actual read.
3. **#how-no-end-state-works** — the studio model: the Chronicle, the empty
   project registry, BUILD-000, STATE ZERO and its honest current status.
4. **#official-links** — bookmark it. The only place links and (future)
   contract addresses will ever be posted. Today it lists exactly two live
   surfaces: noendstate.com and the GitHub repo.
5. **#general** — say hello if you like. Nobody is required to introduce
   themselves.
6. Pick your rooms: **#studio-floor** to watch the work, **#questions** to
   ask anything, BUILDERS channels if you make things.

## Safety notes surfaced during onboarding

Stated in #welcome and repeated in the verification message:

- The team will never DM you first. Anyone who does is impersonating us.
- Nothing is mintable. There is no contract, no price, no supply, no chain.
  Any "STATE ZERO mint" link is a scam, today and until noendstate.com and
  #official-links say otherwise at the same time.
- We will never ask for your seed phrase, private keys, or a payment to
  access any channel or role.

## Operational notes

- Onboarding copy lives in `community/discord/welcome-copy.md`; edits go
  through the normal repo review flow before the server is touched.
- If the verification bot goes down, Operator may temporarily grant Verified
  manually to accounts that request it in the verification channel; the
  outage and manual grants are logged, and the compromised-bot playbook in
  `community/discord/security.md` applies if the outage is suspicious.
