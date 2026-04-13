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
    summary:
      "사용자의 사진과 텍스트를 기반으로 전문가 수준의 퍼스널 컬러, 체형, 분위기를 분석하여 최적의 페르소나 스타일 리포트를 제공하는 Full-Stack 플랫폼입니다.",
    description: `# PersonaStyle — AI 퍼스널 스타일 & 컬러 분석 서비스

## 프로젝트 개요 (Overview)

PersonaStyle은 **Google Gemini AI**를 핵심 엔진으로 활용하는 퍼스널 컬러 및 스타일 분석 서비스다. 사진 한 장 혹은 텍스트 자기소개만으로 AI가 퍼스널 컬러 시즌, 체형, 얼굴형을 분석하고, 패션·뷰티·라이프스타일 전반에 걸친 구체적인 스타일링 가이드를 제공한다.

단순한 분석을 넘어 **바이럴 공유 카드 생성**, **페르소나 궁합 매칭**, **실시간 트렌드 집계**, **프리미엄 PDF 리포트**까지 갖춘 완결된 SaaS 프로덕트다.

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19 |
| 언어 | TypeScript (strict) |
| AI | Google Gemini 1.5 Flash / Pro |
| 백엔드/DB | Supabase (PostgreSQL + pgvector + RLS) |
| 인증 | Supabase Auth (Magic Link, Social Login) |
| 결제 | Portone (iamport) |
| 모니터링 | Sentry (서버/엣지/클라이언트 전계층) |
| 배포 | Vercel |

---

## 핵심 파이프라인 (Core Pipeline)

\`\`\`
[사용자 입력]
    │
    ├─ 사진 업로드 → 클라이언트에서 압축 (1024px, quality 0.7)
    └─ 텍스트 입력 → 그대로 전달
           │
           ▼
[POST /api/analyze]
    │  1. Zod 스키마 검증 (analyzeRequestSchema)
    │  2. 입력 모드 판별 (photo / text / combined)
    │  3. AnalysisService.performAnalysis() 실행
    │       ├─ buildPrompt() → 모드별 프롬프트 조립
    │       ├─ FALLBACK_MODELS 순회 (Pro → Flash → Flash-8B)
    │       │     ├─ 성공 → JSON 파싱 + Zod VisualProfile 검증
    │       │     ├─ RATE_LIMIT → 재시도 대기 후 retry
    │       │     ├─ DAILY_QUOTA_EXHAUSTED → 다음 모델로 전환
    │       │     └─ SPENDING_CAP / INVALID_KEY → 즉시 중단 & 에러 throw
    │       └─ 범주화된 GeminiErrorInfo 반환 (7가지 에러 유형)
    │
    ▼
[클라이언트 수신]
    │  1. saveAnalysisToHistory() 실행
    │       ├─ Supabase 세션 있음 → DB INSERT (analysis_history)
    │       └─ 세션 없음 → LocalStorage fallback (최대 20개)
    │  2. AnalysisResultDisplay 렌더링
    │
    ▼
[공유 / 확장]
    ├─ GET /api/share/[id]      → Satori + Resvg로 1080×1920 PNG 생성
    ├─ POST /api/match          → pgvector 코사인 유사도 + Gemini 궁합 텍스트
    ├─ GET /api/trend           → persona_stats 테이블 실시간 조회
    └─ POST /api/premium/analyze → Gemini 1.5 Pro 심층 분석 + PDF 생성
\`\`\`

---

## 프로젝트 구조 (Project Structure)

\`\`\`
src/
├── app/                          # Next.js App Router (페이지 + API)
│   ├── api/
│   │   ├── analyze/              # 메인 분석 API
│   │   ├── share/[id]/           # 공유 카드 이미지 생성 API
│   │   ├── match/                # 페르소나 매칭 API
│   │   ├── trend/                # 트렌드 통계 API
│   │   ├── premium/
│   │   │   ├── analyze/          # 프리미엄 심층 분석 API
│   │   │   └── pdf/[id]/         # PDF 리포트 다운로드 API
│   │   └── payment/verify/       # 결제 검증 API (Portone)
│   ├── analyze/
│   │   ├── page.tsx              # 분석 입력 페이지 (Client Component)
│   │   └── [id]/page.tsx         # 공유 가능한 분석 결과 페이지 (SSR + 동적 OG)
│   ├── history/                  # 분석 히스토리
│   ├── match/                    # 페르소나 매칭
│   ├── trend/                    # 트렌드 페이지
│   ├── premium/[id]/             # 프리미엄 리포트
│   ├── checkout/                 # 결제 체크아웃
│   └── login/                    # 로그인 (Magic Link + Social)
│
├── features/                     # 기능 기반 아키텍처
│   ├── analyze/
│   │   ├── components/           # UploadForm, TextInput, AnalysisResult
│   │   └── services/
│   │       └── analysisService.ts  # 핵심 분석 서비스 (폴백 로직 포함)
│   ├── home/                     # HeroSection, FeaturesSection
│   ├── shared/
│   │   ├── components/           # ShareImage (Satori용 React 컴포넌트)
│   │   ├── hooks/
│   │   └── types/
│   ├── match/                    # 매칭 UI
│   └── premium/
│       └── components/
│           └── PDFTemplate.tsx   # @react-pdf/renderer 기반 PDF 템플릿
│
├── lib/                          # 공유 유틸리티 및 서비스 레이어
│   ├── gemini.ts                 # Gemini 클라이언트 + 에러 분류기 (7종)
│   ├── prompts.ts                # 모드별 프롬프트 팩토리 (image/text/combined/premium)
│   ├── validation.ts             # Zod 스키마 (요청 + VisualProfile)
│   ├── history.ts                # 하이브리드 히스토리 (Supabase + LocalStorage)
│   ├── matching.ts               # 벡터 유사도 + Gemini 궁합 텍스트
│   ├── payment.ts                # Portone 결제 트랜잭션 관리
│   ├── pdf.tsx                   # React PDF 스트림/버퍼 생성
│   ├── trend.ts                  # 페르소나 통계 RPC 호출
│   ├── logger.ts                 # Sentry 연동 구조화 로거
│   └── supabase/                 # 서버/클라이언트 Supabase 클라이언트
│
├── types/
│   ├── types.ts                  # AnalysisResult, VisualAnalysisProfile 등 핵심 타입
│   └── viral.ts                  # PersonaDesignConfig, PERSONA_DESIGN_TOKENS
│
├── contexts/
│   ├── AuthContext.tsx           # Supabase 세션 전역 관리
│   └── LanguageContext.tsx       # ko / en 다국어 전환
│
└── middleware.ts                 # Supabase SSR 세션 갱신 (Edge Runtime)
\`\`\`

---

## 상세 기능 구현 (Technical Implementation)

### 1. 멀티모달 AI 분석 엔진

**핵심 문제**: Gemini API 할당량 초과 및 일시적 제한 발생 시 서비스 중단 방지

**해결 방법**: \`AnalysisService\`에 3단계 폴백 시스템 구현

\`\`\`typescript
// 모델 우선순위: Pro → Flash → Flash-8B
const FALLBACK_MODELS = [PREMIUM_MODEL_NAME, DEFAULT_MODEL, "gemini-1.5-flash-8b"];

for (const modelName of FALLBACK_MODELS) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try { /* ... */ }
    catch (err) {
      const errorInfo = categorizeGeminiError(err); // 7가지 에러 유형 분류
      if (errorInfo.type === "DAILY_QUOTA_EXHAUSTED") break; // 다음 모델로
      if (errorInfo.type === "RATE_LIMIT") await sleep(retryDelay); // 재시도
      if (errorInfo.type === "SPENDING_CAP_EXHAUSTED") throw; // 즉시 중단
    }
  }
}
\`\`\`

**입력 모드 3가지** — 모드에 따라 프롬프트가 다르게 조립된다:
- \`photo\`: 사진만 → \`ADVANCED_VISUAL_ANALYSIS_INSTRUCTION\` + Fitzpatrick Scale 기반 피부톤 정규화
- \`text\`: 텍스트만 → 성격/상황 기반 추론 프롬프트
- \`combined\`: 사진 + 텍스트 → 시각 분석과 자기소개를 교차 분석하는 통합 프롬프트

**응답 스키마**: AI 응답을 Zod \`visualAnalysisSchema\`로 검증. 얼굴형(6종), 체형(6종), Fitzpatrick 피부톤(6단계) 등 열거형 값으로 정규화.

---

### 2. 서버사이드 공유 카드 생성

**기술**: Satori (JSX → SVG) + @resvg/resvg-js (SVG → PNG)

분석 결과의 \`persona_type\`에 따라 \`PERSONA_DESIGN_TOKENS\`에서 고유한 배경색, 패턴 유형, 액센트 컬러를 결정한다. 최종 이미지는 **1080×1920 (9:16)** PNG로 생성되어 소셜 미디어 공유에 최적화된다.

\`\`\`typescript
// 폰트는 최초 요청 시 한 번만 로드하여 메모리 캐싱
let fontCache: ArrayBuffer | null = null;

const svg = await satori(<ShareCard data={...} />, {
  width: 1080, height: 1920,
  fonts: [{ name: 'Noto Sans KR', data: fontCache!, weight: 400 }],
});
const png = new Resvg(svg).render().asPng();
\`\`\`

생성된 이미지는 \`Cache-Control: public, max-age=31536000, immutable\`로 CDN 영구 캐싱된다. 이미지 접근 시 \`share_count\`도 원자적으로 증가한다.

분석 결과 페이지(\`/analyze/[id]\`)는 **동적 OG 메타태그**를 서버에서 생성하여 SNS 공유 시 분석 결과 카드가 자동으로 미리보기에 표시된다.

---

### 3. 벡터 기반 페르소나 궁합 매칭

**기술 스택**: pgvector (PostgreSQL 확장) + Gemini Embedding (1536차원)

Supabase에 \`vector(1536)\` 컬럼을 갖는 \`analysis_history\` 테이블에 각 분석의 임베딩이 저장된다. 궁합 계산은 PostgreSQL RPC 함수를 통해 서버에서 수행된다.

\`\`\`sql
-- 코사인 유사도 계산 (pgvector 코사인 거리 연산자)
RETURN 1 - (v1 <=> v2);
\`\`\`

매칭 결과는 단순 점수를 넘어, Gemini가 두 페르소나 유형과 점수를 바탕으로 **한국어 궁합 리포트 텍스트**를 생성한다. 보안상 \`source_id\`의 소유권을 서버에서 검증한 후에만 매칭이 실행된다.

---

### 4. 프리미엄 분석 + PDF 리포트

**접근 제어**: 프리미엄 분석 API는 \`payment_transactions\` 테이블의 \`status = 'paid'\` 레코드를 서버에서 직접 확인한다. 클라이언트에서 넘어오는 어떤 값도 신뢰하지 않는 Zero-Trust 접근 방식.

**분석 수준**: 기본 분석이 \`gemini-1.5-flash\`를 사용한다면, 프리미엄은 \`gemini-1.5-pro\`를 사용하며 프롬프트도 전혀 다르다. 컬러 심리학, 퍼스널 브랜드 전략, 비즈니스/소셜/캐주얼 시나리오별 파워 드레싱 가이드, 1년 액션 플랜까지 생성된다.

**PDF 생성**: \`@react-pdf/renderer\`의 \`renderToBuffer()\`로 \`PDFTemplate\` React 컴포넌트를 서버에서 직접 PDF 바이너리로 변환한다.

---

### 5. 하이브리드 데이터 지속성

로그인 여부에 상관없이 서비스가 동작하도록 이중 저장 전략을 구현했다.

| 조건 | 저장소 | 특징 |
|------|--------|------|
| 로그인 + Supabase 설정 됨 | Supabase DB | UUID로 영구 공유 가능, 크로스 디바이스 동기화 |
| 비로그인 | LocalStorage | 최대 20개, 브라우저 내 임시 저장 |

\`saveAnalysisToHistory()\`는 Supabase 저장 실패 시 자동으로 LocalStorage로 폴백하며, 반환값으로 사용 가능한 ID를 항상 제공한다.

---

### 6. 보안 및 관측 가능성

**Row Level Security (RLS)**: 모든 테이블에 RLS를 활성화. 각 정책은 \`auth.uid() = user_id\` 조건으로 소유권을 강제한다. 프리미엄 리포트는 결제 완료 레코드가 존재하는 경우에만 SELECT를 허용하는 복합 정책을 적용했다.

**트렌드 집계의 익명성**: \`refresh_persona_stats()\` RPC는 \`user_id\`를 전혀 참조하지 않고 순수 집계(COUNT, RATIO)만 수행하여 개인 식별 정보가 통계에 노출되지 않는다.

**Sentry 전계층 연동**: \`sentry.client.config.ts\`, \`sentry.server.config.ts\`, \`sentry.edge.config.ts\`로 각 런타임별 설정을 분리. \`logger.error()\`는 항상 Sentry에 예외를 캡처하고, \`logger.warn()\`은 경고 레벨 이벤트를 전송한다.

**입력 검증**: 모든 API 라우트는 Zod 스키마 검증을 통과한 후에만 비즈니스 로직을 실행한다.

---

## 데이터베이스 스키마 (Database Schema)

\`\`\`
analysis_history
├── id (UUID, PK)
├── user_id (FK → auth.users)
├── input_type (photo | text | combined)
├── summary, analysis, fashion, beauty, action_items (JSONB)
├── visual_profile (JSONB) — Fitzpatrick, 체형, 얼굴형 등 정규화 데이터
├── embedding (VECTOR(1536)) — pgvector 코사인 유사도용
├── persona_type, core_keywords
├── is_public, share_count
└── RLS: 소유자만 SELECT / INSERT / DELETE

persona_matches
├── source_id, target_id (FK → analysis_history)
├── score (0~100, 코사인 유사도 기반)
└── analysis_text (Gemini 생성 궁합 텍스트)

persona_stats
├── persona_type (UNIQUE)
├── count, ratio
└── refresh_persona_stats() RPC로 익명 집계 갱신

premium_reports
├── analysis_id (FK → analysis_history)
├── deep_analysis_json (JSONB)
├── payment_id (FK → payment_transactions)
└── RLS: 결제 완료(status='paid') 시에만 접근 허용

payment_transactions
├── merchant_uid (UNIQUE)
├── imp_uid (Portone 결제 고유 ID)
├── status ENUM (ready | paid | cancelled | failed)
└── RLS: 소유자만 조회 / 수정 가능
\`\`\`

---

## 사용 기술 및 라이브러리 (Tech Stack)

### Frontend
| 분류 | 라이브러리 | 용도 |
|------|-----------|------|
| 프레임워크 | Next.js 16 (App Router) | SSR, 동적 메타태그, API Routes |
| UI | React 19, Tailwind CSS v4 | 컴포넌트, 스타일링 |
| 애니메이션 | Framer Motion | 페이지 전환, 로딩 UX |
| 아이콘 | Lucide React | 아이콘 시스템 |
| 토스트 | Sonner | 비침습적 알림 |
| 폰트 | Montserrat + Cormorant (Google Fonts) | 디스플레이 + 바디 타이포그래피 |

### Backend & AI
| 분류 | 라이브러리 | 용도 |
|------|-----------|------|
| AI | @google/generative-ai | Gemini 1.5 Flash / Pro 멀티모달 추론 |
| 데이터베이스 | @supabase/supabase-js + @supabase/ssr | PostgreSQL + pgvector + Auth + Storage |
| 서버 이미지 생성 | satori + @resvg/resvg-js | JSX → SVG → PNG 서버사이드 렌더링 |
| PDF | @react-pdf/renderer | 서버사이드 A4 PDF 생성 |
| 검증 | zod v4 | API 입력 및 AI 응답 스키마 검증 |
| 결제 | Portone (iamport) | 신용카드, 카카오페이 등 국내 결제 |

### 관측 가능성 & 품질
| 분류 | 라이브러리 | 용도 |
|------|-----------|------|
| 에러 추적 | @sentry/nextjs | 클라이언트/서버/엣지 전계층 에러 모니터링 |
| 단위 테스트 | Vitest + @testing-library/react | 컴포넌트 및 서비스 테스트 |
| E2E 테스트 | Playwright | 브라우저 통합 테스트 |
| 린터 | ESLint (Next.js config) | 코드 품질 |

---

## 주요 구현 특징 (Key Highlights)

1. **Graceful AI Degradation**: 단일 모델 의존 없이 3개 Gemini 모델을 체인으로 연결. 에러 유형(할당량 초과 / 레이트 리밋 / 결제 한도 초과)에 따라 재시도·모델전환·즉시중단을 구분하여 서비스 가용성을 극대화했다.

2. **서버사이드 이미지 파이프라인**: 공유 카드 이미지를 클라이언트가 아닌 서버에서 생성(Satori + Resvg)함으로써 일관된 렌더링 품질을 보장하고, CDN 영구 캐싱으로 이후 요청의 비용을 0으로 만들었다.

3. **Privacy-First 벡터 DB 설계**: pgvector 기반 유사도 검색을 PostgreSQL RPC 레이어에 캡슐화하여 클라이언트에 벡터 데이터가 노출되지 않는다. 트렌드 통계는 순수 집계만 수행하여 역추적이 불가능하다.

4. **Zero-Trust 결제 검증**: 프리미엄 기능 접근 시 클라이언트의 어떤 값도 신뢰하지 않고, 서버에서 직접 \`payment_transactions\` 테이블의 \`status = 'paid'\`를 검증한다. DB 수준의 복합 RLS 정책으로 이중 보호를 구현했다.

5. **하이브리드 스토리지 패턴**: 로그인 없이도 서비스 핵심 기능이 동작하도록 Supabase ↔ LocalStorage 이중 저장 전략을 구현. 로그인 후에는 자동으로 클라우드 동기화된다.

6. **동적 OG 이미지 연계**: \`/analyze/[id]\` 페이지는 서버에서 분석 데이터를 조회하여 \`generateMetadata()\`로 동적 OG 태그를 생성하고, \`og:image\`를 공유 카드 API(\`/api/share/[id]\`)와 연결한다. SNS 공유 시 분석 결과 카드가 자동 미리보기로 표시된다.

7. **Fitzpatrick Scale 기반 시각 분석**: 단순한 "밝은/어두운 피부"가 아닌 의학적으로 표준화된 Fitzpatrick Scale(Type I~VI)을 적용하여 피부톤을 정규화한다. AI 응답을 Zod 열거형 스키마로 검증함으로써 데이터 정합성을 보장한다.
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Gemini API",
      "Supabase",
      "Satori",
    ],
    liveUrl: "https://persona-style.vercel.app",
    imageUrl: "/images/project-persona-style.webp",
    accentColor: "#a855f7",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary:
      "금융 에셋 데이터와 RSS 피드를 실시간으로 크롤링하고 AI로 분석하여 직관적인 대시보드와 고성능 차트로 시각화하는 투자 정보 플랫폼입니다.",
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
`,
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
    summary:
      "GitHub 커밋 내역을 분석하여 개발자의 의사결정 과정을 유추하고, 전문적인 기술 블로그 포스트를 자동으로 생성해주는 AI 기반 SaaS입니다.",
    description: `# synapso.dev — AI-Powered Tech Blog Generator

## 프로젝트 개요 (Overview)

**synapso.dev**는 개발자의 GitHub 커밋 히스토리를 Google Gemini AI가 분석하여 **전문적인 시니어 엔지니어 관점의 기술 블로그 포스트를 자동 생성**하는 멀티유저 SaaS 플랫폼입니다.

단순한 변경사항 나열을 넘어, 커밋 Diff 패턴과 파일 구조 변화를 바탕으로 "요구사항 → 기획 → 개발"이라는 개발자의 의사결정 흐름을 역추론(**Reverse Spec Recovery**)하여 완성도 높은 마크다운 문서를 자동 생성·발행합니다.

> **"코딩만 하세요. 기술 블로그는 AI가 완성합니다."**

---

## 핵심 파이프라인 (Core Pipeline)

전체 데이터 흐름은 **인증 → 커밋 수집 → 작업 큐 → AI 분석 → 포스트 발행**의 5단계로 구성됩니다.

\`\`\`
GitHub OAuth     →   커밋 Diff 수집   →   Job 큐 등록    →   Gemini 분석    →   포스트 발행
─────────────        ─────────────        ───────────        ─────────────       ─────────────
NextAuth v5          Octokit API           Supabase jobs       Structured JSON     Slug 자동 생성
GitHub 토큰 저장      불필요 파일 필터링      pending → done      5-섹션 강제 검증     Soft Delete
repo scope           80,000자 제한          5분 타임아웃          Exponential Retry   ISR 렌더링
\`\`\`

### 1단계: GitHub 인증 및 커밋 수집 (\`auth.ts\`, \`lib/github.ts\`)

- NextAuth v5로 GitHub OAuth 인증. \`repo\` scope 요청으로 퍼블릭·프라이빗 저장소 모두 접근
- **GitHub Numeric ID를 안정적 사용자 식별자로 고정**: NextAuth 기본 동작(매 로그인마다 randomUUID 생성)을 오버라이드하여 \`account.providerAccountId\`를 \`token.sub\`으로 명시 설정. 로그인할 때마다 user.id가 달라지는 버그를 원천 차단
- Octokit으로 커밋 Diff 추출 시 \`EXCLUDED_FILE_PATTERNS\`로 lock 파일, 바이너리, 빌드 아티팩트, \`.env\` 계열을 자동 필터링하여 AI 컨텍스트 윈도우 낭비 방지

### 2단계: 비동기 작업 큐 (\`lib/jobs.ts\`)

- AI 분석은 Serverless Request Timeout을 초과할 수 있으므로, 작업을 \`jobs\` 테이블에 \`pending\` 상태로 등록 후 백그라운드에서 처리
- \`runAIAnalysisBackground\`는 \`Promise.race([run(), timeout])\` 패턴으로 5분 초과 시 자동 \`failed\` 처리
- 프론트엔드는 폴링으로 상태(\`pending → processing → completed / failed\`)를 실시간 반영

### 3단계: AI 심층 분석 (\`lib/ai.ts\`)

- Gemini API의 \`responseMimeType: "application/json"\` + \`responseSchema\`(JSON Schema)로 **Structured Output** 강제. 자유 텍스트 파싱의 불안정성 완전 제거
- **5개 섹션 완결성 정규식 검증**: 응답에 \`커밋 개발내역 / 작업 순서 / 핵심 기능 / 개발 스토리 / 핵심 교훈\` 5개 섹션이 모두 포함되지 않으면 즉시 재시도
- **Exponential Backoff 재시도**: Rate Limit(429) 또는 섹션 누락 시 \`2^n * 2000ms\` 딜레이로 최대 3회 재시도
- **Reverse Spec Recovery 프롬프팅**: 단순 코드 설명 금지. 커밋(구현)으로부터 요구사항·기획·개발 의사결정을 역추론하도록 시스템 프롬프트 설계
- 전체 Diff 합산 80,000자 초과 시 자동 트런케이션으로 토큰 비용 제어

### 4단계: 포스트 발행 (\`lib/posts.ts\`)

- \`YYYY-MM-DD-<slugified-title>\` 형식의 날짜 기반 Slug 자동 생성
- 동일 Slug 충돌 방지: DB에서 기존 Slug를 조회 후 \`-1\`, \`-2\` 카운터 부여 (최대 100회 보호)
- **Soft Delete 패턴**: 삭제 요청 시 실제 레코드 삭제 대신 \`deletedAt\` 타임스탬프 설정. 휴먼 에러 시 복구 가능
- React \`cache()\` 적용으로 동일 요청 내 DB 중복 조회 방지 (\`getPostById\`, \`getPostByUsernameAndSlug\`)

---

## 프로젝트 구조 (Project Structure)

\`\`\`text
synapso.dev/
├── app/
│   ├── [locale]/               # next-intl 다국어 라우팅 (ko / en)
│   │   ├── @[username]/        # 사용자 퍼블릭 블로그 페이지 (/:username)
│   │   ├── generate/           # 포스트 생성 UI
│   │   ├── jobs/               # 작업 현황 대시보드
│   │   ├── settings/           # 자동 포스팅·결제 설정
│   │   ├── pricing/            # 구독 플랜 안내
│   │   ├── demo/               # 로그인 없이 체험 가능한 데모
│   │   └── admin/              # 관리자 전용 포털
│   ├── actions/                # React Server Actions
│   └── api/
│       ├── generate/           # AI 분석 트리거 엔드포인트
│       ├── jobs/               # Job CRUD
│       ├── posts/              # 포스트 CRUD
│       ├── github/             # 리포·커밋 목록 조회
│       ├── settings/           # 사용자 설정 관리
│       ├── subscription/       # 사용량·플랜 조회
│       ├── portone/            # PortOne 결제 연동
│       ├── webhooks/           # PortOne / Stripe 웹훅 수신
│       └── cron/
│           ├── auto-post/      # 자동 포스팅 스케줄러 (매일 09:00 UTC)
│           └── billing/        # 구독 갱신 청구 스케줄러 (매일 01:00 UTC)
├── lib/
│   ├── ai.ts                   # Gemini 연동, 프롬프트 빌딩, Retry 로직
│   ├── github.ts               # Octokit 기반 커밋 Diff 추출, 파일 필터링
│   ├── jobs.ts                 # Job 상태 머신 및 백그라운드 워커
│   ├── posts.ts                # 포스트 CRUD, Slug 생성, Soft Delete
│   ├── profiles.ts             # 사용자 프로필 관리, Profile ID 마이그레이션
│   ├── subscription.ts         # 티어별 제한 상수(TIER_LIMITS), 사용량 Lazy Reset
│   ├── portone-billing.ts      # PortOne SDK 결제키 저장·청구·취소·웹훅 처리
│   ├── settings.ts             # 자동 포스팅 설정, processed_commits 중복 방지
│   ├── email.ts                # Resend 기반 트랜잭션 이메일 발송
│   ├── billing.ts              # Stripe 기반 레거시 결제 (글로벌)
│   ├── changelog.ts            # GitHub Releases 기반 업데이트 노트
│   └── supabase-admin.ts       # Service Role Key 기반 관리자 클라이언트
└── components/
    ├── GenerateForm.tsx         # 커밋 선택 및 AI 생성 폼
    ├── EditForm.tsx             # 마크다운 편집기
    ├── PostContent.tsx          # rehype 기반 마크다운 렌더러
    ├── jobs/                   # Job 상태 폴링 컴포넌트
    └── settings/               # 자동 포스팅 / 결제 설정 UI
\`\`\`

---

## 상세 기능 구현 (Technical Implementation)

### AI 프롬프팅: Reverse Spec Recovery

\`\`\`typescript
// lib/ai.ts — 개발자가 userContext를 제공하지 않은 경우 AI가 코드로부터 역추론
const section4Instruction = userContext
  ? \`### 개발 스토리
     [USER CONTEXT]를 바탕으로 요구사항 → 기획 → 개발 순서로 스토리를 구성하라.\`
  : \`### 개발 스토리
     [USER CONTEXT 없음 — AI가 코드로부터 역추론]
     반드시 섹션 서두에 "AI가 코드로부터 추론한 내용입니다"라는 문구를 포함할 것.\`;
\`\`\`

프롬프트는 단순 코드 설명을 명시적으로 금지하고, Diff 패턴과 의존성 변화로부터 "왜 이 코드를 만들었는지"를 독자가 이해할 수 있도록 설계됩니다.

### Structured Output으로 환각 억제

\`\`\`typescript
// lib/ai.ts — JSON Schema를 responseSchema로 강제하여 파싱 에러 원천 차단
const schema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    content: { type: SchemaType.STRING },
  },
  required: ["title", "summary", "tags", "content"],
};

const model = genAI.getGenerativeModel({
  model: modelName,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});
\`\`\`

응답 수신 후 SECTION_HEADINGS 상수로 5개 섹션 완결성을 정규식 검증합니다. 누락 시 Exponential Backoff로 재시도합니다.

### 계층적 구독 시스템 (Tier-based Constraint)

\`\`\`typescript
// lib/subscription.ts
export const TIER_LIMITS: Record<SubscriptionTier, { ... }> = {
  free:     { monthlyLimit: 20,       aiModel: "gemini-3.1-flash-lite-preview", watermark: true,  maxAutoRepos: 1        },
  pro:      { monthlyLimit: 30,       aiModel: "gemini-3-flash-preview",        watermark: false, maxAutoRepos: Infinity },
  business: { monthlyLimit: Infinity, aiModel: "gemini-3.1-pro-preview",        watermark: false, maxAutoRepos: Infinity },
};
\`\`\`

- **Lazy Reset**: 매 사용량 조회 시 \`usage_reset_date\`가 현재 시각을 지났으면 카운터를 자동 초기화. 별도 스케줄러 없이 DB 부하를 최소화
- **원자적 증가**: Supabase RPC \`increment_usage_count\`로 경쟁 조건(race condition) 없는 카운터 증가. RPC 미존재 시 fallback 로직 포함
- **취소 롤백**: 분석 실패 또는 취소 시 \`decrementUsage\`로 사용량을 원복

### PortOne 결제 시스템

\`\`\`typescript
// lib/portone-billing.ts — 빌링키 기반 정기 결제 흐름
export async function saveBillingKeyAndCharge(username, billingKey, tier, cycle) {
  // 1. 첫 결제 실행
  await paymentClient.payWithBillingKey({ paymentId, billingKey, ... });

  // 2. 결제 이벤트 멱등성 기록 (upsert + ignoreDuplicates)
  await supabaseAdmin.from("payment_events").upsert({ id: paymentId, ... }, { onConflict: "id", ignoreDuplicates: true });

  // 3. 프로필 구독 상태 업데이트
  await supabaseAdmin.from("profiles").update({ subscription_tier, subscription_status: "active", ... });
}
\`\`\`

- **자동 갱신 Cron** (\`/api/cron/billing\`, 매일 01:00 UTC): \`usage_reset_date <= now\`인 active 구독자를 조회하여 \`chargeWithBillingKey\` 자동 실행. 결제 실패 시 \`past_due\` 상태 전환
- **웹훅 멱등성**: \`payment_events\` 테이블에 이벤트 ID를 PK로 upsert하여 동일 이벤트 중복 처리 방지
- **빌링키 삭제 복원력**: 구독 취소 시 PortOne 빌링키 삭제 실패해도 DB 상태는 정상 업데이트 (zombie key는 추후 cron에서 정리)

### 자동 포스팅 파이프라인 (\`/api/cron/auto-post\`, 매일 09:00 UTC)

\`\`\`
auto_mode 유저 조회 → 사용량·티어 확인 → weekly 스케줄 체크 → 미처리 커밋 조회
→ Gemini 분석 → 사용량 증가 → 포스트 생성 → processed_commits 기록
\`\`\`

- \`processed_commits\` 테이블로 이미 포스팅된 커밋 SHA를 추적, 중복 발행 방지
- \`auto_schedule: "weekly"\` 설정 시 마지막 포스트 생성 후 7일 이내면 건너뜀
- Free 티어는 \`auto_repos\` 최대 1개만 허용 (\`TIER_LIMITS.maxAutoRepos\`)
- AI 분석 실패 시 \`jobs\` 테이블에 실패 기록을 남겨 사용자가 \`/jobs\` 페이지에서 확인 가능

### 보안 아키텍처

\`\`\`typescript
// next.config.ts — 전역 보안 헤더 설정
{
  "X-Frame-Options": "DENY",                    // 클릭재킹 방지
  "X-Content-Type-Options": "nosniff",          // MIME 스니핑 방지
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://*.supabase.co ...",
}
\`\`\`

- **역할 기반 접근 제어**: NextAuth JWT에 \`role\` 필드 포함. 미들웨어에서 \`/admin\` 경로를 \`role === 'admin'\`으로 보호. \`/@admin-user\` 같은 username과의 오탐을 \`startsWith\` 정밀 매칭으로 구분
- **Cron 엔드포인트 보호**: \`CRON_SECRET\` Bearer 토큰으로 외부 호출 차단
- **마크다운 XSS 방지**: \`isomorphic-dompurify\`로 사용자 입력 HTML 살균
- **Rate Limiting**: Upstash Redis 기반 API 요청 제한

---

## 데이터베이스 스키마 (Database Schema)

| 테이블              | 역할                                                  |
| ------------------- | ----------------------------------------------------- |
| \`profiles\`          | 사용자 정보, 구독 티어, PortOne 빌링키, 월별 사용량   |
| \`posts\`             | 블로그 포스트 (Soft Delete, is_public 필드)           |
| \`jobs\`              | AI 분석 작업 큐 (pending/processing/completed/failed) |
| \`user_settings\`     | 자동 포스팅 모드, 대상 저장소, 스케줄 설정            |
| \`processed_commits\` | 자동 포스팅 처리된 커밋 SHA (중복 방지)               |
| \`payment_events\`    | 결제 이벤트 멱등성 기록                               |

---

## 사용 기술 및 라이브러리 (Tech Stack)

| 영역              | 기술                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| **Framework**     | Next.js 16.1.6 (App Router), React 19.2.3                             |
| **Auth**          | NextAuth v5.0.0-beta.30 (GitHub OAuth, JWT 전략)                      |
| **Database**      | Supabase (PostgreSQL, RLS, Service Role Admin)                        |
| **AI / LLM**      | \`@google/generative-ai\` — Gemini 2.5 Flash Lite / Flash / Pro         |
| **결제 (국내)**   | PortOne Server SDK (\`@portone/server-sdk\`, 빌링키 정기결제)           |
| **결제 (글로벌)** | Stripe (레거시 보존)                                                  |
| **Styling**       | Tailwind CSS v4.2.0, CSS Variables, 다크 테마                         |
| **i18n**          | next-intl v4 (ko / en 이중 언어)                                      |
| **Markdown**      | \`react-markdown\`, \`rehype-highlight\`, \`rehype-sanitize\`, \`remark-gfm\` |
| **이메일**        | Resend + \`@react-email/components\`                                    |
| **Rate Limiting** | Upstash Redis (\`@upstash/ratelimit\`)                                  |
| **Validation**    | Zod v4                                                                |
| **GitHub 연동**   | Octokit v5                                                            |
| **Analytics**     | Vercel Analytics                                                      |
| **Infra**         | Vercel (Serverless, ISR, Cron Jobs)                                   |
| **Testing**       | Vitest, @testing-library/react                                        |

---

## 주요 구현 특징 (Key Highlights)

### 1. Structured Output으로 AI 환각(Hallucination) 억제

Gemini API의 \`responseSchema\`를 활용한 JSON 타입 응답 강제와, 5개 섹션 완결성의 정규식 후검증을 결합하여 백엔드 파싱 에러를 원천 차단합니다. 자유 텍스트 생성의 불안정성을 스키마 계층에서 봉쇄한 설계입니다.

### 2. Serverless 환경에 최적화된 비동기 작업 큐

Vercel Serverless의 10~60초 Request Timeout 한계를 극복하기 위해, 무거운 AI 분석 작업을 \`jobs\` 테이블 기반 상태 머신으로 분리하고 \`Promise.race([run(), 5분_타임아웃])\`으로 안전하게 처리합니다. 실패 내역도 DB에 기록되어 사용자 관점에서 투명한 에러 처리를 제공합니다.

### 3. 토큰 비용 최적화 파이프라인

\`EXCLUDED_FILE_PATTERNS\`로 lock 파일, 빌드 아티팩트, 바이너리 파일을 Diff에서 사전 차단하고, 파일당 3,000자 패치 트런케이션과 전체 80,000자 상한선을 적용하여 AI 컨텍스트 윈도우 한계를 우회하고 API 비용을 구조적으로 절감합니다.

### 4. 멱등성 보장 결제 시스템

\`payment_events\` 테이블에 이벤트 ID를 Primary Key로 \`upsert + ignoreDuplicates\`하여 웹훅 재전송에 의한 이중 결제를 방지합니다. Lazy Reset 패턴으로 월별 사용량 초기화도 별도 스케줄러 없이 처리합니다.

### 5. 안정적인 사용자 식별자 설계

NextAuth v5 기본 동작의 불안정한 UUID 생성 문제를 해결하기 위해 GitHub Numeric ID를 \`token.sub\`으로 고정하고, 기존 UUID 기반 프로필의 \`id\` 컬럼을 \`migrateProfileId\` 함수로 1회성 자동 마이그레이션합니다.
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "GitHub API",
      "Gemini API",
      "Supabase",
      "Stripe",
    ],
    liveUrl: "https://synapso.dev",
    githubUrl: "https://github.com/tuosm9390/Synapso.dev",
    imageUrl: "/images/project-synapso.dev.png",
    accentColor: "#f43f5e",
  },
  {
    id: "minions-bid",
    title: "Minions Bid (League Auction Tool)",
    summary:
      "리그 오브 레전드 커뮤니티를 위한 초저지연 실시간 멀티플레이어 경매 시스템으로, 독특한 Cyber-Pixel 디자인과 서버 권한 기반 아키텍처를 특징으로 합니다.",
    description: `# Minions Bid

## 프로젝트 개요

Minions Bid는 리그 오브 레전드 커뮤니티 운영을 위한 도구로, 하나의 제품 안에 다음 세 가지 흐름을 통합한 프로젝트입니다.

1. 실시간 선수 경매방 생성 및 라이브 입찰
2. 리그 일정 생성 및 경기 결과 관리
3. 시즌 종료 후 우승팀 명예의 전당 아카이빙

이 프로젝트는 Next.js App Router 기반으로 구축되어 있으며, 백엔드 플랫폼으로 Firebase를 사용합니다. 경매 기능은 주최자, 팀장, 관전자 사이의 저지연 실시간 동기화에 초점을 맞추고 있고, 일정 관리와 아카이브 기능은 단발성 드래프트 도구를 시즌 운영 시스템으로 확장하는 역할을 합니다. 최근에는 설치 가능한 PWA 셸을 추가해 모바일 홈 화면 진입과 기본 오프라인 캐시까지 고려한 구조로 확장되었습니다.

UI 역시 일반적인 대시보드 스타일을 그대로 따르지 않습니다. 두꺼운 테두리, CRT 오버레이, 픽셀 아이콘, 모달 중심 인터랙션을 조합한 레트로 아케이드 감성의 "Cyber-Pixel" 비주얼 시스템을 채택하고 있습니다.

## 제품 범위

### 1. 경매 워크플로우

- 팀 수, 팀당 인원, 총 포인트를 기준으로 경매방 생성
- 팀장과 선수 정보를 수동 입력 또는 Excel 업로드로 등록
- 주최자, 팀장, 관전자 전용 입장 링크 생성
- 추첨, 타이머, 입찰, 낙찰, 재경매를 포함한 실시간 경매 진행
- 완료된 경매 결과를 \`auction_archives\`에 영구 저장

### 2. 리그 일정 워크플로우

- 기존 경매 또는 리그 이름과 연결된 일정 생성
- 날짜별 매치 타임라인 구성
- 팀 간 대진과 경기 시간을 배정
- 경기별 승자와 메모 기록
- 경기 단계와 상태 기준으로 전적/점수/경기 목록 필터링
- 최종 우승팀을 선택해 일정 종료 처리

### 3. 명예의 전당 워크플로우

- 등록된 우승 기록 조회
- 경매 아카이브를 기반으로 우승팀 수동 등록
- 연결된 리그 일정 종료 시 우승팀 자동 등록

## 아키텍처

### 애플리케이션 구조

- 프레임워크: Next.js 16 App Router
- 렌더링 방식: 서버에서 진입 라우트를 렌더링하고, 기능 중심 UI는 클라이언트 컴포넌트로 구성
- 상태 관리: 클라이언트 경매 상태는 Zustand, 백엔드 동기화는 Firebase 구독 기반으로 처리
- PWA 구성: Web App Manifest, 서비스 워커 등록 컴포넌트, 정적 자산 캐시를 포함한 설치형 웹앱 셸

### 백엔드 모델

이 코드베이스는 중요한 쓰기 작업 전반에서 서버 권한 중심(server-authoritative) 모델을 따릅니다.

- 읽기 및 동기화:
  - Firestore \`onSnapshot\` 구독으로 방, 팀, 선수, 입찰, 메시지 상태를 클라이언트 스토어에 실시간 반영
  - Firebase Realtime Database는 presence와 경량 broadcast signal 용도로 사용
- 변경 작업:
  - Next.js Server Actions가 Firebase Admin SDK 코드를 호출
  - 실제 상태 변경 전 권한과 데이터 유효성을 서버에서 검증

즉, 이 프로젝트는 클라이언트가 모든 상태를 직접 주도하는 구조가 아닙니다. 클라이언트는 실시간 상태를 렌더링하지만, 방 생성, 입찰, 낙찰 처리, 경기 결과 등록, 아카이브 저장처럼 중요한 전환은 서버가 통제합니다.

## 핵심 데이터 흐름

### 방 생성

방 생성 흐름은 [\`src/components/CreateRoomModal.tsx\`](D:/development/league-auction/src/components/CreateRoomModal.tsx)와 [\`src/features/auction/hooks/useCreateRoom.ts\`](D:/development/league-auction/src/features/auction/hooks/useCreateRoom.ts)가 담당합니다.

주요 동작은 다음과 같습니다.

- 여러 단계의 모달에서 기본 설정, 팀장 정보, 선수 풀 정보를 순차적으로 수집
- \`xlsx\`를 사용해 브라우저에서 Excel 업로드 파싱
- 로컬 스토리지와 Firestore를 함께 조회해 기존 활성 방 여부 확인
- 일정 연결을 위해 스케줄 옵션을 함께 로드
- 최종 방 생성은 [\`src/features/auction/api/roomActions.ts\`](D:/development/league-auction/src/features/auction/api/roomActions.ts)의 서버 액션으로 위임

생성 시 서버는 다음 데이터를 기록합니다.

- \`rooms/{roomId}\` 문서
- 팀장별 토큰을 포함하는 \`teams\` 서브컬렉션
- \`WAITING\` 상태로 초기화된 \`players\` 서브컬렉션
- 이후 링크 인증에 사용할 organizer/viewer 토큰

### 링크 기반 역할 인증

이 제품은 일반적인 계정 시스템을 제공하지 않습니다. 대신 역할별 토큰을 통해 방 접근 권한을 부여합니다.

[\`src/app/api/room-auth/route.ts\`](D:/development/league-auction/src/app/api/room-auth/route.ts)는 다음을 수행합니다.

- \`roomId\`, \`role\`, \`token\`, 선택적 \`teamId\`를 입력으로 받음
- organizer/viewer 토큰을 room 문서 기준으로 검증
- leader 토큰을 선택된 team 문서 기준으로 검증
- \`/room/{roomId}\` 범위의 \`httpOnly\` 쿠키를 기록
- 정규화된 role 컨텍스트와 함께 실제 방 페이지로 리다이렉트

이 방식은 커뮤니티 운영 도구에 맞게 접근 절차를 단순화하면서도, 서버 검증을 유지하는 구조입니다.

### 경매 동기화

실시간 경매 화면의 중심은 [\`src/app/room/[id]/RoomClient.tsx\`](D:/development/league-auction/src/app/room/[id]/RoomClient.tsx)입니다.

여기서 사용하는 실시간 상태는 다음 파일들에서 공급됩니다.

- [\`src/features/auction/hooks/useAuctionRealtime.ts\`](D:/development/league-auction/src/features/auction/hooks/useAuctionRealtime.ts)
- [\`src/features/auction/hooks/usePresence.ts\`](D:/development/league-auction/src/features/auction/hooks/usePresence.ts)
- [\`src/features/auction/store/useAuctionStore.ts\`](D:/development/league-auction/src/features/auction/store/useAuctionStore.ts)

구조적으로는 다음과 같습니다.

- Firestore snapshot이 Zustand 스토어를 초기화하고 지속적으로 갱신
- RTDB presence로 현재 접속 중인 팀장과 주최자를 추적
- RTDB signal path는 추첨 애니메이션 종료 같은 단발성 이벤트 전달에 사용
- UI는 이 상태를 기반으로 다음과 같은 파생 조건을 계산
  - 모든 팀장 접속 여부
  - 현재 경매 중인 선수
  - 현재 최고 입찰가
  - 타이머 만료 여부
  - 팀 정원 충족 여부

### 경매 변경 파이프라인

핵심 경매 로직은 [\`src/features/auction/api/auctionFlowActions.ts\`](D:/development/league-auction/src/features/auction/api/auctionFlowActions.ts)에 구현되어 있습니다.

주요 작업은 다음과 같습니다.

- \`drawNextPlayer\`: \`WAITING\` 상태 선수 한 명을 무작위로 \`IN_AUCTION\`으로 전환
- \`startAuction\`: 서버 기준 타이머 시작
- \`pauseAuction\` / \`resumeAuction\`: 팀장 연결 끊김에 따른 경매 중단 및 재개 처리
- \`placeBid\`: 정수 금액, 10포인트 단위, 최대 금액, 팀 잔액, 중복 선두 입찰, 팀 정원, 타이머 연장 조건 검증
- \`awardPlayer\`: Firestore transaction 안에서 낙찰 상태 확정
- \`draftPlayer\`: 유찰 또는 대기 선수를 0포인트로 수동 영입
- \`restartAuctionWithUnsold\`: 모든 \`UNSOLD\` 선수를 다시 \`WAITING\`으로 전환

여기서 중요한 설계 선택은 "빠른 착시"보다 "정합성"을 우선했다는 점입니다. 입찰 상태는 클라이언트에서 바로 확정하지 않고, 서버에서 검증과 저장을 마친 뒤 Firebase 구독을 통해 전체 참가자에게 동일하게 반영됩니다.

### 아카이브 저장

경매가 완료되면 [\`saveAuctionArchive\`](D:/development/league-auction/src/features/auction/api/roomActions.ts)가 결과 스냅샷을 \`auction_archives\`에 저장합니다.

이 아카이브에는 다음 정보가 포함됩니다.

- 방 메타데이터
- 연결된 일정 메타데이터
- 최종 팀 스냅샷
- 선수별 낙찰가와 포지션 정보

이후 이 데이터는 리그 일정 생성과 명예의 전당 등록의 입력 소스로 재사용됩니다.

## 리그 일정 시스템

리그 일정 기능은 단순 보조 페이지가 아니라 독립된 도메인으로 구현되어 있습니다.

주요 파일은 다음과 같습니다.

- [\`src/components/LeagueScheduleManager.tsx\`](D:/development/league-auction/src/components/LeagueScheduleManager.tsx)
- [\`src/features/schedules/api/scheduleActions.ts\`](D:/development/league-auction/src/features/schedules/api/scheduleActions.ts)
- [\`src/components/ScheduleCalendar.tsx\`](D:/development/league-auction/src/components/ScheduleCalendar.tsx)
- [\`src/components/ScheduleMatchDayEditor.tsx\`](D:/development/league-auction/src/components/ScheduleMatchDayEditor.tsx)
- [\`src/components/ScheduleRosterPanel.tsx\`](D:/development/league-auction/src/components/ScheduleRosterPanel.tsx)
- [\`src/components/LeagueRecordSummaryPanel.tsx\`](D:/development/league-auction/src/components/LeagueRecordSummaryPanel.tsx)
- [\`src/features/schedules/utils/leagueRecords.ts\`](D:/development/league-auction/src/features/schedules/utils/leagueRecords.ts)

핵심 책임은 다음과 같습니다.

- \`league_schedules\`에 일정 레코드 생성
- 날짜 키 기반의 \`match_days\` 서브컬렉션 관리
- 방 또는 경매 아카이브 데이터를 일정용 로스터 팀 구조로 변환
- 미완료 경기 기준으로 "다음 경기" 계산
- 경기 결과 검증 및 저장
- 일정 종료와 함께 우승팀을 명예의 전당에 반영
- 단계별 참가 팀만 추려서 순위표를 다시 계산하고, 상태 필터 기준으로 경기 수/완료 수/점수 합계를 재집계

이 기능에서 특히 중요한 부분은 로스터 복원입니다. 일정 레이어는 다음 데이터 원본을 이용해 팀 정보를 재구성할 수 있습니다.

- 현재 저장된 \`rooms\`
- 과거 \`auction_archives\`
- 중복 사용을 막기 위한 hall-of-fame 제외 목록

덕분에 원래의 실시간 경매방이 사라진 이후에도 일정 관리 기능은 계속 유효하게 동작할 수 있습니다.

## 명예의 전당 시스템

명예의 전당 기능은 [\`src/features/hall-of-fame/api/hallOfFameActions.ts\`](D:/development/league-auction/src/features/hall-of-fame/api/hallOfFameActions.ts)에 구현되어 있고, App Router 진입 페이지는 [\`src/app/hall-of-fame/page.tsx\`](D:/development/league-auction/src/app/hall-of-fame/page.tsx)입니다.

지원하는 기능은 다음과 같습니다.

- 명예의 전당 엔트리 목록 조회
- 아직 등록되지 않은 아카이브 목록 조회
- 관리자 코드 기반 수동 등록 및 삭제
- 리그 일정 종료 시 우승팀 자동 삽입

이 구조 덕분에 경매와 일정 도메인이 단순한 이벤트 처리에서 끝나지 않고, 장기적으로 축적되는 커뮤니티 기록으로 이어집니다.

## 프로젝트 구조

\`\`\`text
src/
  app/
    api/room-auth/            토큰 검증 및 쿠키 부트스트랩
    hall-of-fame/             명예의 전당 페이지와 클라이언트 셸
    league-schedule/          리그 일정 라우트
    manifest.ts               PWA manifest 정의
    room/[id]/                실시간 경매방 라우트
    page.tsx                  홈 / 런처 화면
  components/
    create-room/              다단계 방 생성 플로우
    ui/                       공용 프리미티브 컴포넌트
    LeagueScheduleManager.tsx 일정 관리 셸
    LeagueRecordSummaryPanel.tsx 전적 요약, 필터, 경기 목록 UI
    PwaRegistration.tsx       프로덕션 서비스 워커 등록
  content/
    updateFeed.ts             홈 화면 티커 / 업데이트 피드
  features/
    auction/
      api/                    방, 채팅, 경매 흐름용 서버 액션
      components/             경매 전용 UI
      hooks/                  Firebase 동기화 및 방 제어 훅
      store/                  Zustand 경매 상태
      utils/                  방 생성 및 표시용 유틸리티
    hall-of-fame/
      api/                    아카이브 및 우승팀 등록 로직
      components/             명예의 전당 카드 및 모달 UI
    schedules/
      api/                    일정 CRUD 및 타임라인 로직
      types.ts                공용 일정 도메인 타입
      utils/                  경기 규칙, 전적 계산, 다음 경기 도출
  lib/
    firebase.ts               클라이언트 Firebase 초기화
    firebaseAdmin.ts          Admin SDK 초기화와 lazy Firestore proxy
public/
  sw.js                       PWA 서비스 워커
\`\`\`

## 기술 스택

### 프론트엔드

- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Zustand

### 백엔드 및 데이터

- Firebase Firestore
- Firebase Realtime Database
- Firebase Admin SDK

### 툴링 및 테스트

- ESLint 9
- Vitest
- Testing Library
- Playwright
- \`xlsx\` 기반 스프레드시트 업로드 파싱

## 주요 구현 결정

### 1. 클라이언트 직접 쓰기 대신 서버 액션 사용

중요한 변경 작업을 서버 액션에 집중시켜 브라우저 신뢰도를 낮추고, 도메인 규칙을 한 곳에 모으며, 경합이 발생할 수 있는 경매 전환을 더 안전하게 처리합니다.

### 2. 하나의 데이터베이스가 아니라 Firestore와 RTDB를 역할 분리해 사용

이 프로젝트는 Firebase의 두 저장소를 용도에 맞게 분리해서 사용합니다.

- Firestore: 구조화되고 조회 가능한 영속 도메인 상태
- RTDB: 연결 상태 추적과 경량 signal broadcast

이 분리는 단순한 이론이 아니라 실제 코드 구조에 그대로 드러나는 실용적 선택입니다.

### 3. 전체 계정 시스템 대신 토큰 기반 방 접근

커뮤니티 이벤트성 도구라는 특성상, 링크 기반 역할 입장은 완전한 인증 시스템보다 훨씬 단순합니다. 동시에 구현은 서버 검증과 \`httpOnly\` 쿠키를 유지해 최소한의 보안 통제를 확보합니다.

### 4. 경매 완료 이후를 고려한 아카이브 중심 확장

이 시스템은 "경매가 끝나면 종료"되지 않습니다. 완료된 방 데이터를 아카이브로 정규화해 저장함으로써, 이후 일정 관리와 시즌 기록 기능으로 자연스럽게 연결됩니다.

### 5. 기능 단위 중심의 저장소 구성

저장소는 다음과 같이 도메인 중심으로 정리되어 있습니다.

- \`auction\`
- \`schedules\`
- \`hall-of-fame\`

덕분에 서버 액션, 훅, 컴포넌트, 타입이 각 비즈니스 흐름 가까이에 배치되어 있습니다.

### 6. 설치형 웹앱 레이어를 별도 기능으로 얹은 구조

PWA 기능은 기존 비즈니스 로직을 흔들지 않도록 얇은 셸로 추가되어 있습니다.

- [\`src/app/layout.tsx\`](D:/development/league-auction/src/app/layout.tsx)에서 메타데이터, manifest, apple web app 옵션, 구조화 데이터를 설정
- [\`src/app/manifest.ts\`](D:/development/league-auction/src/app/manifest.ts)에서 웹앱 메타데이터를 생성
- [\`src/components/PwaRegistration.tsx\`](D:/development/league-auction/src/components/PwaRegistration.tsx)가 프로덕션에서만 서비스 워커를 등록
- [\`public/sw.js\`](D:/development/league-auction/public/sw.js)가 기본 정적 자산과 네비게이션 요청을 캐시

이 방식은 경매/일정/아카이브 도메인 코드와 설치형 셸을 분리해 유지보수 부담을 줄입니다.

## 이 프로젝트가 기술적으로 흥미로운 이유

- 정적인 CRUD 대시보드가 아니라, 다수 사용자가 동시에 참여하는 상태 중심 상호작용 문제를 다룹니다.
- 역할 기반 딥링크와 범위 제한 쿠키를 사용해 접근 절차를 단순화하면서도 서버 통제를 유지합니다.
- 실시간 UX와 낙찰 처리의 정합성을 동시에 고려한 입찰 구조를 가집니다.
- 라이브 이벤트를 일정 관리와 장기 아카이브 흐름으로 확장합니다.
- 흔한 SaaS UI가 아니라 제품 정체성이 분명한 시각 언어를 유지합니다.

## 참고 파일

기술 맥락을 빠르게 파악하기 좋은 핵심 진입 파일은 다음과 같습니다.

- [\`package.json\`](D:/development/league-auction/package.json)
- [\`README.md\`](D:/development/league-auction/README.md)
- [\`src/app/page.tsx\`](D:/development/league-auction/src/app/page.tsx)
- [\`src/app/layout.tsx\`](D:/development/league-auction/src/app/layout.tsx)
- [\`src/app/manifest.ts\`](D:/development/league-auction/src/app/manifest.ts)
- [\`src/app/room/[id]/RoomClient.tsx\`](D:/development/league-auction/src/app/room/[id]/RoomClient.tsx)
- [\`src/features/auction/api/auctionFlowActions.ts\`](D:/development/league-auction/src/features/auction/api/auctionFlowActions.ts)
- [\`src/features/auction/api/roomActions.ts\`](D:/development/league-auction/src/features/auction/api/roomActions.ts)
- [\`src/features/auction/hooks/useAuctionRealtime.ts\`](D:/development/league-auction/src/features/auction/hooks/useAuctionRealtime.ts)
- [\`src/features/auction/hooks/usePresence.ts\`](D:/development/league-auction/src/features/auction/hooks/usePresence.ts)
- [\`src/features/schedules/api/scheduleActions.ts\`](D:/development/league-auction/src/features/schedules/api/scheduleActions.ts)
- [\`src/components/LeagueRecordSummaryPanel.tsx\`](D:/development/league-auction/src/components/LeagueRecordSummaryPanel.tsx)
- [\`src/features/schedules/utils/leagueRecords.ts\`](D:/development/league-auction/src/features/schedules/utils/leagueRecords.ts)
- [\`src/features/hall-of-fame/api/hallOfFameActions.ts\`](D:/development/league-auction/src/features/hall-of-fame/api/hallOfFameActions.ts)
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Zustand",
      "Framer Motion",
      "Tailwind CSS",
    ],
    liveUrl: "https://minionsbid.vercel.app",
    githubUrl: "https://github.com/tuosm9390/minionsbid",
    imageUrl: "/images/project-minions-bid.png",
    accentColor: "#f59e0b",
  },
  {
    id: "quote-builder",
    title: "스마트 견적서 생성기",
    summary:
      "노션 스타일의 JSON 블록 에디터를 통해 기업형 견적서를 실시간으로 작성하고, 클라이언트 사이드에서 고해상도 PDF로 변환 및 관리하는 도구입니다.",
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
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "BlockNote",
      "Mantine",
      "jsPDF",
      "Tailwind CSS",
    ],
    liveUrl: "https://quote-builder-beige.vercel.app/",
    imageUrl: "/images/project-quote-builder.webp",
    accentColor: "#0064ff",
  },
  {
    id: "self-growth-dashboard",
    title: "Self Growth Dashboard",
    summary:
      "학습, 운동, 회고 등 개인의 성장 데이터를 추적하고 시각화하는 올인원 대시보드입니다.",
    description: `# Self-Growth Dashboard

## 1. 프로젝트 개요 (Overview)

**Self-Growth Dashboard**는 개인의 루틴, 할 일, 일정 및 목표 달성률을 종합적으로 관리하고 시각화하는 데이터 기반 대시보드 웹 애플리케이션입니다. 

본 프로젝트의 가장 큰 특징은 **Notion을 Headless DB로 활용**하면서도 자체적인 인터페이스와 전역 상태 관리를 통해 사용자에게 빠른 인터랙션과 고도화된 데이터 시각화를 제공한다는 점입니다. 이를 통해 Notion의 자유로운 데이터 스키마라는 장점을 취하는 동시에, 제한된 시각화 한계 및 느린 사용성을 극복했습니다.

## 2. 기술 스택 (Tech Stack)

| 분류 | 기술 및 라이브러리 | 적용 목적 |
| --- | --- | --- |
| **Framework / Core** | Next.js (16.1.6, App Router), React (19.2.3) | 서버 사이드 렌더링, API 라우트 활용 및 최신 React 기능 도입 |
| **State Management** | Zustand (5.0.12) | 가볍고 직관적인 전역 상태 관리 및 Slice 패턴을 통한 상태 분리 |
| **Database / Backend** | @notionhq/client (5.13.0) | Notion API를 활용한 Headless CMS 연동 및 데이터 영속화 보장 |
| **Styling & UI** | Tailwind CSS v4, clsx, tailwind-merge | Utility-first 스타일링과 동적 클래스 병합 처리 |
| **Visualization & Animation**| Recharts (3.8.0), Framer Motion (12.37.0) | 대시보드 통계 차트 구현 및 부드러운 UI 전환 애니메이션 처리 |
| **Validation & Form** | React Hook Form, Zod | 스키마 기반 런타임 데이터 검증 및 안전한 폼 데이터 처리 |
| **Testing** | Vitest (3.2.4), Testing Library | JSDOM 기반의 단위/통합 테스트 환경 구축 및 무결성 검증 |

## 3. 핵심 아키텍처 및 데이터 파이프라인 (Core Architecture & Data Pipeline)

### 3.1. 계층 분리 아키텍처 (Layered Architecture)
프론트엔드와 백엔드의 책임을 명확하게 분리하여 확장성과 유지보수성을 극대화하였습니다.

- **Presentation Layer (\`src/app\`, \`src/components\`)**: React 기반의 UI와 서버/클라이언트 라우팅 처리
- **State Layer (\`src/store\`)**: Zustand를 이용해 서버 데이터를 캐싱하고, UI 상태를 즉시(Optimistic)로 갱신
- **Service Layer (\`src/services\`)**: 클라이언트에서 호출할 API 인터페이스 및 HTTP 통신 구현체 (e.g. \`JsonRoutineService\`)
- **API Controller Layer (\`src/app/api\`)**: Next.js Route Handler가 요청을 받아 Zod로 유효성을 검증하고 Repository로 위임
- **Repository Layer (\`src/repositories\`)**: Notion API와의 실제 통신 및 스키마 매핑 로직 전담 (e.g. \`NotionRoutineRepository\`)

### 3.2. 데이터 흐름 파이프라인 (Data Flow)
1. **[UI/Store]** 유저 인터랙션으로 Zustand Store의 비동기 액션 호출 (예: 상태 업데이트)
2. **[Service]** \`Json*Service\`가 Fetch API를 통해 방어적 에러 핸들링과 함께 Next.js API 라우트로 네트워크 요청 전송
3. **[API Route]** \`/api/*\` 경로에서 요청을 받아 Payload 유효성 검사 (Zod Schema Validation) 수행
4. **[Repository]** \`Notion*Repository\`가 검증된 데이터를 바탕으로 Notion Database의 블록 및 속성 업데이트 구성 및 실행
5. **[Response]** 성공 결과가 클라이언트로 반환되고, Zustand Store가 뷰(View)를 트리거하여 화면 렌더링 최신화

## 4. 프로젝트 주요 구조 (Project Structure)

\`\`\`text
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # 대시보드 도메인 라우트 (analytics, calendar, routines, todos 등)
│   │   ├── api/                # 클라이언트 통신을 받아 Notion에 중계하는 BFF(Backend for Frontend) 엔드포인트
│   │   └── layout.tsx / page.tsx
│   ├── components/             # 도메인 중립적 및 재사용 가능한 UI 컴포넌트 목록 모음
│   ├── data/                   # 초기화 데이터, 모의(Mock) 데이터 및 정적 설정 값
│   ├── hooks/                  # 공통 비즈니스 로직을 분리한 커스텀 리액트 훅
│   ├── lib/                    # 유틸리티 함수 모음 (클래스 병합 처리, Zod 스키마 정의 등)
│   ├── repositories/           # [Backend Layer] Notion API와 직접 소통하고 DTO 매핑을 수행하는 계층
│   ├── services/               # [Frontend Layer] 프론트엔드가 사용할 API 호출 인터페이스 및 팩토리 패턴
│   ├── store/                  # Zustand Store (Slice 패턴으로 모듈별 객체 분리 구조 설계)
│   └── types/                  # 전역으로 공유되는 비즈니스 도메인 엔티티(Entity) 타입 선언
\`\`\`

## 5. 주요 구현 특징 및 기술적 성과 (Key Highlights)

### 5.1. Slice 패턴을 활용한 스케일러블한 상태 관리
여러 도메인의 데이터(Routines, Schedules, Todos, Categories, Analytics 등)가 대량으로 혼재하는 대시보드의 특성상, 단일 Store가 비대해지는 문제를 방지하기 위해 **Zustand Slice 패턴**을 적극 도입했습니다. 개별 관심사별로 상태와 비동기 로직을 분리(\`RoutineSlice\`, \`TodoSlice\` 등) 한 후, 루트 스토어(\`useAppStore\`)에 통합하여 유연하고 확장 가능한 데이터 파이프라인을 구축했습니다.

### 5.2. Service Factory 패턴으로 의존성 역전 구현
유저 인터페이스(UI)가 구체적인 통신 로직에 강하게 종속되는 현상을 막기 위하여 \`ServiceFactory\` 패턴을 적용했습니다. \`IRoutineService\`, \`ITodoService\`와 같은 추상 인터페이스에 연결된 구현체(\`JsonRoutineService\`)를 동적으로 주입하여, 추후 다른 데이터베이스 플랫폼(예: Supabase 등)으로의 마이그레이션 시 프론트 컴포넌트 로직의 변경을 원천적으로 차단했습니다.

### 5.3. Notion DB의 최적화된 Headless 연동
자주 업데이트 되거나 관리가 필요한 분류, 프로젝트, 스케줄 등을 코드베이스 외부(Notion)에서 편리하게 제어할 수 있습니다. Notion API가 가지는 복잡한 관계 쿼리 및 통계적 연산 한계는 Next.js 내부 로직과 프론트엔드 데이터 조합(Join) 로직으로 완벽하게 보완했습니다. 관리적 편안함과 유접 인터페이스의 자유도를 동시에 확보했습니다.

### 5.4. 마이크레이션 스크립트 기반 데이터 무결성 이관
레거시 데이터나 로컬의 과거 데이터를 Notion DB 구조로 단숨에 정확하게 이전하기 위해, 독립적으로 구동되는 커스텀 마이그레이션 스크립트(\`migrate-to-notion.js\`, \`migrate-records-only.js\`)를 구축하여 초기 개발 환경 구축과 데이터 무결성 보장을 완수했습니다.
`,
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
    summary:
      "사용자의 감정과 주변 환경 컨텍스트를 AI로 분석하여 개인화된 심리 치유 처방을 제공하는 Flutter 기반 모바일 웰니스 애플리케이션입니다.",
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
    summary:
      "트렌드 키워드와 뉴스를 수집하여 AI 페르소나 기반의 스레드 콘텐츠로 변환하고 Meta Threads API를 통해 전 과정을 자동화하는 발행 서비스입니다.",
    description: `# Threads Auto-Poster

## 개요

\`threads-autoposter\`는 매일 개발 및 AI 관련 이슈를 수집하고, 이를 Threads용 게시물로 생성한 뒤 자동 발행하고, 이후 수집한 성과 데이터를 다음 생성 과정에 다시 반영하는 TypeScript 기반 자동화 시스템입니다.

현재 저장소는 성격이 다른 두 애플리케이션을 함께 포함합니다.

1. 루트 디렉터리의 Node.js 워커 및 운영 제어 영역
2. \`dashboard/\` 하위의 별도 Next.js 분석 대시보드

실질적인 핵심은 루트 워커입니다. 이 워커는 외부 소스를 크롤링하고, Gemini로 핵심 트렌드를 선별하고, 최근 발행 이력과 비교해 중복을 걸러내고, 한국어 또는 영어 Threads 글을 생성하고, 승인된 글을 발행하며, 이후 인사이트를 수집하고, 성과가 좋은 게시물을 few-shot 예시로 승격시켜 다음 생성 품질을 높입니다.

## 제품 범위

이 프로젝트는 단순히 스케줄에 맞춰 LLM 결과를 올리는 봇이 아닙니다. 하나의 콘텐츠 파이프라인 안에 다음 역할이 함께 묶여 있습니다.

- 여러 개발자 커뮤니티에서 트렌드 수집
- 단순 키워드 규칙이 아닌 AI 기반 주제 선별
- 최근 발행 이력 기준 중복 억제
- 프롬프트 메모리, 톤 제약, 성과 피드백이 들어간 스레드 생성
- Threads 댓글 체인을 포함한 자동 게시
- 스케줄, 토픽, 보류 게시물, 성과 지표를 다루는 운영 대시보드
- 글쓰기 패턴과 포맷 다양성을 점검하는 품질 분석

즉, 이 저장소는 단발성 포스팅 스크립트보다는 자율형 콘텐츠 운영 시스템에 가깝습니다.

## 아키텍처

### 1. 워커 런타임

루트 워커는 [\`src/index.ts\`](/D:/development/threads-autoposter/src/index.ts)에서 시작됩니다. 이 엔트리포인트는 환경변수 기반 설정을 로드하고, 현재 실행 상태를 출력하며, \`--now\` 및 \`--dry-run\` 플래그를 처리하고, 일반 실행 시에는 스케줄러 싱글턴을 시작합니다.

핵심 오케스트레이터는 [\`src/services/scheduler.ts\`](/D:/development/threads-autoposter/src/services/scheduler.ts)에 있습니다. 이 스케줄러는 다음 책임을 가집니다.

- 사용자 정의 스케줄 또는 discovery mode 스케줄 관리
- 일 단위 스케줄 새로고침
- 일간 및 주간 품질 분석 작업 실행
- 지연 수집 방식의 Threads 인사이트 작업 실행
- 전체 콘텐츠 파이프라인 실행

### 2. 데이터 및 상태 모델

이 프로젝트는 두 가지 저장 계층을 함께 사용합니다.

- Firestore: 운영 시점의 기본 데이터베이스
- \`data/\` 디렉터리의 로컬 JSON 파일: 초기값, 일부 설정, 폴백 저장소

Firestore가 실질적인 기준 저장소인 영역은 다음과 같습니다.

- 보류 및 발행 게시물
- few-shot 예시
- 스케줄 설정
- 토큰 메타데이터
- 품질 분석 리포트

반면 로컬 파일도 여전히 운영상 의미가 있습니다.

- [\`data/topics.json\`](/D:/development/threads-autoposter/data/topics.json): 토픽, 제외 키워드, 신뢰 소스 설정
- [\`data/examples.json\`](/D:/development/threads-autoposter/data/examples.json): few-shot 예시의 시드 또는 백업
- [\`data/schedules.json\`](/D:/development/threads-autoposter/data/schedules.json): 스케줄 상태의 폴백 또는 초기 부트스트랩 데이터
- Docker 진입 시 비어 있는 \`/app/data\` 볼륨에 기본 파일 복사

이 구조는 의도적입니다. 운영 이력과 가변 상태는 Firestore에 두고, 초기 구성과 부트스트랩 데이터는 파일로 유지해 로컬 개발과 마이그레이션 비용을 낮추고 있습니다.

### 3. 운영 인터페이스

운영자가 쓰는 UI는 현재 두 개로 나뉘어 있습니다.

루트 애플리케이션은 [\`src/server.ts\`](/D:/development/threads-autoposter/src/server.ts)에서 Express 서버를 띄우고, [\`public/app.js\`](/D:/development/threads-autoposter/public/app.js) 기반의 정적 대시보드를 제공합니다. 이 레거시 제어면은 다음 기능을 담당합니다.

- 토픽 관리
- 제외 키워드 관리
- 신뢰 소스 관리
- 스케줄러 시작, 정지, 즉시 실행
- 동적 스케줄 추가 및 삭제
- 보류 게시물 수정, 승인, 즉시 발행, 삭제
- 로그 조회

반면 \`dashboard/\`는 별도의 Next.js 16 분석 대시보드입니다. 이 앱은 Firestore에서 발행 게시물을 직접 읽어와 스레드 목록과 일별 참여도 차트를 렌더링하고, 수동 인사이트 갱신도 제공합니다. 인증은 [\`dashboard/src/proxy.ts\`](/D:/development/threads-autoposter/dashboard/src/proxy.ts)와 [\`dashboard/src/app/actions/auth.ts\`](/D:/development/threads-autoposter/dashboard/src/app/actions/auth.ts)에서 구현된 쿠키 기반 비밀번호 게이트를 사용합니다.

## 핵심 데이터 흐름

전체 흐름을 이해하는 가장 좋은 진입점은 [\`src/services/scheduler.ts\`](/D:/development/threads-autoposter/src/services/scheduler.ts)의 파이프라인 실행 순서입니다.

### 1. 토큰 검증

실제 게시 전에 워커는 [\`src/auth/threads-auth.ts\`](/D:/development/threads-autoposter/src/auth/threads-auth.ts)를 통해 Threads 액세스 토큰을 검증합니다. 검증에 실패하면 토큰 갱신을 시도합니다. 또한 설정된 \`THREADS_USER_ID\`가 토큰 소유자와 다를 경우 이를 자동으로 바로잡습니다.

### 2. 멀티소스 수집

[\`src/services/multi-source-crawler.ts\`](/D:/development/threads-autoposter/src/services/multi-source-crawler.ts)는 전날 기준 콘텐츠를 다음 소스에서 수집합니다.

- Hacker News 상위 스토리
- 여러 Reddit 서브레딧
- dev.to 인기 글

구현상 \`Promise.allSettled\`를 사용하므로, 특정 소스 하나가 실패해도 전체 수집이 중단되지 않습니다. 이후 \`topics.json\`에 등록된 trusted source가 있으면 해당 기사 본문을 추가로 가져와 Gemini로 전문 용어와 핵심 주장을 추출하고, 점수 보정까지 수행합니다.

### 3. 트렌드 합성

[\`src/services/trend-analyzer.ts\`](/D:/development/threads-autoposter/src/services/trend-analyzer.ts)는 수집한 기사 목록을 압축된 형태로 Gemini에 전달하고, 2~3개의 구체적인 트렌드 토픽을 JSON 형식으로 반환받습니다. 이후 이를 내부 표준 구조인 \`ResearchedTopic\`으로 변환합니다.

여기서 중요한 점은 주제 묶음이 규칙 기반 클러스터링 코드가 아니라 모델 기반 의미 해석에 의해 결정된다는 것입니다.

### 4. 중복 억제

[\`src/services/topic-dedup.ts\`](/D:/development/threads-autoposter/src/services/topic-dedup.ts)는 새 후보 토픽을 최근 발행 이력과 비교합니다.

중복 판정은 2단계로 구성됩니다.

- 저비용 Jaccard 스타일 토큰 유사도 검사
- 애매한 경우에만 수행하는 Gemini 의미 중복 검사

의미 검사 자체가 실패하면 파이프라인은 차단보다 진행을 택합니다. 즉, 여기서는 fail-open 성향이 분명합니다.

### 5. 콘텐츠 생성

[\`src/services/content-generator.ts\`](/D:/development/threads-autoposter/src/services/content-generator.ts)는 시스템 전체에서 가장 많은 제품 의사결정이 응집된 계층입니다.

이 서비스는 다음 요소를 합쳐 긴 프롬프트를 구성합니다.

- 고정된 크리에이터 페르소나
- chain-of-thought 스타일의 작성 절차
- 강제된 스레드 구조
- 감정 톤 전략
- Firestore 또는 \`data/examples.json\`에서 읽은 few-shot 예시
- 최근 게시 이력
- 최근 결과물의 품질 경고
- 과거 성과에서 추출한 프롬프트 피드백

생성 결과는 본문과 댓글 체인뿐 아니라 감정 분석용 JSON 블록도 포함합니다. 생성기는 감정 조합이 약하면 재시도하며, 최종적으로 \`mainPost\`와 replies 형태로 파싱합니다.

### 6. 보류 게시물 저장

생성된 게시물은 [\`src/utils/pending-posts-manager.ts\`](/D:/development/threads-autoposter/src/utils/pending-posts-manager.ts)를 통해 Firestore의 \`pending-posts\` 컬렉션에 저장됩니다.

구현상 중요한 사실이 하나 있습니다. \`addPendingPost\`는 현재 새 게시물을 기본적으로 \`approved: true\` 상태로 저장합니다. 즉, 승인 API와 수정 API는 존재하지만, 기본 파이프라인은 생성 직후 자동 승인되고 같은 실행 흐름에서 곧바로 발행 가능한 상태가 됩니다.

### 7. 발행

[\`src/services/threads-publisher.ts\`](/D:/development/threads-autoposter/src/services/threads-publisher.ts)는 Threads 실제 발행을 담당합니다.

이 서비스는 다음 순서로 동작합니다.

- Threads Graph API로 미디어 컨테이너 생성
- 컨테이너 처리 대기
- 본문 게시
- \`reply_to_id\`를 이용한 댓글 체인 순차 게시
- 게시 단계별 재시도 처리
- 실제 발행 없이 출력만 하는 dry-run 지원

특히 컨테이너 게시 전 30초 대기와 댓글 간 5초 대기 같은 Threads API 특화 제약이 코드에 직접 반영되어 있습니다.

### 8. 발행 후 피드백 루프

발행이 끝나면 스케줄러는 permalink를 조회하고 Threads id를 기록합니다. 이후 [\`src/services/performance-tracker.ts\`](/D:/development/threads-autoposter/src/services/performance-tracker.ts)가 두 시점에서 참여 데이터를 수집합니다.

- 발행 후 약 22시간 시점
- 발행 후 약 6.5일 시점

이 데이터는 두 용도로 사용됩니다.

- 대시보드 분석 화면의 지표 렌더링
- 다음 생성 프롬프트에서 어떤 포맷과 훅이 잘 먹히는지에 대한 피드백 제공

### 9. 품질 분석과 예시 승격

[\`src/utils/quality-analyzer.ts\`](/D:/development/threads-autoposter/src/utils/quality-analyzer.ts)는 최근 게시물을 기준으로 출력 일관성을 점검합니다. 현재 확인하는 항목은 다음과 같습니다.

- 포맷 다양성
- 질문형 마무리 비율
- 첫 댓글 시작 문구 반복 여부
- 첫 줄 훅 다양성

또한 [\`src/utils/pending-posts-manager.ts\`](/D:/development/threads-autoposter/src/utils/pending-posts-manager.ts)의 \`promoteExcellentPosts()\`는 성과가 일정 기준을 넘는 게시물을 \`few-shot-examples\` 컬렉션으로 승격합니다. 별도의 학습 시스템 없이도 콘텐츠 생성 품질을 점진적으로 조정하는 방식입니다.

## 주요 기능 영역

### 트렌드 수집 및 정렬

이 프로젝트의 크롤러는 단순히 RSS나 API를 긁는 수준이 아닙니다. 여러 소스를 공통 \`CollectedArticle\` 구조로 정규화하고, 점수와 댓글 수를 포함한 메타데이터를 유지하고, trusted source에 대해서는 추가 LLM 기반 문맥 추출을 수행한 뒤, 그 결과를 정렬해 다음 단계로 넘깁니다.

### 프롬프트 엔지니어링이 곧 제품 로직

이 시스템의 차별점 상당수는 모델 래퍼가 아니라 프롬프트 설계 안에 있습니다. 콘텐츠 생성기는 다음과 같은 제품 의사결정을 담고 있습니다.

- 목소리와 페르소나
- 구조적 변주
- 감정 분포
- 반복 회피
- 링크 사용 방식
- Threads 포맷팅 규칙

즉, 여기서는 프롬프트가 단순 부속물이 아니라 핵심 비즈니스 로직입니다.

### 운영자가 개입 가능한 주제 경계

[\`src/config/topics.ts\`](/D:/development/threads-autoposter/src/config/topics.ts)는 운영자가 자동 수집 영역을 편집할 수 있게 해줍니다. 조정 가능한 축은 다음과 같습니다.

- 대상 토픽
- 제외 키워드
- 신뢰 소스

이 덕분에 시스템은 완전 자동 수집기라기보다 편집 방향을 지정할 수 있는 자동화 파이프라인이 됩니다.

### 이중 대시보드 구조

현재 저장소에는 운영 목적이 다른 두 UI가 공존합니다.

- 루트 Express + 정적 대시보드: 제어 중심
- 별도 Next.js 대시보드: 조회와 분석 중심

이 분리는 저장소가 단일 관리 화면에서 점차 역할 분리된 운영 도구로 이동하는 중이라는 신호로 읽을 수 있습니다.

## 프로젝트 구조

\`\`\`text
threads-autoposter/
├── src/
│   ├── index.ts                    # 워커 엔트리포인트 및 CLI 플래그 처리
│   ├── server.ts                   # 레거시 제어 대시보드용 Express 서버
│   ├── api/routes.ts               # 스케줄, 토픽, 보류 게시물 API
│   ├── auth/threads-auth.ts        # Threads 토큰 검증 및 갱신
│   ├── config/
│   │   ├── index.ts                # 환경변수 기반 런타임 설정
│   │   ├── schedules.ts            # 스케줄 저장 및 discovery mode 로직
│   │   └── topics.ts               # 토픽, 제외 키워드, 신뢰 소스 설정
│   ├── services/
│   │   ├── multi-source-crawler.ts
│   │   ├── trend-analyzer.ts
│   │   ├── topic-dedup.ts
│   │   ├── content-generator.ts
│   │   ├── emotional-analyzer.ts
│   │   ├── threads-publisher.ts
│   │   ├── threads-insights.ts
│   │   └── performance-tracker.ts
│   ├── utils/
│   │   ├── firebase.ts
│   │   ├── pending-posts-manager.ts
│   │   ├── quality-analyzer.ts
│   │   ├── gemini-fallback.ts
│   │   ├── env-updater.ts
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── __tests__/                  # 핵심 파이프라인 대상 Vitest 테스트
├── public/                         # Express가 서빙하는 레거시 브라우저 대시보드
├── data/                           # 시드 데이터 및 로컬 폴백 파일
├── scripts/                        # 운영용 스크립트 및 마이그레이션 스크립트
├── dashboard/                      # 별도 Next.js 분석 대시보드
└── Dockerfile                      # 워커 컨테이너 빌드 설정
\`\`\`

## 기술 스택

### 루트 워커

- Node.js 20
- TypeScript
- \`node-cron\`
- \`axios\`
- \`@google/genai\`
- \`firebase-admin\`
- \`winston\`
- \`vitest\`

### 대시보드 앱

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Recharts
- Firebase Admin SDK

### 외부 연동 시스템

- Threads Graph API
- Hacker News API
- Reddit JSON 엔드포인트
- dev.to API
- Firestore

## 주요 구현 결정

### Firestore 중심 운영, 파일 기반 부트스트랩 유지

코드베이스는 분명 로컬 JSON 중심 초기 버전에서 Firestore 기반 서비스로 진화한 상태입니다. 하지만 기존 파일 모델을 완전히 제거하지 않고 초기값과 폴백 용도로 남겨 두었습니다. 이 선택은 로컬 개발과 마이그레이션 비용을 낮추는 데 유리합니다.

### 모든 LLM 호출에 모델 폴백 적용

[\`src/utils/gemini-fallback.ts\`](/D:/development/threads-autoposter/src/utils/gemini-fallback.ts)는 Gemini 모델 목록을 순서대로 받아, 쿼터 초과나 호출 실패 시 다음 모델로 즉시 넘어갑니다. 자동화 워크로드에서는 이런 작은 안정성 계층이 실제 운영 품질에 직접 영향을 줍니다.

### 품질과 성과가 다시 생성으로 되돌아가는 구조

이 프로젝트는 "글 생성"과 "사후 분석"을 분리된 부수 기능으로 두지 않습니다. 최근 출력물의 품질 경고와 성과 인사이트가 다음 생성 프롬프트에 직접 주입됩니다. 별도 학습 인프라 없이도 적응형 생성 시스템처럼 동작하게 만드는 설계입니다.

### 발행 이력이 상태로 남는 구조

생성된 게시물은 발행 전에 저장되고, 발행 후에는 Threads id와 permalink가 기록되며, 나중에는 engagement 스냅샷도 같은 객체에 축적됩니다. 따라서 한 게시물의 생애주기를 생성부터 성과 수집까지 추적할 수 있습니다.

### 두 개의 대시보드는 서로 다른 운영 역할을 반영

레거시 대시보드는 제어면이고, Next.js 대시보드는 분석면입니다. 둘이 공존하면서 다소 중복 개념이 생기긴 했지만, 역할 자체는 분리되어 있어 현재 상태를 혼란이라기보다 이행 단계로 보는 편이 정확합니다.

## 왜 이 프로젝트가 기술적으로 흥미로운가

이 저장소가 흥미로운 이유는 프레임워크 자체보다 제품 동작 복잡도가 높기 때문입니다.

핵심 난점은 다음에 있습니다.

- 노이즈가 많은 외부 소스를 안정적인 콘텐츠 파이프라인으로 바꾸는 일
- LLM을 기사 보강, 주제 선별, 중복 판정, 글쓰기, 감정 분석 등 여러 역할에 쓰는 일
- 시간이 지나도 반복적인 출력으로 무너지지 않도록 상태를 유지하는 일
- 생성 품질과 실제 반응 데이터를 다음 프롬프트로 되먹이는 일
- 자동 실행과 인간 운영 제어를 함께 지원하는 일

결과적으로 이 프로젝트는 LLM 기반 자율 워크플로가 실제 운영 단계로 가면서 어떤 요소를 필요로 하는지 잘 보여주는 예시입니다. 저장소 안에는 이미 마이그레이션, 폴백, 지연형 지표 수집, 운영자 도구, 피드백 기반 프롬프트 개선 같은 현실적인 문제들이 모두 드러나 있습니다.
`,
    techStack: [
      "Node.js",
      "TypeScript",
      "Gemini API",
      "Meta Threads API",
      "node-cron",
    ],
    liveUrl: "https://threads-autoposter-one.vercel.app",
    githubUrl: "https://github.com/tuosm9390/threads-autoposter",
    imageUrl: "/images/project-threads-autoposter.webp",
    accentColor: "#000000",
  },
  {
    id: "agent-diary",
    title: "AgentDiary",
    summary:
      "AI 에이전트의 터미널 세션을 실시간 모니터링하고 작업 내용을 자동 요약 및 아티팩트로 추출하며 RAG 기반 로그 채팅을 지원하는 대시보드입니다.",
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
    // liveUrl: "https://agent-diary.vercel.app",
    githubUrl: "https://github.com/tuosm9390/agent-diary",
    imageUrl: "/images/project-agent-diary.webp",
    accentColor: "#3b82f6",
    liveUrl: "",
  },
  {
    id: "cafe-book",
    title: "Cafe Book (카페 도감)",
    summary:
      "방문한 카페를 지도에 기록하고 나만의 커피 레시피를 공유하는 플랫폼으로, 카카오 지도 API와 Firebase 실시간 동기화를 활용한 GIS 기반 서비스입니다.",
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
`,
    techStack: [
      "React",
      "TypeScript",
      "Firebase",
      "Kakao Maps API",
      "Tailwind CSS",
    ],
    liveUrl: "https://cafe-book.vercel.app",
    imageUrl: "/images/project-cafe-book.png",
    accentColor: "#ff9800",
  },
];
