import type { StateZeroToken } from "@/lib/schemas/state-zero";

/**
 * DEVELOPMENT FIXTURES ONLY.
 *
 * These records exist so the State Zero explorer can be built and tested
 * before any collection exists. They are never served as production facts:
 * the explorer only renders them when featureFlags.stateZeroFixturesEnabled
 * is true, which is never the case in production (see config/economics.ts).
 * Every fixture is visibly labeled in the UI.
 */
export const stateZeroFixtures: StateZeroToken[] = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
  tokenId: i,
  seed: `fixture-seed-${i.toString(16).padStart(4, "0")}`,
  mintBlock: null,
  mintTimestamp: null,
  originalHolder: null,
  currentHolder: null,
  provenanceCount: 0,
  status: "fixture" as const,
  transfers: [],
  holderParticipation: [],
}));

export function getFixtureToken(tokenId: number): StateZeroToken | undefined {
  return stateZeroFixtures.find((t) => t.tokenId === tokenId);
}
