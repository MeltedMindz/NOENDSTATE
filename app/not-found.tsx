import Link from "next/link";
import { ArrowLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section
      className="section section--flush"
      style={{ minHeight: "70dvh", display: "flex", alignItems: "center" }}
    >
      <div className="container">
        <p className="mono-label" style={{ marginBottom: "var(--space-4)" }}>
          404 / No such record
        </p>
        <h1 className="display" style={{ maxWidth: "16ch", marginBottom: "var(--space-5)" }}>
          This state does not exist.
        </h1>
        <p className="prose" style={{ marginBottom: "var(--space-6)" }}>
          Nothing was ever recorded at this address — and unlike a deleted page,
          we can say that with confidence, because records here are never deleted.
        </p>
        <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <ArrowLink href="/">Return to the beginning</ArrowLink>
          <ArrowLink href="/chronicle">Open the Chronicle</ArrowLink>
        </div>
        <p style={{ marginTop: "var(--space-5)" }}>
          <Link href="/status">Or check what is actually running</Link>
        </p>
      </div>
    </section>
  );
}
