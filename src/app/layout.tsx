import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/url";
import Nav from "@/components/ui/Nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

const description =
  "AI Systems Engineer shipping production AI end-to-end as the sole engineer at a 150+ client consultancy — analytics infrastructure across 70+ outlets, four human-gated production agents, and an internal operations platform in daily use.";

export const metadata: Metadata = {
  // Resolved from env so the Vercel URL works today and a custom domain
  // works later without a code change. See src/lib/url.ts.
  metadataBase: new URL(siteUrl()),
  alternates: { canonical: "/" },
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "AI Systems Engineer", "AI Agents", "LLM Applications", "RAG",
    "Automation", "Next.js", "Three.js", "Claude API", "Delhi", "India",
  ],
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description,
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ground"
        >
          Skip to work
        </a>
        <Nav />
        {children}
      </body>
    </html>
  );
}
