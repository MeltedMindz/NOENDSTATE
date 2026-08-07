# Protocol deployment gates

**No deployment is authorized. Nothing has ever been deployed — not to
mainnet, not to a testnet, not "just to try it."** The contracts in
`contracts/src/` are local prototypes; `config/contracts.ts` records
every address as `null` and every status as `"prototype"`, and it accepts
only real, verified deployments — never placeholders.

Deployment (including any *public testnet* deployment under the studio's
name) requires **every** gate below closed, in writing, with artifacts.
Closing the final gate is itself a reviewed PR plus a Chronicle event.

## The gates — all currently ❌

| # | Gate | Status | What "closed" means |
|---|---|---|---|
| 1 | **Independent audit** | ❌ | Engagement with a named firm (open decision #12); all findings resolved or explicitly accepted; final report published and linked from `config/contracts.ts` `auditUrl` + an `audit` Chronicle event |
| 2 | **Legal clearance** | ❌ | All 14 launch gates in `docs/legal/launch-gates.md` closed — entity, counsel, securities analysis, tax, KYC/eligibility, sanctions, privacy. No counsel is engaged today |
| 3 | **Terms published** | ❌ | Binding terms live at `/terms`, counsel-reviewed, covering the artifact, transfer treatment (open decision #8), refunds, restrictions |
| 4 | **Chain selected** | ❌ | `mintChain` decided (open decision #4), recorded in config + ADR + Chronicle |
| 5 | **Treasury custody** | ❌ | Custody model decided (open decision #10); sink addresses exist and are recorded in `config/contracts.ts` `treasuryAddresses` |
| 6 | **Multisig ownership** | ❌ | Every `DEFAULT_ADMIN_ROLE` and operational role held by a multisig with documented signers policy and threshold; deployer EOA fully renounced; role assignment verified onchain post-deploy |
| 7 | **Monitoring** | ❌ | Provider selected (open decision #13); alerts live for role grants, pauses, schedule/sink changes, funding events, anomalous transfers — *before* value flows |
| 8 | **Incident response ready** | ❌ | `docs/security/incident-response.md` contract-incident runbook rehearsed; pause authority, contacts, and disclosure templates in place |
| 9 | **Testnet soak** | ❌ | Full system deployed to the selected chain's testnet with final parameters; complete lifecycle exercised (mint → sync → fund → transfer → claim → withdraw → pause/unpause); soak period completed with zero unexplained behavior; results written up |
| 10 | **Economic model approval** | ❌ | Every null in `config/economics.ts` resolved (supply, price, currency, allocations totaling 10,000 bps, cadence, transfer treatment, eligible-revenue definition) and approved through the legal + governance path; recorded as Chronicle `governance` events |

## Hard sequencing

Some gates order-depend: chain (4) precedes audit scope finalization (1)
and testnet soak (9); custody (5) and multisig (6) precede soak, because
the soak must rehearse the real ownership setup; economics (10) precedes
soak's "final parameters." The audit must cover the code that actually
deploys — any post-audit change reopens gate 1.

## What closing looks like mechanically

1. Each gate's artifact (report, signed decision, runbook, soak log)
   lands in the repo or is linked from it.
2. This table flips ❌→✅ one PR at a time, each reviewed.
3. Deployment itself: scripted, from the audited commit, executed by the
   multisig ceremony; addresses enter `config/contracts.ts` with status
   `"deployed"`, `deployedAt`, chain, and audit link in one PR.
4. A Chronicle event records the deployment with transaction hashes —
   the studio's first legitimately `onchain_verified` entries.

## The plain statement

Until every row above is ✅: no deployment, no mint, no funding, no
testnet-under-our-name, no exceptions for demos or deadlines. Anyone —
including the founder — proposing to skip a gate is proposing an
incident. Contract addresses circulating before `config/contracts.ts`
lists them are fake by definition
(`docs/security/community-threat-model.md`).
