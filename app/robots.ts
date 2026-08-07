import type { MetadataRoute } from "next";
import { studio } from "@/config/studio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Fixture token pages must never be indexed as real assets.
        disallow: ["/state-zero/0", "/state-zero/1", "/state-zero/2", "/state-zero/3", "/state-zero/4", "/state-zero/5", "/state-zero/6", "/state-zero/7"],
      },
    ],
    sitemap: `${studio.domain}/sitemap.xml`,
  };
}
