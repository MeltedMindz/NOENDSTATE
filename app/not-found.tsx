import Link from "next/link";
import { CTA } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="section section--flush" style={{ minHeight: "70dvh", display: "flex", alignItems: "center" }}>
      <div className="container">
        <div className="open-frame" style={{ padding: "clamp(2rem, 6vw, 4.5rem)", maxWidth: "44rem" }}>
          <span className="frame-tick" aria-hidden="true" />
          <p className="mono-label" style={{ marginBottom: "var(--space-4)" }}>
            404 / No such record
          </p>
          <h1 className="display" style={{ marginBottom: "var(--space-5)" }}>
            This state <em>does not exist.</em>
          </h1>
          <p className="prose" style={{ marginBottom: "var(--space-6)" }}>
            Nothing was ever recorded at this address — and unlike a deleted page,
            we can say that with confidence, because records here are never deleted.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <CTA href="/" primary>Return to the beginning</CTA>
            <CTA href="/chronicle">Open the Chronicle</CTA>
          </div>
          <p style={{ marginTop: "var(--space-5)" }}>
            <Link href="/status">Or check what is actually running</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
