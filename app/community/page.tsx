import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { community } from "@/config/community";

export const metadata: Metadata = pageMetadata({
  title: "Community",
  description:
    "Where NO END STATE happens in public: X for the build record, Telegram for conversation, Discord as headquarters, GitHub for the code.",
  path: "/community",
});

export default function CommunityPage() {
  const surfaces = Object.values(community);
  return (
    <>
      <PageIntro serial="07" label="Community" title={<>Built in public, <em>on the record.</em></>}>
        <p>
          The studio operates across a small set of public surfaces, each with a
          distinct job. Only live, verified links appear here — surfaces that
          aren&rsquo;t open yet say so honestly instead of pretending.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="07.1" label="Surfaces" />
          <ul style={{ listStyle: "none", display: "grid", gap: "var(--space-5)", maxWidth: "52rem" }}>
            {surfaces.map((s) => (
              <li
                key={s.name}
                style={{
                  border: "1px solid var(--rule-strong)",
                  padding: "var(--space-6)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-4)",
                  alignItems: "center",
                }}
              >
                <div style={{ flexGrow: 1, minWidth: "14rem" }}>
                  <h2 className="title">{s.name}</h2>
                  <p style={{ color: "var(--ash)", fontSize: "var(--text-small)" }}>{s.role}</p>
                </div>
                {s.url && s.status === "live" ? (
                  <a href={s.url} className="cta" rel="noopener noreferrer" target="_blank">
                    Open {s.name} <span className="arrow" aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className="status-pill">
                    <span className="dot" aria-hidden="true" />
                    {s.status === "opening_soon" ? "Opening soon" : "Not yet public"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="07.2" label="And the permanent one" />
          <div className="prose">
            <p>
              Social platforms are rented ground. The permanent surface is the{" "}
              <Link href="/chronicle">Chronicle</Link> — the append-only company
              record that outlives feeds, algorithms, and accounts. When the social
              surfaces open, announcements will land there second; the record comes
              first.
            </p>
            <p>
              <strong>Security note:</strong> the studio will never DM you first,
              never ask for a seed phrase, and never post contract addresses anywhere
              except this site and the read-only official-links channels of verified
              community spaces.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
