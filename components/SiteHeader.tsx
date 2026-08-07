"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/Marks";
import styles from "./SiteHeader.module.css";

const MENU_ITEMS = [
  { index: "01", href: "/studio", name: "Studio", role: "The persistent company" },
  { index: "02", href: "/projects", name: "Projects", role: "Independent products, one record" },
  { index: "03", href: "/state-zero", name: "State Zero", role: "The founding cohort" },
  { index: "04", href: "/chronicle", name: "Chronicle", role: "The append-only record" },
  { index: "05", href: "/treasury", name: "Treasury", role: "Capital, verified or labeled" },
  { index: "06", href: "/build", name: "Build", role: "The public laboratory" },
  { index: "07", href: "/community", name: "Community", role: "The public surfaces" },
];

const MENU_SECONDARY = [
  { href: "/manifesto", name: "Manifesto" },
  { href: "/faq", name: "FAQ" },
  { href: "/status", name: "Status" },
  { href: "/legal", name: "Legal" },
];

export function SiteHeader({ latestEventId }: { latestEventId: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Body scroll lock + Escape + focus trap
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menu = menuRef.current;
    const focusables = menu?.querySelectorAll<HTMLElement>("a[href], button");
    focusables?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.wordmarkLink} aria-label="NO END STATE — home">
            <Wordmark compact />
          </Link>
          <nav aria-label="Primary" className={styles.inlineNav}>
            <Link href="/studio">Studio</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/state-zero">State Zero</Link>
            <Link href="/chronicle">Chronicle</Link>
          </nav>
          <div className={styles.headerRight}>
            <span className={styles.recMarker} aria-label={`Latest Chronicle record ${latestEventId}`}>
              REC {latestEventId}
            </span>
            <button
              ref={toggleRef}
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="fullscreen-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Index"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="fullscreen-menu"
        ref={menuRef}
        className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
        hidden={!open}
      >
        <div className={`container ${styles.menuInner}`}>
          <p className="mono-label">Site index — an unfinished company</p>
          <nav aria-label="Site index">
            <ul className={styles.menuList}>
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.menuRow} onClick={() => setOpen(false)}>
                    <span className={styles.menuIndex}>{item.index}</span>
                    <span className={styles.menuName}>{item.name}</span>
                    <span className={styles.menuRole}>{item.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={styles.menuSecondary}>
              {MENU_SECONDARY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.menuFoot}>
            Founded once. Building indefinitely.
          </p>
        </div>
      </div>
    </>
  );
}
