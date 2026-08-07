#!/usr/bin/env node
/**
 * Chronicle event generator: allocates the next sequence/eventId pair and
 * prints a scaffold. Appends nothing automatically — the Chronicle only
 * takes reviewed records. Duplicate-ID protection is enforced by
 * tests/unit/content.test.ts, which fails the build on any violation.
 *
 * Usage: pnpm studio:new-event <type> "Title"
 */
import { readFileSync } from "fs";

const TYPES = [
  "studio_founded", "state_zero_created", "project_proposed", "project_started",
  "project_launched", "project_updated", "project_sunset", "release", "audit",
  "incident", "recovery", "treasury_inflow", "treasury_outflow", "distribution",
  "governance", "partnership", "acquisition", "grant", "milestone", "postmortem",
  "correction", "epoch_started", "epoch_closed",
];

const type = process.argv[2];
const title = process.argv[3];
if (!type || !title || !TYPES.includes(type)) {
  console.error(`Usage: pnpm studio:new-event <type> "Title"\nTypes: ${TYPES.join(", ")}`);
  process.exit(1);
}

const events = readFileSync("content/chronicle/events.ts", "utf8");
const seqs = [...events.matchAll(/sequence:\s*(\d+)/g)].map((m) => Number(m[1]));
const nextSeq = seqs.length ? Math.max(...seqs) + 1 : 0;
const eventId = `NES-${String(nextSeq).padStart(4, "0")}`;
const today = new Date().toISOString().slice(0, 10);

console.log(`
── Chronicle event ${eventId} ─ append to content/chronicle/events.ts ──────
  {
    eventId: "${eventId}",
    sequence: ${nextSeq},
    type: "${type}",
    title: "${title}",
    summary: "", // one or two honest sentences
    body: null,
    occurredAt: "${today}", // when it actually happened
    recordedAt: "${today}", // when this record was written
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: [],
    transactionHashes: [], // required if verificationStatus is onchain_verified
    contractAddresses: [],
    repositoryCommit: null,
    contentHash: null,
    supersedesEventId: null, // set for corrections; the old record stays
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: [],
  },

Append only. Never renumber, never delete. Run \`pnpm test\` to verify
integrity before committing.
`);
