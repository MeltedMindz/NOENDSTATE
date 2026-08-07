# Legal launch gates

The 14 gates that must close before State Zero can mint or any economic
feature can enable. **Status of every gate: OPEN. No legal counsel has
been engaged.**

> **This document is not legal advice.** It is the studio's own checklist
> of the questions it believes must be answered by qualified counsel in
> the relevant jurisdictions before launch. Its existence is a commitment
> to ask, not an answer.

These gates are what `economics.legalApprovalStatus` summarizes; that
field stays `"not_started"` in `config/economics.ts` until this page says
otherwise, and the mint/claims double-gate hangs off it
(`docs/state-zero/economic-gates.md`).

| # | Gate | What it is | Why it blocks | Closing requires |
|---|---|---|---|---|
| 1 | **Entity formation** | No legal entity exists (`studio.legalEntity: null`) | Contracts, liability, banking, tax, and terms all need a party to exist | Choosing structure + jurisdiction (open decisions #9), forming it, recording it in config + Chronicle |
| 2 | **Counsel review** | No lawyer has reviewed any of this | Every other gate's conclusions are provisional until qualified counsel signs them | Engaging counsel competent in the relevant jurisdictions; written scope covering gates 3–14 |
| 3 | **Securities analysis** | Whether State Zero, its distributions, or its marketing constitute a securities offering anywhere it would be sold | Getting this wrong is existential; the revenue-sharing architecture makes the question unavoidable | Counsel's written analysis of the final economic design (which is why economics stay null until then); any required structuring changes made |
| 4 | **Consumer protection** | Sale mechanics, refunds (`refundPolicy: null`), disclosures, fairness of mint process | Consumer law applies even where securities law doesn't | Counsel-reviewed sale mechanics, refund policy, and disclosure set |
| 5 | **Tax** | Entity tax treatment of mint proceeds, treasury holdings, and distributions | Obligations accrue at transaction time whether understood or not | Written tax position from a qualified advisor; accounting design (gate 13) aligned to it |
| 6 | **KYC / eligibility** | Whether purchaser verification or eligibility restrictions are required | Determines mint flow architecture — bolting on later is a redesign | Counsel determination; implementation plan if required |
| 7 | **Sanctions** | Compliance approach for restricted persons/jurisdictions (`jurisdictionalRestrictions: null`) | Strict-liability territory | Counsel-approved screening/restriction approach |
| 8 | **Privacy** | Data handling for the site and any future forms/wallet flows | Obligations exist as soon as personal data is processed; `/privacy` must be true | Counsel-reviewed privacy policy matching actual data flows (today: no forms, no analytics — the honest baseline) |
| 9 | **Terms published** | Binding terms of sale/use at `/terms` | Everything the docs call "architecture, not terms" (e.g., `docs/state-zero/transfer-model.md`) needs its binding counterpart | Counsel-drafted terms covering transfer treatment, distributions, restrictions, disputes |
| 10 | **Contract audit** | Independent audit of the deployed code | Unaudited prototypes must not hold value — also deployment gate #1 | See `docs/protocol/deployment-gates.md` |
| 11 | **Economic model approval** | Formal sign-off on every value in `config/economics.ts` | The nulls (supply, price, allocations, cadence, eligible revenue) are the offering; they must be approved, not improvised | Gates 3–5 informing final values; decision recorded per `docs/decisions/open-decisions.md` process |
| 12 | **Treasury custody** | Legal + operational custody of funds (also deployment gates #5–6) | Someone must be accountable for other people's money before taking any | Custody decision, multisig ceremony, documented signer policy |
| 13 | **Accounting** | Books, reporting, and treasury accounting from day one | The transparency commitments (`docs/treasury/data-methodology.md`) require real accounting behind them | Accounting provider/process selected; chart of accounts covering crypto flows |
| 14 | **Public communications review** | Review of site, docs, and social copy for offering-language problems | Marketing can create the liability the structure avoided; the banned-vocabulary list (`docs/brand/voice.md`) is the self-imposed floor | Counsel review of public surfaces before any sale-related announcement |

## How a gate closes

A gate closes only with an artifact: an engagement letter, a written
analysis, a formed entity's documents, a published policy. Closing is a
reviewed PR updating this table plus, for material gates, a Chronicle
`governance` event. No gate closes by verbal assurance or by the passage
of time.

## Until then

The studio can do everything that doesn't touch money: build, publish,
record, open community surfaces, deploy the website. That is not a
workaround — it is the designed state. The gates are why the site can
honestly say nothing is for sale.
