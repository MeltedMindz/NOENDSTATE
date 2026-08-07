/**
 * Canonical studio configuration.
 * Single source of truth for identity strings used across the site,
 * metadata, feeds, and structured data.
 */
export const studio = {
  name: "NO END STATE",
  legalEntity: null as string | null, // no entity formed — launch gate, see docs/legal/launch-gates.md
  domain: "https://noendstate.com",
  coreLine: "Founded once. Building indefinitely.",
  secondaryLine: "A permanent record of an unfinished company.",
  description:
    "NO END STATE is an internet-native, onchain product and protocol studio. It builds protocols, products, and experiments under one persistent company, and preserves the complete record — including failures — in an append-only Chronicle.",
  foundedAt: "2026-08-07", // repository created, domain registered, first commit
  category: "Onchain product and protocol studio",
} as const;

export type Studio = typeof studio;
