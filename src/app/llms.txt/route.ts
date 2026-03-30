import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export function GET() {
  const projectList = projects
    .map(
      (p) =>
        `- ${p.title}: ${p.summary} (${p.techStack.join(", ")}) — ${profile.siteUrl}/projects/${p.id}`
    )
    .join("\n");

  const content = `# ${profile.businessName}

> ${profile.tagline}

## About

${profile.description.join(" ")}

## Developer

- Name: ${profile.name}
- Role: ${profile.title}
- Email: ${profile.contact.email}
- GitHub: ${profile.contact.github}
- LinkedIn: ${profile.contact.linkedin}
- Portfolio: ${profile.siteUrl}

## Core Skills

Next.js, TypeScript, React, Tailwind CSS, Supabase, WebSocket, Flutter, Gemini API, Zustand, Framer Motion

## Key Strengths

- 풀스택 개발: 프론트엔드부터 백엔드, 인프라까지 전 영역 통합 개발
- 빠른 실행력: 1인 개발의 민첩성으로 빠른 결과물 도출
- 책임감 있는 유지보수: 프로젝트 완료 후 지속적인 기술 지원
- 모던 기술 스택: 최신 기술 트렌드를 활용한 고성능 서비스 구축

## Portfolio Projects

${projectList}

## Contact

For project inquiries: ${profile.contact.email}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
