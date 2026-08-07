import { ImageResponse } from "next/og";

export const alt = "NO END STATE — Founded once. Building indefinitely.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide Open Graph card: the open frame, the wordmark, the core line.
 * Drawn from tokens; no external assets.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0e0d0b",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: "2px solid #e9e4d8",
            borderRight: "2px solid #e9e4d8",
            borderBottom: "2px solid #e9e4d8",
            position: "relative",
            padding: 56,
          }}
        >
          {/* broken top edge */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "58%", height: 2, background: "#e9e4d8", display: "flex" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "26%", height: 2, background: "#e9e4d8", display: "flex" }} />
          <div style={{ position: "absolute", top: -26, left: "66%", width: 2, height: 26, background: "#59d9c3", display: "flex" }} />

          <div style={{ display: "flex", fontSize: 30, color: "#8a867c", letterSpacing: 4, fontFamily: "monospace" }}>
            NO END STATE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 76, color: "#e9e4d8", fontWeight: 600 }}>
              Founded once.
            </div>
            <div style={{ display: "flex", fontSize: 76, color: "#59d9c3", fontWeight: 600, fontStyle: "italic" }}>
              Building indefinitely.
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8a867c", fontFamily: "monospace", letterSpacing: 2 }}>
            A PERMANENT RECORD OF AN UNFINISHED COMPANY — NOENDSTATE.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
