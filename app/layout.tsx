import type { Metadata, Viewport } from "next";
import { grotesk, newsreader, plexMono } from "@/app/fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getChronicle } from "@/lib/content";
import { studio } from "@/config/studio";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(studio.domain),
  title: {
    default: `${studio.name} — ${studio.coreLine}`,
    template: `%s — ${studio.name}`,
  },
  description: studio.description,
  applicationName: studio.name,
  creator: studio.name,
  publisher: studio.name,
  category: "technology",
  keywords: [
    "NO END STATE",
    "onchain studio",
    "protocol studio",
    "State Zero",
    "Chronicle",
    "build in public",
    "crypto studio",
    "product studio",
  ],
  alternates: {
    canonical: studio.domain,
    types: {
      "application/rss+xml": `${studio.domain}/feed.xml`,
    },
  },
  openGraph: {
    siteName: studio.name,
    type: "website",
    url: studio.domain,
    locale: "en_US",
    title: `${studio.name} — ${studio.coreLine}`,
    description: studio.secondaryLine,
  },
  twitter: {
    card: "summary_large_image",
    title: `${studio.name} — ${studio.coreLine}`,
    description: studio.secondaryLine,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const latest = getChronicle()[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${studio.domain}/#organization`,
        name: studio.name,
        url: studio.domain,
        description: studio.description,
        foundingDate: studio.foundedAt,
        slogan: studio.coreLine,
        logo: {
          "@type": "ImageObject",
          url: `${studio.domain}/icon.svg`,
        },
        sameAs: ["https://github.com/MeltedMindz/NOENDSTATE"],
      },
      {
        "@type": "WebSite",
        "@id": `${studio.domain}/#website`,
        name: studio.name,
        url: studio.domain,
        description: studio.secondaryLine,
        publisher: { "@id": `${studio.domain}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html lang="en" className={`${grotesk.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
