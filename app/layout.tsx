import type { Metadata } from "next";
import { grotesk, newsreader, plexMono } from "@/app/fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getChronicle } from "@/lib/content";
import { studio } from "@/config/studio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(studio.domain),
  title: {
    default: `${studio.name} — ${studio.coreLine}`,
    template: `%s — ${studio.name}`,
  },
  description: studio.description,
  openGraph: {
    siteName: studio.name,
    type: "website",
    url: studio.domain,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const latest = getChronicle()[0];
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: studio.name,
    url: studio.domain,
    description: studio.description,
    foundingDate: studio.foundedAt,
    slogan: studio.coreLine,
  };

  return (
    <html lang="en" className={`${grotesk.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <SiteHeader latestEventId={latest?.eventId ?? "NES-0000"} />
        <main id="main" style={{ paddingTop: "3.75rem" }}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
