/**
 * Deterministic generative artwork for State Zero artifacts.
 *
 * The drawing derives entirely from:
 *  - the immutable token seed (fixed at mint)
 *  - the token id
 *  - the count and categories of Chronicle events witnessed
 *
 * Same inputs, same image — no randomness at render time. This is the
 * prototype for the onchain StateRenderer: an incomplete state cell with
 * one permanently open edge, accumulating one stratum per Chronicle event.
 */

/** FNV-1a string hash → 32-bit uint. */
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — deterministic from the hashed seed. */
export function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIGNAL = ["#59d9c3", "#8be08a", "#e3e05a", "#e39a5a", "#e37a6a"];

export type StateArtInput = {
  seed: string;
  tokenId: number;
  eventsWitnessed: number;
  eventTypes: string[];
};

/**
 * Returns an SVG string, 480x600. Rendered inline (server component) or
 * used to build data URIs. Bone-on-ink; one open edge on the frame.
 */
export function renderStateArt({ seed, tokenId, eventsWitnessed, eventTypes }: StateArtInput): string {
  const rand = mulberry32(hashSeed(`${seed}:${tokenId}`));
  const W = 480;
  const H = 600;
  const M = 48; // margin
  const openEdge = Math.floor(rand() * 4); // 0 top, 1 right, 2 bottom, 3 left
  const gapStart = 0.25 + rand() * 0.4;
  const gapLen = 0.18 + rand() * 0.2;

  // Frame with one open edge: draw 4 sides, the open one has a gap.
  const sides: string[] = [];
  const edges = [
    { x1: M, y1: M, x2: W - M, y2: M }, // top
    { x1: W - M, y1: M, x2: W - M, y2: H - M }, // right
    { x1: W - M, y1: H - M, x2: M, y2: H - M }, // bottom
    { x1: M, y1: H - M, x2: M, y2: M }, // left
  ];
  edges.forEach((e, i) => {
    if (i !== openEdge) {
      sides.push(
        `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="#e8e4da" stroke-width="2"/>`
      );
    } else {
      const dx = e.x2 - e.x1;
      const dy = e.y2 - e.y1;
      const aEnd = { x: e.x1 + dx * gapStart, y: e.y1 + dy * gapStart };
      const bStart = { x: e.x1 + dx * (gapStart + gapLen), y: e.y1 + dy * (gapStart + gapLen) };
      sides.push(
        `<line x1="${e.x1}" y1="${e.y1}" x2="${aEnd.x.toFixed(1)}" y2="${aEnd.y.toFixed(1)}" stroke="#e8e4da" stroke-width="2"/>`,
        `<line x1="${bStart.x.toFixed(1)}" y1="${bStart.y.toFixed(1)}" x2="${e.x2}" y2="${e.y2}" stroke="#e8e4da" stroke-width="2"/>`
      );
    }
  });

  // Event strata: one horizontal line per witnessed event, accumulating
  // from the bottom of the cell. Type determines the signal accent.
  const strata: string[] = [];
  const innerW = W - 2 * M;
  const usable = H - 2 * M - 60;
  for (let i = 0; i < eventsWitnessed; i++) {
    const y = H - M - 24 - (i * usable) / Math.max(eventsWitnessed, 12);
    const inset = rand() * innerW * 0.35;
    const fromLeft = rand() > 0.5;
    const x1 = fromLeft ? M + 12 : M + 12 + inset;
    const x2 = fromLeft ? W - M - 12 - inset : W - M - 12;
    const type = eventTypes[i % Math.max(eventTypes.length, 1)] ?? "";
    const accent = type === "incident" ? SIGNAL[4] : type === "studio_founded" ? SIGNAL[0] : SIGNAL[hashSeed(type) % SIGNAL.length];
    const isAccent = rand() < 0.3;
    strata.push(
      `<line x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${isAccent ? accent : "#8a867c"}" stroke-width="${isAccent ? 2 : 1}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`
    );
  }

  // Drift fragments: small ticks outside the open edge, suggesting the
  // next state arriving.
  const ticks: string[] = [];
  const tickCount = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < tickCount; i++) {
    const t = gapStart + rand() * gapLen;
    const e = edges[openEdge];
    const dx = e.x2 - e.x1;
    const dy = e.y2 - e.y1;
    const px = e.x1 + dx * t;
    const py = e.y1 + dy * t;
    // normal direction pointing outward
    const nx = openEdge === 1 ? 1 : openEdge === 3 ? -1 : 0;
    const ny = openEdge === 0 ? -1 : openEdge === 2 ? 1 : 0;
    const d = 8 + rand() * 26;
    ticks.push(
      `<line x1="${(px + nx * 6).toFixed(1)}" y1="${(py + ny * 6).toFixed(1)}" x2="${(px + nx * d).toFixed(1)}" y2="${(py + ny * d).toFixed(1)}" stroke="#59d9c3" stroke-width="1.5" opacity="0.8"/>`
    );
  }

  const serial = `SZ ${String(tokenId).padStart(4, "0")}`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="State Zero artifact ${serial}: generative state cell with ${eventsWitnessed} event strata">`,
    `<rect width="${W}" height="${H}" fill="#0e0d0b"/>`,
    ...sides,
    ...strata,
    ...ticks,
    `<text x="${M}" y="${H - 18}" font-family="ui-monospace, monospace" font-size="13" fill="#8a867c" letter-spacing="2">${serial}</text>`,
    `<text x="${W - M}" y="${H - 18}" text-anchor="end" font-family="ui-monospace, monospace" font-size="13" fill="#59d9c3" letter-spacing="2">${eventsWitnessed} EVENTS</text>`,
    `</svg>`,
  ].join("");
}
