import type { BuildEntry } from "@/lib/schemas/build";

/**
 * The public laboratory. Honest entries only — no invented experiments.
 */
export const builds: BuildEntry[] = [
  {
    id: "BUILD-000",
    title: "Building NO END STATE",
    hypothesis:
      "A company can be designed so that its complete record — launches, failures, decisions, incidents — is a first-class product that compounds instead of disappearing.",
    currentState:
      "The public site, Chronicle system, project registry, State Zero explorer, treasury interface, and local protocol prototypes are built and verified. Economic features are locked behind unresolved legal gates. Contracts are local prototypes; nothing is deployed.",
    status: "building",
    owner: null,
    startedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    projectId: null,
    chronicleEventIds: ["NES-0002"],
    repositoryUrls: ["https://github.com/MeltedMindz/NOENDSTATE"],
    outcome: null,
    body: "The first public build is the studio's own foundation. It includes: a Next.js application with a custom design system and no template residue; an append-only Chronicle with enforced integrity invariants; a typed, Zod-validated project registry that starts honestly empty; a State Zero explorer whose economic surfaces are disabled until legal review completes; a treasury page that refuses to show unverified numbers; and Foundry prototypes of StateZero, ChronicleRegistry, ProjectRegistry, TreasuryRouter, RevenueDistributor, and StateRenderer with unit, fuzz, and invariant tests. Deployment gates for every contract remain closed.",
  },
];
