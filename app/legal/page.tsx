import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Legal",
  description: "Legal status of NO END STATE: current drafts, open launch gates, and what is not yet active.",
  path: "/legal",
});

const GATES = [
  "Legal entity formation",
  "Counsel review of the State Zero model",
  "Securities-law analysis",
  "Consumer-protection review",
  "Tax analysis",
  "KYC / eligibility analysis",
  "Sanctions compliance review",
  "Privacy policy finalization",
  "Terms of service finalization",
  "Smart-contract audit",
  "Economic model approval",
  "Treasury custody arrangement",
  "Accounting arrangement",
  "Public communications review",
];

export default function LegalPage() {
  return (
    <>
      <PageIntro serial="09" label="Legal" title={<>Status: <em>drafts, gates open.</em></>}>
        <p>
          This page describes the legal state of the studio plainly. No legal entity
          has been formed, no counsel has completed a review, and no economic feature
          is active. The pages below are working drafts, labeled as drafts, and will
          be replaced by reviewed versions before any gated feature launches.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="09.1" label="Documents" />
          <ul style={{ listStyle: "none", display: "grid", gap: "var(--space-3)", maxWidth: "36rem" }}>
            <li><Link href="/privacy" className="arrow-link">Privacy (draft) <span className="arrow" aria-hidden="true">→</span></Link></li>
            <li><Link href="/terms" className="arrow-link">Terms (draft) <span className="arrow" aria-hidden="true">→</span></Link></li>
            <li><Link href="/risk" className="arrow-link">Risk disclosures (draft) <span className="arrow" aria-hidden="true">→</span></Link></li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="09.2" label="Launch gates" aside={`${GATES.length} open / 0 closed`} />
          <div className="prose" style={{ marginBottom: "var(--space-6)" }}>
            <p>
              Before minting, revenue claims, or any economic feature of State Zero
              can be activated, every gate below must be closed and the closure
              recorded in the Chronicle. All of them are currently open.
            </p>
          </div>
          <ol
            style={{
              listStyle: "none",
              maxWidth: "44rem",
              borderTop: "1px solid var(--rule-strong)",
            }}
          >
            {GATES.map((g, i) => (
              <li
                key={g}
                style={{
                  display: "flex",
                  gap: "var(--space-5)",
                  alignItems: "center",
                  padding: "var(--space-3) 0",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flexGrow: 1 }}>{g}</span>
                <span className="status-pill" data-tone="caution">
                  <span className="dot" aria-hidden="true" />
                  open
                </span>
              </li>
            ))}
          </ol>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              Nothing on this site is legal, tax, or investment advice. Minting is not
              currently active. Revenue claims are not currently active. Where this
              site describes the intended protocol, it describes a proposed technical
              architecture, not an active financial product.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
