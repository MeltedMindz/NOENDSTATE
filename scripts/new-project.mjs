#!/usr/bin/env node
/**
 * Project generator: allocates the next stable P-NNN id and prints a
 * ready-to-review record scaffold plus the matching Chronicle event draft.
 * It intentionally does NOT write into content/ — records enter the
 * registry through review, not automation.
 *
 * Usage: pnpm studio:new-project "Project Name" [slug]
 */
import { readFileSync } from "fs";

const name = process.argv[2];
if (!name) {
  console.error('Usage: pnpm studio:new-project "Project Name" [slug]');
  process.exit(1);
}
const slug = (process.argv[3] ?? name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const registry = readFileSync("content/projects/index.ts", "utf8");
const ids = [...registry.matchAll(/id:\s*"P-(\d{3})"/g)].map((m) => Number(m[1]));
const nextId = `P-${String(ids.length ? Math.max(...ids) + 1 : 0).padStart(3, "0")}`;

const events = readFileSync("content/chronicle/events.ts", "utf8");
const seqs = [...events.matchAll(/sequence:\s*(\d+)/g)].map((m) => Number(m[1]));
const nextSeq = seqs.length ? Math.max(...seqs) + 1 : 0;
const nextEventId = `NES-${String(nextSeq).padStart(4, "0")}`;
const today = new Date().toISOString().slice(0, 10);

console.log(`
── Project record scaffold ─ paste into content/projects/index.ts ──────────
  {
    id: "${nextId}",
    slug: "${slug}",
    name: "${name}",
    oneLine: "", // one honest sentence
    thesis: "",
    description: "",
    status: "research",
    category: "",
    startedAt: "${today}",
    launchedAt: null,
    sunsetAt: null,
    chain: null,
    repositoryUrl: null,
    websiteUrl: null,
    socialUrl: null,
    contractAddresses: [],
    audits: [],
    revenuePolicy: null,
    stateZeroAllocationBps: null,
    stateZeroAllocationApproved: false,
    treasuryAddresses: [],
    team: [],
    technologies: [],
    heroAsset: null,
    gallery: [],
    chronicleEventIds: ["${nextEventId}"],
    postmortemUrl: null,
    public: false, // flip to true only after review
    featured: false,
    updatedAt: "${today}",
  },

── Chronicle event draft ─ paste into content/chronicle/events.ts ──────────
  {
    eventId: "${nextEventId}",
    sequence: ${nextSeq},
    type: "project_proposed",
    title: "${name} is proposed",
    summary: "",
    body: null,
    occurredAt: "${today}",
    recordedAt: "${today}",
    projectId: "${nextId}",
    epochId: "epoch-0",
    sourceUrls: [],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: null,
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["${slug}"],
  },

── Community sync ───────────────────────────────────────────────────────────
Run \`pnpm community:sync\` after the project is public to plan the Discord
category and Telegram topic for ${nextId}.

Run \`pnpm test\` before committing — schema validation will catch anything
incomplete.
`);
