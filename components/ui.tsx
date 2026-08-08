import Link from "next/link";
import type { ReactNode } from "react";
import type { VerificationStatus } from "@/lib/schemas/chronicle";

/** Record header: section label + serial, ledger style. */
export function RecordHeader({
  serial,
  label,
  aside,
}: {
  serial: string;
  label: string;
  aside?: ReactNode;
}) {
  return (
    <div className="record-header">
      <p className="mono-label">
        {serial} / {label}
      </p>
      {aside ? <div className="mono-label">{aside}</div> : null}
    </div>
  );
}

export function CTA({
  href,
  children,
  primary = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  external?: boolean;
}) {
  const className = `cta${primary ? " cta--primary" : ""}`;
  if (external) {
    return (
      <a href={href} className={className} rel="noopener noreferrer" target="_blank">
        {children} <span className="arrow" aria-hidden="true">→</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="arrow-link">
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

const STATUS_TONE: Record<string, string> = {
  live: "live",
  building: "building",
  prototype: "building",
  research: "neutral",
  testing: "building",
  paused: "caution",
  shipped: "live",
  failed: "sunset",
  sunset: "sunset",
  archived: "neutral",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="status-pill" data-tone={STATUS_TONE[status] ?? "neutral"}>
      <span className="dot" aria-hidden="true" />
      {status}
    </span>
  );
}

const VERIFICATION_LABEL: Record<VerificationStatus, { label: string; tone: string }> = {
  onchain_verified: { label: "Onchain verified", tone: "verified" },
  studio_disclosed: { label: "Studio disclosed", tone: "disclosed" },
  external: { label: "External source", tone: "neutral" },
  estimate: { label: "Estimate", tone: "caution" },
};

/** Every fact on the site carries its epistemic status. */
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const v = VERIFICATION_LABEL[status];
  return (
    <span className="status-pill" data-tone={v.tone}>
      <span className="dot" aria-hidden="true" />
      {v.label}
    </span>
  );
}

export function DataSourceLabel({
  source,
  timestamp,
  verification,
}: {
  source: string;
  timestamp: string;
  verification: VerificationStatus;
}) {
  return (
    <p className="mono-label" style={{ display: "flex", flexWrap: "wrap", gap: "0.75em", alignItems: "center" }}>
      <VerificationBadge status={verification} />
      <span>source: {source}</span>
      <span>as of {timestamp}</span>
    </p>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--rule-strong)",
        paddingTop: "var(--space-5)",
        maxWidth: "44rem",
      }}
    >
      <h3 className="title" style={{ marginBottom: "var(--space-4)" }}>
        {title}
      </h3>
      <div className="prose">{children}</div>
      {action ? <div style={{ marginTop: "var(--space-5)" }}>{action}</div> : null}
    </div>
  );
}
