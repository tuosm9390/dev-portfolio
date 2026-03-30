import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.businessName,
    jobTitle: profile.title,
    description: profile.description.join(" "),
    url: profile.siteUrl,
    email: `mailto:${profile.contact.email}`,
    telephone: profile.contact.phone,
    sameAs: [profile.social.github, profile.social.linkedin],
    knowsAbout: [
      "Next.js",
      "TypeScript",
      "React",
      "풀스택 웹 개발",
      "WebSocket",
      "Supabase",
      "Flutter",
      "Tailwind CSS",
      "Gemini API",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.businessName,
    url: profile.siteUrl,
    description: profile.description.join(" "),
    author: {
      "@type": "Person",
      name: profile.name,
    },
    inLanguage: "ko-KR",
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${profile.businessName} 포트폴리오`,
    description: "풀스택 웹 개발 프로젝트 포트폴리오",
    url: profile.siteUrl,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      description: project.summary,
      url: `${profile.siteUrl}/projects/${project.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
    </>
  );
}
