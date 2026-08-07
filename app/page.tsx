import Link from "next/link";
import { StateField } from "@/components/StateField";
import { Reveal } from "@/components/Reveal";
import { CTA, ArrowLink, RecordHeader, VerificationBadge } from "@/components/ui";
import { ChronicleList } from "@/components/ChronicleList";
import { BuildDiagram, RecordDiagram, CompoundDiagram } from "@/components/PrincipleDiagrams";
import { getBuilds, getChronicle, getProjects } from "@/lib/content";
import { community } from "@/config/community";
import styles from "./home.module.css";

export default function HomePage() {
  const events = getChronicle();
  const projects = getProjects();
  const builds = getBuilds();

  return (
    <>
      {/* ── 01 HERO ─────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Introduction">
        <StateField />
        <div className={`container ${styles.heroInner}`}>
          <div className={`open-frame ${styles.heroFrame}`}>
            <span className="frame-tick" aria-hidden="true" />
            <p className={styles.heroEyebrow}>
              An internet-native studio building protocols, products, and experiments
            </p>
            <h1 className={styles.heroTitle}>
              Founded once.
              <br />
              <em>Building indefinitely.</em>
            </h1>
            <p className={styles.heroSub}>
              NO END STATE is a persistent product and protocol studio.{" "}
              <span className={styles.heroSubAccent}>
                STATE ZERO preserves the record of everything that follows.
              </span>
            </p>
            <div className={styles.heroActions}>
              <CTA href="/studio" primary>
                Explore the studio
              </CTA>
              <CTA href="/chronicle">Enter the Chronicle</CTA>
            </div>
          </div>
          <p className={styles.heroFoot}>
            <span>A permanent record of an unfinished company</span>
            <span aria-hidden="true">SCROLL ↓</span>
          </p>
        </div>
      </section>

      {/* ── 02 THESIS ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader serial="02" label="Thesis" />
          <div className={styles.split}>
            <Reveal>
              <h2 className="display">
                The company has <em>no final form.</em>
              </h2>
            </Reveal>
            <Reveal>
              <div className="prose">
                <p>
                  Most companies are built toward an exit, an acquisition, a final shape.
                  NO END STATE is built the other way: the studio is the permanent object,
                  and everything it makes is a chapter inside it.
                </p>
                <p>
                  Projects are created beneath the studio as independent products.
                  Successes compound into the next generation of work. Failures stay
                  visible in the archive — recorded, dated, and kept. The company&rsquo;s
                  history is treated as a product in its own right.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 OPERATING PRINCIPLES ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader serial="03" label="Operating principles" />
          <div className={styles.principles}>
            <Reveal className={styles.principle}>
              <BuildDiagram />
              <h3 className="title">Build.</h3>
              <p className="prose">
                Create independent products that deserve to exist on their own —
                protocols, financial mechanisms, AI-native tools, infrastructure.
              </p>
            </Reveal>
            <Reveal className={styles.principle}>
              <RecordDiagram />
              <h3 className="title">Record.</h3>
              <p className="prose">
                Preserve launches, decisions, incidents, milestones, and failures in
                an append-only Chronicle. Corrections add records; they never erase them.
              </p>
            </Reveal>
            <Reveal className={styles.principle}>
              <CompoundDiagram />
              <h3 className="title">Compound.</h3>
              <p className="prose">
                Route knowledge, infrastructure, reputation, and eligible economics
                into the next generation of work instead of restarting from zero.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 PROJECTS ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader
            serial="04"
            label="Projects"
            aside={<Link href="/projects">Full registry →</Link>}
          />
          {projects.length === 0 ? (
            <div className={styles.split}>
              <Reveal>
                <h2 className="display">
                  The registry is open.
                  <br />
                  <em>Nothing is in it yet.</em>
                </h2>
              </Reveal>
              <Reveal>
                <div className="prose">
                  <p>
                    That is not a placeholder — it is the honest state of a company that
                    was founded this year. Every future project enters through the same
                    door: a stable ID, a thesis, a published status, and a Chronicle
                    trail from first commit to launch, sunset, or postmortem.
                  </p>
                  <p style={{ marginTop: "1em" }}>
                    Projects move through six states: research, prototype, building,
                    live, sunset, archived. A sunset project keeps its page, its record,
                    and its postmortem. Nothing is deleted from the portfolio.
                  </p>
                  <div style={{ marginTop: "var(--space-5)" }}>
                    <ArrowLink href="/projects">How projects enter the registry</ArrowLink>
                  </div>
                </div>
              </Reveal>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── 05 STATE ZERO ───────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader serial="05" label="State Zero" />
          <div className={styles.split}>
            <Reveal>
              <h2 className="display">
                One founding cohort.
                <br />
                <em>Everything that follows.</em>
              </h2>
            </Reveal>
            <Reveal>
              <div className="prose">
                <p>
                  STATE ZERO is the studio&rsquo;s fixed founding cohort — a permanent
                  founding artifact, not a static collectible. Each artifact witnesses
                  the same company history, carries its own transfer provenance, and
                  accumulates the record of every project, launch, incident, and
                  recovery that comes after it.
                </p>
                <p>
                  There will be no second founding collection, no successor pass, no
                  silent dilution of the beginning. Economic features are designed but
                  not active; minting is not currently open, and final participation
                  terms have not been published.
                </p>
                <div style={{ marginTop: "var(--space-5)" }}>
                  <CTA href="/state-zero">Explore State Zero</CTA>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 06 CHRONICLE ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader
            serial="06"
            label="Chronicle"
            aside={`${events.length} records`}
          />
          <Reveal>
            <h2 className="display" style={{ marginBottom: "var(--space-6)" }}>
              Every event, <em>appended.</em>
            </h2>
          </Reveal>
          <Reveal>
            <ChronicleList events={events.slice(0, 4)} compact />
          </Reveal>
          <div style={{ marginTop: "var(--space-6)" }}>
            <CTA href="/chronicle">Open the Chronicle</CTA>
          </div>
        </div>
      </section>

      {/* ── 07 TRANSPARENCY ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader serial="07" label="Transparency" />
          <div className={styles.split}>
            <Reveal>
              <h2 className="display">
                Facts carry their <em>own labels.</em>
              </h2>
            </Reveal>
            <Reveal>
              <div className="prose">
                <p>
                  Everything the studio publishes is classified before it is displayed.
                  Onchain data is verified against a public chain. Studio disclosures
                  are asserted and sourced. External data names its origin. Estimates
                  are marked as estimates — and never dressed up as verified facts.
                </p>
                <ul className={styles.badgeList}>
                  <li><VerificationBadge status="onchain_verified" /></li>
                  <li><VerificationBadge status="studio_disclosed" /></li>
                  <li><VerificationBadge status="external" /></li>
                  <li><VerificationBadge status="estimate" /></li>
                </ul>
                <div style={{ marginTop: "var(--space-5)" }}>
                  <ArrowLink href="/treasury">See the treasury methodology</ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 08 BUILD IN PUBLIC ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader
            serial="08"
            label="Build in public"
            aside={<Link href="/build">The laboratory →</Link>}
          />
          {builds.map((b) => (
            <Reveal key={b.id}>
              <Link href="/build" className={styles.buildCard}>
                <span className="mono-label">{b.id}</span>
                <span className={styles.buildTitle}>{b.title}</span>
                <span className={styles.buildState}>{b.currentState}</span>
                <span className="status-pill" data-tone="building">
                  <span className="dot" aria-hidden="true" />
                  {b.status}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 09 COMMUNITY ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <RecordHeader serial="09" label="Community" />
          <div className={styles.surfaces}>
            {Object.values(community).map((s) => (
              <Reveal key={s.name} className={styles.surface}>
                <h3 className="title">{s.name}</h3>
                <p className={styles.surfaceRole}>{s.role}</p>
                {s.url && s.status === "live" ? (
                  <a href={s.url} className="arrow-link" rel="noopener noreferrer" target="_blank">
                    Open <span className="arrow" aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className="status-pill">
                    <span className="dot" aria-hidden="true" />
                    {s.status === "opening_soon" ? "Opening soon" : "Not yet public"}
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 FINAL ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className={`open-frame ${styles.finalFrame}`}>
              <span className="frame-tick" aria-hidden="true" />
              <h2 className={styles.finalTitle}>
                This is State Zero.
                <br />
                <em>Everything else comes after.</em>
              </h2>
              <div className={styles.finalActions}>
                <CTA href="/manifesto" primary>
                  Read the manifesto
                </CTA>
                <CTA href="/chronicle">Enter the Chronicle</CTA>
                <CTA href="/build">Follow the build</CTA>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
