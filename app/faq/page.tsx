import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Direct answers about NO END STATE, State Zero, the Chronicle, and what is and isn't active.",
  path: "/faq",
});

const FAQS: [string, string][] = [
  [
    "What is NO END STATE?",
    "A persistent, internet-native product and protocol studio. It builds independent projects — protocols, AI-native products, infrastructure, experiments — under one permanent company, and preserves the complete record of that work in an append-only Chronicle.",
  ],
  [
    "What is State Zero?",
    "The studio's fixed founding cohort: a founding artifact designed to accumulate the company's history — every project, launch, incident, and recovery — as permanent provenance. It is not a static PFP collection and its value language is history, not rarity tables.",
  ],
  [
    "Can I mint a State Zero token?",
    "No. Minting is not currently active, no contract is deployed, and final participation terms — supply, price, chain — have not been published. Anyone claiming to sell you one today is scamming you.",
  ],
  [
    "Is State Zero an investment?",
    "No. It is not equity, stock, ownership, or a promise of profit, and nothing on this site is financial advice. An intended economic architecture exists — routing a defined portion of eligible project revenue to holders under published contract rules — but it is inactive and gated behind legal review, audits, and published terms.",
  ],
  [
    "Will there be a second founding collection?",
    "No. No Season 2, no successor pass, no equivalent-but-bigger cohort. The founding supply, once published and minted, is final.",
  ],
  [
    "What is the Chronicle?",
    "The company's append-only event record. Sequence numbers never repeat, published IDs never change, and nothing is silently deleted — corrections are appended as new events that reference what they supersede. Onchain-verified records are distinguished from studio disclosures on every entry.",
  ],
  [
    "What happens when a project fails?",
    "It is marked sunset, its postmortem is published, and its page and Chronicle trail are preserved. Failures are part of the body of work, not something to scrub.",
  ],
  [
    "Where are the projects?",
    "The registry is honestly empty. The studio was founded in August 2026 and the first build is the studio itself — BUILD-000 on the Build page. Projects will appear in the registry when they are real.",
  ],
  [
    "Which chain will the protocol use?",
    "Not decided, and we won't pretend otherwise. The contract prototypes are EVM-based (Foundry/Solidity); the deployment chain is an open decision recorded in the repository.",
  ],
  [
    "Is there a Discord, Telegram, or X account?",
    "Not yet public. The Community page shows the honest status of every surface, and this site will list the only official links. Treat any account claiming to be NO END STATE today as fake.",
  ],
  [
    "Is the code open?",
    "Yes — the site, content systems, and contract prototypes live in the public repository linked in the footer.",
  ],
  [
    "Who is behind this?",
    "The studio operates in public through its work and its record. Team identity disclosures, like everything else, will be published deliberately — not invented for a FAQ.",
  ],
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageIntro serial="08" label="FAQ" title={<>Direct <em>answers.</em></>} />
      <section className="section" style={{ marginTop: "var(--space-8)" }}>
        <div className="container">
          <div style={{ maxWidth: "52rem", borderTop: "1px solid var(--rule-strong)" }}>
            {FAQS.map(([q, a]) => (
              <details className="disclosure" key={q}>
                <summary>{q}</summary>
                <div className="disclosure-body">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
