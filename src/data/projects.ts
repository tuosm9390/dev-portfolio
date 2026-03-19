export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  imageUrl: string;
  accentColor: string; // Toss-style vibrant accent color
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
    accentColor: "#a855f7",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary: "실시간 암호화폐 분석 플랫폼",
    description:
      "실시간 암호화폐 시세 모니터링, AI 기반 투자 예측, 기술적 분석 차트를 제공하는 투자 대시보드입니다. WebSocket을 통한 실시간 데이터와 ICT/SMC 분석 도구를 탑재했습니다.",
    techStack: [
      "Next.js",
      "TypeScript",
      "WebSocket",
      "Lightweight Charts",
      "Gemini API",
    ],
    liveUrl: "https://investment-platform-smoky.vercel.app",
    imageUrl: "/images/project-investment.webp",
    accentColor: "#10b981",
  },
  {
    id: "Synapso.dev",
    title: "Synapso.dev",
    summary: "GitHub 연동 자동 포스팅 블로그",
    description:
      "GitHub 레포지토리의 변경사항을 자동으로 분석하여 기술 블로그 포스트로 변환하는 시스템입니다. AI가 코드 변경 이유를 분석하고 가독성 높은 콘텐츠를 자동 생성합니다.",
    techStack: ["Next.js", "TypeScript", "GitHub API", "Gemini API", "MDX"],
    liveUrl: "https://synapso.dev",
    githubUrl: "https://github.com/tuosm9390/Synapso.dev",
    imageUrl: "/images/project-synapso.dev.png",
    accentColor: "#f43f5e",
  },
  {
    id: "minions-bid",
    title: "Minions Bid",
    summary: "실시간 리그 경매 시뮬레이션 플랫폼",
    description:
      "Supabase 실시간 데이터베이스를 활용한 리그 경매 웹 애플리케이션입니다. 실시간 양방향 통신, 유저별 상태 관리 및 모바일 반응형 UI를 제공하여 원활한 경매 경험을 지원합니다.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Zustand", "Tailwind CSS"],
    liveUrl: "https://minionsbid.vercel.app",
    githubUrl: "https://github.com/tuosm9390/minionsbid",
    imageUrl: "/images/project-minions-bid.png",
    accentColor: "#f59e0b",
  },
  {
    id: "quote-builder",
    title: "스마트 견적서 생성기",
    summary: "블록 기반 PDF 견적서 에디터",
    description:
      "BlockNote 에디터를 연동하여 Notion처럼 블록 단위로 문서를 작성하고, html2canvas 및 jsPDF를 활용하여 고품질의 PDF 견적서를 즉시 내보낼 수 있는 유틸리티 웹 서비스입니다.",
    techStack: [
      "Next.js",
      "TypeScript",
      "BlockNote",
      "Mantine",
      "jsPDF",
      "Tailwind CSS",
    ],
    liveUrl: "https://quote-builder.vercel.app",
    imageUrl: "/images/project-quote-builder.webp",
    accentColor: "#0064ff",
  },
  // {
  //   id: "ai-kanban-board",
  //   title: "AI Kanban Board",
  //   summary: "드래그 앤 드롭 지원 칸반 보드",
  //   description:
  //     "dnd-kit을 적용한 향상된 드래그 앤 드롭 칸반 보드입니다. 부드러운 애니메이션(Framer Motion)과 Zustand를 활용한 깔끔한 클라이언트 상태 관리를 통해 직관적인 프로젝트 관리 경험을 제공합니다.",
  //   techStack: [
  //     "Next.js",
  //     "TypeScript",
  //     "dnd-kit",
  //     "Zustand",
  //     "Framer Motion",
  //     "Tailwind CSS",
  //   ],
  //   liveUrl: "https://ai-kanban-board.vercel.app",
  //   imageUrl: "/images/project-ai-kanban.webp",
  //   accentColor: "#6366f1",
  // },
  {
    id: "self-growth-dashboard",
    title: "Self Growth Dashboard",
    summary: "개인 성장 지표 시각화 대시보드",
    description:
      "학습, 운동, 회고 등 개인의 성장 데이터를 추적하고 시각화하는 올인원 대시보드입니다. 차트 라이브러리를 통한 지표 분석과 목표 관리 기능을 제공합니다.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Chart.js",
      "Supabase",
      "Tailwind CSS",
    ],
    liveUrl: "https://self-growth-dashboard.vercel.app",
    imageUrl: "/images/project-growth.webp",
    accentColor: "#d946ef",
  },
  {
    id: "sumpyo-flutter-app",
    title: "Sumpyo (숨표)",
    summary: "현대인을 위한 휴식 및 명상 가이드 앱",
    description:
      "Flutter로 개발된 모바일 웰니스 앱입니다. 실시간 스트레스 측정, 개인화된 명상 코스, 그리고 휴식 시간을 기록하고 분석하는 기능을 제공하여 현대인의 정신 건강을 돕습니다.",
    techStack: ["Flutter", "Dart", "Firebase", "HealthKit"],
    liveUrl: "https://sumpyo.app",
    githubUrl: "https://github.com/tuosm/sumpyo-flutter-app",
    imageUrl: "/images/project-sumpyo.webp",
    accentColor: "#0ea5e9",
  },
  // {
  //   id: "k-realestate",
  //   title: "K-Realestate AI Studio",
  //   summary: "AI 기반 부동산 자산 관리 및 분석 스튜디오",
  //   description:
  //     "Gemini AI 모델을 결합해 부동산 시장 데이터를 기반으로 맞춤형 분석을 수행합니다. Drizzle ORM과 로컬 SQLite 환경을 갖추고 있어 빠른 데이터 처리 및 질의 분석이 가능합니다.",
  //   techStack: [
  //     "Next.js",
  //     "TypeScript",
  //     "Gemini API",
  //     "Drizzle ORM",
  //     "SQLite",
  //     "NextAuth",
  //   ],
  //   liveUrl: "https://k-realestate.vercel.app",
  //   imageUrl: "/images/project-k-realestate.webp",
  //   accentColor: "#475569",
  // },
];
