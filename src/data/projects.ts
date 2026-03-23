import { z } from "zod";

/**
 * Project interface defined with Zod for runtime validation
 * Following Constitution Principle IV: Strict Validation & Type Safety
 */
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(), // Markdown supported
  techStack: z.array(z.string()),
  liveUrl: z.string().url(),
  githubUrl: z.string().url().optional(),
  imageUrl: z.string(),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/), // Hex color validation
});

export type Project = z.infer<typeof ProjectSchema>;

export const projects: Project[] = [
  {
    id: "persona-style",
    title: "Persona Style AI",
    summary: "AI 기반 퍼스널 스타일 분석 서비스",
    description: `사용자의 얼굴형, 체형, 피부톤 등을 AI가 분석하여 최적의 패션 스타일을 추천하는 웹 서비스입니다. 
    
### 주요 기능
- **이미지 분석**: Gemini API를 활용한 정밀한 시각 데이터 처리
- **스타일 추천**: 분석 데이터 기반 맞춤형 코디네이션 제안
- **가이드 제공**: 사용자별 고유 스타일 리포트 생성

Next.js와 TypeScript를 활용하여 견고한 프론트엔드 아키텍처를 구축했습니다.`,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API"],
    liveUrl: "https://persona-style.vercel.app",
    imageUrl: "/images/project-persona-style.webp",
    accentColor: "#a855f7",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary: "실시간 암호화폐 분석 플랫폼",
    description: `실시간 암호화폐 시세 모니터링 및 AI 기반 투자 예측 차트를 제공하는 대시보드입니다.

### 기술적 특징
- **실시간 데이터**: WebSocket을 통한 끊김 없는 시세 데이터 동기화
- **차트 엔진**: Lightweight Charts를 활용한 고성능 렌더링
- **AI 분석**: ICT/SMC 알고리즘과 LLM을 결합한 시장 분석`,
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
    description: `GitHub 레포지토리의 변경사항을 자동으로 분석하여 기술 블로그 포스트로 변환하는 시스템입니다.

AI가 코드 변경 이유를 분석하고 가독성 높은 콘텐츠를 자동 생성합니다. MDX를 활용하여 유연한 컨텐츠 레이아웃을 지원합니다.`,
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
    description: `Supabase 실시간 데이터베이스를 활용한 리그 경매 웹 애플리케이션입니다. 

실시간 양방향 통신, 유저별 상태 관리 및 모바일 반응형 UI를 제공하여 원활한 경매 경험을 지원합니다. Zustand를 통해 복잡한 경매 상태를 효율적으로 관리합니다.`,
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
    description: `BlockNote 에디터를 연동하여 Notion처럼 블록 단위로 문서를 작성하고 PDF로 내보내는 유틸리티 서비스입니다.

html2canvas 및 jsPDF를 활용하여 고품질의 출력을 지원하며, Mantine UI 컴포넌트로 사용자 편의성을 높였습니다.`,
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
  {
    id: "self-growth-dashboard",
    title: "Self Growth Dashboard",
    summary: "개인 성장 지표 시각화 대시보드",
    description: `학습, 운동, 회고 등 개인의 성장 데이터를 추적하고 시각화하는 올인원 대시보드입니다.

Chart.js를 통한 지표 분석과 Supabase 기반의 실시간 데이터 저장을 지원합니다. 사용자 개인의 루틴 관리에 최적화되어 있습니다.`,
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
    description: `Flutter로 개발된 모바일 웰니스 앱입니다. 현대인의 정신 건강을 돕기 위한 다양한 도구를 제공합니다.

### 핵심 기능
- **스트레스 측정**: 실시간 센서 데이터 활용
- **명상 가이드**: 맞춤형 오디오 코스 제공
- **휴식 기록**: Firebase를 통한 활동 데이터 분석 및 시각화`,
    techStack: ["Flutter", "Dart", "Firebase", "HealthKit"],
    liveUrl: "https://sumpyo.app",
    githubUrl: "https://github.com/tuosm/sumpyo-flutter-app",
    imageUrl: "/images/project-sumpyo.webp",
    accentColor: "#0ea5e9",
  },
];
