import Link from "next/link";
import { ChronicleList } from "@/components/ChronicleList";
import { ArrowLink } from "@/components/ui";
import { getBuilds, getChronicle, getProjects } from "@/lib/content";
import { featureFlags } from "@/config/economics";
import styles from "./home.module.css";

export default function HomePage() {
  const events = getChronicle();
  const projects = getProjects();
  const build = getBuilds().find((b) => b.id === "BUILD-000");
  const recordCount = String(events.length).padStart(4, "0");
  const stateZeroLocked = !featureFlags.stateZeroMintEnabled;

  const WORK = [
    {
      key: "BUILD-000",
      href: "/build",
      name: "Studio foundation",
      desc: "The site, content systems, and protocol prototypes — the studio's first build.",
      status: build?.status ?? "building",
      tone: "building",
    },
    {
      key: "SZ",
      href: "/state-zero",
      name: "State Zero",
      desc: "Founding-cohort architecture. Not a registered project; no tokens exist.",
      status: stateZeroLocked ? "locked" : "unlocked",
      tone: "caution",
    },
    {
      key: "NES",
      href: "/chronicle",
      name: "Chronicle",
      desc: "The append-only company record.",
      status: "live",
      tone: "live",
    },
    {
      key: "P",
      href: "/projects",
      name: "Project registry",
      desc: `${projects.length} registered ${projects.length === 1 ? "project" : "projects"}.`,
      status: "open",
      tone: "neutral",
    },
  ] as const;

  return (
    <>
      {/* ── 01 · introduction ─────────────────────────────────── */}
      <section className={styles.intro} aria-label="Introduction">
        <div className={`container ${styles.introInner}`}>
          <h1 className={styles.declaration}>
            Founded once.
            <br />
            Building indefinitely.
          </h1>
          <div className={styles.introSide}>
            <p className={styles.introSentence}>
              An independent product and protocol studio whose entire record —
              including failure — is permanent.
            </p>
            <p className={styles.introLinks}>
              <ArrowLink href="/studio">Enter the studio</ArrowLink>
              <ArrowLink href="/chronicle">Open the Chronicle</ArrowLink>
            </p>
          </div>
        </div>
        {/* live readout — the broken rule is the page's one open-cell marker */}
        <div className={styles.readout}>
          <span className={styles.readoutTick} aria-hidden="true" />
          <div className={`container ${styles.readoutInner}`}>
            <span>Independent product + protocol studio</span>
            <span>EST. 2026</span>
            <span>
              BUILD-000 / {(build?.status ?? "building").toUpperCase()}
            </span>
            <span>CHRONICLE / {recordCount} RECORDS</span>
            <span>STATE ZERO / {stateZeroLocked ? "LOCKED" : "OPEN"}</span>
          </div>
        </div>
      </section>

      {/* ── 02 · current work ─────────────────────────────────── */}
      <section className={styles.surface} aria-label="Current work">
        <div className="container">
          <div className="surface-head">
            <p className="mono-label">Current work</p>
          </div>
          <ul className="index">
            {WORK.map((w) => (
              <li key={w.key}>
                <Link href={w.href} className="index-row">
                  <span className="index-key">{w.key}</span>
                  <span className="index-name">{w.name}</span>
                  <span className="index-desc">{w.desc}</span>
                  <span className="index-side">
                    <span className="status-pill" data-tone={w.tone}>
                      <span className="dot" aria-hidden="true" />
                      {w.status}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 03 · chronicle ────────────────────────────────────── */}
      <section className={styles.surface} aria-label="Chronicle">
        <div className="container">
          <div className="surface-head">
            <p className="mono-label">Chronicle — latest records</p>
            <ArrowLink href="/chronicle">Full Chronicle</ArrowLink>
          </div>
          <ChronicleList events={events.slice(0, 4)} compact />
        </div>
      </section>

      {/* ── 04 · operating model ──────────────────────────────── */}
      <section className={styles.surface} aria-label="Operating model">
        <div className="container">
          <div className="surface-head">
            <p className="mono-label">Operating model</p>
          </div>
          <h2 className="display" style={{ maxWidth: "18ch" }}>
            The company has no final form.
          </h2>
          <ol className={styles.model}>
            <li>
              <span className="mono-label">01 / Build</span>
              <span>Create independent products that deserve to exist on their own.</span>
            </li>
            <li>
              <span className="mono-label">02 / Record</span>
              <span>Append every launch, decision, incident, and failure to the Chronicle.</span>
            </li>
            <li>
              <span className="mono-label">03 / Compound</span>
              <span>Route knowledge, infrastructure, and eligible economics into the next work.</span>
            </li>
          </ol>
        </div>
      </section>

      {/* ── 05 · state zero ───────────────────────────────────── */}
      <section className={styles.surface} aria-label="State Zero">
        <div className="container">
          <div className="surface-head">
            <p className="mono-label">State Zero</p>
          </div>
          <div className={styles.stateZero}>
            <p className={styles.stateZeroLine}>
              The fixed founding cohort — one artifact class that accumulates the
              company&rsquo;s entire history. Never recreated, never diluted.
            </p>
            <p className={styles.stateZeroStatus}>
              NO TOKENS EXIST · MINT NOT ACTIVE · TERMS NOT PUBLISHED ·
              ARCHITECTURE PREVIEW
            </p>
            <ArrowLink href="/state-zero">Explore State Zero</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
