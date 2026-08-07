"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Scroll reveal wrapper. Reveals once; inert under reduced motion (CSS). */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
