# Open decisions

Every deliberately-unmade decision, in one place. The rule that makes this
page possible: **an undecided value is null in code and "not yet decided"
in public — never a placeholder, never an example number.** (See
`config/economics.ts`, `config/contracts.ts`, `config/community.ts`.)

Two blocking classes:

- **Blocks launch** — State Zero cannot mint without it.
- **Blocks economics only** — the studio can operate, build, and publish
  without it; only money-touching features wait.

| # | Decision | Why it matters | Current safe default | What enables deciding it | Files affected | Blocks |
|---|---|---|---|---|---|---|
| 1 | Founding supply (`MAX_SUPPLY`) | Immutable at deploy; no expansion path exists in `StateZero.sol` — this is a one-shot decision | `foundingSupply: null`; no supply shown anywhere | Economic model approval + legal review of offering size | `config/economics.ts`, StateZero constructor arg at deploy | launch |
| 2 | Mint price | Consumer-protection and securities exposure; prototype mint has no payment logic by design | `mintPrice: null` | Legal approval of sale mechanics; economic model | `config/economics.ts`, future mint contract/frontend | launch |
| 3 | Mint currency | Interacts with price display, accounting, tax | `mintCurrency: null` | Same as price | `config/economics.ts` | launch |
| 4 | Deployment chain | Determines audit scope, gas costs, custody tooling, explorer links | `mintChain: null`; `chain: null` on all six contracts | Technical evaluation + counsel view on venue | `config/economics.ts`, `config/contracts.ts`, deploy scripts | launch |
| 5 | Allocation schedule (four bps values) | `TreasuryRouter.setSchedule` requires exactly 10000 total; publishing bps is a public commitment | all four `*AllocationBps: null` | Economic model approval + legal | `config/economics.ts`, router `setSchedule` at init, `docs/treasury/allocation-framework.md` | launch |
| 6 | Eligible revenue definition | "What revenue is shared" is the single most disputable sentence in the model | `eligibleRevenueDefinition: null` | Counsel-reviewed written definition | `config/economics.ts`, terms | launch |
| 7 | Distribution cadence | Sets holder expectations; irregular cadence must be stated, not implied | `distributionCadence: null` | Economic + ops decision | `config/economics.ts` | economics only |
| 8 | Transfer treatment (final rule) | Prototype implements checkpoint semantics (`RevenueDistributor.handleTransfer`); the *published, binding* rule needs legal sign-off | `transferTreatment: null`; docs label the mechanism architecture-not-terms | Terms drafting + legal approval | `config/economics.ts`, `docs/state-zero/transfer-model.md`, terms | launch |
| 9 | Legal entity + jurisdiction | Contracts, tax, liability, terms all hang off it | `studio.legalEntity: null` | Entity formation (legal gate 1) | `config/studio.ts`, terms, privacy | launch |
| 10 | Treasury custody (multisig setup, signers, threshold) | Router sinks and admin roles need owners that aren't an EOA | `treasuryAddresses: []` | Custody decision + multisig ceremony, documented | `config/contracts.ts`, deploy scripts, `docs/protocol/deployment-gates.md` | launch |
| 11 | Social handles (X, Discord, Telegram) | Impersonation risk starts the day these exist; names must be secured deliberately | all `url: null`, `status: "not_yet_public"` | Handle availability check + community launch plan | `config/community.ts`, `community/` docs | neither (operational) |
| 12 | Audit firm | Contract deployment gate; firm choice affects timeline and scope | none engaged; `auditUrl: null` everywhere | Shortlist, quotes, chain decision (#4) first | `config/contracts.ts`, `docs/protocol/deployment-gates.md` | launch |
| 13 | Monitoring provider (onchain + uptime) | Incident response needs detection before there is anything to detect late | none | Deployment plan; also needed for treasury pages' future adapters | `docs/security/incident-response.md`, `docs/architecture/data-sources.md` | launch (for contracts); site can operate without |
| 14 | Email / form provider | Security contact + any future contact surface; today GitHub advisories carry security reports | none — site has no forms by design | Ops decision; privacy review of provider | `SECURITY.md`, `/privacy`, future contact UI | neither |
| 15 | Refund / vesting policies | Consumer-protection surface of the sale | both `null` | Legal drafting | `config/economics.ts`, terms | launch |
| 16 | Jurisdictional restrictions & KYC/eligibility approach | Sanctions and securities exposure | `jurisdictionalRestrictions: null` | Counsel analysis (legal gates 6–7) | `config/economics.ts`, mint flow | launch |

## How a decision closes

1. The decision is made and written down (an ADR in `docs/decisions/` for
   structural ones; updated policy docs for the rest).
2. Code changes land in the affected `config/*` files via reviewed PR —
   nulls become values in one place, and UI that rendered "not yet
   decided" starts rendering the value.
3. A Chronicle event records it (type `governance` or `milestone`) —
   decisions of this weight are part of the permanent record.
4. This table's row is updated in the same change set.

Nothing on this list may be "soft-decided" in a tweet, a Discord message,
or a doc alone. If it isn't in config + Chronicle, it isn't decided.
