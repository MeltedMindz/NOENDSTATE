import { describe, expect, it } from "vitest";
import { getBuilds, getChronicle, getProjects } from "@/lib/content";
import { validateChronicle } from "@/lib/schemas/chronicle";
import { economics, featureFlags } from "@/config/economics";
import { contracts, treasuryAddresses } from "@/config/contracts";
import { community } from "@/config/community";

describe("chronicle integrity", () => {
  it("validates and sorts newest-first", () => {
    const events = getChronicle();
    expect(events.length).toBeGreaterThan(0);
    for (let i = 1; i < events.length; i++) {
      expect(events[i - 1].sequence).toBeGreaterThan(events[i].sequence);
    }
  });

  it("has dense unique sequences matching eventIds", () => {
    const events = getChronicle();
    expect(validateChronicle(events)).toEqual([]);
  });

  it("separates occurredAt from recordedAt", () => {
    for (const e of getChronicle()) {
      expect(e.occurredAt).toBeTruthy();
      expect(e.recordedAt).toBeTruthy();
    }
  });

  it("never marks studio disclosures as onchain verified without tx hashes", () => {
    for (const e of getChronicle()) {
      if (e.verificationStatus === "onchain_verified") {
        expect(e.transactionHashes.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("project registry", () => {
  it("parses every project against the schema", () => {
    expect(() => getProjects()).not.toThrow();
  });

  it("has unique ids and slugs", () => {
    const projects = getProjects();
    const ids = new Set(projects.map((p) => p.id));
    const slugs = new Set(projects.map((p) => p.slug));
    expect(ids.size).toBe(projects.length);
    expect(slugs.size).toBe(projects.length);
  });

  it("never approves a State Zero allocation without an approved policy", () => {
    for (const p of getProjects()) {
      if (p.stateZeroAllocationBps !== null && p.stateZeroAllocationBps > 0) {
        expect(p.stateZeroAllocationApproved).toBe(true);
        expect(p.revenuePolicy).not.toBeNull();
      }
    }
  });
});

describe("build log", () => {
  it("parses and includes BUILD-000", () => {
    const builds = getBuilds();
    expect(builds.some((b) => b.id === "BUILD-000")).toBe(true);
  });
});

describe("economic launch gates", () => {
  it("keeps every unapproved economic value null", () => {
    expect(economics.foundingSupply).toBeNull();
    expect(economics.mintPrice).toBeNull();
    expect(economics.stateZeroAllocationBps).toBeNull();
    expect(economics.launchStatus).toBe("not_launched");
    expect(economics.legalApprovalStatus).toBe("not_started");
  });

  it("keeps mint and claims disabled without legal approval regardless of env", () => {
    // The flags AND on legalApprovalStatus === "approved", which is false.
    expect(featureFlags.stateZeroMintEnabled).toBe(false);
    expect(featureFlags.revenueClaimsEnabled).toBe(false);
  });

  it("has no contract addresses or treasury addresses configured", () => {
    for (const c of contracts) {
      expect(c.address).toBeNull();
      expect(c.status).toBe("prototype");
    }
    expect(treasuryAddresses).toEqual([]);
  });
});

describe("community surfaces", () => {
  it("never marks a surface live without a url", () => {
    for (const s of Object.values(community)) {
      if (s.status === "live") expect(s.url).toBeTruthy();
      if (!s.url) expect(s.status).not.toBe("live");
    }
  });
});
