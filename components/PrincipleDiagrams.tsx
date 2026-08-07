/**
 * Thin-line state diagrams for the three operating principles.
 * Original schematics in the studio's visual grammar — cells, strata,
 * routed loops. Decorative to screen readers; the copy carries meaning.
 */

const STROKE = "#8a867c";
const ACCENT = "#59d9c3";

export function BuildDiagram() {
  return (
    <svg viewBox="0 0 220 140" fill="none" aria-hidden="true" style={{ width: "100%", maxWidth: 220 }}>
      {/* an independent cell, complete on its own */}
      <rect x="30" y="30" width="100" height="80" stroke={STROKE} strokeWidth="1.5" />
      <line x1="50" y1="55" x2="110" y2="55" stroke={STROKE} />
      <line x1="50" y1="70" x2="95" y2="70" stroke={STROKE} />
      <line x1="50" y1="85" x2="105" y2="85" stroke={STROKE} />
      {/* shipping: output leaves the cell */}
      <line x1="130" y1="70" x2="185" y2="70" stroke={ACCENT} strokeWidth="1.5" />
      <path d="M180 64 L190 70 L180 76" stroke={ACCENT} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function RecordDiagram() {
  return (
    <svg viewBox="0 0 220 140" fill="none" aria-hidden="true" style={{ width: "100%", maxWidth: 220 }}>
      {/* append-only strata, oldest at bottom */}
      <line x1="40" y1="110" x2="180" y2="110" stroke={STROKE} />
      <line x1="40" y1="96" x2="165" y2="96" stroke={STROKE} />
      <line x1="40" y1="82" x2="175" y2="82" stroke={STROKE} />
      <line x1="40" y1="68" x2="150" y2="68" stroke={STROKE} />
      <line x1="40" y1="54" x2="170" y2="54" stroke={STROKE} />
      {/* the next record arriving */}
      <line x1="40" y1="34" x2="120" y2="34" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M126 28 L136 34 L126 40" stroke={ACCENT} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CompoundDiagram() {
  return (
    <svg viewBox="0 0 220 140" fill="none" aria-hidden="true" style={{ width: "100%", maxWidth: 220 }}>
      {/* two generations of cells */}
      <rect x="30" y="25" width="60" height="42" stroke={STROKE} strokeWidth="1.5" />
      <rect x="130" y="73" width="60" height="42" stroke={STROKE} strokeWidth="1.5" />
      {/* output of the first routes into the second */}
      <path d="M90 46 H110 V94 H130" stroke={STROKE} strokeWidth="1.2" fill="none" />
      {/* and back into the next beginning */}
      <path d="M190 94 H205 V12 H60 V25" stroke={ACCENT} strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
      <path d="M54 19 L60 27 L66 19" stroke={ACCENT} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
