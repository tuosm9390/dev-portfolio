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
    summary: "사용자의 사진과 텍스트를 기반으로 전문가 수준의 퍼스널 컬러, 체형, 분위기를 분석하여 최적의 페르소나 스타일 리포트를 제공하는 Full-Stack 플랫폼입니다.",
    description: `# Persona Style

## 프로젝트 개요 (Overview)
**Persona Style**은 사용자의 사진, 텍스트 등의 입력을 기반으로 전문가 수준의 심리, 패션, 뷰티 분석을 제공하고 최적의 "페르소나"를 도출하는 플랫폼입니다.
Gemini 1.5 Pro 모델을 활용해 개인화된 스타일/심리 분석을 수행하고, 도출된 디자인 리포트를 PDF나 고퀄리티 이미지 매체로 내보내어 SNS를 통한 바이럴 엔진 구동, 타 유저와의 "페르소나 매칭"까지 기능하는 Full-Stack 애플리케이션입니다.

## 핵심 파이프라인 (Core Pipeline)
1. **분석 기록 및 벡터 임베딩 (Analysis & Embedding)**
   - 다양한 Input(사진/텍스트 등)에 대해 분석 결과(summary, fashion, visual_profile 등)를 JSON 형태로 도출해 \`analysis_history\`에 저장합니다.
   - 이때 각 분석 결과는 Gemini Embedding 모델을 통해 \`VECTOR(1536)\` 차원으로 변환 및 저장되어 향후 "사용자 간 매칭"과 유사도 분석에 활용됩니다.
2. **바이럴 엔드포인트 및 바이럴 매칭 엔진 (Viral Matching)**
   - 렌더링 속도가 빠른 \`satori\`와 \`@resvg/resvg-js\`를 서버 사이드에서 활용하여 모바일 공유에 최적화된 9:16 카드 이미지를 즉시 생성해 반환합니다.
   - Supabase PostGIS/Vector 확장의 Cosine Similarity(\`1 - (v1 <=> v2)\`) RPC를 활용해 페르소나 매칭 점수를 빠르고 정확하게 도출합니다(\`persona_matches\`).
3. **프리미엄 심층 보고서 (Premium Export)**
   - PortOne SDK로 결제 시스템을 통합하여(\`payment_transactions\`), 결제 성공/콜백 시 \`premium_reports\` 레코드를 활성화합니다.
   - React-PDF와 HTML-to-Image를 하이브리드로 사용하여 클라이언트/서버에서 고해상도 A4 분량의 PDF 리포트(Deep Analysis)를 제공합니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
persona-style/
├── src/
│   ├── app/                # UI 라우트 컴포넌트 
│   │   └── api/            # Viral(share, match, trend) 및 Premium API
│   ├── components/         # Radix UI, Framer Motion 기반 애니메이션 UI
│   └── lib/                # Supabase SSR, Sentry 로깅 등 공통 모듈
├── supabase_schema.sql         # 분석 결과, 벡터 임베딩, 임포트 DB 스키마
└── sentry.*.config.ts          # 클라이언트/서버/엣지 환경 모니터링
\`\`\`

## 상세 기능 구현 (Technical Implementation)
- **Supabase RLS 및 익명화 통계 아키텍처**
  민감할 수 있는 개인 분석 리포트의 보안을 강화하고자 엄격한 Row Level Security(RLS)를 적용했습니다. 트렌드 통계를 생성할 때(\`refresh_persona_stats\` RPC) \`user_id\`를 완전히 배제한 채 Aggregation Only 전략으로 테이블을 재삽입하여 보안과 성능을 모두 챙겼습니다.
- **고도화된 Report Export Engine**
  Next.js Edge Runtime과 \`Satori\`를 결합하여 오픈그래프/바이럴 공유용 이미지는 Edge 레이어에서 수십 ms 안에 생성합니다. 복잡한 분석 도표가 들어간 A4 PDF 페이퍼워크 생성 단계는 Node 런타임의 \`@react-pdf/renderer\`로 워크로드를 분리하여 병목을 최소화했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion
- **Backend / Database**: Supabase SSR (\`pgvector\` 확장 포함), Zod
- **AI / LLM**: \`@google/generative-ai\` (Gemini 1.5 Pro)
- **PDF & Image Generation**: \`satori\`, \`@react-pdf/renderer\`, \`html-to-image\`, \`@resvg/resvg-js\`
- **Monitroing & Payments**: \`@sentry/nextjs\`, PortOne 결제 시스템
`, `@react-pdf/renderer`, `html-to-image`, `@resvg/resvg-js`
- **Monitroing & Payments**: `@sentry/nextjs`, PortOne 결제 시스템
`, \`@react-pdf/renderer\`, \`html-to-image\`, \`@resvg/resvg-js\`
- **Monitoring & Payments**: \`@sentry/nextjs\`, PortOne 결제 시스템`,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API", "Supabase", "Satori"],
    liveUrl: "https://persona-style.vercel.app",
    imageUrl: "/images/project-persona-style.webp",
    accentColor: "#a855f7",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary: "금융 에셋 데이터와 RSS 피드를 실시간으로 크롤링하고 AI로 분석하여 직관적인 대시보드와 고성능 차트로 시각화하는 투자 정보 플랫폼입니다.",
    description: `# Investment Platform

## 프로젝트 개요 (Overview)
**Investment Platform**은 특정 금융 키워드나 종목명으로 웹 뉴스와 RSS 피드를 동적으로 크롤링하고, 수집된 데이터를 대시보드 형태로 제공하는 웹 애플리케이션입니다.
Next.js의 서버 사이드 리소스와 Cheerio를 활용하여 데이터를 스크래핑한 뒤, 클라이언트 영역에서 경량화된 차트 라이브러리를 통해 시계열 데이터 및 분석 결과를 직관적으로 시각화하는 데 중점을 두었습니다.

## 핵심 파이프라인 (Core Pipeline)
1. **데이터 수집 (Scraping & Crawling)**
   - \`cheerio\`를 활용하여 대상 웹페이지나 검색 결과(예: 네이버 검색 모바일/PC 버전)의 HTML DOM을 파싱하여 정형화된 뉴스 데이터로 추출합니다.
   - 런타임 환경에서 API 라우트를 통해 크롤러 스크립트(\`src/lib/crawler\`, \`test-crawler.ts\`)를 비동기로 실행하여 최신 데이터를 패치합니다.
2. **AI 데이터 분석 (Processing)**
   - \`@google/generative-ai\` (Gemini API)를 연동하여 단순한 헤드라인 추출을 넘어서, 금융 뉴스의 맥락을 파악하고 투자자 관점의 의미 있는 데이터로 정제/요약합니다.
3. **데이터 시각화 (Visualization)**
   - 수집 및 분석된 데이터를 \`lightweight-charts\`와 \`recharts\`를 사용하여 대시보드의 캔버스 및 SVG 차트로 렌더링합니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
investment-platform/
├── src/
│   ├── app/                # Next.js 16 App Router 구조
│   │   ├── api/            # 외부 API 또는 크롤러를 실행하는 서버사이드 엔드포인트
│   │   └── search/         # 특정 키워드/종목 검색결과 및 차트 대시보드 뷰
│   └── lib/                # 비즈니스/크롤러 모듈 디렉토리
├── test-crawler.ts         # 로컬 환경 크롤러 유닛 테스트 스크립트
├── crawler-log.txt         # 크롤링 에러/성공 상태를 담은 로그 기록
└── gstack-sketch.html/png  # 초기 퍼블리싱 UI 프로토타입 설계 파일
\`\`\`

## 상세 기능 구현 (Technical Implementation)
- **우회적 크롤링 파이프라인 컴포넌트화**
  동적으로 변화하는 타겟 사이트(예: 포털 검색)의 HTML 구조에 대응하기 위해 데이터를 패치(\`test-rss.ts\`, \`dump-mobile.ts\`)하고 Cheerio 셀렉터를 모듈화하여, 유지보수 비용을 낮추는 스크래핑 아키텍처를 설계했습니다.
- **성능 중심의 데이터 바인딩**
  빠른 차트 렌더링을 위해 TradingView의 \`lightweight-charts\`를 WebGL 캔버스 위에서 구동하여 수많은 시점에서 발생하는 데이터 틱(tick)의 브라우저 리플로우(Reflow)를 최소화했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16.1.6 (App Router), React 19
- **Data Fetching/Scraping**: \`axios\`, \`cheerio\` (HTML DOM Parser)
- **Data Visualization**: \`lightweight-charts\`, \`recharts\`
- **AI Processing**: \`@google/generative-ai\` (Gemini)
- **Styling**: \`clsx\`, \`lucide-react\`
`, `test-crawler.ts`)를 비동기로 실행하여 최신 데이터를 패치합니다.
2. **AI 데이터 분석 (Processing)**
   - `@google/generative-ai` (Gemini API)를 연동하여 단순한 헤드라인 추출을 넘어서, 금융 뉴스의 맥락을 파악하고 투자자 관점의 의미 있는 데이터로 정제/요약합니다.
3. **데이터 시각화 (Visualization)**
   - 수집 및 분석된 데이터를 `lightweight-charts`와 `recharts`를 사용하여 대시보드의 캔버스 및 SVG 차트로 렌더링합니다.

## 프로젝트 구조 (Project Structure)
```text
investment-platform/
├── src/
│   ├── app/                # Next.js 16 App Router 구조
│   │   ├── api/            # 외부 API 또는 크롤러를 실행하는 서버사이드 엔드포인트
│   │   └── search/         # 특정 키워드/종목 검색결과 및 차트 대시보드 뷰
│   └── lib/                # 비즈니스/크롤러 모듈 디렉토리
├── test-crawler.ts         # 로컬 환경 크롤러 유닛 테스트 스크립트
├── crawler-log.txt         # 크롤링 에러/성공 상태를 담은 로그 기록
└── gstack-sketch.html/png  # 초기 퍼블리싱 UI 프로토타입 설계 파일
```

## 상세 기능 구현 (Technical Implementation)
- **우회적 크롤링 파이프라인 컴포넌트화**
  동적으로 변화하는 타겟 사이트(예: 포털 검색)의 HTML 구조에 대응하기 위해 데이터를 패치(`test-rss.ts`, `dump-mobile.ts`)하고 Cheerio 셀렉터를 모듈화하여, 유지보수 비용을 낮추는 스크래핑 아키텍처를 설계했습니다.
- **성능 중심의 데이터 바인딩**
  빠른 차트 렌더링을 위해 TradingView의 `lightweight-charts`를 WebGL 캔버스 위에서 구동하여 수많은 시점에서 발생하는 데이터 틱(tick)의 브라우저 리플로우(Reflow)를 최소화했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16.1.6 (App Router), React 19
- **Data Fetching/Scraping**: `axios`, `cheerio` (HTML DOM Parser)
- **Data Visualization**: `lightweight-charts`, `recharts`
- **AI Processing**: `@google/generative-ai` (Gemini)
- **Styling**: `clsx`, `lucide-react`
`, \`test-crawler.ts\`)를 비동기로 실행하여 최신 데이터를 캐싱합니다.
2. **AI 데이터 분석 (Processing)**
   - \`@google/generative-ai\` (Gemini API)를 연동하여 단순한 텍스트 리스트를 넘어, 금융 뉴스의 맥락을 파악하고 투자자에게 가치 있는 데이터로 정제/요약합니다.  
3. **데이터 시각화 (Visualization)**
   - 수집 및 분석된 데이터를 \`lightweight-charts\`와 \`recharts\`를 사용하여 대시보드와 SVG 차트로 렌더링합니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
investment-platform/
├── src/
│   ├── app/                # Next.js 16 App Router 구조
│   │   ├── api/            # 외부 API 및 크롤러를 실행하는 서버사이드 엔드포인트
│   │   ├── search/         # 특정 자산/종목 검색결과 및 차트 대시보드 뷰
│   ├── lib/                # 비즈니스/크롤러 모듈 라이브러리
├── test-crawler.ts         # 로컬 환경 크롤러 기능 검증 스크립트
├── crawler-log.txt         # 크롤링 성공/실패 상태를 담은 로그 기록
└── gstack-sketch.html/png  # 초기 와이어프레임 UI 프로토타입 설계 파일
\`\`\`

## 상세 기술 구현 (Technical Implementation)
- **유연한 크롤링 파이프라인 컴포넌트화**
  동적으로 변화하는 타겟 사이트(예: 포털 검색)의 HTML 구조에 대응하기 위해 데이터를 캐시(\`test-rss.ts\`, \`dump-mobile.ts\`)하고 Cheerio 셀렉터를 모듈화하여, 유지보수 비용을 낮추는 스크래핑 아키텍처를 설계했습니다.
- **성능 중심의 데이터 바인딩**
  많은 차트 렌더링을 위해 TradingView의 \`lightweight-charts\`를 WebGL 컨텍스트 위에서 구현하여 수천개의 시점에서 발생되는 데이터 틱(tick)의 리드로우(Reflow)를 최소화했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16.1.6 (App Router), React 19
- **Data Fetching/Scraping**: \`axios\`, \`cheerio\` (HTML DOM Parser)
- **Data Visualization**: \`lightweight-charts\`, \`recharts\`
- **AI Processing**: \`@google/generative-ai\` (Gemini)
- **Styling**: \`clsx\`, \`lucide-react\``,
    techStack: [
      "Next.js",
      "TypeScript",
      "WebSocket",
      "Lightweight Charts",
      "Gemini API",
      "Cheerio",
    ],
    liveUrl: "https://investment-platform-smoky.vercel.app",
    imageUrl: "/images/project-investment.webp",
    accentColor: "#10b981",
  },
  {
    id: "Synapso.dev",
    title: "Synapso.dev",
    summary: "GitHub 커밋 내역을 분석하여 개발자의 의사결정 과정을 유추하고, 전문적인 기술 블로그 포스트를 자동으로 생성해주는 AI 기반 SaaS입니다.",
    description: `# synapso.dev - AI-Powered Tech Blog Generator

## 프로젝트 개요 (Overview)
**synapso.dev**는 개발자가 작성한 GitHub 커밋 내역을 Google Gemini AI가 분석하여, 단편적인 변경사항의 나열이 아닌 **전문적인 시니어 엔지니어 관점의 기술 블로그 포스트로 자동 생성**해주는 멀티유저 SaaS 플랫폼입니다.
단순한 코드 요약을 넘어, 커밋에 담긴 코드 패턴과 구조 변경을 바탕으로 "요구사항 → 기획/설계 → 개발"이라는 개발자의 의사결정 과정(Reverse Spec Recovery)을 역추론하여 완성도 높은 마크다운 문서를 즉시 발행합니다.

## 핵심 파이프라인 (Core Pipeline)
이 프로젝트의 주요 데이터 흐름은 **커밋 수집 → 작업 등록 → AI 분석 → 포스트 발행**의 4단계 파이프라인으로 구성됩니다.

1. **GitHub 연동 및 커밋 수집 (\`lib/github.ts\`)**
   - NextAuth를 통해 GitHub OAuth 인증 후 리포지토리 접근 권한을 획득합니다.
   - Octokit을 사용해 커밋 Diff를 추출하며, AI 응답 품질 향상과 토큰 절약을 위해 패키지 Lock 파일, 환경변수, 바이너리, 빌드 결과물 등 불필요한 파일을 자동(\`shouldExcludeFile\`) 필터링합니다.
2. **비동기 작업 큐 및 상태 관리 (\`lib/jobs.ts\`)**
   - 사용자 경험을 위해 무거운 AI 분석 작업은 Supabase \`jobs\` 테이블에 대기열(Pending 상태)로 등록됩니다.
   - 백그라운드 프로세스(\`runAIAnalysisBackground\`)가 최대 5분의 타임아웃 규칙과 함께 작업을 비동기 처리하며 진행 상태(Processing, Completed, Failed)를 UI에 실시간(또는 Polling)으로 반영합니다.
3. **AI 심층 분석 및 명세 역추론 (\`lib/ai.ts\`)**
   - 수집된 Commit Diff를 바탕으로 Gemini 프롬프트를 구성합니다.
   - 단일 스트링 생성이 아닌 **Structured Output(JSON Schema)** 모드를 활용해 제목, 요약문, 태그, 본문(마크다운) 구조를 강제하여 파싱 안정성을 더했습니다.
   - Rate Limiting 429 에러 처리와 Exponential Backoff를 통한 Retry 메커니즘이 내장되어 있습니다.
4. **포스트 발행 및 관리 (\`lib/posts.ts\`)**
   - 생성된 JSON 데이터는 마크다운으로 변환되어 \`posts\` 테이블에 저장되며, 날짜 기반의 고유 Slug(예: \`YYYY-MM-DD-title-slug\`)가 자동 할당됩니다.
   - ISR(Incremental Static Regeneration) 등을 통해 Vercel 환경에서 빠른 페이지 렌더링을 제공합니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
synapso.dev/
├── app/                  # Next.js 16 App Router (UI, Route, API)
│   ├── [locale]/         # next-intl 기반 다국어 지원 라우팅
│   ├── actions/          # React Server Actions (데이터 변이 로직)
│   └── api/              # 백엔드 API Routes 및 Webhook 엔드포인트
│       ├── cron/         # 자동 발행 스케줄러 (Vercel Cron)
│       └── webhooks/     # Stripe / PortOne 결제 콜백
├── lib/                  # 핵심 서비스 및 비즈니스 로직
│   ├── ai.ts             # Gemini 연동, 프롬프트 빌딩 및 Retry 로직
│   ├── github.ts         # Octokit 기반 API (커밋 diff 추출)
│   ├── jobs.ts           # 백그라운드 워커 및 Job 상태 머신
│   ├── posts.ts          # 블로그 포스트 CRUD 및 Slug 중복 방지 로직
│   ├── portone-billing.ts# 국내 결제 연동 (PortOne SDK)
│   └── subscription.ts   # 유저 구독 플랜(Free, Pro, Business) 검증
└── components/           # 재사용 가능한 UI 컴포넌트 세트
\`\`\`

## 상세 기능 구현 (Technical Implementation)

- **Reverse Spec Recovery 패턴 (AI Prompting)**
  프롬프트 설계 시 "단순 코드 설명 제한" 규칙을 강제합니다. 대신 개발자가 왜 이러한 코드를 작성했는지, 구조와 의존성 변화를 바탕으로 "기획 의도"와 "해결하려 한 문제"를 추론하게 지시합니다. (예: \`AI가 코드로부터 추론한 내용입니다\` 문구 포함 규칙 처리)
- **과금 및 구독 시스템 (Tier-based Constraint)**
  Free, Pro, Business 티어에 따라 사용할 수 있는 Gemini 모델(Flash Lite / Flash / Pro)을 동적으로 분기(\`TIER_LIMITS\`)합니다. 또한 한 달 생성 가능 횟수에 제한을 두어 AI 인프라 비용을 제어합니다. 국내 결제는 PortOne, 글로벌 결제는 Stripe를 도입한 하이브리드 결제 스택을 사용합니다.
- **안정적인 Slug 생성 및 Soft Delete**
  동일한 제목에서 파생될 수 있는 URL 충돌을 방지하기 위해 생성 시 중복을 확인하고 \`-1\`, \`-2\` 등 카운터를 붙이는 알고리즘을 사용합니다. 포스트 삭제 요청 시 실제 데이터를 삭제하지 않고 \`deletedAt\` 값을 부여하여(Soft Delete) 휴먼 에러 시 복구할 수 있는 방어 코드가 적용되어 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: Next.js 16.1.6 (App Router), React 19, Tailwind CSS 4
- **Backend & Database**: Supabase (PostgreSQL), NextAuth v5
- **AI / LLM**: \`@google/generative-ai\` (Gemini API 2.5)
- **Payments**: PortOne SDK, Stripe
- **Utils**: \`zod\`(데이터 검증), \`octokit\`(GitHub 연동), \`date-fns\`, Upstash Redis (Rate Limiting)
- **Markdown Tools**: \`react-markdown\`, \`rehype-highlight\`, \`remark-gfm\`
- **Infra**: Vercel (Hosting, Cron Jobs)

## 주요 구현 특징 (Key Highlights)

1. **AI 환각(Hallucination) 억제를 위한 스키마 강제**
   자유로운 텍스트 생성이 가진 파싱 불안정성을 해결하기 위해, Gemini API의 \`responseSchema\`를 활용해 JSON 타입 응답을 보장받음으로써 백엔드 오류를 원천 차단했습니다.
2. **탄력적인 토큰 워크플로우 최적화**
   GitHub Diff에서 토큰을 심하게 잡아먹는 lock 파일과 바이너리 확장자들을 \`EXCLUDED_FILE_PATTERNS\`로 사전에 차단(\`lib/github.ts\`)하여, 컨텍스트 윈도우 한계를 우회하고 불필요한 AI 연산 비용을 최적화했습니다.
3. **분산 환경을 고려한 작업 관리**
   Serverless 환경의 Request Timeout 한계를 극복하기 위해 \`jobs\` 테이블 기반 비동기 폴링 구조를 구현하여 대용량 커밋 분석 작업 시 시스템 안전성을 확보했습니다.
`, `-2` 등 카운터를 붙이는 알고리즘을 사용합니다. 포스트 삭제 요청 시 실제 데이터를 삭제하지 않고 `deletedAt` 값을 부여하여(Soft Delete) 휴먼 에러 시 복구할 수 있는 방어 코드가 적용되어 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: Next.js 16.1.6 (App Router), React 19, Tailwind CSS 4
- **Backend & Database**: Supabase (PostgreSQL), NextAuth v5
- **AI / LLM**: `@google/generative-ai` (Gemini API 2.5)
- **Payments**: PortOne SDK, Stripe
- **Utils**: `zod`(데이터 검증), `octokit`(GitHub 연동), `date-fns`, Upstash Redis (Rate Limiting)
- **Markdown Tools**: `react-markdown`, `rehype-highlight`, `remark-gfm`
- **Infra**: Vercel (Hosting, Cron Jobs)

## 주요 구현 특징 (Key Highlights)

1. **AI 환각(Hallucination) 억제를 위한 스키마 강제**
   자유로운 텍스트 생성이 가진 파싱 불안정성을 해결하기 위해, Gemini API의 `responseSchema`를 활용해 JSON 타입 응답을 보장받음으로써 백엔드 오류를 원천 차단했습니다.
2. **탄력적인 토큰 워크플로우 최적화**
   GitHub Diff에서 토큰을 심하게 잡아먹는 lock 파일과 바이너리 확장자들을 `EXCLUDED_FILE_PATTERNS`로 사전에 차단(`lib/github.ts`)하여, 컨텍스트 윈도우 한계를 우회하고 불필요한 AI 연산 비용을 최적화했습니다.
3. **분산 환경을 고려한 작업 관리**
   Serverless 환경의 Request Timeout 한계를 극복하기 위해 `jobs` 테이블 기반 비동기 폴링 구조를 구현하여 대용량 커밋 분석 작업 시 시스템 안전성을 확보했습니다.
`, \`-2\` 등을 카운터를 붙이는 알고리즘을 사용합니다. 포스트 삭제 요청 시 실제 데이터를 삭제하지 않고 \`deletedAt\` 값을 부여하여(Soft Delete) 장애 시 복구할 수 있는 방어 코드가 적용되어 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: Next.js 16.1.6 (App Router), React 19, Tailwind CSS 4
- **Backend & Database**: Supabase (PostgreSQL), NextAuth v5
- **AI / LLM**: \`@google/generative-ai\` (Gemini API 2.5)
- **Payments**: PortOne SDK, Stripe
- **Utils**: \`zod\`(데이터 검증), \`octokit\`(GitHub 연동), \`date-fns\`, Upstash Redis (Rate Limiting)
- **Markdown Tools**: \`react-markdown\`, \`rehype-highlight\`, \`remark-gfm\`
- **Infra**: Vercel (Hosting, Cron Jobs)

## 주요 구현 특징 (Key Highlights)

1. **AI 환각(Hallucination) 억제를 위한 구조적 검증**
   자유로운 텍스트 생성의 가변성 문제를 해결하기 위해, Gemini API의 \`responseSchema\`를 활용해 JSON 형식의 응답을 보장받음으로써 백엔드 오류를 원천 차단했습니다.
2. **대규모 토픽 워커플로우 최적화**
   GitHub Diff에서 토큰을 낭비하기 쉬운 lock 파일과 바이너리 확장자들을 \`EXCLUDED_FILE_PATTERNS\`로 사전에 차단(\`lib/github.ts\`)하여, 핵심 코드 변화에만 집중하고 비용을 최적화했습니다.
3. **분사 환경을 고려한 작업 관리**
   Serverless 환경의 Request Timeout 한계를 극복하기 위해 \`jobs\` 테이블 기반 비동기 큐 구조를 구현하여 대용량 커밋 분석 작업 시 시스템 안정성을 확보했습니다.`,
    techStack: ["Next.js", "TypeScript", "GitHub API", "Gemini API", "Supabase", "Stripe"],
    liveUrl: "https://synapso.dev",
    githubUrl: "https://github.com/tuosm9390/Synapso.dev",
    imageUrl: "/images/project-synapso.dev.png",
    accentColor: "#f43f5e",
  },
  {
    id: "minions-bid",
    title: "Minions Bid (League Auction Tool)",
    summary: "리그 오브 레전드 커뮤니티를 위한 초저지연 실시간 멀티플레이어 경매 시스템으로, 독특한 Cyber-Pixel 디자인과 서버 권한 기반 아키텍처를 특징으로 합니다.",
    description: `# 🎮 Project Description: Minions Bid (League Auction Tool)

## 📌 Overview
**Minions Bid** is a high-performance, real-time multiplayer auction system designed for League of Legends community tournaments and team drafting. It allows organizers and team captains to conduct player auctions with near-zero latency, ensuring a fair and engaging drafting experience. The project features a unique **Cyber-Pixel** aesthetic—a blend of 8-bit retro art and modern cyberpunk elements.

## 🏗️ Architecture & Core Pipeline

The project follows a **Server-Authority Real-time Architecture** using a hybrid Firebase approach to balance persistence and performance.

### 🔄 Data Flow Pipeline
1.  **Room Creation & Setup**: Organizers initialize a room and upload player lists via Excel (\`xlsx\`). Data is persisted in **Cloud Firestore**.
2.  **Scene-Based State Machine**: The auction progress is managed through discrete "Scenes" (Waiting → Lottery → Active → Result), preventing complex conditional rendering bugs.
3.  **Real-time Synchronization**:
    *   **Firestore (\`onSnapshot\`)**: Synchronizes structural data like player status, team balances, and chat messages.
    *   **Firebase Realtime Database (RTDB)**: Handles ultra-low latency signals (e.g., lottery animations, instant bid notifications) to ensure sub-100ms feedback.
4.  **Atomic Mutations**: All state changes (Bidding, Awarding) are handled via **Next.js Server Actions** using the Firebase Admin SDK to ensure atomicity and prevent client-side manipulation.

## 📂 Project Structure

- \`src/app/\`: Next.js App Router pages and API routes.
- \`src/features/auction/\`: Domain-driven module containing the core business logic.
    - \`api/\`: Server Actions for database mutations.
    - \`components/\`: Scene-specific UI components (\`AuctionBoard\`, \`BiddingControl\`, etc.).
    - \`hooks/\`: Custom hooks for real-time synchronization (\`useAuctionRealtime\`) and UI logic.
    - \`store/\`: Client-side state management using **Zustand**.
- \`src/lib/\`: Shared infrastructure (Firebase initialization, global utilities).
- \`doc/\`: Comprehensive technical documentation covering architecture, logic, and design conventions.

## 🛠️ Technical Implementation

### ⚡ Real-time Bidding & Consistency
To prevent race conditions during high-speed bidding wars, the system employs a **Server Authority** model. Instead of optimistic UI updates for bids, the UI only reflects a "Leading" status once the server confirms the bid and pushes it back via Firebase. This ensures all participants see the exact same state at all times.

### 🎲 Lottery & Animation System
The player selection process uses a custom **Lottery Animation** (slot-machine style) built with **Framer Motion**. The synchronization between the animation end and the start of the auction is managed via RTDB signals to ensure all clients start their local timers simultaneously.

### 📱 Responsive Cyber-Pixel UI
The UI is built on a custom design system defined in \`DESIGN.md\`:
- **Fluid Typography**: Uses CSS \`clamp()\` and custom Tailwind tokens for seamless scaling across devices.
- **Pixel-Perfect Components**: Custom-built UI elements with heavy borders (\`border-4\`) and high-contrast OKLCH colors.
- **Portal-based Modals**: All interactive overlays use React Portals to avoid Z-index and stacking context issues in complex layouts.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: 
    - **Firestore**: Persistent relational-like data.
    - **Realtime Database**: Ephemeral high-speed state.
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4, Framer Motion
- **Tooling**: Vitest (Unit Testing), Playwright (E2E Testing), ExcelJS

## 🌟 Key Highlights

- **Low-Latency Experience**: Optimized for real-time interaction where 0.1s matters.
- **Scalable Data Management**: Effortlessly handles large player pools through optimized Firebase subscriptions and bulk Excel processing.
- **Aesthetic Distinction**: A meticulously crafted visual identity that stands out from generic dashboard-style tools.
- **Zero-Trust Security**: Strict validation at the Server Action layer combined with Firebase Security Rules ensures data integrity.
`, `BiddingControl`, etc.).
    - `hooks/`: Custom hooks for real-time synchronization (`useAuctionRealtime`) and UI logic.
    - `store/`: Client-side state management using **Zustand**.
- `src/lib/`: Shared infrastructure (Firebase initialization, global utilities).
- `doc/`: Comprehensive technical documentation covering architecture, logic, and design conventions.

## 🛠️ Technical Implementation

### ⚡ Real-time Bidding & Consistency
To prevent race conditions during high-speed bidding wars, the system employs a **Server Authority** model. Instead of optimistic UI updates for bids, the UI only reflects a "Leading" status once the server confirms the bid and pushes it back via Firebase. This ensures all participants see the exact same state at all times.

### 🎲 Lottery & Animation System
The player selection process uses a custom **Lottery Animation** (slot-machine style) built with **Framer Motion**. The synchronization between the animation end and the start of the auction is managed via RTDB signals to ensure all clients start their local timers simultaneously.

### 📱 Responsive Cyber-Pixel UI
The UI is built on a custom design system defined in `DESIGN.md`:
- **Fluid Typography**: Uses CSS `clamp()` and custom Tailwind tokens for seamless scaling across devices.
- **Pixel-Perfect Components**: Custom-built UI elements with heavy borders (`border-4`) and high-contrast OKLCH colors.
- **Portal-based Modals**: All interactive overlays use React Portals to avoid Z-index and stacking context issues in complex layouts.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: 
    - **Firestore**: Persistent relational-like data.
    - **Realtime Database**: Ephemeral high-speed state.
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4, Framer Motion
- **Tooling**: Vitest (Unit Testing), Playwright (E2E Testing), ExcelJS

## 🌟 Key Highlights

- **Low-Latency Experience**: Optimized for real-time interaction where 0.1s matters.
- **Scalable Data Management**: Effortlessly handles large player pools through optimized Firebase subscriptions and bulk Excel processing.
- **Aesthetic Distinction**: A meticulously crafted visual identity that stands out from generic dashboard-style tools.
- **Zero-Trust Security**: Strict validation at the Server Action layer combined with Firebase Security Rules ensures data integrity.
`, \`BiddingControl\` 등).
    - \`hooks/\`: 실시간 동기화(\`useAuctionRealtime\`) 및 UI 로직을 위한 커스텀 훅.
    - \`store/\`: **Zustand**를 이용한 클라이언트 상태 관리.
- \`src/lib/\`: 공유 인프라 (Firebase 초기화, 글로벌 유틸리티).
- \`doc/\`: 아키텍처, 로직 및 디자인 컨벤션을 다루는 포괄적인 기술 문서.

## 🛠 Technical Implementation

### ⚡ Real-time Bidding & Consistency
고속 입찰 경쟁 중 레이스 컨디션을 방지하기 위해 시스템은 **Server Authority** 모델을 채택했습니다. 입찰에 대해 낙관적 UI 업데이트를 하는 대신, 서버가 입찰을 확인하고 Firebase를 통해 다시 푸시한 후에만 UI에 "입찰 중" 상태가 반영됩니다. 이를 통해 모든 참가자가 항상 정확히 동일한 상태를 볼 수 있도록 보장합니다.

### 🎲 Lottery & Animation System
플레이어 선택 프로세스는 **Framer Motion**으로 제작된 커스텀 **추첨 애니메이션(Lottery Animation)**(슬롯머신 스타일)을 사용합니다. 애니메이션 종료와 경매 시작 사이의 동기화는 RTDB 신호를 통해 관리되어 모든 클라이언트가 로컬 타이머를 동시에 시작하도록 합니다.

### 📱 Responsive Cyber-Pixel UI
UI는 \`DESIGN.md\`에 정의된 커스텀 디자인 시스템을 바탕으로 구축되었습니다.
- **Fluid Typography**: \`clamp()\` 함수와 커스텀 Tailwind 토큰을 사용하여 기기간 원활한 스케일링을 지원합니다.
- **Pixel-Perfect Components**: 두꺼운 테두리(\`border-4\`)와 고대비 OKLCH 색상을 사용한 커스텀 UI 요소.
- **Portal-Based Modals**: 모든 인터랙티브 오버레이는 React Portals를 사용하여 복잡한 레이아웃에서 z-index 및 스태킹 컨텍스트 문제를 방지합니다.

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: 
    - **Firestore**: 영구적인 관계형 데이터 저장.
    - **Realtime Database**: 휘발성 고속 상태 처리.
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4, Framer Motion
- **Tooling**: Vitest (Unit Testing), Playwright (E2E Testing), ExcelJS

## ✨ Key Highlights
- **초저지연 경험 (Low-Latency Experience)**: 0.1초가 중요한 실시간 인터랙션에 최적화되었습니다.
- **확장 가능한 데이터 관리 (Scalable Data Management)**: 최적화된 Firebase 구독 및 대량 엑셀 처리를 통해 대규모 플레이어 풀을 손쉽게 처리합니다.
- **차별화된 심미성 (Aesthetic Distinction)**: 일반적인 대시보드 스타일의 도구와 차별화되는 세심하게 제작된 시각적 정체성.
- **제로 트러스트 보안 (Zero-Trust Security)**: Server Action 레이어에서의 엄격한 검증과 Firebase 보안 규칙을 결합하여 데이터 무결성을 보장합니다.`,
    techStack: ["Next.js", "TypeScript", "Firebase", "Zustand", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://minionsbid.vercel.app",
    githubUrl: "https://github.com/tuosm9390/minionsbid",
    imageUrl: "/images/project-minions-bid.png",
    accentColor: "#f59e0b",
  },
  {
    id: "quote-builder",
    title: "스마트 견적서 생성기",
    summary: "노션 스타일의 JSON 블록 에디터를 통해 기업형 견적서를 실시간으로 작성하고, 클라이언트 사이드에서 고해상도 PDF로 변환 및 관리하는 도구입니다.",
    description: `# Quote Builder

## 프로젝트 개요 (Overview)
**Quote Builder**는 기업형 문서를 손쉽게 작성하고, WYSIWYG 에디터를 통해 실시간으로 견적 금액을 계산한 뒤, 이 데이터를 PDF로 변환하여 발송하거나 저장할 수 있는 문서 에디터 및 관리 애플리케이션입니다. 
Next.js 프레임워크와 Prisma ORM을 결합하여 견고한 백엔드 API를 제공하며, BlockNote.js의 JSON 블록 기반 에디터를 프론트엔드의 핵심 기능으로 채택하여 기존 HTML 기반 에디터가 갖는 복잡한 파싱 문제를 해결한 것이 특징입니다.

## 핵심 파이프라인 (Core Pipeline)
1. **문서 편집 (WYSIWYG Editing)**
   - \`@blocknote/react\` 및 \`@mantine/core\`를 활용해, 노션(Notion) 스타일의 블록 기반 WYSIWYG 에디터를 클라이언트에 제공합니다.
   - 견적서의 가격 테이블이나 서식이 포함된 블록 입력이 발생하면, 클라이언트 전역 상태 관리도구인 \`zustand\`를 통해 데이터 레이어에 실시간으로 반영하며 \`totalAmount\`를 산출합니다.
2. **저장 및 상태 관리 (Database Operations)**
   - 작성된 복합 JSON 블록 데이터는 PostgreSQL 환경과 연동된 Prisma ORM을 통해 \`Quotation\` 테이블 내 \`blocks(Json)\` 데이터 타입으로 영속화됩니다. DRAFT, SENT 등의 상태(\`status\`)와 Soft Delete 지원 필드(\`deletedAt\`)를 활용해 안정적인 문서 라이프사이클을 제공합니다.
3. **문서 동적 렌더링 및 Export (PDF Rendering)**
   - 작성된 견적서를 고객에게 발송하기 위해 고안된 파이프라인입니다. HTML DOM을 \`html-to-image\`와 \`html2canvas\`로 캡처한 뒤, 이를 \`jspdf\`를 통해 스케일링된 A4 기반 PDF 바이너리 파일로 변환합니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
quote-builder/
├── src/
│   ├── app/                # Next.js 16 App Router 기반 경로 및 페이지 레이아웃
│   └── components/         # Radix UI, Blocknote 기반 에디터 구현체 및 디자인 시스템
├── prisma/
│   └── schema.prisma       # 문서 엔티티(Quotation 등) 정의 및 PostgreSQL 모델링
├── package.json            # 애플리케이션 디펜던시
└── tailwind.config.ts      # Tailwind 유틸리티 및 tw-animate-css 등 UI 토큰 관리
\`\`\`

## 상세 기능 구현 (Technical Implementation)
- **JSON 기반 블록 에디팅 구조**
  보안 결함(XSS)과 CSS 충돌에 취약한 기존 Text-to-HTML(Summernote 등) 에디터 대신, 순수 JSON 노드 구조(예: \`{ type: "header", data: ... }\`)로 데이터를 구조화하는 BlockNote를 채택하여 데이터 파싱의 무결성과 에디터 확장의 유연성을 확보했습니다.
- **클라이언트 사이드 PDF 오프로딩 로직**
  수많은 사용자가 동시에 PDF 생성을 요청할 경우 백엔드의 CPU/RAM 사용량이 기하급수적으로 높아지는 Server-Side 렌더링 방식의 단점을 해결하고자, 모든 PDF 캡쳐 및 Draw 연산을 브라우저 자원을 활용하는 Client-Side(jsPDF/html2canvas) 로 위임하도록 아키텍처를 그렸습니다.
- **강력한 데이터 유효성 및 권한 부여 체계**
  Prisma 레이어 위에서 Soft Delete(\`deletedAt\` != null 체크) 필터링을 기본으로 유지하고, \`ownerId\` 검증 로직으로 본인이 작성한 문서만 접근 가능하도록 하는 엄격한 Multi-Tenant 논리를 따르고 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Frontend Core**: Next.js 16.1, React 19, Tailwind CSS v4
- **Editor & UI**: \`@blocknote/react\`, \`@mantine/core\`, \`radix-ui\`, \`zustand\` (클라이언트 상태)
- **Database & ORM**: PostgreSQL, Prisma (\`@prisma/client\`, \`@prisma/adapter-pg\`)
- **PDF Generation**: \`jspdf\`, \`html2canvas\`, \`html-to-image\`
`, `@mantine/core`, `radix-ui`, `zustand` (클라이언트 상태)
- **Database & ORM**: PostgreSQL, Prisma (`@prisma/client`, `@prisma/adapter-pg`)
- **PDF Generation**: `jspdf`, `html2canvas`, `html-to-image`
`, \`@mantine/core\`, \`radix-ui\`, \`zustand\` (클라이언트 상태)
- **Database & ORM**: PostgreSQL, Prisma (\`@prisma/client\`, \`@prisma/adapter-pg\`)
- **PDF Generation**: \`jspdf\`, \`html2canvas\`, \`html-to-image\``,
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
    summary: "학습, 운동, 회고 등 개인의 성장 데이터를 추적하고 시각화하는 올인원 대시보드입니다.",
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
    summary: "사용자의 감정과 주변 환경 컨텍스트를 AI로 분석하여 개인화된 심리 치유 처방을 제공하는 Flutter 기반 모바일 웰니스 애플리케이션입니다.",
    description: `# 마음 약방 (Sumpyo AI)

## 프로젝트 개요 (Overview)
**마음 약방 (구 숨표 AI)**은 사용자의 감정을 분석하고 개인화된 심리 치유 처방전을 따뜻한 위로의 메시지로 제공하는 Flutter 기반 모바일 인공지능 애플리케이션입니다. 
복잡한 상태 관리를 Riverpod 기반 Clean Architecture로 추상화하였고, 오프라인 환경 대응을 위한 Local Storage(Hive)와 원격 서버(Supabase) 간의 양방향 동기화 구역을 설계하여 모바일 사용자들에게 안정적인 Wellness 경험을 제공합니다.

## 핵심 파이프라인 (Core Pipeline)
1. **사용자 컨텍스트 수집 (Context Gathering)**
   - 사용자의 입력뿐만 아니라 모바일 디바이스의 지리적 환경(Geolocator 기반 날씨나 지역 등)을 보조 데이터로 모바일 환경 내에서 로깅합니다.
2. **AI 처방전 생성 (AI Prescription)**
   - \`google_generative_ai\`를 활용하여 수집된 컨텍스트를 구조화된 프롬프트로 래핑하여 Gemini AI 모델로 요청, 감정 분석에 대한 위로와 행동 가이던스(처방전)를 응답받습니다.
3. **분산 저장소 처리 로직 (Local & Remote Store)**
   - 사용자의 민감한 기록과 처방 내용은 네트워크 불가 상황을 방어하기 위해 NoSQL 저장소인 \`Hive\`에 먼저 로컬 캐싱됩니다.
   - 인터넷 연결이 회복되는 라우팅 라이프사이클에서 \`Supabase\`를 통해 백업 및 원격 동기화를 비동기로 완료합니다.

## 프로젝트 구조 (Project Structure)
이 앱은 Feature-Driven Clean Architecture 기반으로 폴더를 응집화했습니다.
\`\`\`text
sumpyo-flutter-app/
├── lib/
│   ├── core/           # 공통 에러 핸들러, 네트워크 유틸, 플러그인 레지스트레이션
│   ├── features/       # 웰니스/사용자 감정 분석과 같은 도메인별 폴더
│   │   ├── .../domain          # 엔티티 (Freezed/Json Serializable) 및 레포지토리 인터페이스
│   │   ├── .../data            # Hive 로컬 데이터소스 및 Dio/Supabase API 구현체
│   │   └── .../presentation    # Riverpod 뷰모델 및 페이지 위젯 구현
│   └── shared/         # 전역 테마, Provider, 재사용 위젯 블록 (fl_chart 등)
├── doc/                        # 개발 로드맵 및 기술 명세서
└── pubspec.yaml                # 다트 종속성 관리 및 애셋 선언
\`\`\`

## 상세 기능 구현 (Technical Implementation)
- **선언적 뷰모델 바인딩 (Riverpod + Code Generation)**
  \`riverpod_annotation\`과 Freezed, Data Class Generator인 \`build_runner\`를 결합하여 개발 시 생기는 보일러플레이트를 대거 자동화했습니다. 도메인 레이어의 데이터 변이가 발생할 때 Immutable 객체를 복사하고 컴포넌트를 선언적으로 Rebuild하도록 설계했습니다.
- **GoRouter 기반 심층 네비게이션**
  모바일 앱 특성상 처방전 상세보기에서 메인, 설정 뷰로 넘어가는 복잡한 상태 천이를 \`go_router\` 딥링크 기반 경로로 추상화하여, 백스택(Back-Stack) 관리의 부작용이나 메모리 누수 오류를 방어했습니다.

## 사용 기술 및 라이브러리 (Tech Stack)
- **Framework & Language**: Flutter 3.27, Dart 3.6 
- **State Management**: flutter_riverpod 2.6
- **Routing**: go_router
- **Data Persistence**: Supabase (Remote DB/Auth), Hive 2.x (Local Cache Storage)
- **Code Generation**: Freezed, json_serializable
- **Tools / UI**: flutter_animate (상호작용 애니메이션), fl_chart (통계), google_generative_ai
`,
    techStack: ["Flutter", "Dart", "Firebase", "HealthKit", "Riverpod", "Hive"],
    liveUrl: "https://sumpyo.app",
    githubUrl: "https://github.com/tuosm/sumpyo-flutter-app",
    imageUrl: "/images/project-sumpyo.webp",
    accentColor: "#0ea5e9",
  },
  {
    id: "threads-autoposter",
    title: "Threads Auto-Poster",
    summary: "트렌드 키워드와 뉴스를 수집하여 AI 페르소나 기반의 스레드 콘텐츠로 변환하고 Meta Threads API를 통해 전 과정을 자동화하는 발행 서비스입니다.",
    description: `# 🧵 스레드 자동 게시 도구 (Threads Auto-Poster) - 프로젝트 상세 설명서

이 문서는 \`threads-autoposter\` 프로젝트의 아키텍처, 핵심 로직, 기능 구현 및 기술 스택에 대한 상세 정보를 제공합니다. 상위 프로젝트인 \`dev-portfolio\`에서 이 프로젝트를 참조하거나 전시할 때 활용할 수 있도록 작성되었습니다.

---

## 1. 프로젝트 개요

\`threads-autoposter\`는 매일 최신 테크 트렌드와 뉴스를 수집하여 AI(Google Gemini)를 통해 스레드(Threads) 환경에 최적화된 콘텐츠로 변환하고, Meta Threads API를 사용하여 자동으로 게시하는 **엔드 투 엔드(End-to-End) 자동화 서비스**입니다.

단순히 뉴스 링크를 공유하는 것을 넘어, AI가 "친근하고 똑똑한 테크 크리에이터"의 페르소나로 핵심 내용을 요약하고 본문과 댓글이 이어지는 스레드 형태로 풍성한 콘텐츠를 생성하는 것이 핵심입니다.

---

## 2. 핵심 파이프라인

이 서비스는 다음과 같은 6단계 파이프라인으로 작동합니다:

1. **멀티소스 크롤링 (Crawling)**: Hacker News, Reddit, dev.to에서 최근 24시간 내 발행된 테크/AI/개발 콘텐츠를 병렬로 수집합니다.
2. **AI 트렌드 분석 (Analysis)**: 수집된 기사들을 Gemini에게 전달하여 실제 화제가 되고 있는 토픽을 2~3개 선정합니다.
3. **중복 토픽 필터링 (Deduplication)**: 최근 7일 내 발행된 게시물과 주제가 겹치는 토픽을 Jaccard 유사도 + Gemini 시맨틱 판단으로 제거합니다.
4. **AI 콘텐츠 생성 (Generation)**: 선정된 토픽을 Gemini에게 전달합니다. Chain-of-Thought 프롬프팅, Few-Shot 예시, 구조 이력 인식을 통해 매번 다른 리듬과 구조의 글을 생성합니다.
5. **Threads 자동 게시 (Publishing)**: Meta Threads Graph API를 통해 본문 게시 후, 관련 댓글들을 순차적으로 게시하여 하나의 완성된 스레드를 구축합니다.
6. **자기강화 학습 (Self-Improvement)**: 파이프라인 완료 후, 댓글 2개 이상인 우수 게시물을 Few-Shot 예시로 자동 승격하여 시간이 지날수록 AI 글 품질이 향상됩니다.

---

## 3. 프로젝트 구조

\`\`\`text
threads-autoposter/
├── src/
│   ├── index.ts                    # 앱 진입점 및 CLI 명령어 처리
│   ├── server.ts                   # 대시보드 및 모니터링용 Express 서버
│   ├── auth/                       # Meta Threads OAuth 및 토큰 관리
│   ├── config/                     # 환경 변수, 스케줄, 설정 관리
│   ├── services/                   # 비즈니스 로직 핵심 서비스
│   │   ├── multi-source-crawler.ts # 외부 데이터 수집 (HN, Reddit, dev.to)
│   │   ├── trend-analyzer.ts       # Gemini 기반 트렌드 분석 및 토픽 선정
│   │   ├── topic-dedup.ts          # 중복 콘텐츠 게시 방지 (2단계 하이브리드)
│   │   ├── content-generator.ts    # Gemini AI 기반 글쓰기 엔진
│   │   ├── threads-publisher.ts    # Threads API 연동 및 게시 제어
│   │   └── scheduler.ts            # node-cron 기반 파이프라인 스케줄 관리
│   ├── utils/
│   │   ├── helpers.ts              # 유틸리티 (문장 경계 절단 등)
│   │   ├── logger.ts               # Winston 구조화 로거
│   │   ├── pending-posts-manager.ts # 게시물 상태 관리 + 예시 자동 승격
│   │   └── alert.ts                # 파이프라인 알림
│   └── types/                      # TypeScript 인터페이스 정의
├── data/
│   ├── examples.json               # Few-Shot 예시 (운영 중 자동 갱신)
│   ├── pending-posts.json          # 게시물 상태 데이터 (발행 이력 포함)
│   └── schedules.json              # 스케줄 설정 데이터
├── scripts/
│   ├── get-token.ts                # Threads 토큰 발급 CLI
│   └── analyze-quality.ts          # 콘텐츠 품질 분석 도구
└── src/__tests__/                  # Vitest 단위 테스트 (64개)
\`\`\`

---

## 4. 상세 기능 구현 내역

### 4.1. AI 콘텐츠 엔진 (\`ContentGenerator\`)

- **사고의 사슬(Chain-of-Thought) 프롬프팅**: AI에게 '분석 → 앵글 설정 → 포맷 선택 → 작성'의 순서로 사고하게 하여 단순 요약이 아닌 독자적 인사이트를 도출합니다.
- **예시 기반 학습(Few-Shot Learning)**: \`data/examples.json\`에서 서로 다른 포맷(FORMAT_A, FORMAT_CHAIN)의 예시를 최대 2개 선택하여 톤앤매너를 학습시킵니다.
- **구조 인식 이력(Structure-Aware History)**: 최근 5개 게시물의 훅 패턴, 포맷 종류, 본문 단락 수, 댓글 개수를 AI에게 전달하여 훅뿐 아니라 글 전체 구조가 반복되는 것을 방지합니다.
- **가변형 포맷**: 뉴스의 중요도와 복잡도에 따라 '단독 포스트(FORMAT_A)' 또는 '댓글 체인(FORMAT_CHAIN)'을 AI가 스스로 결정합니다.
- **문장 경계 절단**: 500자 제한 도달 시 문장 중간이 아닌 마지막 완전한 문장 위치에서 절단하여 자연스러운 마무리를 보장합니다.

### 4.2. 자기강화 학습 시스템 (\`promoteExcellentPosts\`)

파이프라인 실행 완료 시 자동으로 동작합니다:

- **기준**: 댓글 2개 이상의 발행 완료 게시물
- **동작**: \`data/examples.json\`에 자동 추가 (cap: 최대 10개)
- **보호 정책**: cap 초과 시 수동으로 큐레이션한 예시는 보호하고 오래된 자동 승격 항목을 우선 제거
- **효과**: 운영 기간이 길어질수록 AI 학습 예시의 품질이 실제 발행 데이터 기반으로 향상

### 4.3. 중복 토픽 필터 (\`TopicDeduplicator\`)

2단계 하이브리드 방식으로 중복 콘텐츠 게시를 방지합니다:

- **1단계 (빠른 필터)**: Jaccard 유사도 기반 키워드 비교. 유사도 ≥ 0.6이면 즉시 제거 (Gemini 호출 없음)
- **2단계 (시맨틱 판단)**: 유사도 0.2~0.6 구간의 모호한 케이스는 Gemini가 의미적 중복 여부를 판단
- **다른 앵글 허용**: 같은 사건이라도 다른 관점(기술 분석 vs 사회적 영향)이면 통과
- **Fail-Open**: Gemini 호출 실패 시 통과 처리하여 콘텐츠 누락 방지
- **비교 기간**: 최근 7일 내 발행 이력과 비교

### 4.4. 데이터 수집 엔진 (\`MultiSourceCrawler\`)

- **병렬 수집**: HN, Reddit, dev.to 3개 소스를 \`Promise.allSettled\`로 동시 크롤링
- **시간 필터**: 최근 24시간 내 발행된 콘텐츠만 수집
- **점수 기반 정렬**: 추천수(score), 댓글수를 기반으로 신뢰도 높은 콘텐츠 우선 선별
- **부분 실패 허용**: 특정 소스 수집 실패 시에도 나머지 소스 결과로 파이프라인 계속 진행

### 4.5. 품질 분석 도구 (\`analyze-quality\`)

\`\`\`bash
npm run quality [--n=20]
\`\`\`

최근 N개 발행 게시물에 대해 4가지 지표를 측정합니다:

| 지표 | 기준 |
|---|---|
| FORMAT 분포 | A/CHAIN 2가지 이상 사용 |
| 질문 마무리 비율 | 20% 이하 |
| REPLY1 첫 문구 반복 | 반복 없음 |
| 훅(첫 줄) 다양성 | 전체 고유 |

게시물이 **20개 이상** 쌓이면 quality 분석 결과를 생성 프롬프트에 자동 피드백하는 루프 구현 안내가 표시됩니다.

---

## 5. 사용 기술 및 라이브러리

### 핵심 스택

- **언어**: TypeScript (Strict Mode)
- **런타임**: Node.js
- **패키지 관리**: npm

### 통합 서비스

- **AI**: \`@google/genai\` (Google Gemini)
- **통신/크롤링**: \`axios\`
- **스케줄링**: \`node-cron\`
- **로깅**: \`winston\`

### 개발 및 운영

- **테스트**: \`vitest\` (64개 단위 테스트)
- **실행 환경**: \`tsx\`, \`pm2\`
- **컨테이너**: \`Dockerfile\` 기반 배포 지원

---

## 6. 프로젝트의 주요 강점

1. **인간 중심의 콘텐츠**: AI 특유의 기계적인 문체를 제거하고, 구조 이력 인식 + Few-Shot 예시를 통해 매번 다른 리듬과 구조의 글을 생성합니다.
2. **자기강화 루프**: 서비스 운영 데이터가 쌓일수록 Few-Shot 예시가 자동으로 갱신되어 AI 글 품질이 지속적으로 향상됩니다.
3. **지능형 중복 방지**: 단순 키워드 매칭을 넘어 Gemini 시맨틱 판단으로 의미적 중복을 제거하면서 다른 앵글의 게시는 허용합니다.
4. **안전한 인증 관리**: OAuth 2.0 흐름을 자동화하고, 토큰 만료를 감지하여 갱신 알림을 제공합니다.
5. **검증 시스템(Dry-run)**: 실제 게시 전 생성된 결과물을 확인하고 테스트할 수 있는 검증 모드를 제공합니다.
6. **높은 확장성**: 서비스 레이어가 분리된 구조로 새로운 데이터 소스나 게시 플랫폼을 추가하기 용이합니다.

---

이 프로젝트는 최신 AI 기술과 소셜 미디어 생태계를 결합하여 **완전 자동화된 콘텐츠 크리에이션**을 구현한 사례입니다.
`, `pm2`
- **컨테이너**: `Dockerfile` 기반 배포 지원

---

## 6. 프로젝트의 주요 강점

1. **인간 중심의 콘텐츠**: AI 특유의 기계적인 문체를 제거하고, 구조 이력 인식 + Few-Shot 예시를 통해 매번 다른 리듬과 구조의 글을 생성합니다.
2. **자기강화 루프**: 서비스 운영 데이터가 쌓일수록 Few-Shot 예시가 자동으로 갱신되어 AI 글 품질이 지속적으로 향상됩니다.
3. **지능형 중복 방지**: 단순 키워드 매칭을 넘어 Gemini 시맨틱 판단으로 의미적 중복을 제거하면서 다른 앵글의 게시는 허용합니다.
4. **안전한 인증 관리**: OAuth 2.0 흐름을 자동화하고, 토큰 만료를 감지하여 갱신 알림을 제공합니다.
5. **검증 시스템(Dry-run)**: 실제 게시 전 생성된 결과물을 확인하고 테스트할 수 있는 검증 모드를 제공합니다.
6. **높은 확장성**: 서비스 레이어가 분리된 구조로 새로운 데이터 소스나 게시 플랫폼을 추가하기 용이합니다.

---

이 프로젝트는 최신 AI 기술과 소셜 미디어 생태계를 결합하여 **완전 자동화된 콘텐츠 크리에이션**을 구현한 사례입니다.
`, \`pm2\`
*   **컨테이너**: \`Dockerfile\` 기반의 배포 자동화 지원

---

## 6. 프로젝트의 주요 가치

1.  **인간 중심의 콘텐츠**: AI 특유의 기계적인 문서체를 지양하고, "구어체 표현", "적절한 위트", "분석적 관점이 있는 인사이트" 등의 요소를 반영하여 실제 사람이 운영하는 느낌을 줍니다.
2.  **안전한 인증 관리**: OAuth 2.0 흐름을 자동화하고, 장기 액세스 토큰의 갱신을 자동으로 처리하여 번거로운 작업 없이 안전한 인증 체계를 구축하고 있습니다.
3.  **검증 시스템(Dry-run)**: 실제 게시 전 생성된 결과물을 확인하고 테스트할 수 있는 검증 모드를 제공하여 안정적인 운영이 가능합니다.
4.  **높은 확장성**: 서비스 레이어가 분리된 구조로 설계되어 새로운 소스나 게시 플랫폼을 추가하기 매우 용이합니다.

---

이 프로젝트는 최신 AI 기술과 소셜 미디어 플랫폼 생태계를 결합하여 **완전 자동화된 콘텐츠 크리에이터**를 구현한 사례입니다.`,
    techStack: ["Node.js", "TypeScript", "Gemini API", "Meta Threads API", "node-cron"],
    liveUrl: "https://threads-autoposter.vercel.app",
    githubUrl: "https://github.com/tuosm9390/threads-autoposter",
    imageUrl: "/images/project-threads-autoposter.webp",
    accentColor: "#000000",
  },
  {
    id: "agent-diary",
    title: "AgentDiary",
    summary: "AI 에이전트의 터미널 세션을 실시간 모니터링하고 작업 내용을 자동 요약 및 아티팩트로 추출하며 RAG 기반 로그 채팅을 지원하는 대시보드입니다.",
    description: `# AgentDiary: Real-time AI Agent Monitoring & Diary

**AgentDiary**는 AI 에이전트(예: Gemini CLI, Claude Code)의 터미널 작업 세션을 실시간으로 모니터링하고, 작업 내역을 자동으로 기록 및 요약하여 개발자의 작업 흐름을 체계적으로 관리해주는 데스크탑 애플리케이션입니다.

## 🚀 주요 기능

### 1. 실시간 터미널 모니터링 (Live View)
- **Multi-Session Support**: 여러 AI 에이전트 세션을 동시에 실행하고 모니터링할 수 있습니다.
- **PTY integration**: \`node-pty\`를 사용하여 실제 로컬 터미널 환경과 동일한 상호작용을 제공합니다.
- **Xterm.js Rendering**: 고성능 터미널 렌더링 엔진을 통해 쾌적한 로그 확인이 가능합니다.
- **Split Screen**: 여러 세션을 한눈에 볼 수 있는 분할 화면 모드를 지원합니다.

### 2. AI 기반 자동 요약 및 아티팩트 추출 (Diary View)
- **Automatic Logging**: 모든 터미널 출력(stdout/stderr)을 SQLite 데이터베이스에 영구 저장합니다.
- **AI Summarization**: 세션 종료 시 Google Gemini(2.5-flash 등)가 작업 내용을 분석하여 3~4줄의 한글 요약을 생성합니다.
- **Artifact Tracking**: 작업 중 수정된 파일 목록과 설치된 패키지 목록을 자동으로 추출하여 배지 형태로 표시합니다.
- **Search & Filter**: 과거 작업 내역을 제목, 명령어, 날짜 등으로 손쉽게 검색할 수 있습니다.

### 3. RAG 기반 로그 채팅 (Chat with Log)
- **Contextual Q&A**: 특정 세션의 로그 전체를 컨텍스트로 사용하여 AI와 대화할 수 있습니다. "이 작업에서 어떤 라이브러리를 왜 설치했지?", "수정한 코드의 핵심 로직이 뭐야?" 등의 질문이 가능합니다.
- **Persistent Chat History**: 로그와 관련된 대화 내역도 데이터베이스에 저장되어 나중에 다시 확인할 수 있습니다.

### 4. 생산성 도구
- **Export to Markdown**: 작업 요약과 로그를 포함한 마크다운 리포트를 즉시 생성하여 내보낼 수 있습니다.
- **Deep-linking**: 로그 내의 파일 경로를 감지하여 클릭 시 VS Code 등 편집기에서 바로 열 수 있는 기능을 지원합니다.
- **System Settings**: 사용 모델 선택 및 커스텀 프롬프트 지시사항을 통해 요약 품질을 제어할 수 있습니다.

## 🏗️ 프로젝트 구조

\`\`\`text
agent-diary/
├── app/                  # 메인 애플리케이션 (Next.js + Electron)
│   ├── src/
│   │   ├── app/          # Next.js App Router (UI 로직)
│   │   └── components/   # React 컴포넌트 (TerminalWindow 등)
│   ├── main.js           # Electron 메인 프로세스 (서버 실행 및 창 관리)
│   ├── server.js         # Node.js 백엔드 (Express, Socket.io, PTY, DB, AI)
│   └── db/               # SQLite 데이터베이스 및 설정 파일 저장소
├── prototype/            # 초기 기능 검증용 프로토타입 (Express + SQLite)
├── .specify/             # 프로젝트 스펙 및 태스크 관리를 위한 템플릿/스크립트
└── .gemini/commands/     # 프로젝트 전용 Gemini CLI 커스텀 커맨드 설정
\`\`\`

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Terminal UI**: Xterm.js

### Backend
- **Runtime**: Node.js (Express)
- **Real-time**: Socket.io
- **Process Management**: \`node-pty\` (Pseudo-terminal)
- **Database**: SQLite3
- **AI Integration**: \`@google/generative-ai\` (Gemini API)

### Desktop
- **Shell**: Electron
- **Packaging**: electron-builder

## 🧠 핵심 로직 흐름

1. **세션 시작**: 사용자가 디렉토리를 선택하고 에이전트를 실행하면, 백엔드에서 \`node-pty\`를 통해 쉘 프로세스를 생성합니다.
2. **데이터 스트리밍**: 쉘의 출력 데이터는 Socket.io를 통해 프론트엔드의 Xterm.js로 실시간 전달됨과 동시에, 메모리 부하를 줄이기 위해 로컬 임시 파일에 스트리밍 저장됩니다.
3. **세션 종료**: 프로세스가 종료되면 임시 파일의 로그를 읽어 Gemini API로 전달합니다. 
4. **AI 분석 (Map-Reduce)**: 로그가 너무 길 경우(10,000자 초과), 로그를 분할하여 요약한 뒤 최종 요약본을 생성하는 Map-Reduce 전략을 사용합니다.
5. **데이터 영속화**: 생성된 요약, 아티팩트 정보, 전체 로그를 SQLite에 저장하고 임시 파일을 삭제합니다.
6. **채팅 (RAG)**: 사용자가 채팅을 요청하면 해당 세션의 로그를 검색하여 Gemini의 System Instruction으로 삽입, 맥락에 맞는 답변을 생성합니다.
`,
    techStack: ["Next.js", "Electron", "SQLite", "Socket.io", "Gemini API"],
    liveUrl: "https://agent-diary.vercel.app",
    githubUrl: "https://github.com/tuosm9390/agent-diary",
    imageUrl: "/images/project-agent-diary.webp",
    accentColor: "#3b82f6",
  },
  {
    id: "cafe-book",
    title: "Cafe Book (카페 도감)",
    summary: "방문한 카페를 지도에 기록하고 나만의 커피 레시피를 공유하는 플랫폼으로, 카카오 지도 API와 Firebase 실시간 동기화를 활용한 GIS 기반 서비스입니다.",
    description: `# Cafe Book (카페 도감)

## 프로젝트 개요 (Overview)
**Cafe Book(카페 도감)**은 사용자들이 방문한 카페를 지도 상에 기록하고, 자신만의 스페셜티 커피 추출 레시피를 공유할 수 있는 커뮤니티 기반의 웹 애플리케이션입니다.
프론트엔드 중심의 아키텍처로 설계되었으며, Firebase를 BaaS(Backend as a Service)로 활용하여 사용자의 인증 및 실시간 데이터 관리를 수행합니다. 카카오 지도 API를 깊게 통합하여 직관적인 지리 정보 서비스(GIS) 커스텀 뷰를 제공하는 것이 핵심 기능 중 하나입니다.

## 핵심 파이프라인 (Core Pipeline)
이 애플리케이션은 클라이언트 사이드 렌더링(SPA) 방식으로 동작하며, 주요 데이터 흐름은 다음과 같습니다.

1. **사용자 인증 및 권한 관리 (\`lib/firebase.ts\`, \`auth.ts\`)**
   - Firebase Auth를 활용하여 사용자 인증(이메일, 소셜 로그인)을 처리합니다.
   - 라우팅 단에서 \`<ProtectedRoute>\` 컴포넌트를 통해 로그인 여부를 검증하고, 미인증 사용자의 접근을 차단합니다.
2. **지도 기반 카페 탐색 및 조작 (\`cafeApi.ts\`, \`kakaoApi.ts\`)**
   - **지도 렌더링**: \`react-kakao-maps-sdk\`를 통해 사용자의 현재 위치 또는 선택된 영역의 카페 핀을 렌더링합니다.
   - **데이터 패칭**: Firestore의 \`cafes\` 컬렉션에서 카페 메타데이터(좌표 포함)를 가져옵니다. 
   - **이미지 자동화**: 사용자가 새 카페를 등록할 때 Kakao Search REST API(\`searchCafeImages\`)를 호출하여 해당 카페의 이미지를 자동으로 수집 및 매핑합니다.
3. **커피 레시피 공유 및 관리 (\`recipeApi.ts\`, \`types/recipe.ts\`)**
   - 원두 정보, 물 온도, 추출 비율(Ratio) 및 각 단계별 추출 시간(ExtractionStep)을 세밀하게 설정할 수 있는 커스텀 데이터 스키마를 구성했습니다.
   - 최신순/인기순 조회 등의 데이터를 Firestore Index를 통해 최적화하여 쿼리합니다.
4. **Mocking 기반 E2E 테스트 파이프라인**
   - Playwright 기반의 통합 테스트 시, 프로덕션 데이터 오염을 방지하기 위해 API 레이어 단에서 \`window.isE2ETest\` 플래그를 검사합니다.
   - 테스트 환경에서는 Firestore 대신 LocalStorage를 활용한 Mock 데이터 저장소(\`mock_cafes\`, \`mock_recipes\`)로 요청을 가로채어 빠르고 독립적인 테스트 환경을 구축했습니다.

## 프로젝트 구조 (Project Structure)
\`\`\`text
cafe-book/
├── src/
│   ├── api/             # Firebase 및 서드파티(Kakao) API 통신 레이어
│   │   ├── auth.ts      # 유저 인증 허브
│   │   ├── cafeApi.ts   # 카페 데이터 CRUD 로직
│   │   ├── recipeApi.ts # 레시피 데이터 CRUD 로직
│   │   └── kakaoApi.ts  # Kakao REST API 래퍼
│   ├── components/      # UI 컴포넌트 세트 (Radix UI 기반)
│   ├── pages/           # React Router 뷰 단위 컴포넌트
│   │   ├── MapPage.tsx    # 메인 지도/탐색 뷰
│   │   └── RecipeDetailPage.tsx # 레시피 상세 설명 뷰
│   ├── types/           # 전역 TypeScript 타입 선언
│   │   └── recipe.ts    # 레시피 엔티티 인터페이스
│   ├── App.tsx          # 최상위 라우팅 및 레이아웃 컨텍스트
│   └── main.tsx         # 진입점 (Vite 기반)
├── tests/               # Vitest 기반 단위 테스트
├── specs/               # Playwright 기반 E2E 테스트 시나리오
└── firebase.json        # Firebase 배포 및 보안 정책 (Security Rules)
\`\`\`

## 상세 기능 구현 (Technical Implementation)

- **커스텀 커피 추출 스키마 구현**
  커피 레시피를 단순히 텍스트로 저장하는 것이 아니라, \`ExtractionStep\` 인터페이스를 통해 푸어오버(Pour-over) 등의 세밀한 드립 커피 정보를 등록할 수 있습니다. 각 단계별 물 투입량, 누적량, 소요 시간을 계량화하여 저장하고 클라이언트에 타이머 등 부가 기능을 제공하기 쉬운 구조입니다.
- **데이터 흐름 위임에 따른 레이어 분리**
  View 영역(\`pages/\`)에는 UI 렌더링에만 집중하고, 실제 비즈니스 로직(예: Firestore 쿼리, Timestamp 파싱 등)은 \`api/\` 디렉토리에 추상화시켜 관리합니다. 이를 통해 Firebase를 다른 데이터베이스로 마이그레이션하거나 테스트 코드 작성 시 의존성을 낮췄습니다.
- **보안을 고려한 Lazy Migration**
  레시피 데이터에 \`startTime\`과 같은 신규 필드가 추가되었을 때, 기존 과거 데이터를 백엔드에서 억지로 일괄 마이그레이션(Batch Update)하지 않고, 클라이언트 \`getRecipesByUserId\` 패치 시점에서 스키마를 평가하여 기본값을 주입하는 방식(Lazy Migration)을 택해 데이터베이스 트랜잭션 오버헤드를 막고 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: React Router DOM v7
- **Styling/UI**: Tailwind CSS 3.4, Radix UI(접근성 높은 Headless UI), Lucide React(아이콘)
- **Backend / Database**: Firebase v10 (Firestore, Firebase Auth)
- **Mapping Service**: Kakao Maps API, Kakao SDK (\`react-kakao-maps-sdk\`)
- **Testing**: Vitest (Unit Test), Playwright (E2E Test)

## 주요 구현 특징 (Key Highlights)

1. **Smart E2E Test Strategy**
   Playwright 환경에서 브라우저가 실행될 때 브라우저 윈도우 객체에 테스트 플래그를 심고, API 유틸에서 이를 런타임에 감지하여 \`localStorage\` 모의 저장소로 전환하는 "Runtime Mocking" 아키텍처를 구현했습니다. 이 전략은 별도의 Mocking 서버를 띄우지 않고도 프론트엔드 기능을 완벽하게 검증할 수 있게 합니다.
2. **지도와 데이터의 매끄러운 바인딩**
   카카오 지도의 클러스터링/마커 표시 기능과 Firebase의 실시간 데이터 스트리밍을 결합하여, 유저가 바라보는 지도 위치상에 존재하는 카페 데이터를 능동적으로 렌더링하는 UX를 제공합니다.
3. **Headless 컴포넌트를 활용한 디자인 시스템**
   Tailwind CSS의 유틸리티 클래스와 Radix UI의 동작(Behavior) 스크립트를 결합(예: \`components/ui/\`)하여, 재사용성이 높고 접근성 표준(WAI-ARIA)을 준수하는 모던한 디자인 뼈대를 구축했습니다.
`, `auth.ts`)**
   - Firebase Auth를 활용하여 사용자 인증(이메일, 소셜 로그인)을 처리합니다.
   - 라우팅 단에서 `<ProtectedRoute>` 컴포넌트를 통해 로그인 여부를 검증하고, 미인증 사용자의 접근을 차단합니다.
2. **지도 기반 카페 탐색 및 조작 (`cafeApi.ts`, `kakaoApi.ts`)**
   - **지도 렌더링**: `react-kakao-maps-sdk`를 통해 사용자의 현재 위치 또는 선택된 영역의 카페 핀을 렌더링합니다.
   - **데이터 패칭**: Firestore의 `cafes` 컬렉션에서 카페 메타데이터(좌표 포함)를 가져옵니다. 
   - **이미지 자동화**: 사용자가 새 카페를 등록할 때 Kakao Search REST API(`searchCafeImages`)를 호출하여 해당 카페의 이미지를 자동으로 수집 및 매핑합니다.
3. **커피 레시피 공유 및 관리 (`recipeApi.ts`, `types/recipe.ts`)**
   - 원두 정보, 물 온도, 추출 비율(Ratio) 및 각 단계별 추출 시간(ExtractionStep)을 세밀하게 설정할 수 있는 커스텀 데이터 스키마를 구성했습니다.
   - 최신순/인기순 조회 등의 데이터를 Firestore Index를 통해 최적화하여 쿼리합니다.
4. **Mocking 기반 E2E 테스트 파이프라인**
   - Playwright 기반의 통합 테스트 시, 프로덕션 데이터 오염을 방지하기 위해 API 레이어 단에서 `window.isE2ETest` 플래그를 검사합니다.
   - 테스트 환경에서는 Firestore 대신 LocalStorage를 활용한 Mock 데이터 저장소(`mock_cafes`, `mock_recipes`)로 요청을 가로채어 빠르고 독립적인 테스트 환경을 구축했습니다.

## 프로젝트 구조 (Project Structure)
```text
cafe-book/
├── src/
│   ├── api/             # Firebase 및 서드파티(Kakao) API 통신 레이어
│   │   ├── auth.ts      # 유저 인증 허브
│   │   ├── cafeApi.ts   # 카페 데이터 CRUD 로직
│   │   ├── recipeApi.ts # 레시피 데이터 CRUD 로직
│   │   └── kakaoApi.ts  # Kakao REST API 래퍼
│   ├── components/      # UI 컴포넌트 세트 (Radix UI 기반)
│   ├── pages/           # React Router 뷰 단위 컴포넌트
│   │   ├── MapPage.tsx    # 메인 지도/탐색 뷰
│   │   └── RecipeDetailPage.tsx # 레시피 상세 설명 뷰
│   ├── types/           # 전역 TypeScript 타입 선언
│   │   └── recipe.ts    # 레시피 엔티티 인터페이스
│   ├── App.tsx          # 최상위 라우팅 및 레이아웃 컨텍스트
│   └── main.tsx         # 진입점 (Vite 기반)
├── tests/               # Vitest 기반 단위 테스트
├── specs/               # Playwright 기반 E2E 테스트 시나리오
└── firebase.json        # Firebase 배포 및 보안 정책 (Security Rules)
```

## 상세 기능 구현 (Technical Implementation)

- **커스텀 커피 추출 스키마 구현**
  커피 레시피를 단순히 텍스트로 저장하는 것이 아니라, `ExtractionStep` 인터페이스를 통해 푸어오버(Pour-over) 등의 세밀한 드립 커피 정보를 등록할 수 있습니다. 각 단계별 물 투입량, 누적량, 소요 시간을 계량화하여 저장하고 클라이언트에 타이머 등 부가 기능을 제공하기 쉬운 구조입니다.
- **데이터 흐름 위임에 따른 레이어 분리**
  View 영역(`pages/`)에는 UI 렌더링에만 집중하고, 실제 비즈니스 로직(예: Firestore 쿼리, Timestamp 파싱 등)은 `api/` 디렉토리에 추상화시켜 관리합니다. 이를 통해 Firebase를 다른 데이터베이스로 마이그레이션하거나 테스트 코드 작성 시 의존성을 낮췄습니다.
- **보안을 고려한 Lazy Migration**
  레시피 데이터에 `startTime`과 같은 신규 필드가 추가되었을 때, 기존 과거 데이터를 백엔드에서 억지로 일괄 마이그레이션(Batch Update)하지 않고, 클라이언트 `getRecipesByUserId` 패치 시점에서 스키마를 평가하여 기본값을 주입하는 방식(Lazy Migration)을 택해 데이터베이스 트랜잭션 오버헤드를 막고 있습니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: React Router DOM v7
- **Styling/UI**: Tailwind CSS 3.4, Radix UI(접근성 높은 Headless UI), Lucide React(아이콘)
- **Backend / Database**: Firebase v10 (Firestore, Firebase Auth)
- **Mapping Service**: Kakao Maps API, Kakao SDK (`react-kakao-maps-sdk`)
- **Testing**: Vitest (Unit Test), Playwright (E2E Test)

## 주요 구현 특징 (Key Highlights)

1. **Smart E2E Test Strategy**
   Playwright 환경에서 브라우저가 실행될 때 브라우저 윈도우 객체에 테스트 플래그를 심고, API 유틸에서 이를 런타임에 감지하여 `localStorage` 모의 저장소로 전환하는 "Runtime Mocking" 아키텍처를 구현했습니다. 이 전략은 별도의 Mocking 서버를 띄우지 않고도 프론트엔드 기능을 완벽하게 검증할 수 있게 합니다.
2. **지도와 데이터의 매끄러운 바인딩**
   카카오 지도의 클러스터링/마커 표시 기능과 Firebase의 실시간 데이터 스트리밍을 결합하여, 유저가 바라보는 지도 위치상에 존재하는 카페 데이터를 능동적으로 렌더링하는 UX를 제공합니다.
3. **Headless 컴포넌트를 활용한 디자인 시스템**
   Tailwind CSS의 유틸리티 클래스와 Radix UI의 동작(Behavior) 스크립트를 결합(예: `components/ui/`)하여, 재사용성이 높고 접근성 표준(WAI-ARIA)을 준수하는 모던한 디자인 뼈대를 구축했습니다.
`, \`auth.ts\`)**
   - Firebase Auth를 활용하여 사용자 인증(이메일, 소셜 로그인 등)을 처리합니다.
   - 라우터 단에서 \`<ProtectedRoute>\` 컴포넌트를 통해 로그인 여부를 검증하고, 미인증 사용자의 접근을 차단합니다.
2. **지도 기반 카페 탐색 및 등록 (\`cafeApi.ts\`, \`kakaoApi.ts\`)**
   - **지도 렌더링**: \`react-kakao-maps-sdk\`를 통해 사용자의 현재 위치 또는 특정 상태의 영업 중인 카페 핀을 렌더링합니다.
   - **데이터 캐싱**: Firestore의 \`cafes\` 컬렉션에서 카페 메타데이터(좌표 포함)를 가져옵니다. 
   - **이미지 자동화**: 사용자가 새 카페를 등록할 때 Kakao Search REST API(\`searchCafeImages\`)를 호출하여 해당 카페의 이미지를 자동으로 수집 및 매칭합니다.
3. **커피 레시피 공유 및 관리 (\`recipeApi.ts\`, \`types/recipe.ts\`)**
   - 원두 정보, 물 온도, 추출 비율(Ratio) 및 각 단계별 추출 시간(ExtractionStep)을 세밀하게 설정할 수 있는 커스텀 데이터 스토리지 구조를 구성했습니다.
   - 최신순/인기순 조회 등의 데이터를 Firestore Index를 통해 최적화하여 쿼리합니다.
4. **Mocking 기반 E2E 테스트 파이프라인**
   - Playwright 기반의 통합 테스트 시, 네트워크 상태나 데이터 오염을 방지하기 위해 API 레이어 단계에서 \`window.isE2ETest\` 플래그를 겁니다.
   - 테스트 환경에서는 Firestore 대신 LocalStorage를 활용한 Mock 데이터 저장소(\`mock_cafes\`, \`mock_recipes\`)로 요청을 가로채고 응답하는 테스트 환경을 구축했습니다.

## 프로젝트 구조 (Project Structure)

\`\`\`text
cafe-book/
├── src/
│   ├── api/             # Firebase 및 서드파티(Kakao) API 통신 레이어
│   │   ├── auth.ts      # 사용자 인증 핸들러
│   │   ├── cafeApi.ts   # 카페 데이터 CRUD 로직
│   │   ├── recipeApi.ts # 레시피 데이터 CRUD 로직
│   │   └── kakaoApi.ts  # Kakao REST API 래퍼
│   ├── components/      # UI 컴포넌트 세트 (Radix UI 기반)
│   ├── pages/           # React Router 기반의 각 페이지 컴포넌트
│   │   ├── MapPage.tsx    # 메인 지도/도감 뷰
│   │   └── RecipeDetailPage.tsx # 레시피 상세 설명 뷰
│   ├── types/           # 전역 TypeScript 정의 설정
│   │   └── recipe.ts    # 레시피 엔티티 인터페이스
│   ├── App.tsx          # 최상위 라우팅 및 레이아웃 컴포넌트
│   └── main.tsx         # 진입점 (Vite 기반)
├── tests/               # Vitest 기반 단위 테스트
├── specs/               # Playwright 기반 E2E 테스트 시나리오
└── firebase.json        # Firebase 배포 및 보안 정책 (Security Rules)
\`\`\`

## 상세 기술 구현 (Technical Implementation)

- **커피 추출 상태 머신 구현**
  커피 레시피를 단순한 텍스트로 저장하는 것이 아니라, \`ExtractionStep\` 인터페이스를 통해 푸어오버(Pour-over) 등의 세밀한 단계별 정보를 등록할 수 있습니다. 각 단계별 물 주입량, 비율, 소요 시간을 계산화하여 저장하고 클라이언트에 타임라인 등으로 시각화 기능을 제공하기 위한 구조입니다.
- **데이터 정합성 유지를 위한 레이어 분리**
  View 영역(\`pages/\`)은 UI 렌더링에만 집중하고, 실제 비즈니스 로직(예: Firestore 쿼리, Timestamp 파싱 등)은 \`api/\` 디렉토리에 추상화시켜 관리합니다. 이를 통해 Firebase를 다루는 데이터베이스 로직이 바뀌더라도 UI 코드를 수정하지 않고 테스트 코드를 작성 시의 일관성을 유지합니다.
- **보안을 고려한 Lazy Migration**
  레시피 데이터에 \`startTime\`과 같은 새로운 필드가 추가되었을 때, 기존 과거 데이터를 백엔드에서 한꺼번에 업데이트(Batch Update)하지 않고, 클라이언트가 \`getRecipesByUserId\` 호출 시점에 상태를 평가하여 기본값을 주입하는 방식(Lazy Migration)을 채택하여 데이터베이스 부하를 최소화하고 데이터 정합성을 유지합니다.

## 사용 기술 및 라이브러리 (Tech Stack)

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: React Router DOM v7
- **Styling/UI**: Tailwind CSS 3.4, Radix UI(접근성 높은 Headless UI), Lucide React(아이콘)
- **Backend / Database**: Firebase v10 (Firestore, Firebase Auth)
- **Mapping Service**: Kakao Maps API, Kakao SDK (\`react-kakao-maps-sdk\`)
- **Testing**: Vitest (Unit Test), Playwright (E2E Test)

## 주요 구현 특징 (Key Highlights)

1. **Smart E2E Test Strategy**
   Playwright 환경에서 네트워크 의존성을 제거하기 위해 테스트 플래그를 심고, API 유틸에서 이를 감지하여 localStorage 모의 저장소로 전환하는 "Runtime Mocking" 아키텍처를 구현했습니다. 이 전략은 별도의 Mocking 서버를 띄우지 않고도 프로젝트의 기능을 완벽하게 검증할 수 있게 합니다.
2. **지도와 데이터의 매끄러운 바인딩**
   카카오 지도의 클러스터링/마커 표시 기능과 Firebase의 실시간 데이터 스트리밍을 결합하여, 사용자가 바라보는 지도 위치 상태에 존재하는 카페 데이터를 능동적으로 렌더링하는 UX를 제공합니다.
3. **Headless 컴포넌트를 활용한 디자인 시스템**
   Tailwind CSS의 유틸리티 클래스와 Radix UI의 동작(Behavior) 스택을 결합하여, 재사용성이 높고 접근성 표준(WAI-ARIA)을 준수하는 모던한 디자인 시스템을 구현했습니다.`,
    techStack: ["React", "TypeScript", "Firebase", "Kakao Maps API", "Tailwind CSS"],
    liveUrl: "https://cafe-book.vercel.app",
    imageUrl: "/images/project-cafe-book.webp",
    accentColor: "#ff9800",
  },
];
