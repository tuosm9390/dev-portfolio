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
      "React",
      "Next.js",
      "TypeScript",
      "프론트엔드 개발",
      "Tanstack Query",
      "Tailwind CSS",
      "Zustand",
      "Supabase",
      "Firebase",
      "Vercel",
      "WebSocket",
      "Gemini API",
      "AI 개발",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} | ${profile.businessName}`,
    url: profile.siteUrl,
    description: `${profile.title} ${profile.name}의 포트폴리오. React · TypeScript · Next.js 기반으로 6개 프로덕션 서비스를 운영합니다.`,
    author: {
      "@type": "Person",
      name: profile.name,
      url: profile.siteUrl,
    },
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${profile.siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${profile.name} 프론트엔드 개발 포트폴리오`,
    description:
      "React · Next.js · TypeScript 기반 프론트엔드 개발 프로젝트 포트폴리오",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "김상찬 개발자는 어떤 기술 스택을 사용하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "React, Next.js, TypeScript를 메인으로 사용하며, Tanstack Query, Zustand, Tailwind CSS로 상태 관리와 스타일링을 합니다. 백엔드는 Supabase, Firebase를 활용하고 Vercel로 배포합니다.",
        },
      },
      {
        "@type": "Question",
        name: "김상찬은 어떤 프로젝트를 만들었나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `AI 기반 콘텐츠 관리 플랫폼 Synapso.dev, AI 퍼스널 스타일링 서비스 Persona Style AI, 자동 SNS 포스터 Threads Auto-Poster 등 총 ${projects.length}개의 프로덕션 서비스를 운영하고 있습니다.`,
        },
      },
      {
        "@type": "Question",
        name: "chan.works는 누구의 포트폴리오인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "chan.works는 프론트엔드 개발자 김상찬의 포트폴리오 사이트입니다. React · TypeScript · Next.js 기반으로 혼자 기획부터 배포까지 6개 프로덕션 서비스를 운영하고 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "김상찬 개발자에게 연락하려면 어떻게 해야 하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `이메일 ${profile.contact.email} 또는 GitHub(${profile.social.github})와 LinkedIn을 통해 연락할 수 있습니다.`,
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
