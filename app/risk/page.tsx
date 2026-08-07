import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Risk",
  description: "Risk disclosures for NO END STATE — draft pending legal review.",
  path: "/risk",
});

const RISKS: [string, string][] = [
  [
    "Nothing here is an investment",
    "State Zero is not equity, stock, ownership, or a claim on the studio. No revenue, appreciation, or profit is promised, implied, or guaranteed — by this site or by anyone speaking for the studio.",
  ],
  [
    "The economic model may never activate",
    "The intended revenue-routing architecture is inactive and gated behind legal review, audits, and published terms. Any or all of those gates may fail, change the model, or prevent it entirely.",
  ],
  [
    "Smart contracts carry risk",
    "The protocol prototypes are unaudited local code. If contracts are ever deployed, audits reduce but do not eliminate the risk of bugs, exploits, or permanent loss.",
  ],
  [
    "Crypto assets are volatile and can go to zero",
    "Anything tokenized can lose all value. Regulatory changes can restrict or prohibit features, transfers, or participation in some jurisdictions.",
  ],
  [
    "Projects will fail",
    "The studio's model explicitly includes failed projects. A project's sunset can mean the loss of anything that depended on it, and the studio publishes postmortems rather than making users whole.",
  ],
  [
    "Impersonation is the immediate risk today",
    "No social accounts are public and no contracts are deployed. Accounts, mints, or addresses claiming to be NO END STATE today are fraudulent. The only official surface is this site and the repository it links.",
  ],
];

export default function RiskPage() {
  return (
    <>
      <PageIntro
        serial="09.C"
        label="Risk"
        title={<>Read this <em>before anything else.</em></>}
        aside={
          <span className="status-pill" data-tone="caution">
            <span className="dot" aria-hidden="true" />
            Draft — pending legal review
          </span>
        }
      />
      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <div style={{ maxWidth: "52rem", display: "grid", gap: "var(--space-6)" }}>
            {RISKS.map(([title, body]) => (
              <div key={title} style={{ borderTop: "1px solid var(--rule)", paddingTop: "var(--space-4)" }}>
                <h2 className="title" style={{ marginBottom: "var(--space-2)" }}>{title}</h2>
                <p className="prose">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
