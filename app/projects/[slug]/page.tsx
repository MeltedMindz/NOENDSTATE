import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { ChronicleList } from "@/components/ChronicleList";
import { RecordHeader, StatusPill, ArrowLink } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { getEventsForProject, getProject, getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: project.oneLine,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const events = getEventsForProject(project.id);

  return (
    <>
      <PageIntro
        serial={project.id}
        label={project.category}
        title={project.name}
        aside={<StatusPill status={project.status} />}
      >
        <p>{project.oneLine}</p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial={`${project.id}.1`} label="Thesis" />
          <div className="prose">
            <p>{project.thesis}</p>
            <p>{project.description}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial={`${project.id}.2`} label="Record" />
          <div className="table-scroll">
            <table className="data-table" style={{ maxWidth: "56rem" }}>
              <tbody>
                <tr>
                  <td>Started</td>
                  <td>{project.startedAt}</td>
                </tr>
                <tr>
                  <td>Launched</td>
                  <td>{project.launchedAt ?? "Not launched"}</td>
                </tr>
                {project.sunsetAt ? (
                  <tr>
                    <td>Sunset</td>
                    <td>{project.sunsetAt}</td>
                  </tr>
                ) : null}
                <tr>
                  <td>Chain</td>
                  <td>{project.chain ?? "—"}</td>
                </tr>
                <tr>
                  <td>Revenue policy</td>
                  <td>{project.revenuePolicy ?? "No revenue policy published."}</td>
                </tr>
                <tr>
                  <td>Contracts</td>
                  <td>
                    {project.contractAddresses.length === 0
                      ? "No contracts deployed."
                      : project.contractAddresses.map((c) => (
                          <div key={c.address} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                            {c.label}: {c.address} ({c.chain})
                          </div>
                        ))}
                  </td>
                </tr>
                <tr>
                  <td>Audits</td>
                  <td>
                    {project.audits.length === 0
                      ? "No audits published."
                      : project.audits.map((a) => (
                          <div key={a.url}>
                            <a href={a.url}>{a.auditor}</a> — {a.date}
                          </div>
                        ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {project.postmortemUrl ? (
            <p style={{ marginTop: "var(--space-5)" }}>
              <ArrowLink href={project.postmortemUrl}>Read the postmortem</ArrowLink>
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial={`${project.id}.3`} label="Chronicle" aside={`${events.length} events`} />
          <ChronicleList events={events} compact />
        </div>
      </section>
    </>
  );
}
