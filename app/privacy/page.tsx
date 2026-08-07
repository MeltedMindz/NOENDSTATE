import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "NO END STATE privacy practices — draft pending legal review.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        serial="09.A"
        label="Privacy"
        title={<>Privacy <em>practices.</em></>}
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
              This is a working draft. It accurately describes what the site does
              today; it has not been reviewed by counsel and will be replaced by a
              reviewed policy before any feature that collects personal data
              launches.
            </p>
            <p>
              <strong>What this site collects today: nothing it doesn&rsquo;t need.</strong>{" "}
              The site is a static-first application served by Vercel. It sets no
              marketing cookies, runs no advertising trackers, and includes no
              third-party analytics scripts. Standard web-server request logs
              (IP address, user agent, requested path) are processed by our hosting
              provider, Vercel, to serve and secure the site.
            </p>
            <p>
              <strong>Forms.</strong> There are none. No email list exists. If a
              signup form is added, it will state what is collected, why, and under
              what consent — and this policy will be updated first.
            </p>
            <p>
              <strong>Wallets.</strong> The site includes no wallet connection.
              When wallet features ship, connecting will be opt-in, and no wallet
              address will be linked to personal identity by the studio.
            </p>
            <p>
              <strong>Contact.</strong> Until a studio contact address is published,
              privacy questions can be raised as issues on the public repository
              linked in the footer.
            </p>
            <p>Last updated: 2026-08-07.</p>
          </div>
        </div>
      </section>
    </>
  );
}
