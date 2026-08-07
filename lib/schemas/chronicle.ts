import { z } from "zod";

export const chronicleEventTypeSchema = z.enum([
  "studio_founded",
  "state_zero_created",
  "project_proposed",
  "project_started",
  "project_launched",
  "project_updated",
  "project_sunset",
  "release",
  "audit",
  "incident",
  "recovery",
  "treasury_inflow",
  "treasury_outflow",
  "distribution",
  "governance",
  "partnership",
  "acquisition",
  "grant",
  "milestone",
  "postmortem",
  "correction",
  "epoch_started",
  "epoch_closed",
]);

export type ChronicleEventType = z.infer<typeof chronicleEventTypeSchema>;

export const verificationStatusSchema = z.enum([
  "onchain_verified", // provable against a public chain
  "studio_disclosed", // asserted by the studio, sourced where possible
  "external", // reported by a third party
  "estimate", // explicitly an estimate — never presented as fact
]);

export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const chronicleEventSchema = z.object({
  eventId: z.string().regex(/^NES-\d{4}$/, "Event IDs are NES-0000 style and never change"),
  sequence: z.number().int().nonnegative(),
  type: chronicleEventTypeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().nullable(),
  /** When the thing actually happened. */
  occurredAt: z.string(),
  /** When the record was written. Separate from occurredAt by design. */
  recordedAt: z.string(),
  projectId: z.string().nullable(),
  epochId: z.string().nullable(),
  sourceUrls: z.array(z.string()),
  transactionHashes: z.array(z.string()),
  contractAddresses: z.array(z.string()),
  repositoryCommit: z.string().nullable(),
  contentHash: z.string().nullable(),
  /** Corrections append; they never rewrite. */
  supersedesEventId: z.string().nullable(),
  verificationStatus: verificationStatusSchema,
  visibility: z.enum(["public", "internal"]),
  tags: z.array(z.string()),
});

export type ChronicleEvent = z.infer<typeof chronicleEventSchema>;

/**
 * Chronicle invariants, enforced by tests in tests/unit/chronicle.test.ts:
 * - sequence numbers are unique and dense from 0
 * - eventIds are unique and match their sequence
 * - a supersedesEventId always points at an existing earlier event
 * - superseded events are never removed from the record
 */
export function validateChronicle(events: ChronicleEvent[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const seqs = new Set<number>();
  for (const e of events) {
    if (ids.has(e.eventId)) problems.push(`duplicate eventId ${e.eventId}`);
    if (seqs.has(e.sequence)) problems.push(`duplicate sequence ${e.sequence}`);
    ids.add(e.eventId);
    seqs.add(e.sequence);
    const expected = `NES-${String(e.sequence).padStart(4, "0")}`;
    if (e.eventId !== expected) {
      problems.push(`eventId ${e.eventId} does not match sequence ${e.sequence}`);
    }
  }
  for (const e of events) {
    if (e.supersedesEventId && !ids.has(e.supersedesEventId)) {
      problems.push(`${e.eventId} supersedes missing event ${e.supersedesEventId}`);
    }
  }
  return problems;
}
