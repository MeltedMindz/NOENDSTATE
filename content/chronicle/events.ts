import type { ChronicleEvent } from "@/lib/schemas/chronicle";

/**
 * The Chronicle. Append-only.
 *
 * Rules (enforced by tests):
 * - New events are appended with the next sequence number.
 * - Published eventIds never change.
 * - Nothing is deleted. Corrections append a `correction` event that
 *   references the superseded record via supersedesEventId.
 * - occurredAt is when it happened; recordedAt is when it was written down.
 *
 * Every event here is real. No invented history.
 */
export const chronicleEvents: ChronicleEvent[] = [
  {
    eventId: "NES-0000",
    sequence: 0,
    type: "studio_founded",
    title: "NO END STATE is founded",
    summary:
      "The studio is founded as a persistent, internet-native product and protocol company. First repository commit recorded the same day.",
    body: "NO END STATE begins with a deliberate constraint: the company has no final form. It is founded once, and it builds indefinitely. Products and protocols will be created beneath it; each one expands the studio's body of work, operating knowledge, and this record. This event is the root of the Chronicle. Everything that follows appends to it.",
    occurredAt: "2026-08-07",
    recordedAt: "2026-08-07",
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: ["https://github.com/MeltedMindz/NOENDSTATE"],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: null,
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["founding", "studio"],
  },
  {
    eventId: "NES-0001",
    sequence: 1,
    type: "milestone",
    title: "noendstate.com is registered",
    summary:
      "The canonical domain noendstate.com is registered through Vercel, with nameservers pointed at the Vercel edge network.",
    body: null,
    occurredAt: "2026-08-07",
    recordedAt: "2026-08-07",
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: ["https://noendstate.com"],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: null,
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["infrastructure", "domain"],
  },
  {
    eventId: "NES-0002",
    sequence: 2,
    type: "project_started",
    title: "BUILD 000 begins: building NO END STATE",
    summary:
      "Work begins on the studio's own foundation — the website, the Chronicle system, the project registry, the State Zero architecture, and local protocol prototypes.",
    body: "The first build is the studio itself. BUILD 000 covers the public website, the append-only Chronicle, the typed project registry, the State Zero explorer with its economic features locked, a transparent treasury interface with no invented data, and local Foundry prototypes of the protocol contracts. None of the contracts are deployed. Minting and revenue claims are disabled until the launch gates in the public record are closed.",
    occurredAt: "2026-08-07",
    recordedAt: "2026-08-07",
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: ["https://github.com/MeltedMindz/NOENDSTATE"],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: null,
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["build-000", "website", "foundation"],
  },
];
