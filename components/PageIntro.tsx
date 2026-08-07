import type { ReactNode } from "react";

/**
 * Standard page opening: ledger-style record header, display title,
 * optional intro prose. Every route opens as an entry in the record.
 */
export function PageIntro({
  serial,
  label,
  title,
  aside,
  children,
}: {
  serial: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container" style={{ paddingTop: "var(--space-8)" }}>
      <div className="record-header">
        <p className="mono-label">
          {serial} / {label}
        </p>
        {aside ? <div className="mono-label">{aside}</div> : null}
      </div>
      <h1 className="display" style={{ maxWidth: "22ch" }}>
        {title}
      </h1>
      {children ? (
        <div className="prose" style={{ marginTop: "var(--space-5)" }}>
          {children}
        </div>
      ) : null}
    </header>
  );
}
