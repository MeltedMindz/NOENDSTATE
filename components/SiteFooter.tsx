import Link from "next/link";
import { Wordmark } from "@/components/Marks";
import { community } from "@/config/community";
import { buildInfo } from "@/lib/build-info";
import styles from "./SiteFooter.module.css";

const NAV = [
  { href: "/studio", name: "Studio" },
  { href: "/projects", name: "Projects" },
  { href: "/state-zero", name: "State Zero" },
  { href: "/chronicle", name: "Chronicle" },
  { href: "/treasury", name: "Treasury" },
  { href: "/build", name: "Build" },
  { href: "/manifesto", name: "Manifesto" },
  { href: "/faq", name: "FAQ" },
];

const MACHINE = [
  { href: "/api/chronicle", name: "Chronicle API" },
  { href: "/api/projects", name: "Projects API" },
  { href: "/api/status", name: "Status API" },
  { href: "/feed.xml", name: "RSS" },
  { href: "/llms.txt", name: "llms.txt" },
];

const LEGAL = [
  { href: "/legal", name: "Legal" },
  { href: "/privacy", name: "Privacy" },
  { href: "/terms", name: "Terms" },
  { href: "/risk", name: "Risk" },
  { href: "/status", name: "Status" },
];

export function SiteFooter() {
  const surfaces = Object.values(community);
  const commit = buildInfo.commit ? buildInfo.commit.slice(0, 7) : "local";
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Wordmark />
            <p className={styles.line}>A permanent record of an unfinished company.</p>
            <p className={styles.inquire}>
              Inquire — no contact address is published yet. Open an issue on GitHub.
            </p>
          </div>
          <nav aria-label="Footer" className={styles.nav}>
            <ul className={styles.navCol} aria-label="Site">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
            <ul className={styles.navCol} aria-label="Machine-readable">
              {MACHINE.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
            <ul className={styles.navCol} aria-label="Community">
              {surfaces.map((s) =>
                s.url && s.status === "live" ? (
                  <li key={s.name}>
                    <a href={s.url} rel="noopener noreferrer" target="_blank">
                      {s.name}
                    </a>
                  </li>
                ) : (
                  <li key={s.name} className={styles.pending}>
                    {s.name}
                    <span className={styles.pendingNote}>
                      {s.status === "opening_soon" ? "opening soon" : "not yet public"}
                    </span>
                  </li>
                )
              )}
            </ul>
            <ul className={styles.navCol} aria-label="Legal">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2026 NO END STATE</p>
          <p className={styles.commit}>
            DEPLOY {commit} / {buildInfo.environment.toUpperCase()}
          </p>
          <p className={styles.closing}>The work continues.</p>
        </div>
      </div>
    </footer>
  );
}
