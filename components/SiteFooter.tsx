import Link from "next/link";
import { Wordmark } from "@/components/Marks";
import { community } from "@/config/community";
import styles from "./SiteFooter.module.css";

const NAV = [
  { href: "/studio", name: "Studio" },
  { href: "/projects", name: "Projects" },
  { href: "/state-zero", name: "State Zero" },
  { href: "/chronicle", name: "Chronicle" },
  { href: "/treasury", name: "Treasury" },
  { href: "/build", name: "Build" },
  { href: "/community", name: "Community" },
  { href: "/manifesto", name: "Manifesto" },
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
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Wordmark />
            <p className={styles.line}>
              Founded once. Building indefinitely.
            </p>
          </div>
          <nav aria-label="Footer" className={styles.nav}>
            <ul className={styles.navCol}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
            <ul className={styles.navCol}>
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
            <ul className={styles.navCol}>
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 NO END STATE. A permanent record of an unfinished company.
          </p>
          <p className={styles.closing}>The work continues.</p>
        </div>
      </div>
    </footer>
  );
}
