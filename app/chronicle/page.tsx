import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ChronicleList } from "@/components/ChronicleList";
import { RecordHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { getChronicle } from "@/lib/content";
import { chronicleEventTypeSchema } from "@/lib/schemas/chronicle";

export const metadata: Metadata = pageMetadata({
  title: "Chronicle",
  description:
    "The append-only record of NO END STATE: every launch, decision, incident, milestone, and failure, in sequence.",
  path: "/chronicle",
});

export default async function ChroniclePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const all = getChronicle();
  const parsedType = chronicleEventTypeSchema.safeParse(type);
  const activeType = parsedType.success ? parsedType.data : null;
  const events = activeType ? all.filter((e) => e.type === activeType) : all;

  const typesInUse = Array.from(new Set(all.map((e) => e.type)));

  return (
    <>
      <PageIntro
        serial="04"
        label="Chronicle"
        title={<>The record only <em>grows.</em></>}
        aside={`${all.length} records / epoch 0`}
      >
        <p>
          Every significant event in the company&rsquo;s life is appended here with a
          sequence number that never repeats and an ID that never changes. Corrections
          create new events; they do not rewrite old ones. Superseded records stay
          visible. What the studio knows and when it knew it are kept separate.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader
            serial="04.1"
            label={activeType ? `Filtered: ${activeType.replace(/_/g, " ")}` : "All records"}
            aside={
              activeType ? <Link href="/chronicle">Clear filter</Link> : `${events.length} shown`
            }
          />
          <nav aria-label="Filter by event type" style={{ marginBottom: "var(--space-6)" }}>
            <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
              {typesInUse.map((t) => (
                <li key={t}>
                  <Link
                    href={t === activeType ? "/chronicle" : `/chronicle?type=${t}`}
                    className="status-pill"
                    data-tone={t === activeType ? "system" : undefined}
                    style={{
                      textDecoration: "none",
                      borderColor: t === activeType ? "var(--signal-cyan)" : undefined,
                      color: t === activeType ? "var(--signal-cyan)" : undefined,
                    }}
                  >
                    {t.replace(/_/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ChronicleList events={events} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="04.2" label="Integrity rules" />
          <div className="prose">
            <p>
              The Chronicle is append-only by construction: sequence numbers are
              unique and dense, published IDs are immutable, and deletions do not
              exist. When a record turns out to be wrong, a correction event is
              appended that references what it supersedes — and both remain public.
              Onchain verification is distinguished from studio disclosure on every
              record, and unknown facts are recorded as unknown rather than invented.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
