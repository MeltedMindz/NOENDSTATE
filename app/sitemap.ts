import type { MetadataRoute } from "next";
import { studio } from "@/config/studio";
import { getChronicle, getProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/studio",
    "/projects",
    "/state-zero",
    "/chronicle",
    "/treasury",
    "/build",
    "/manifesto",
    "/community",
    "/faq",
    "/legal",
    "/privacy",
    "/terms",
    "/risk",
    "/status",
  ].map((path) => ({
    url: `${studio.domain}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const eventRoutes = getChronicle().map((e) => ({
    url: `${studio.domain}/chronicle/${e.eventId}`,
    lastModified: new Date(e.recordedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const projectRoutes = getProjects().map((p) => ({
    url: `${studio.domain}/projects/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Fixture token pages are intentionally excluded — never indexed as real assets.
  return [...staticRoutes, ...eventRoutes, ...projectRoutes];
}
