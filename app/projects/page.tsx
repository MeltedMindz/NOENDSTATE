import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { EmptyState, RecordHeader, StatusPill, CTA } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "The NO END STATE project registry: every product the studio builds, through every state — including sunset and archived.",
  path: "/projects",
});

const LIFECYCLE = [
  ["research", "A thesis worth investigating. Nothing promised."],
  ["prototype", "Working code exists. It may never ship — that is the point of prototypes."],
  ["building", "Committed. In active development toward launch."],
  ["live", "Launched and operating. Its revenue policy, if any, is published on its page."],
  ["sunset", "Wound down. The page, record, and postmortem remain."],
  ["archived", "Preserved. Still part of the body of work."],
] as const;

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageIntro
        serial="02"
        label="Projects"
        title={<>Independent products. <em>One record.</em></>}
        aside={`${projects.length} registered`}
      >
        <p>
          Every project enters this registry with a stable ID and leaves a permanent
          trail. Status is reported honestly at every stage, and no project is ever
          deleted from the portfolio — including the ones that fail.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          {projects.length === 0 ? (
            <EmptyState
              title="No projects registered yet."
              action={<CTA href="/build">Watch the first build</CTA>}
            >
              <p>
                The studio was founded in August 2026, and the first build is the
                studio itself. When the first product enters the registry it will
                appear here with its ID, thesis, status, and Chronicle trail — and it
                will stay here permanently, whatever happens to it.
              </p>
            </EmptyState>
          ) : (
            <ul style={{ listStyle: "none", display: "grid", gap: "var(--space-5)" }}>
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-4)",
                      alignItems: "baseline",
                      border: "1px solid var(--rule-strong)",
                      padding: "var(--space-6)",
                      textDecoration: "none",
                    }}
                  >
                    <span className="mono-label">{p.id}</span>
                    <span className="title">{p.name}</span>
                    <span style={{ color: "var(--ash)", flexGrow: 1 }}>{p.oneLine}</span>
                    <StatusPill status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="02.1" label="The lifecycle" />
          <div className="table-scroll">
            <table className="data-table" style={{ maxWidth: "56rem" }}>
              <thead>
                <tr>
                  <th scope="col">State</th>
                  <th scope="col">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {LIFECYCLE.map(([state, meaning]) => (
                  <tr key={state}>
                    <td><StatusPill status={state} /></td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              Projects are added through a reviewed generator (
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                pnpm studio:new-project
              </code>
              ) that allocates the next stable ID, scaffolds the record, and drafts
              the Chronicle entry. Nothing is published without review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
