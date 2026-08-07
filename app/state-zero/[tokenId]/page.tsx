import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader, ArrowLink } from "@/components/ui";
import { ChronicleList } from "@/components/ChronicleList";
import { pageMetadata } from "@/lib/site-metadata";
import { featureFlags } from "@/config/economics";
import { getFixtureToken, stateZeroFixtures } from "@/lib/fixtures/state-zero";
import { getChronicle } from "@/lib/content";
import { renderStateArt } from "@/lib/state-art";

/**
 * Token detail. Only renders in fixture mode (development). In production,
 * where no collection exists, every tokenId 404s — fixture pages are never
 * served or indexed as real assets.
 */

export function generateStaticParams() {
  if (!featureFlags.stateZeroFixturesEnabled) return [];
  return stateZeroFixtures.map((t) => ({ tokenId: String(t.tokenId) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}): Promise<Metadata> {
  const { tokenId } = await params;
  return {
    ...pageMetadata({
      title: `State Zero fixture ${tokenId}`,
      description: "Development fixture — not a real token.",
      path: `/state-zero/${tokenId}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function StateZeroTokenPage({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  if (!featureFlags.stateZeroFixturesEnabled) notFound();
  const { tokenId } = await params;
  const id = Number.parseInt(tokenId, 10);
  const token = Number.isFinite(id) ? getFixtureToken(id) : undefined;
  if (!token) notFound();

  const events = getChronicle();
  const serial = `SZ ${String(token.tokenId).padStart(4, "0")}`;

  return (
    <>
      <PageIntro
        serial={serial}
        label="Founding artifact — development fixture"
        title={<>Artifact <em>{serial}</em></>}
        aside={
          <span className="status-pill" data-tone="caution">
            <span className="dot" aria-hidden="true" />
            Development fixture
          </span>
        }
      >
        <p>
          This is a development fixture used to build the explorer before any
          collection exists. It is not a real token, has no holder, and represents
          nothing onchain.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gap: "var(--space-7)",
            gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
            alignItems: "start",
          }}
        >
          <div
            style={{ border: "1px solid var(--rule)", maxWidth: "30rem" }}
            dangerouslySetInnerHTML={{
              __html: renderStateArt({
                seed: token.seed,
                tokenId: token.tokenId,
                eventsWitnessed: events.length,
                eventTypes: events.map((e) => e.type),
              }),
            }}
          />
          <div>
            <RecordHeader serial={`${serial}.1`} label="Identity" />
            <div className="table-scroll">
              <table className="data-table">
                <tbody>
                  <tr>
                    <td>Token ID</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{token.tokenId}</td>
                  </tr>
                  <tr>
                    <td>Seed</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{token.seed}</td>
                  </tr>
                  <tr>
                    <td>Mint block</td>
                    <td>{token.mintBlock ?? "Not minted"}</td>
                  </tr>
                  <tr>
                    <td>Original holder</td>
                    <td>{token.originalHolder ?? "—"}</td>
                  </tr>
                  <tr>
                    <td>Current holder</td>
                    <td>{token.currentHolder ?? "—"}</td>
                  </tr>
                  <tr>
                    <td>Provenance entries</td>
                    <td>{token.provenanceCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "var(--space-6)" }}>
              <RecordHeader serial={`${serial}.2`} label="Economic ledger" />
              <p className="prose">
                Disabled. No distribution epochs exist, no allocations have accrued,
                and claims are not active. This section will only ever display data
                from approved, audited contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader
            serial={`${serial}.3`}
            label="Company history witnessed"
            aside={`${events.length} events`}
          />
          <ChronicleList events={events} compact />
          <p style={{ marginTop: "var(--space-6)" }}>
            <ArrowLink href="/state-zero">Back to State Zero</ArrowLink>
          </p>
        </div>
      </section>
    </>
  );
}
