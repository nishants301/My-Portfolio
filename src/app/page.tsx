import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Work from "@/components/sections/Work";
import Approach from "@/components/sections/Approach";
import Stack from "@/components/sections/Stack";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/url";

/**
 * Structured data so a recruiter's search, and any AI summarising this page,
 * gets the facts rather than an inference from the markup.
 */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    url: siteUrl(),
    sameAs: [site.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
    worksFor: { "@type": "Organization", name: "Plateful Consulting" },
    knowsAbout: [...site.capabilities],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Guru Gobind Singh Indraprastha University",
    },
    hasPart: projects
      .filter((p) => p.url)
      .map((p) => ({
        "@type": "CreativeWork",
        name: p.name,
        url: p.url,
        description: p.tagline,
      })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <main>
      <JsonLd />
      <Hero />
      <Stats />
      <Work />
      <Approach />
      <Stack />
      <About />
      <Contact />
    </main>
  );
}
