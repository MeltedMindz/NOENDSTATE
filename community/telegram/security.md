# Telegram security

Anti-scam and incident policy for the Telegram surfaces. Telegram's attack
surface is DM impersonation and clone groups; everything here is built to
make the real thing checkable in seconds.

## Invariants (never change, no exceptions)

1. **Admins and team never send the first DM.** Not for support,
   verification, giveaways, or incidents. A first-contact DM is, by itself,
   proof of impersonation.
2. **The announcements channel plus noendstate.com is the only truth.** An
   announcement that is not in both places is not real. The discussion group
   never carries official announcements on its own.
3. **No contract addresses exist or are published.** Minting is not active;
   there is no contract, supply, price, or chain. When an address is ever
   published, it appears on noendstate.com and in official channels
   simultaneously. Until then every address is a scam.
4. **We never ask for seed phrases or private keys**, never request payment
   for access, and never instruct anyone to sign something they cannot read.
5. **Nothing is urgent.** No countdowns, stealth drops, or pressure. Urgency
   is the scammer's signature, so we never use it.

## Clone and impersonation defense

- Expect clone channels and groups using our name and future artwork. The
  pinned message tells members how to self-verify: check the link on
  noendstate.com/community — the site links the real Telegram surfaces, and
  nothing else is real.
- Report impersonating channels/groups/accounts to Telegram, note them in
  the admin log, and warn in the Security topic when a clone is actively
  recruiting.
- Usernames for both surfaces are claimed at launch and never changed;
  a changed @username would be treated as an incident.

## Incident handling

For scam waves, compromised admin accounts, or a hijacked surface:

1. **Contain.** Strip rights from a compromised admin account immediately;
   enable slow mode; restrict the group to admins-only posting if a wave is
   active.
2. **Announce.** Post a security notice in the announcements channel and pin
   it: what happened, what to ignore, what to do. Mirror to noendstate.com.
   Never announce an incident only in the group.
3. **Clean.** Delete malicious messages; ban the accounts; verify the pinned
   message and both descriptions are intact.
4. **Record.** Chronicle entry (NES event) once facts are stable; postmortem
   if members could have been harmed.

If the announcements channel itself is compromised, noendstate.com is the
fallback root of trust — the site carries the notice, and recovery of the
channel is worked with Telegram support. This dependency order (site above
socials) is deliberate and permanent.

## Member guidance (repeated in pins and periodically in Security topic)

- Verify every link against noendstate.com before clicking.
- The team will never DM you. Screenshot and report DM "support" in the
  Security topic.
- Never share a seed phrase with anyone, including us — we will never want
  it.
- If you signed something suspicious: assume compromise, move assets from a
  clean device immediately, then report. We cannot recover funds, but your
  report protects the next person.
- Vulnerabilities in things we ship: private security contact on
  noendstate.com, not the group.
