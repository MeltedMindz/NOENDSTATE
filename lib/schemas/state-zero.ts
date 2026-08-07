import { z } from "zod";

/**
 * State Zero artifact model.
 *
 * Three strictly separated layers:
 * 1. Company history — every artifact witnesses the same Chronicle. Never resets.
 * 2. Token provenance — transfers, custody periods, marks. Travels with the token.
 * 3. Holder participation — attached to the wallet that did the participating.
 *    It does NOT become the buyer's history after a transfer.
 */
export const stateZeroTokenSchema = z.object({
  tokenId: z.number().int().nonnegative(),
  /** Immutable seed fixed at mint; drives the generative artwork. */
  seed: z.string(),
  mintBlock: z.number().int().nullable(),
  mintTimestamp: z.string().nullable(),
  originalHolder: z.string().nullable(),
  currentHolder: z.string().nullable(),
  provenanceCount: z.number().int().nonnegative(),
  status: z.enum(["fixture", "minted"]),
  transfers: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      at: z.string(),
      txHash: z.string().nullable(),
    })
  ),
  holderParticipation: z.array(
    z.object({
      kind: z.enum(["vote", "contribution", "testing", "grant", "project"]),
      label: z.string(),
      at: z.string(),
      wallet: z.string(),
    })
  ),
});

export type StateZeroToken = z.infer<typeof stateZeroTokenSchema>;
