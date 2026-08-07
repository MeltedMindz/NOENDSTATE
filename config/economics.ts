import { z } from "zod";

/**
 * State Zero economics configuration.
 *
 * Every value that has not been approved is null and every feature flag
 * defaults to false. Nothing in this file is a promise; it is a schema
 * that approved terms can later be inserted into. The website must render
 * gracefully around every null here.
 *
 * Hard rule: no UI may display an invented supply, price, allocation, or
 * launch date. See docs/state-zero/economic-gates.md and
 * docs/legal/launch-gates.md.
 */
export const economicsSchema = z.object({
  foundingSupply: z.number().int().positive().nullable(),
  mintPrice: z.string().nullable(), // decimal string in mintCurrency units
  mintCurrency: z.string().nullable(), // e.g. "ETH"
  mintChain: z.string().nullable(), // e.g. "base", "ethereum"
  eligibleRevenueDefinition: z.string().nullable(),
  stateZeroAllocationBps: z.number().int().min(0).max(10000).nullable(),
  treasuryAllocationBps: z.number().int().min(0).max(10000).nullable(),
  operatingAllocationBps: z.number().int().min(0).max(10000).nullable(),
  reserveAllocationBps: z.number().int().min(0).max(10000).nullable(),
  distributionCadence: z.string().nullable(),
  transferTreatment: z.enum(["checkpoint", "snapshot", "other"]).nullable(),
  refundPolicy: z.string().nullable(),
  vestingPolicy: z.string().nullable(),
  jurisdictionalRestrictions: z.array(z.string()).nullable(),
  launchStatus: z.enum(["not_launched", "testnet", "live"]),
  legalApprovalStatus: z.enum(["not_started", "in_review", "approved"]),
});

export type Economics = z.infer<typeof economicsSchema>;

export const economics: Economics = economicsSchema.parse({
  foundingSupply: null,
  mintPrice: null,
  mintCurrency: null,
  mintChain: null,
  eligibleRevenueDefinition: null,
  stateZeroAllocationBps: null,
  treasuryAllocationBps: null,
  operatingAllocationBps: null,
  reserveAllocationBps: null,
  distributionCadence: null,
  transferTreatment: null,
  refundPolicy: null,
  vestingPolicy: null,
  jurisdictionalRestrictions: null,
  launchStatus: "not_launched",
  legalApprovalStatus: "not_started",
});

/**
 * Feature flags. Environment variables can only be used to turn features
 * OFF in this codebase; enabling any of these requires a code change that
 * passes review, because enabling them is a legal launch gate.
 */
export const featureFlags = {
  stateZeroMintEnabled:
    process.env.NEXT_PUBLIC_STATE_ZERO_MINT_ENABLED === "true" &&
    economics.legalApprovalStatus === "approved",
  revenueClaimsEnabled:
    process.env.NEXT_PUBLIC_REVENUE_CLAIMS_ENABLED === "true" &&
    economics.legalApprovalStatus === "approved",
  walletConnectEnabled: process.env.NEXT_PUBLIC_WALLET_CONNECT_ENABLED === "true",
  /** Development fixtures for the State Zero explorer. Never true in production. */
  stateZeroFixturesEnabled:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_STATE_ZERO_FIXTURES === "true",
} as const;
