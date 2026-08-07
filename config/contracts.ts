/**
 * Contract deployment registry.
 * Nothing is deployed. Every address is null. The prototypes in /contracts
 * are local, unaudited, and gated behind docs/protocol/deployment-gates.md.
 * Never put a placeholder or example address here — null or a real,
 * verified deployment only.
 */
export type ContractDeployment = {
  name: string;
  address: string | null;
  chain: string | null;
  deployedAt: string | null;
  auditUrl: string | null;
  status: "prototype" | "testnet" | "audited" | "deployed";
};

export const contracts: ContractDeployment[] = [
  { name: "StateZero", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
  { name: "ChronicleRegistry", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
  { name: "ProjectRegistry", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
  { name: "TreasuryRouter", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
  { name: "RevenueDistributor", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
  { name: "StateRenderer", address: null, chain: null, deployedAt: null, auditUrl: null, status: "prototype" },
];

export const anyDeployed = contracts.some((c) => c.address !== null);

/**
 * Treasury addresses. None configured — the treasury page must show its
 * "not yet initialized" state until a real, verified address is added.
 */
export const treasuryAddresses: { label: string; address: string; chain: string }[] = [];
