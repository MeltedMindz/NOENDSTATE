import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { RecordHeader } from "@/components/ui";
import { pageMetadata } from "@/lib/site-metadata";
import { buildInfo } from "@/lib/build-info";
import { featureFlags } from "@/config/economics";
import { getBuilds, getChronicle } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Status",
  description: "Honest system status for NO END STATE: what is deployed, what is operating, and what does not exist yet.",
  path: "/status",
});

export default function StatusPage() {
  const chronicle = getChronicle();
  const builds = getBuilds();
  const lastContentUpdate = [
    ...chronicle.map((e) => e.recordedAt),
    ...builds.map((b) => b.updatedAt),
  ]
    .sort()
    .at(-1);

  const SYSTEMS: [string, string, "live" | "static" | "disabled" | "absent", string][] = [
    ["Website", "This application", "live", "Serving — you are reading it."],
    ["Project registry", "Typed content system", "static", "Operating. Registry is honestly empty."],
    ["Chronicle", "Append-only record", "static", `Operating. ${chronicle.length} public records.`],
    ["State Zero explorer", "Founding artifact interface", "static", "Operating in architecture-preview mode. No tokens exist."],
    ["Treasury data", "Onchain reads", "absent", "Not initialized — no addresses configured."],
    ["Wallet integration", "Wallet connect", "disabled", "Disabled by feature flag."],
    ["Mint system", "State Zero minting", "disabled", "Disabled. Legal gates open."],
    ["Claim system", "Revenue claims", "disabled", "Disabled. Legal gates open."],
    ["Community links", "Discord / Telegram / X", "absent", "Not yet public."],
    ["Public API", "/api/projects, /api/chronicle, /api/status", "live", "Serving JSON from the same validated content."],
  ];

  const TONE: Record<string, string> = {
    live: "live",
    static: "live",
    disabled: "caution",
    absent: "neutral",
  };

  return (
    <>
      <PageIntro serial="10" label="Status" title={<>What is actually <em>running.</em></>}>
        <p>
          There is no external monitoring provider yet, so this page does not show
          uptime percentages it cannot back. It shows what this deployment knows
          about itself: what is serving, what is disabled, and what does not exist.
        </p>
      </PageIntro>

      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <RecordHeader serial="10.1" label="Systems" />
          <div className="table-scroll">
            <table className="data-table" style={{ maxWidth: "64rem" }}>
              <thead>
                <tr>
                  <th scope="col">System</th>
                  <th scope="col">State</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEMS.map(([name, , state, detail]) => (
                  <tr key={name}>
                    <td style={{ color: "var(--bone)" }}>{name}</td>
                    <td>
                      <span className="status-pill" data-tone={TONE[state]}>
                        <span className="dot" aria-hidden="true" />
                        {state === "static" ? "operating" : state === "absent" ? "not configured" : state}
                      </span>
                    </td>
                    <td>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RecordHeader serial="10.2" label="This deployment" />
          <div className="table-scroll">
            <table className="data-table" style={{ maxWidth: "48rem" }}>
              <tbody>
                <tr>
                  <td>Built</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>{buildInfo.builtAt}</td>
                </tr>
                <tr>
                  <td>Commit</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                    {buildInfo.commit ?? "local build — no CI metadata"}
                  </td>
                </tr>
                <tr>
                  <td>Environment</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>{buildInfo.environment}</td>
                </tr>
                <tr>
                  <td>Last content update</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>{lastContentUpdate ?? "—"}</td>
                </tr>
                <tr>
                  <td>Mint flag</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                    {String(featureFlags.stateZeroMintEnabled)}
                  </td>
                </tr>
                <tr>
                  <td>Claims flag</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>
                    {String(featureFlags.revenueClaimsEnabled)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="prose" style={{ marginTop: "var(--space-6)" }}>
            <p>
              Known limitations: status reflects build time, not live probes; an
              external monitoring adapter is planned and will replace this section
              with real checks when configured.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
