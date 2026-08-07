import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { CTA, ArrowLink, RecordHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { studio } from "@/config/studio";

export const metadata: Metadata = pageMetadata({
  title: "Studio",
  description:
    "NO END STATE is a persistent product and protocol studio. One company, many projects, a single append-only record.",
  path: "/studio",
});

const DISCIPLINES = [
  ["Onchain protocols", "Financial mechanisms and coordination systems that live on public chains."],
  ["AI-native products", "Software designed around models as a primary material, not a bolt-on."],
  ["Developer infrastructure", "Primitives and tooling other builders can depend on."],
  ["Consumer crypto", "Products that make onchain systems usable by people, not just wallets."],
  ["Experimental software", "Prototypes that earn their way to production — or into the archive."],
  ["Open-source primitives", "Work released for reuse, recorded like everything else."],
] as const;

export default function StudioPage() {
  return (
    <>
      <PageIntro serial="01" label="Studio" title={<>The persistent <em>company.</em></>}>
        <p>
          {studio.name} is an internet-native, onchain product and protocol studio.
          It was founded once, on {studio.foundedAt}, and it is designed to keep
          building — without a final form, an exit shape, or an end state.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="01.1" label="How it works" />
          <div className="prose">
            <p>
              The studio is the permanent parent entity. Projects are created beneath
              it as independent products with their own names, code, economics, and
              users. What binds them is the record: every project enters the registry
              with a stable ID, publishes its status honestly through its whole life,
              and writes its launches, incidents, and outcomes into the shared
              Chronicle.
            </p>
            <p>
              Success compounds. Revenue from work that succeeds can finance future
              work under policies that are published per project — none are active
              today. Knowledge compounds regardless: architecture, tooling,
              postmortems, and operating experience carry forward even when a product
              does not.
            </p>
            <p>
              Failure is kept. A sunset project keeps its page, its Chronicle trail,
              and its postmortem. The archive is not a graveyard to hide — it is part
              of the studio&rsquo;s proof of work.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="01.2" label="What the studio builds" />
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fill, minmax(19rem, 1fr))",
            }}
          >
            {DISCIPLINES.map(([name, desc]) => (
              <Reveal key={name}>
                <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "var(--space-4)" }}>
                  <h2 className="title" style={{ marginBottom: "var(--space-2)" }}>
                    {name}
                  </h2>
                  <p style={{ color: "var(--ash)", fontSize: "var(--text-small)" }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="01.3" label="What the studio is not" />
          <div className="prose">
            <p>
              NO END STATE is not an NFT collection with a roadmap, not a DAO, not a
              token, not a launchpad, and not an investment club. State Zero is a
              founding cohort and a record — it is not equity, stock, or a promise of
              profit. Where the intended economic architecture is described on this
              site, it is described as architecture: designed, gated, and inactive
              until the launch gates in the public record are closed.
            </p>
          </div>
          <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <CTA href="/manifesto" primary>Read the manifesto</CTA>
            <CTA href="/projects">See the project registry</CTA>
          </div>
          <p style={{ marginTop: "var(--space-6)" }}>
            <ArrowLink href="/chronicle">Or start from the record itself</ArrowLink>
          </p>
        </div>
      </section>
    </>
  );
}
