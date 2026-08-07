import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { EmptyState, RecordHeader, VerificationBadge, CTA } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { treasuryAddresses, contracts } from "@/config/contracts";

export const metadata: Metadata = pageMetadata({
  title: "Treasury",
  description:
    "The NO END STATE treasury interface: verified onchain data, labeled disclosures, and no invented numbers. Currently not initialized.",
  path: "/treasury",
});

const CLASSIFICATIONS = [
  ["onchain_verified", "Read from a public chain and independently checkable. The only class rendered as fact."],
  ["studio_disclosed", "Asserted by the studio and sourced where possible. Labeled as a disclosure."],
  ["external", "Reported by a third party — for example, a price provider. Labeled with its origin."],
  ["estimate", "A model or approximation. Always labeled. Never presented as a verified fact."],
] as const;

export default function TreasuryPage() {
  return (
    <>
      <PageIntro
        serial="05"
        label="Treasury"
        title={<>Numbers you can <em>check.</em></>}
        aside="Not yet initialized"
      >
        <p>
          This page will show the studio&rsquo;s treasury the way the Chronicle shows
          its history: verified where verification is possible, labeled where it is
          not, and empty where nothing exists. It does not render charts of invented
          assets.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="05.1" label="Current status" />
          {treasuryAddresses.length === 0 ? (
            <EmptyState
              title="Treasury not yet initialized."
              action={<CTA href="/chronicle">Follow treasury events in the Chronicle</CTA>}
            >
              <p>
                No treasury addresses are configured. When they are, this page will
                display verified balances and flows read directly from the chain via
                public RPC, alongside the data methodology used to compute anything
                derived. Treasury inflows and outflows will also be appended to the
                Chronicle as events.
              </p>
            </EmptyState>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="05.2" label="Data classification" />
          <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable table">
            <table className="data-table" style={{ maxWidth: "60rem" }}>
              <thead>
                <tr>
                  <th scope="col">Class</th>
                  <th scope="col">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {CLASSIFICATIONS.map(([status, meaning]) => (
                  <tr key={status}>
                    <td>
                      <VerificationBadge status={status} />
                    </td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              Every monetary figure that ever appears here will identify its source,
              its timestamp, its currency, and its verification class. If a data
              source is unavailable or stale, the interface says so instead of
              showing the last number as if it were current.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="05.3" label="Contracts" />
          <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable table">
            <table className="data-table" style={{ maxWidth: "60rem" }}>
              <thead>
                <tr>
                  <th scope="col">Contract</th>
                  <th scope="col">Address</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.name}>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{c.name}</td>
                    <td>{c.address ?? "Not deployed"}</td>
                    <td>
                      <span className="status-pill" data-tone="building">
                        <span className="dot" aria-hidden="true" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              All six protocol contracts exist as local prototypes with tests. None
              are deployed to any chain. Deployment is gated behind audits, legal
              review, and the published gates in the repository — and when it happens,
              the verified addresses will appear here and nowhere else first.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
