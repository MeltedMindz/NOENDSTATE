# Protocol architecture

Six contracts in `contracts/src/` (Foundry, solc 0.8.28, `via_ir`,
OpenZeppelin v5.7). All are **prototypes: deployed nowhere, ever**, and
gated by `docs/protocol/deployment-gates.md`. 42 forge tests pass (unit +
fuzz + invariants); gas snapshot at `contracts/.gas-snapshot`.

## The six contracts

| Contract | One-line responsibility |
|---|---|
| `StateZero` | ERC-721 "STATE ZERO" (SZ) — the fixed founding cohort. Immutable `MAX_SUPPLY`, burn disabled, per-token immutable seed, transfer checkpoint hook, holds no funds. |
| `ChronicleRegistry` | Append-only onchain company record. Rolling root `keccak256(root, contentHash)`; no mutation functions exist. |
| `ProjectRegistry` | Stable project identities and status history; revenue-policy record (`setPolicy`). No deregistration. |
| `TreasuryRouter` | Splits attributed revenue across four sinks by a bps schedule that must total exactly 10,000; pull withdrawals only; dust to reserve. |
| `RevenueDistributor` | Funds-distribution accounting for holders: O(1) funding, per-token cursors, transfer checkpoint settlement, pull claims/withdrawals. |
| `StateRenderer` | Pure deterministic tokenURI: base64 JSON + SVG from `(tokenId, seed, eventsWitnessed)`; strata capped at 48. |

## Interaction diagram

```
 offchain record (content/chronicle)          project decisions
        │ append (RECORDER_ROLE)                    │ (REGISTRAR/ADMIN)
        ▼                                           ▼
 ┌────────────────────┐                    ┌────────────────────┐
 │ ChronicleRegistry  │                    │  ProjectRegistry   │
 │ append-only, root  │                    │ status history,    │
 └─────────┬──────────┘                    │ approved policies  │
           │ syncChronicle(root, n)        └─────────┬──────────┘
           │ (RECORDER_ROLE)                         │ policy informs
           ▼                                         ▼
 ┌────────────────────┐                    ┌────────────────────┐
 │     StateZero      │                    │   TreasuryRouter   │◀── revenue
 │  ERC-721 cohort    │                    │ split by schedule  │    (ETH /
 └──┬──────────────┬──┘                    └─────────┬──────────┘  approved
    │ tokenURI()   │ _update() calls                 │ stateZero share    ERC-20,
    ▼              │ handleTransfer(from,to,id)      │ (pull)          projectId-
 ┌───────────────┐ │  BEFORE ownership change        │              attributed)
 │ StateRenderer │ │                                 ▼
 │ pure SVG/JSON │ │                     ┌──────────────────────┐
 └───────────────┘ └────────────────────▶│  RevenueDistributor  │
                                         │ index += fund/supply │
                                         │ cursors, checkpoint  │
                                         └──────────┬───────────┘
                                                    │ claim()/withdraw() (pull)
                                                    ▼
                        holders                other sinks: treasury /
                                               operating / reserve (pull)
```

Key couplings:

- `StateZero → RevenueDistributor`: `_update` invokes
  `distributor.handleTransfer` **before** ownership changes
  (`docs/protocol/transfer-semantics.md`); the distributor accepts the
  call only from the StateZero address.
- `StateZero → StateRenderer`: `tokenURI` delegates to the renderer, a
  pure function — no state, no external calls.
- `ChronicleRegistry → StateZero`: linked operationally (a RECORDER syncs
  the registry's root into the cohort), not by direct contract calls.
- `TreasuryRouter → RevenueDistributor`: the router's stateZero sink is
  the distributor's funding source operationally; the distributor's
  `FUNDER_ROLE` pulls from the router and funds explicitly.
- `RevenueDistributor → StateZero`: reads `totalMinted()` (funding
  denominator) and `ownerOf()` (claim authorization).

## Roles

| Role | Contract | Grants | Powers |
|---|---|---|---|
| `DEFAULT_ADMIN_ROLE` | all | deployer → multisig (custody gate) | Grant/revoke roles; wire distributor/renderer; pause/unpause; set schedule/sinks/assets; `setPolicy` |
| `MINTER_ROLE` | StateZero | future mint mechanism only | `mint(to)` — no payment logic exists in the prototype |
| `RECORDER_ROLE` | StateZero, ChronicleRegistry | studio recording process | `append` records; `syncChronicle(root, n)` |
| `REGISTRAR_ROLE` | ProjectRegistry | studio ops | `register`, `setStatus`, `updateMetadata` |
| `FUNDER_ROLE` | RevenueDistributor | treasury ops / router path | `fundETH`, `fundToken` |

Deliberate absences: no role can burn an artifact, raise `MAX_SUPPLY`,
edit a Chronicle record, deregister a project, extract router funds
outside the schedule, or push payments to anyone. Pause exists on
StateZero, TreasuryRouter, and RevenueDistributor (admin-only); its abuse
surface is covered in `docs/protocol/threat-model.md`.

## Deeper reading

- Accounting math and worked example:
  `docs/protocol/revenue-accounting.md`
- Transfer/checkpoint ordering and edge cases:
  `docs/protocol/transfer-semantics.md`
- Threats and mitigations: `docs/protocol/threat-model.md`
- What must happen before any of this touches a chain:
  `docs/protocol/deployment-gates.md`
