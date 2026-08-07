import { describe, expect, it } from "vitest";
import { hashSeed, mulberry32, renderStateArt } from "@/lib/state-art";

describe("state art determinism", () => {
  it("hashes seeds stably", () => {
    expect(hashSeed("fixture-seed-0000")).toBe(hashSeed("fixture-seed-0000"));
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });

  it("produces a deterministic PRNG stream", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 10; i++) expect(a()).toBe(b());
  });

  it("renders identical SVG for identical inputs", () => {
    const input = {
      seed: "fixture-seed-0001",
      tokenId: 1,
      eventsWitnessed: 3,
      eventTypes: ["studio_founded", "milestone", "project_started"],
    };
    expect(renderStateArt(input)).toBe(renderStateArt(input));
  });

  it("renders different SVG for different seeds", () => {
    const base = {
      tokenId: 1,
      eventsWitnessed: 3,
      eventTypes: ["studio_founded"],
    };
    expect(renderStateArt({ ...base, seed: "x" })).not.toBe(renderStateArt({ ...base, seed: "y" }));
  });

  it("emits valid svg with a serial and event count", () => {
    const svg = renderStateArt({
      seed: "s",
      tokenId: 7,
      eventsWitnessed: 5,
      eventTypes: ["release"],
    });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("SZ 0007");
    expect(svg).toContain("5 EVENTS");
    expect(svg.endsWith("</svg>")).toBe(true);
  });
});
