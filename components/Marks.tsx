/**
 * Brand marks. The symbol is a state cell: a rectangular frame whose top
 * boundary is permanently open, with one signal tick drifting out of the
 * opening — the system can always receive another event.
 */

export function Symbol({
  size = 28,
  title = "NO END STATE symbol",
}: {
  size?: number;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={title}
    >
      {/* left, bottom, right edges */}
      <path
        d="M6 8 V26 H26 V8"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* top edge, broken */}
      <path d="M6 8 H16" stroke="currentColor" strokeWidth="2" />
      <path d="M23 8 H26" stroke="currentColor" strokeWidth="2" />
      {/* tick drifting out of the opening */}
      <path d="M19.5 8 V2.5" stroke="#59d9c3" strokeWidth="2" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6em",
        fontFamily: "var(--font-ui)",
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontSize: compact ? "0.9375rem" : "1.0625rem",
        whiteSpace: "nowrap",
      }}
    >
      <Symbol size={compact ? 20 : 24} />
      NO END STATE
    </span>
  );
}
