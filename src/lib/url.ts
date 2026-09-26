/**
 * The site's canonical origin, resolved at build time.
 *
 * Order matters:
 *  1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is attached. It is
 *     the only value that should ever appear in a canonical tag or sitemap.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel, so previews and the
 *     first deploy have correct absolute URLs before a domain exists.
 *  3. localhost — local development.
 *
 * Absolute URLs matter here: Open Graph images and canonical links are ignored
 * by crawlers and link unfurlers when they are relative.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

/** Joins a path onto the canonical origin. */
export const absoluteUrl = (path = "/") =>
  `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
