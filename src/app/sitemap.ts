import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/url";

/**
 * Generated from the project list, so a new case study is indexed the moment
 * it is added to src/data/projects.ts — nothing here to keep in sync by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: absoluteUrl(`/work/${p.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      // Featured work should outrank the archive entries.
      priority: p.featured ? 0.8 : 0.5,
    })),
  ];
}
