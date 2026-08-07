import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const alt = "NO END STATE — Founded once. Building indefinitely.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0e0d0b";
const BONE = "#e9e4d8";
const ASH = "#98948a";
const CYAN = "#59d9c3";

/** Accumulated strata behind the frame — deterministic, in brand colors. */
const STRATA: { top: number; left: number; width: number; color: string; opacity: number }[] = [
  { top: 444, left: 80, width: 760, color: ASH, opacity: 0.32 },
  { top: 458, left: 200, width: 900, color: ASH, opacity: 0.26 },
  { top: 472, left: 80, width: 540, color: "#8be08a", opacity: 0.45 },
  { top: 486, left: 340, width: 780, color: ASH, opacity: 0.28 },
  { top: 498, left: 80, width: 1040, color: "#e3e05a", opacity: 0.35 },
];

/**
 * The site-wide Open Graph card: the open frame with its escaping tick,
 * the core declaration in the brand serif, the registry layer in mono,
 * strata accumulating beneath. Drawn entirely from tokens; fonts are the
 * real brand faces, fetched at build time.
 */
export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          padding: 56,
          fontFamily: "IBM Plex Mono",
        }}
      >
        {/* strata field */}
        {STRATA.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.width,
              height: 2,
              background: s.color,
              opacity: s.opacity,
              display: "flex",
            }}
          />
        ))}

        {/* open frame: left / right / bottom closed, top broken */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: `2px solid ${BONE}`,
            borderRight: `2px solid ${BONE}`,
            borderBottom: `2px solid ${BONE}`,
            position: "relative",
            padding: "48px 56px 40px",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, width: "58%", height: 2, background: BONE, display: "flex" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "30%", height: 2, background: BONE, display: "flex" }} />
          {/* the tick escaping the open boundary */}
          <div style={{ position: "absolute", top: -30, left: "63%", width: 2, height: 30, background: CYAN, display: "flex" }} />

          {/* registry header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              letterSpacing: 5,
              color: ASH,
            }}
          >
            <div style={{ display: "flex" }}>NO END STATE</div>
            <div style={{ display: "flex" }}>EST. 2026 / EPOCH 0</div>
          </div>

          {/* declaration */}
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Newsreader" }}>
            <div style={{ display: "flex", fontSize: 96, color: BONE, lineHeight: 1.08, letterSpacing: -1 }}>
              Founded once.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 96,
                color: CYAN,
                fontStyle: "italic",
                lineHeight: 1.08,
                letterSpacing: -1,
              }}
            >
              Building indefinitely.
            </div>
          </div>

          {/* registry footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 21,
              letterSpacing: 3,
              color: ASH,
            }}
          >
            <div style={{ display: "flex" }}>A PERMANENT RECORD OF AN UNFINISHED COMPANY</div>
            <div style={{ display: "flex", color: BONE }}>NOENDSTATE.COM</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
