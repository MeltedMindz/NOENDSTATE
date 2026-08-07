# State Zero — economic gates

Every gate standing between State Zero and anyone's money, mapped to the
code that enforces it. The summary: **mint and claims are structurally
off**, every economic value is null, and no environment variable, deploy
setting, or enthusiastic moment can change that without reviewed code
changes and closed legal gates.

## The double-gate (config/economics.ts)

```ts
stateZeroMintEnabled:
  process.env.NEXT_PUBLIC_STATE_ZERO_MINT_ENABLED === "true" &&
  economics.legalApprovalStatus === "approved",
revenueClaimsEnabled:
  process.env.NEXT_PUBLIC_REVENUE_CLAIMS_ENABLED === "true" &&
  economics.legalApprovalStatus === "approved",
```

Both flags require **both** halves:

1. **Env var** — unset by default in every environment
   (`docs/architecture/deployment.md`).
2. **Committed code** — `economics.legalApprovalStatus` must equal
   `"approved"`. It is `"not_started"`, hard-coded and Zod-validated in
   `config/economics.ts`.

Because half 2 is code, flipping it requires a PR that passes review — and
that PR is only legitimate once the legal gates below are closed. Env vars
alone can only ever turn features *off*, never on. Unit tests in
`tests/unit/` assert the gates stay closed.

## The null wall (values that must exist before anything can be priced)

All null in `config/economics.ts`, all open decisions
(`docs/decisions/open-decisions.md`):

`foundingSupply` · `mintPrice` · `mintCurrency` · `mintChain` ·
`eligibleRevenueDefinition` · `stateZeroAllocationBps` ·
`treasuryAllocationBps` · `operatingAllocationBps` ·
`reserveAllocationBps` · `distributionCadence` · `transferTreatment` ·
`refundPolicy` · `vestingPolicy` · `jurisdictionalRestrictions`

Plus `launchStatus: "not_launched"`. The UI renders honest locked/unset
states around every null; displaying an invented supply, price,
allocation, or date is prohibited by policy
(`docs/studio/transparency-policy.md`) and would fail review.

## The contract gates

Even fully-flagged frontends could sell nothing, because the protocol
layer has its own gates:

- **Nothing is deployed.** `config/contracts.ts`: all six contracts
  `address: null`, `status: "prototype"`. Deployment is checklist-gated:
  `docs/protocol/deployment-gates.md` — every box currently unchecked.
- **The prototype mint has no payment logic by design.** `StateZero.mint`
  is `MINTER_ROLE`-only and takes no payment; sale mechanics are absent,
  not defaulted. A mint mechanism would be new, reviewed, audited code.
- **The NFT contract cannot hold funds** and the distributor pays only
  out of what a `FUNDER_ROLE` explicitly funded.

## The legal gates

`legalApprovalStatus` moving `not_started → in_review → approved` is
shorthand for the full slate in `docs/legal/launch-gates.md` — entity
formation, counsel review, securities analysis, consumer protection, tax,
KYC/eligibility, sanctions, privacy, terms, audit, economic model
approval, custody, accounting, communications review. All 14 are OPEN and
no counsel is engaged. The status field may not be advanced ahead of the
gates it summarizes.

## Order of operations, if launch ever happens

1. Legal gates close (each with its artifact — see launch-gates doc).
2. Economic values are decided and land as non-null config via reviewed
   PR + Chronicle `governance` events.
3. Contracts pass deployment gates (audit, testnet soak, custody,
   monitoring — `docs/protocol/deployment-gates.md`) and real addresses
   enter `config/contracts.ts`.
4. `legalApprovalStatus` flips to `"approved"` in code, with the
   supporting record.
5. Only then do the env vars do anything.

Any shortcut through this order is, definitionally, an incident.

## Related flags

- `walletConnectEnabled` — env-gated only (no legal half), default off; a
  read/identity convenience with no authority over funds.
- `stateZeroFixturesEnabled` — dev-only explorer fixtures; off in
  production so fixture token pages 404 (`robots.txt` disallows them).
  Fixtures are always labeled and never render as real inventory.
