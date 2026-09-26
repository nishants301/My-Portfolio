import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments share the codebase but must never be indexed, or they
  // compete with the real domain for the same content.
  const isPreview = process.env.VERCEL_ENV === "preview";

  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl(),
  };
}
