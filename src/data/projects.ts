export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    id: "persona-style",
    title: "Persona Style AI",
    summary: "AI 기반 퍼스널 스타일 분석 서비스",
    description:
      "사용자의 얼굴형, 체형, 피부톤 등을 AI가 분석하여 최적의 패션 스타일을 추천하는 웹 서비스입니다. Gemini API를 활용한 이미지 분석과 맞춤형 스타일 가이드를 제공합니다.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API"],
    liveUrl: "https://persona-style.vercel.app",
    imageUrl: "/images/project-persona-style.webp",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary: "실시간 암호화폐 분석 플랫폼",
    description:
      "실시간 암호화폐 시세 모니터링, AI 기반 투자 예측, 기술적 분석 차트를 제공하는 투자 대시보드입니다. WebSocket을 통한 실시간 데이터와 ICT/SMC 분석 도구를 탑재했습니다.",
    techStack: ["Next.js", "TypeScript", "WebSocket", "Lightweight Charts", "Gemini API"],
    liveUrl: "https://investment-platform-smoky.vercel.app",
    imageUrl: "/images/project-investment.webp",
  },
  {
    id: "auto-blog",
    title: "Auto Dev Blog",
    summary: "GitHub 연동 자동 포스팅 블로그",
    description:
      "GitHub 레포지토리의 변경사항을 자동으로 분석하여 기술 블로그 포스트로 변환하는 시스템입니다. AI가 코드 변경 이유를 분석하고 가독성 높은 콘텐츠를 자동 생성합니다.",
    techStack: ["Next.js", "TypeScript", "GitHub API", "Gemini API", "MDX"],
    liveUrl: "https://auto-blog-eta.vercel.app",
    imageUrl: "/images/project-auto-blog.webp",
  },
  {
    id: "remote-desktop",
    title: "Remote Desktop Extension",
    summary: "크롬 확장 프로그램 기반 원격 데스크톱",
    description:
      "WebRTC 기반의 크롬 확장 프로그램으로, PC와 모바일에서 원격 데스크톱 접속을 지원합니다. 화면 공유, 원격 제어, 실시간 음성 통신 기능을 포함합니다.",
    techStack: ["Chrome Extension", "WebRTC", "TypeScript", "Node.js"],
    liveUrl: "https://chrome.google.com/webstore",
    imageUrl: "/images/project-remote-desktop.webp",
  },
];
