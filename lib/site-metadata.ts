import type { Metadata } from "next";
import { studio } from "@/config/studio";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${studio.domain}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${studio.name}`,
      description,
      url,
      siteName: studio.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${studio.name}`,
      description,
    },
  };
}
