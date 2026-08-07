import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { CTA } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Manifesto",
  description:
    "Why NO END STATE exists: companies are remembered in fragments. This one keeps the whole record.",
  path: "/manifesto",
});

const PRINCIPLES = [
  "Build things that can stand alone.",
  "Preserve the record.",
  "Publish the failure.",
  "Separate facts from claims.",
  "Treat security as product work.",
  "Let capital compound.",
  "Do not dilute the beginning.",
  "Never fake traction.",
  "Never erase the past.",
  "Leave room for the next state.",
];

export default function ManifestoPage() {
  return (
    <>
      <PageIntro serial="00" label="Manifesto" title={<>Against <em>disappearing.</em></>} />

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <div className="prose" style={{ fontSize: "1.1875rem" }}>
            <p>
              Companies are usually remembered through fragments. Products disappear
              when their servers stop. Links break. Teams move on and take the context
              with them. Failures get quietly deleted, and what remains is rewritten
              by marketing until the history says whatever the present needs it to
              say.
            </p>
            <p>
              NO END STATE is built against that. The studio&rsquo;s complete body of
              work — what shipped, what broke, what was decided, what failed — is
              preserved as a first-class product. The company is founded once and
              builds indefinitely. It is never presented as finished, because it is
              designed not to finish.
            </p>
            <p>
              State Zero marks the beginning: one founding cohort, never recreated,
              never diluted. Every project after it contributes knowledge,
              infrastructure, and history to the same record. Failure does not exit
              the archive; it becomes part of the proof that the work was real.
            </p>
            <p>
              This is not nostalgia for permanence. It is an operating discipline:
              when the record cannot be rewritten, the incentives change. You ship
              what you can stand behind, you label estimates as estimates, and you
              let the accumulated record — not the pitch — make the argument.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="record-header">
            <p className="mono-label">Principles</p>
          </div>
          <ol
            style={{
              listStyle: "none",
              display: "grid",
              gap: 0,
              maxWidth: "48rem",
              borderTop: "1px solid var(--rule-strong)",
            }}
          >
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p}>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-5)",
                    alignItems: "baseline",
                    padding: "var(--space-4) 0",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display" style={{ fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)" }}>
                    {p}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
          <div style={{ marginTop: "var(--space-7)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <CTA href="/chronicle" primary>Enter the Chronicle</CTA>
            <CTA href="/studio">Explore the studio</CTA>
          </div>
        </div>
      </section>
    </>
  );
}
