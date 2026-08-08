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
  {
    eventId: "NES-0003",
    sequence: 3,
    type: "release",
    title: "noendstate.com goes live",
    summary:
      "The studio's site is deployed to production and the canonical domain begins serving: sixteen routes, the Chronicle, the project registry, the State Zero architecture with every economic feature locked, and the public record you are reading now.",
    body: "The first release of BUILD-000. The site shipped with a verified test record: 42 protocol contract tests (unit, fuzz, invariant), 17 content-integrity unit tests, and 111 end-to-end and accessibility checks run against the production deployment itself. Minting is not active, revenue claims are not active, no contract is deployed, and the launch gates in the public record remain open. This record was appended the same day the studio was founded — the record and the company started together.",
    occurredAt: "2026-08-07",
    recordedAt: "2026-08-07",
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: ["https://noendstate.com", "https://github.com/MeltedMindz/NOENDSTATE"],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: "173e82a",
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["build-000", "release", "launch"],
  },
  {
    eventId: "NES-0004",
    sequence: 4,
    type: "release",
    title: "Visual System V2: the site becomes a studio index",
    summary:
      "The site is redesigned and redeployed as a concise operating index: a five-surface homepage with live record values, ruled indexes in place of cards, and the procedural state field relocated to State Zero. Nothing about the record, registry, or gates changed.",
    body: "The second release of BUILD-000. The homepage was reduced from ten explanatory sections to five surfaces — declaration, current work, chronicle, operating model, State Zero — cutting rendered homepage copy by 62.5% with every removal mapped to its destination route in the public repository. Bordered controls became editorial text links, cards became hairline index rows, and the open state cell was reduced from a universal container to the mark itself and a single broken-rule marker carrying live studio values. All truth constraints held through the redesign: the Chronicle remains append-only, the project registry remains honestly empty, no tokens exist, minting and claims remain disabled, and every contract deployment gate remains closed. The release was verified against the production domain before this record was appended.",
    occurredAt: "2026-08-08",
    recordedAt: "2026-08-08",
    projectId: null,
    epochId: "epoch-0",
    sourceUrls: ["https://noendstate.com", "https://github.com/MeltedMindz/NOENDSTATE/pull/3"],
    transactionHashes: [],
    contractAddresses: [],
    repositoryCommit: "28ddd9e",
    contentHash: null,
    supersedesEventId: null,
    verificationStatus: "studio_disclosed",
    visibility: "public",
    tags: ["build-000", "release", "visual-system-v2"],
  },
];
