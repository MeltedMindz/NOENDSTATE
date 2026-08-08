import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader, StatusPill, ArrowLink } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { getBuilds } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Build",
  description:
    "The NO END STATE public laboratory: research, experiments, prototypes, and postmortems — including the abandoned approaches.",
  path: "/build",
});

export default function BuildPage() {
  const builds = getBuilds();

  return (
    <>
      <PageIntro
        serial="06"
        label="Build"
        title={<>The public <em>laboratory.</em></>}
        aside={`${builds.length} ${builds.length === 1 ? "entry" : "entries"}`}
      >
        <p>
          Work in progress, shown as work in progress. Entries here are research,
          experiments, prototypes, and postmortems with stable IDs and honest
          statuses — including <em>paused</em>, <em>failed</em>, and{" "}
          <em>archived</em>. Nothing is listed to look busy.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="06.1" label="Entries" />
          <ul style={{ listStyle: "none", display: "grid", gap: "var(--space-6)" }}>
            {builds.map((b) => (
              <li
                key={b.id}
                style={{
                  borderTop: "1px solid var(--rule-strong)",
                  paddingTop: "var(--space-5)",
                  display: "grid",
                  gap: "var(--space-4)",
                  maxWidth: "56rem",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "center" }}>
                  <span className="mono-label">{b.id}</span>
                  <StatusPill status={b.status} />
                  <span className="mono-label">
                    started {b.startedAt} / updated {b.updatedAt}
                  </span>
                </div>
                <h2 className="title">{b.title}</h2>
                <div className="prose">
                  <p>
                    <strong>Hypothesis.</strong> {b.hypothesis}
                  </p>
                  <p>
                    <strong>Current state.</strong> {b.currentState}
                  </p>
                  {b.body ? <p>{b.body}</p> : null}
                  {b.outcome ? (
                    <p>
                      <strong>Outcome.</strong> {b.outcome}
                    </p>
                  ) : null}
                </div>
                {b.repositoryUrls.length > 0 ? (
                  <p className="mono-label">
                    {b.repositoryUrls.map((u) => (
                      <a key={u} href={u} rel="noopener noreferrer" style={{ marginRight: "1em" }}>
                        {u.replace("https://", "")}
                      </a>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "var(--space-7)" }}>
            <ArrowLink href="/chronicle">Build outcomes land in the Chronicle</ArrowLink>
          </p>
        </div>
      </section>
    </>
  );
}
