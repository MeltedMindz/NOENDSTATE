import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the open state cell on ink, drawn from tokens. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0d0b",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path d="M6 8 V26 H26 V8" stroke="#e9e4d8" strokeWidth="2" />
          <path d="M6 8 H16" stroke="#e9e4d8" strokeWidth="2" />
          <path d="M23 8 H26" stroke="#e9e4d8" strokeWidth="2" />
          <path d="M19.5 8 V2.5" stroke="#59d9c3" strokeWidth="2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
