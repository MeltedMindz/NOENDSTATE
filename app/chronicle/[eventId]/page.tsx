import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader, VerificationBadge, ArrowLink } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { getChronicle, getChronicleEvent, getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getChronicle().map((e) => ({ eventId: e.eventId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = getChronicleEvent(eventId);
  if (!event) return {};
  return pageMetadata({
    title: `${event.eventId} — ${event.title}`,
    description: event.summary,
    path: `/chronicle/${event.eventId}`,
  });
}

export default async function ChronicleEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = getChronicleEvent(eventId);
  if (!event) notFound();

  const all = getChronicle();
  const superseded = event.supersedesEventId
    ? getChronicleEvent(event.supersedesEventId)
    : undefined;
  const supersededBy = all.find((e) => e.supersedesEventId === event.eventId);
  const project = event.projectId
    ? getProjects().find((p) => p.id === event.projectId)
    : undefined;

  return (
    <>
      <PageIntro
        serial={event.eventId}
        label={event.type.replace(/_/g, " ")}
        title={event.title}
        aside={<VerificationBadge status={event.verificationStatus} />}
      >
        <p>{event.summary}</p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial={`${event.eventId}.1`} label="Record detail" />
          {event.body ? (
            <div className="prose" style={{ marginBottom: "var(--space-7)" }}>
              <p>{event.body}</p>
            </div>
          ) : null}
          <div className="table-scroll">
            <table className="data-table" style={{ maxWidth: "48rem" }}>
              <tbody>
                <tr>
                  <td>Sequence</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{event.sequence}</td>
                </tr>
                <tr>
                  <td>Occurred</td>
                  <td>
                    <time dateTime={event.occurredAt}>{event.occurredAt}</time>
                  </td>
                </tr>
                <tr>
                  <td>Recorded</td>
                  <td>
                    <time dateTime={event.recordedAt}>{event.recordedAt}</time>
                  </td>
                </tr>
                <tr>
                  <td>Epoch</td>
                  <td>{event.epochId ?? "—"}</td>
                </tr>
                <tr>
                  <td>Project</td>
                  <td>
                    {event.projectId ? (
                      project ? (
                        <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                      ) : (
                        event.projectId
                      )
                    ) : (
                      "Studio-level event"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Sources</td>
                  <td>
                    {event.sourceUrls.length === 0
                      ? "—"
                      : event.sourceUrls.map((u) => (
                          <div key={u}>
                            <a href={u} rel="noopener noreferrer">{u}</a>
                          </div>
                        ))}
                  </td>
                </tr>
                <tr>
                  <td>Transactions</td>
                  <td>
                    {event.transactionHashes.length === 0
                      ? "None — this is not an onchain-verified record."
                      : event.transactionHashes.map((h) => (
                          <div key={h} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                            {h}
                          </div>
                        ))}
                  </td>
                </tr>
                <tr>
                  <td>Tags</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                    {event.tags.join(", ") || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {superseded ? (
            <p style={{ marginTop: "var(--space-5)" }}>
              This record supersedes{" "}
              <Link href={`/chronicle/${superseded.eventId}`}>
                {superseded.eventId} — {superseded.title}
              </Link>
              , which remains in the record.
            </p>
          ) : null}
          {supersededBy ? (
            <p style={{ marginTop: "var(--space-5)", color: "var(--signal-ember)" }}>
              This record has been superseded by{" "}
              <Link href={`/chronicle/${supersededBy.eventId}`}>
                {supersededBy.eventId} — {supersededBy.title}
              </Link>
              . It is preserved unmodified.
            </p>
          ) : null}

          <p style={{ marginTop: "var(--space-7)" }}>
            <ArrowLink href="/chronicle">Back to the full Chronicle</ArrowLink>
          </p>
        </div>
      </section>
    </>
  );
}
