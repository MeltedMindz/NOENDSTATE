# 05 — Protocol architecture (The Protocol Engineer)

Canonical reference: `docs/protocol/*.md`. Workspace: `contracts/` (Foundry, solc 0.8.28, via_ir, OpenZeppelin v5.7.0).

## Contracts (prototypes — deployed NOWHERE)

- **StateZero** — ERC-721 founding cohort. Immutable `MAX_SUPPLY`, role-gated mint with payment logic deliberately absent, per-token immutable seed, chronicle-root sync, burn disabled, pausable, holds no funds, `_update` runs the distributor checkpoint before ownership changes.
- **ChronicleRegistry** — append-only records with dense sequences, rolling `root = keccak(root, contentHash)`, supersede-by-reference (superseded records stay readable), zero mutation surface.
- **ProjectRegistry** — stable ids, preserved status history, admin-gated revenue policy (bps ≤ 10000), no deregistration.
- **TreasuryRouter** — four-sink bps schedule that must total exactly 10,000; ETH + approved-ERC20 intake attributed to project ids; fee-on-transfer safe (balance delta); reserve absorbs rounding dust so allocation is exact; pull-only withdrawals; pausable; no arbitrary external calls, no owner extraction path.
- **RevenueDistributor** — funds-distribution pattern (MAGNITUDE 2¹²⁸): O(1) funding, O(1) claims, per-token cursors. Transfer checkpoint settles accrued value to the **seller's** withdrawable balance; the buyer accrues from the checkpoint forward. Assets bounded (MAX_ASSETS 16), reentrancy-guarded, lifetime `totalFunded`/`totalPaid` accounting.
- **StateRenderer** — pure deterministic base64 JSON + SVG (open cell, ≤48 strata, serial), same inputs → same image forever.

## Test results

`forge test`: **42/42 passing** — unit, access-control, pause, transfer-checkpoint entitlement split, double-claim, malicious/fee-on-transfer tokens, reentrancy attack (attempted reentry caught and blocked), max-supply, zero-value, bps invariants; fuzz (512 runs): full-amount allocation, never-over-distributes with dust ≤ supply−1 wei; invariants (64 runs × depth 32 with a randomized mint/fund/transfer/claim/withdraw handler): `totalPaid ≤ totalFunded` and exact solvency `balance == funded − paid`. Gas snapshot: `contracts/.gas-snapshot`.

## Gates

Every deployment gate in `docs/protocol/deployment-gates.md` is open: no audit, no legal approval, no published terms, no chain selected, no custody, no multisig. **No public-chain deployment was performed or authorized.** The transfer/entitlement rule is documented as architecture, not final terms.
