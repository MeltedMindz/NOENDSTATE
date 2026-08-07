import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "NO END STATE terms of use — draft pending legal review.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageIntro
        serial="09.B"
        label="Terms"
        title={<>Terms of <em>use.</em></>}
        aside={
          <span className="status-pill" data-tone="caution">
            <span className="dot" aria-hidden="true" />
            Draft — pending legal review
          </span>
        }
      />
      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <div className="prose">
            <p>
              This is a working draft, written plainly, pending review by counsel. It
              will be replaced by reviewed terms before any transactional feature
              launches.
            </p>
            <p>
              <strong>The site is informational.</strong> It documents a studio, its
              work, and its record. Nothing on it is an offer to sell any asset, an
              invitation to invest, or legal, tax, or financial advice.
            </p>
            <p>
              <strong>Nothing is for sale here today.</strong> Minting is not active,
              revenue claims are not active, and no contract addresses have been
              published. Any third party representing otherwise is not affiliated
              with the studio.
            </p>
            <p>
              <strong>Accuracy.</strong> The studio labels its information by
              verification status and preserves corrections in the Chronicle rather
              than silently editing history. Content is provided as-is; the studio
              does not warrant that any page is free of errors, and superseded
              records remain published by design.
            </p>
            <p>
              <strong>Open source.</strong> Code in the public repository is governed
              by the license in that repository, not by this page.
            </p>
            <p>
              <strong>Final participation terms have not been published.</strong>{" "}
              When they are, they will appear as reviewed documents recorded in the
              Chronicle — not as silent edits to this draft.
            </p>
            <p>Last updated: 2026-08-07.</p>
          </div>
        </div>
      </section>
    </>
  );
}
