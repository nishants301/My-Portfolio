import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
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
  metadataBase: new URL("https://nishantshekhar.dev"),
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
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
