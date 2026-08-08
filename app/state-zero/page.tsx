import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { StateField } from "@/components/StateField";
import { EmptyState, RecordHeader, CTA } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { featureFlags } from "@/config/economics";
import { stateZeroFixtures } from "@/lib/fixtures/state-zero";
import { getChronicle } from "@/lib/content";
import { renderStateArt } from "@/lib/state-art";

export const metadata: Metadata = pageMetadata({
  title: "State Zero",
  description:
    "STATE ZERO is the fixed founding cohort of NO END STATE — a living founding artifact that accumulates the company's history. Minting is not currently active.",
  path: "/state-zero",
});

const LAYERS = [
  [
    "Company history",
    "Every artifact witnesses the same Chronicle: projects, launches, incidents, recoveries, epochs. This layer never resets and can never be bought separately — it accrues to the whole cohort.",
  ],
  [
    "Token provenance",
    "Transfers, custody periods, and token-specific marks. This layer travels with the token: buy an artifact and you hold its provenance, like acquiring a document with its history of ownership.",
  ],
  [
    "Holder participation",
    "Votes, contributions, testing, grants. This layer is attached to the wallet that did the participating. It does not become the buyer's personal history after a transfer.",
  ],
] as const;

export default function StateZeroPage() {
  const events = getChronicle();
  const fixturesOn = featureFlags.stateZeroFixturesEnabled;

  return (
    <>
      <PageIntro
        serial="03"
        label="State Zero"
        title={<>A founding cohort that <em>keeps accumulating.</em></>}
        aside="Mint not active"
      >
        <p>
          STATE ZERO is the studio&rsquo;s fixed founding cohort. It funded the
          beginning; everything after it — every project, launch, failure, recovery,
          and milestone — becomes part of its permanent record. It is designed as a
          living founding artifact, not a static collectible: its value language is
          accumulated provenance, not conventional rarity.
        </p>
      </PageIntro>

      {/* The generative state system lives here by design — the accumulating
          field is State Zero's focal object, not homepage decoration. */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          height: "20rem",
          marginTop: "var(--space-8)",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
          overflow: "hidden",
        }}
      >
        <StateField />
      </div>

      <section className="section section--flush">
        <div className="container">
          <RecordHeader serial="03.1" label="What it is / what it is not" />
          <div className="prose">
            <p>
              It is a founding membership, a permanent provenance layer, and a witness
              to the company&rsquo;s history. It is <strong>not</strong> equity, stock,
              company ownership, guaranteed income, yield, or a promise of profit.
            </p>
            <p>
              There will never be a State Zero Season 2, a second genesis collection,
              a replacement founder pass, or a successor marketed as equivalent. The
              founding cohort is not recreated and not silently diluted.
            </p>
            <p>
              Final participation terms — supply, price, chain, and any economic
              features — have not been published. Minting is not currently active.
              Revenue claims are not currently active. The architecture described
              below is designed and gated, not live.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="03.2" label="Three layers of history" />
          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
              gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            }}
          >
            {LAYERS.map(([name, desc], i) => (
              <Reveal key={name}>
                <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "var(--space-4)" }}>
                  <p className="mono-label" style={{ marginBottom: "var(--space-2)" }}>
                    Layer {i + 1}
                  </p>
                  <h2 className="title" style={{ marginBottom: "var(--space-3)" }}>{name}</h2>
                  <p style={{ color: "var(--bone-dim)", fontSize: "var(--text-small)" }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              On transfer: company history stays with every artifact, token provenance
              stays with the token, and a seller&rsquo;s participation history remains
              theirs. Where future distributions are concerned, the intended rule is
              checkpoint-based — allocations accrued before a transfer remain with the
              holder entitled at the time; future allocations follow future ownership.
              That rule is documented as architecture, not as published terms.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader
            serial="03.3"
            label="Explorer"
            aside={fixturesOn ? "Development fixtures" : "Collection not created"}
          />
          {fixturesOn ? (
            <>
              <p
                className="status-pill"
                data-tone="caution"
                style={{ marginBottom: "var(--space-6)" }}
              >
                <span className="dot" aria-hidden="true" />
                Development fixtures — not real tokens, not production data
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "grid",
                  gap: "var(--space-5)",
                  gridTemplateColumns: "repeat(auto-fill, minmax(13rem, 1fr))",
                }}
              >
                {stateZeroFixtures.map((t) => (
                  <li key={t.tokenId}>
                    <Link
                      href={`/state-zero/${t.tokenId}`}
                      style={{ textDecoration: "none", display: "block" }}
                      aria-label={`Fixture artifact SZ ${t.tokenId}`}
                    >
                      <div
                        style={{ border: "1px solid var(--rule)" }}
                        dangerouslySetInnerHTML={{
                          __html: renderStateArt({
                            seed: t.seed,
                            tokenId: t.tokenId,
                            eventsWitnessed: events.length,
                            eventTypes: events.map((e) => e.type),
                          }),
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="No tokens exist."
              action={<CTA href="/chronicle">Watch the record instead</CTA>}
            >
              <p>
                The State Zero collection has not been created, and no contract has
                been deployed. When the founding cohort exists, every artifact will be
                explorable here — its seed, its provenance, and the company history it
                has witnessed. Until then, this page shows exactly what exists:
                nothing.
              </p>
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="03.4" label="Economic gates" />
          <div className="prose">
            <p>
              The intended long-term model routes a defined portion of eligible
              project revenue into a distribution system for State Zero holders,
              governed by published contract rules and recorded in the Chronicle.
              Every gate on that model — entity formation, counsel review, securities
              analysis, audits, custody, published terms — is currently open, and the
              features are disabled in code as well as in policy.
            </p>
          </div>
          <p style={{ marginTop: "var(--space-5)" }}>
            <Link href="/legal" className="arrow-link">
              Read the launch gates <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
