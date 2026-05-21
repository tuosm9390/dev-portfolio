import { z } from "zod";

/**
 * Project interface defined with Zod for runtime validation
 * Following Constitution Principle IV: Strict Validation & Type Safety
 */
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  origin: z.string().optional(),
  brandSignal: z.string().optional(),
  productFlow: z.array(z.string()).optional(),
  keyDecisions: z.array(z.string()).optional(),
  proofSignals: z.array(z.string()).optional(),
  description: z.string(), // Markdown supported
  techStack: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  imageUrl: z.string(),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/), // Hex color validation
});

export type Project = z.infer<typeof ProjectSchema>;

const featuredOrder = [
  "Synapso.dev",
  "persona-style",
  "threads-autoposter",
  "minions-bid",
  "ai-doc-agent",
  "youtube-notebooklm-platform",
];

const rawProjects: Project[] = [
  {
    id: "Synapso.dev",
    title: "Synapso.dev",
    summary:
      "PRD와 GitHub 활동을 AI가 교차 분석해 프로젝트 진행률, drift, blocker, risk를 추적하는 Project Memory SaaS.",
    origin:
      "커밋과 이슈에는 프로젝트의 실제 변화가 남지만, 계획 대비 어디까지 왔고 무엇이 틀어졌는지는 매번 따로 정리해야 했습니다. 그 상태 점검을 AI가 대신 하도록 만들었습니다.",
    brandSignal:
      "블로그 자동 생성기에서 Project Memory로 피벗하며, 기존 인증·GitHub 연동·결제 인프라를 유지한 채 핵심 가치 제안을 프로젝트 상태 추적으로 바꾼 SaaS입니다.",
    productFlow: [
      "프로젝트와 PRD를 등록하고 선택적으로 GitHub 저장소를 연결",
      "최근 커밋 Diff, PR, 이슈 맥락을 수집해 불필요한 파일을 필터링",
      "Gemini Structured Output으로 진행률, drift, blocker, risk를 분석",
      "스냅샷을 저장하고 대시보드에서 시계열 상태 변화를 표시",
    ],
    keyDecisions: [
      "NextAuth v5에서 GitHub Numeric ID를 사용자 식별자로 고정",
      "GitHub 연결 전에도 PRD만으로 baseline 스냅샷을 생성하도록 설계",
      "Gemini responseSchema로 JSON 응답 구조를 강제해 파싱 오류를 방지",
      "PortOne 빌링키 정기결제와 payment_events 멱등성으로 구독 흐름을 구성",
    ],
    proofSignals: [
      "프로젝트 등록, GitHub 활동 수집, AI 분석, 스냅샷 저장, 대시보드 표시까지 5단계 파이프라인 구현",
      "analysis_runs와 state_snapshots로 분석 실행과 상태 변화를 감사 추적",
      "Lazy Reset 사용량 제한, 실패 시 사용량 롤백, Cron 보안 토큰 등 운영 안전장치 포함",
    ],
    description: `# synapso.dev — AI-Powered Project Memory Dashboard

## 프로젝트 개요 (Overview)

**synapso.dev**는 솔로 빌더와 소규모 팀을 위한 **AI 기반 프로젝트 상태 추적 SaaS**입니다.

개발자가 PRD(제품 요구사항 문서)를 등록하고 GitHub 저장소를 연결하면, Google Gemini AI가 최근 커밋·PR·이슈 활동을 PRD와 교차 분석하여 **프로젝트의 현재 진행률, drift(계획 이탈), blocker, risk를 구조화된 대시보드로 보고**합니다.

> **"코드는 당신이 짭니다. 프로젝트 상태는 AI가 추적합니다."**

---

## 서비스 피벗 배경 (Product Pivot)

초기 synapso.dev는 GitHub 커밋을 Gemini AI가 분석하여 **기술 블로그 포스트를 자동 생성**하는 SaaS로 출발했습니다. Reverse Spec Recovery(커밋→기획 역추론) 프롬프팅과 Structured Output을 결합한 포스트 생성기로, Stripe 결제와 자동 포스팅 크론까지 구현했습니다.

2026년 5월 피벗 결정 이후, 블로그 생성 기능(약 4,800줄)을 전면 제거하고 **Project Memory** 단독 서비스로 전환했습니다. 기술 인프라(인증, DB, 결제, GitHub 연동)는 그대로 유지하면서 핵심 가치 제안을 교체한 구조적 피벗입니다.

---

## 핵심 파이프라인 (Core Pipeline)

전체 데이터 흐름은 **프로젝트 등록 → GitHub 활동 수집 → Gemini 분석 → 스냅샷 저장 → 대시보드 표시**의 5단계로 구성됩니다.

\`\`\`
프로젝트 + PRD 등록  →  GitHub 활동 수집   →   Gemini 분석    →  스냅샷 저장   →  대시보드 표시
────────────────       ─────────────────      ─────────────      ─────────────     ─────────────
projects 테이블         커밋/PR/이슈 수집       PRD 교차 분석      state_snapshots   진행률/drift
project_plans 테이블    Octokit API            Structured JSON    analysis_runs     시계열 히스토리
PRD 마크다운 입력        불필요 파일 필터링       Exponential Retry   수치 정규화        ko/en 출력
\`\`\`

### 1단계: 프로젝트 등록 (\`lib/projects.ts\`)

- 프로젝트 이름, 설명, 원래 thesis(가설)와 현재 thesis를 입력하여 프로젝트를 생성
- 선택적으로 GitHub 저장소(\`owner/repo\`)를 연결하여 활동 기반 분석 활성화
- PRD/계획 문서를 마크다운으로 등록하면 \`project_plans\` 테이블에 버전 1로 저장
- \`project-slug\`는 이름 기반으로 자동 생성, 충돌 시 \`-1\`, \`-2\` 카운터 부여 (최대 100회 보호)
- React \`cache()\`로 동일 요청 내 DB 중복 조회 방지 (\`getProjectById\`, \`getProjectByOwnerAndSlug\`)

### 2단계: GitHub 활동 수집 (\`lib/github.ts\`)

- \`getRecentCommits\`로 설정된 소스 윈도우(기본 7일) 내 최근 커밋 최대 5개를 가져옴
- \`getCommitDiff\`로 각 커밋의 파일별 변경 내용을 수집, \`EXCLUDED_FILE_PATTERNS\`로 lock 파일·바이너리·빌드 아티팩트를 자동 필터링하여 Gemini 컨텍스트 낭비 방지
- \`getPullRequestsForCommit\`으로 커밋과 연결된 PR의 제목·본문을 수집하여 의사결정 맥락 확보
- 커밋 메시지와 PR 본문에서 \`#(\\d{1,6})\` 정규식으로 이슈 번호를 추출, \`getIssuesByNumbers\`로 이슈 제목·상태·본문 수집
- GitHub 연결 없이도 동작: baseline 스냅샷을 자동 생성하여 PRD만으로 분석 시작 가능

### 3단계: Gemini 분석 (\`lib/project-memory-ai.ts\`)

- \`@google/genai\` SDK로 Gemini API 호출. \`responseMimeType: "application/json"\` + \`responseSchema\`로 **Structured Output** 강제하여 파싱 오류 원천 차단
- 프롬프트는 프로젝트 thesis, PRD 전문, 커밋 활동, PR 맥락, 이슈 맥락을 구조화된 블록으로 조합
- **7가지 분석 항목**: 현황 요약(2~4문장), 진행률(0~100), 현재 단계명, blocker/risk/drift 수, watchNext 2~4개, planProgress 3~6개, drift 0~3개
- **출력 언어 지정**: \`locale\` 파라미터(\`ko\`/\`en\`)에 따라 출력 언어 시스템 프롬프트를 교체. status 값(done/in_progress/at_risk/blocked)과 drift_type 값은 언어 무관 고정
- **Exponential Backoff 재시도**: 503(Gemini 과부하) 시 \`2^n * 2000ms\` 딜레이로 최대 3회 재시도
- 분석 결과에 commit/PR/issue/PRD 출처를 \`evidence\` 배열로 첨부하여 근거 추적 가능

### 4단계: 분석 파이프라인 조율 (\`lib/project-refresh.ts\`)

- \`refreshProjectState\`가 전체 파이프라인을 조율하는 단일 진입점
- \`createAnalysisRun\`으로 분석 실행 레코드(pending → processing → completed/failed)를 관리
- GitHub 연결 여부(\`hasRepoConnection = hasRepoConfigured && Boolean(accessToken)\`)를 판단하여 AI 분석 또는 baseline bootstrap을 분기
- \`buildCommitCoverage\`, \`buildIssueCoverage\`로 분석 범위 메타데이터를 스냅샷에 함께 저장
- \`rawOutputJson\`에 모드(분석 vs baseline), 입력 데이터 수, \`fallbackReason\`을 기록하여 디버깅 및 감사 추적 지원

### 5단계: 스냅샷 저장 및 대시보드 표시

- \`state_snapshots\` 테이블에 진행률, 현재 단계, blocker/risk/drift 수, watchNext, planProgress JSON, drift JSON, evidence JSON 저장
- 스냅샷 히스토리(\`getStateSnapshotsByProject\`)로 프로젝트 상태 변화를 시계열로 추적
- 대시보드에서 진행률 바, drift 카드, watchNext 체크리스트, planProgress 항목별 상태 렌더링
- \`/projects/[id]/runs\`에서 분석 실행 이력 및 실패 원인 조회 가능

---

## 프로젝트 구조 (Project Structure)

\`\`\`text
synapso.dev/
├── app/
│   ├── [locale]/                     # next-intl 다국어 라우팅 (ko / en)
│   │   ├── projects/                 # Project Memory 대시보드
│   │   │   ├── page.tsx              # 프로젝트 목록
│   │   │   ├── new/page.tsx          # 프로젝트 생성 (PRD 입력 포함)
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 프로젝트 대시보드 (진행률·drift·스냅샷)
│   │   │       ├── edit/page.tsx     # 프로젝트·PRD 수정
│   │   │       ├── drift/page.tsx    # Drift 상세 추적
│   │   │       └── runs/page.tsx     # 분석 실행 이력
│   │   ├── settings/page.tsx         # 계정·구독 설정
│   │   ├── pricing/page.tsx          # 구독 플랜 안내
│   │   ├── changelog/page.tsx        # GitHub Releases 기반 업데이트 노트
│   │   ├── about/page.tsx            # 서비스 소개
│   │   ├── how-it-works/page.tsx     # 작동 방식 설명
│   │   ├── admin/                    # 관리자 포털 (유저·테스터·구독 관리)
│   │   ├── login/page.tsx            # GitHub OAuth 로그인
│   │   └── tester-apply/page.tsx     # 베타 테스터 신청
│   ├── actions/                      # React Server Actions (project 생성·수정·새로고침)
│   └── api/
│       ├── projects/                 # 프로젝트 CRUD + 상태 새로고침
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts          # 조회·수정·삭제
│       │       ├── refresh/route.ts  # 상태 분석 트리거
│       │       └── drift/route.ts    # Drift 상세 조회
│       ├── github/                   # 저장소 목록 조회
│       ├── cron/billing/route.ts     # 구독 자동 갱신 (매일 01:00 UTC)
│       ├── portone/billing-key/      # PortOne 결제키 등록
│       ├── webhooks/portone/         # PortOne 웹훅 수신
│       └── subscription/             # 사용량·플랜 조회
├── lib/
│   ├── projects.ts                   # Project Memory CRUD (projects, plans, snapshots, runs)
│   ├── project-memory-ai.ts          # Gemini 기반 프로젝트 상태 분석 프롬프트 및 호출
│   ├── project-refresh.ts            # 프로젝트 상태 새로고침 파이프라인 조율
│   ├── github.ts                     # Octokit 기반 커밋 Diff·PR·이슈 수집, 파일 필터링
│   ├── subscription.ts               # 티어별 제한 상수(TIER_LIMITS), Lazy Reset
│   ├── portone-billing.ts            # PortOne SDK 결제키 저장·청구·취소·웹훅 처리
│   ├── profiles.ts                   # 사용자 프로필 관리, Profile ID 마이그레이션
│   ├── email.ts                      # Resend 기반 트랜잭션 이메일 발송
│   ├── changelog.ts                  # GitHub Releases 기반 업데이트 노트
│   ├── supabase-admin.ts             # Service Role Key 기반 관리자 클라이언트
│   └── types.ts                      # 공유 타입 (Project, ProjectPlan, StateSnapshot 등)
├── components/
│   ├── projects/                     # Project Memory 대시보드 컴포넌트
│   ├── settings/                     # 구독·계정 설정 UI
│   ├── Header.tsx / Footer.tsx
│   └── ui/                           # 공통 UI 컴포넌트
├── messages/                         # next-intl 번역 파일 (ko.json, en.json)
├── scripts/
│   └── drop-blog-tables.sql          # 블로그 잔여 DB 테이블 DROP 마이그레이션
└── auth.ts                           # NextAuth v5 GitHub OAuth 설정
\`\`\`

---

## 상세 기능 구현 (Technical Implementation)

### AI 분석 프롬프트: 운영 리뷰어 페르소나

\`\`\`typescript
// lib/project-memory-ai.ts
\`당신은 AI-native solo builder의 프로젝트 상태를 점검하는 운영 리뷰어입니다.

목표는 "글을 쓰는 것"이 아니라, 프로젝트 상태를 구조화된 JSON으로 보고하는 것입니다.
말투는 간결하고 사실 중심이어야 합니다. 과장 금지. 마케팅 금지.\`
\`\`\`

Gemini 프롬프트는 마케팅이나 수식어를 명시적으로 금지하고, 정보 부족 시 "보수적으로 추정"하도록 지시합니다. PR title/body와 issue 본문이 있으면 커밋 메시지보다 우선하여 의사결정 맥락을 판단합니다.

### Structured Output으로 응답 스키마 강제

\`\`\`typescript
// lib/project-memory-ai.ts
const schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    progressPercent: { type: Type.INTEGER },
    currentPhase: { type: Type.STRING },
    blockerCount: { type: Type.INTEGER },
    riskCount: { type: Type.INTEGER },
    driftCount: { type: Type.INTEGER },
    watchNext: { type: Type.ARRAY, items: { type: Type.STRING } },
    planProgress: { type: Type.ARRAY, items: { /* label, status, evidence, notes */ } },
    drift: { type: Type.ARRAY, items: { /* title, drift_type, original, current, why, evidence_refs */ } },
  },
  required: ["summary", "progressPercent", "currentPhase", ...],
};
\`\`\`

스키마에 없는 자유 텍스트 필드를 원천 차단하여 파싱 오류 가능성을 제거합니다. \`progressPercent\`는 수신 후 \`Math.max(0, Math.min(100, value))\`로 범위를 강제 정규화합니다.

### Baseline Bootstrap: GitHub 없이도 동작

\`\`\`typescript
// lib/project-refresh.ts
const analysis = hasRepoConnection
  ? await analyzeProjectState(currentProject, plan, commitDiffs, pullRequests, issues, locale)
  : buildBaselineAnalysis(currentProject.id, currentProject.name, plan, locale);
\`\`\`

GitHub 연결 전에도 PRD만으로 초기 스냅샷을 생성합니다. Baseline 스냅샷의 \`fallbackReason\`은 \`missing_plan_and_github_activity\` / \`missing_repo_connection\` / \`missing_github_token\` 중 하나로 명시되어 사용자에게 다음 설정 단계를 안내합니다.

### 안정적인 사용자 식별자 설계

\`\`\`typescript
// auth.ts
if (account) {
  token.accessToken = account.access_token;
  token.sub = account.providerAccountId; // GitHub Numeric ID (불변)
}
\`\`\`

NextAuth v5 기본 동작(매 로그인마다 \`randomUUID()\` 생성)을 오버라이드하여 **GitHub Numeric ID를 \`token.sub\`으로 고정**합니다. 기존 UUID 기반 프로필은 \`migrateProfileId\` 함수로 1회성 자동 마이그레이션하여 데이터 손실 없이 전환합니다.

### 계층적 구독 시스템 (Tier-based Constraint)

\`\`\`typescript
// lib/subscription.ts
export const TIER_LIMITS: Record<SubscriptionTier, { ... }> = {
  free:     { monthlyLimit: 20,       aiModel: "gemini-3.1-flash-lite-preview", ... },
  pro:      { monthlyLimit: 30,       aiModel: "gemini-3-flash-preview",        price: { monthly: 6900, yearly: 58800 } },
  business: { monthlyLimit: Infinity, aiModel: "gemini-3.1-pro-preview",        price: { monthly: 29900, yearly: 274800 } },
};
\`\`\`

- **Lazy Reset**: 매 사용량 조회 시 \`usage_reset_date\`가 현재 시각을 지났으면 카운터를 자동 초기화. 별도 스케줄러 없이 DB 부하를 최소화
- **원자적 증가**: Supabase RPC \`increment_usage_count\`로 경쟁 조건 없는 카운터 증가. RPC 미존재 시 단순 update로 fallback
- **취소 롤백**: 분석 실패 시 \`decrementUsage\`로 사용량 원복

### PortOne 결제 시스템

\`\`\`typescript
// lib/portone-billing.ts
export async function saveBillingKeyAndCharge(username, billingKey, tier, cycle) {
  // 1. 첫 결제 실행
  await paymentClient.payWithBillingKey({ paymentId, billingKey, ... });

  // 2. 결제 이벤트 멱등성 기록 (upsert + ignoreDuplicates)
  await supabaseAdmin.from("payment_events").upsert(
    { id: paymentId, ... },
    { onConflict: "id", ignoreDuplicates: true }
  );

  // 3. 프로필 구독 상태 업데이트
  await supabaseAdmin.from("profiles").update({ subscription_tier, subscription_status: "active", ... });
}
\`\`\`

- **자동 갱신 Cron** (\`/api/cron/billing\`, 매일 01:00 UTC): \`usage_reset_date <= now\`인 active 구독자를 조회하여 \`chargeWithBillingKey\` 자동 실행. 결제 실패 시 \`past_due\` 상태 전환
- **웹훅 멱등성**: \`payment_events\` 테이블에 이벤트 ID를 PK로 upsert하여 동일 이벤트 중복 처리 방지
- **빌링키 삭제 복원력**: 구독 취소 시 PortOne 빌링키 삭제 실패해도 DB 상태는 정상 업데이트

### 보안 아키텍처

\`\`\`typescript
// next.config.ts — 전역 보안 헤더
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://*.supabase.co ...",
}
\`\`\`

- **역할 기반 접근 제어**: JWT에 \`role\` 필드 포함. \`/admin\` 경로를 \`role === 'admin'\`으로 보호. \`/@admin-user\` 같은 username 오탐을 \`startsWith\` 정밀 매칭으로 구분
- **Cron 엔드포인트 보호**: \`CRON_SECRET\` Bearer 토큰으로 외부 호출 차단
- **Rate Limiting**: Upstash Redis 기반 API 요청 제한
- **server-only 가드**: \`lib/supabase-admin.ts\`에 \`server-only\` 패키지 임포트로 Service Role Key 클라이언트 코드의 클라이언트 번들 진입 차단

---

## 데이터베이스 스키마 (Database Schema)

| 테이블             | 역할                                                                |
| ------------------ | ------------------------------------------------------------------- |
| \`profiles\`         | 사용자 정보, 구독 티어, PortOne 빌링키, 월별 사용량, 역할(role)     |
| \`payment_events\`   | 결제 이벤트 멱등성 기록 (이벤트 ID를 PK로 중복 방지)               |
| \`projects\`         | Project Memory 프로젝트 (이름, thesis, GitHub 연결, slug)           |
| \`project_plans\`    | PRD/계획 문서 (버전 관리, is_current 플래그)                        |
| \`analysis_runs\`    | 분석 실행 기록 (pending → processing → completed/failed)            |
| \`state_snapshots\`  | AI 분석 결과 스냅샷 (진행률, drift, planProgress, evidence)         |

> **정리 예정 테이블**: \`posts\`, \`jobs\`, \`user_settings\`, \`processed_commits\`는 블로그 기능 전용으로 \`scripts/drop-blog-tables.sql\` 실행 시 제거됩니다.

---

## 개발 히스토리 및 문제 해결 (Development History)

### AI 응답 안정성 — Structured Output 도입

**배경**  
초기 Gemini 연동에서는 응답을 자유 텍스트로 받은 뒤 정규식으로 파싱했습니다. 섹션이 누락되거나 포맷이 달라지면 백엔드에서 파싱 오류가 발생했습니다.

**문제**  
AI의 자유 텍스트 응답은 구조가 일정하지 않아 JSON.parse 실패, 섹션 누락, 잘못된 타입 등의 런타임 오류가 산발적으로 발생했습니다.

**해결**  
\`@google/genai\` SDK의 \`responseMimeType: "application/json"\` + \`responseSchema\` 조합으로 응답 스키마를 스키마 계층에서 강제했습니다. 정수여야 할 필드(\`progressPercent\`, \`blockerCount\` 등)는 \`Type.INTEGER\`로 선언하고, 수신 후에도 \`Math.max(0, Math.min(100, value))\`로 범위를 방어적으로 정규화합니다.

**결과**  
파싱 오류 제로. 스키마 변경 시 TypeScript 타입과 \`schema\` 객체를 동시에 수정하므로 타입 불일치도 컴파일 타임에 탐지됩니다.

---

### 사용자 식별자 불안정 — GitHub Numeric ID 고정

**배경**  
NextAuth v5 기본 동작에서는 \`token.sub\`에 \`randomUUID()\`를 할당합니다. 로그인할 때마다 같은 GitHub 사용자에 다른 ID가 생성되어 DB 프로필이 중복 생성되었습니다.

**문제**  
Supabase의 \`profiles\` 테이블이 로그인마다 새 UUID 레코드를 생성하고, 기존 프로필(구독 정보 포함)과 단절됩니다.

**해결**  
\`auth.ts\`의 \`jwt\` 콜백에서 \`account.providerAccountId\`(GitHub의 불변 Numeric ID)를 \`token.sub\`으로 명시 고정했습니다. 기존 UUID 기반 프로필은 \`migrateProfileId\` 함수가 \`updateProfileId\` → 기존 UUID 레코드 삭제 순으로 1회성 마이그레이션합니다.

**결과**  
로그인 방식(세션 만료·재로그인·브라우저 교체)과 무관하게 동일한 \`profiles\` 레코드에 연결됩니다. 구독 상태와 사용량이 로그인 간에 안정적으로 유지됩니다.

---

### 결제 시스템 전환 — Stripe → PortOne

**배경**  
초기 구독 결제는 Stripe로 구현했습니다. 한국 시장 출시를 위해 원화 결제와 카드사 직접 연동이 필요했습니다.

**문제**  
Stripe는 한국 카드사 직접 연동을 지원하지 않아 PG사를 거쳐야 하고, 원화 정기결제 흐름이 복잡합니다.

**해결**  
PortOne V2 Server SDK로 전환했습니다. 빌링키 기반 정기결제 흐름(최초 카드 등록 → 빌링키 발급 → 이후 서버 측 자동 청구)을 \`portone-billing.ts\`에 구현하고, \`payment_events\` 테이블로 웹훅 재전송에 의한 이중 결제를 방지했습니다. 기존 \`lib/stripe.ts\`는 글로벌 결제 대비용으로 410 스텁으로 보존했습니다.

**결과**  
한국 주요 카드사 직결, 원화 정기결제, 자동 갱신 크론 완성. 웹훅 멱등성으로 결제 이중 처리 방지.

---

### 서비스 피벗 — 블로그 생성기 → Project Memory

**배경**  
블로그 자동 생성(Reverse Spec Recovery) 기능은 기술적으로 완성됐지만, 핵심 가치 제안이 "Project Memory(thesis drift 추적)"로 전환되었습니다.

**문제**  
블로그 기능 코드(약 4,800줄)가 신규 기능 개발의 인지 부담이 되고, 서비스 정체성을 희석시켰습니다.

**해결**  
커밋 \`462f269\`에서 블로그 관련 54개 파일을 삭제했습니다: \`lib/ai.ts\`, \`lib/jobs.ts\`, \`lib/posts.ts\`, \`lib/demo.ts\`, \`lib/settings.ts\`, 블로그 관련 모든 페이지(\`generate/\`, \`jobs/\`, \`@[username]/\`, \`demo/\`)와 API 라우트, 자동 포스팅 크론 등입니다. 이어진 커밋 \`cd717a5\`에서 DB 참조 잔재를 정리하고 \`scripts/drop-blog-tables.sql\`을 추가했습니다. 기술 인프라(인증, GitHub 연동, 결제, i18n)는 Project Memory에서 그대로 재활용됩니다.

**결과**  
빌드 통과 (17개 정적 페이지 생성). 코드베이스가 Project Memory에 집중된 단순한 구조로 정리됐습니다.

---

### i18n 도입 — next-intl 기반 한·영 이중 언어

**배경**  
서비스 초기에는 한국어 단일 언어였으나, 글로벌 접근성을 위해 영어 지원이 필요했습니다.

**문제**  
하드코딩된 한국어 문자열이 컴포넌트 전체에 분산되어 있어 번역 추가가 어려웠습니다.

**해결**  
\`next-intl\`을 도입하여 \`/messages/ko.json\`, \`/messages/en.json\`으로 번역 파일을 분리했습니다. \`[locale]\` 라우트 세그먼트로 언어별 URL을 구성하고, Project Memory 분석 출력도 \`locale\` 파라미터를 Gemini 프롬프트에 주입하여 AI 응답 언어를 제어합니다.

**결과**  
한국어/영어 전환 시 UI 문자열과 AI 분석 결과가 동시에 언어 전환됩니다.

---

### SEO 및 GEO 최적화

**배경**  
정적 마케팅 페이지의 검색 가시성과 AI 검색 엔진 대응이 필요했습니다.

**해결**  
- \`sitemap.ts\`: 정적 페이지 URL을 자동 생성, 무효 URL 방지 및 XSS 이스케이프 적용
- JSON-LD 구조화 데이터를 \`<body>\` 내 \`<script type="application/ld+json">\`으로 삽입 (기존 \`<head>\` 위치에서 이동하여 표준 준수)
- Vercel ISR로 정적 페이지 캐싱과 동적 데이터 결합

---

## 사용 기술 및 라이브러리 (Tech Stack)

| 영역              | 기술                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| **Framework**     | Next.js 16.1.6 (App Router), React 19.2.3                                   |
| **Auth**          | NextAuth v5.0.0-beta.30 (GitHub OAuth, JWT 전략, GitHub Numeric ID 고정)    |
| **Database**      | Supabase (PostgreSQL, Service Role Admin Client)                             |
| **AI / LLM**      | \`@google/genai\` — Gemini 2.5 Flash Lite / Flash / Pro (Structured Output)   |
| **결제**          | PortOne Server SDK (\`@portone/server-sdk\`, 빌링키 정기결제, 한국 원화)      |
| **Styling**       | Tailwind CSS v4.2.0, CSS Variables, 다크 테마                               |
| **i18n**          | next-intl v4 (ko / en 이중 언어, AI 응답 언어 제어 포함)                    |
| **이메일**        | Resend + \`@react-email/components\`                                          |
| **Rate Limiting** | Upstash Redis (\`@upstash/ratelimit\`)                                        |
| **Validation**    | Zod v4                                                                      |
| **GitHub 연동**   | Octokit v5 (커밋 Diff·PR·이슈 수집, 파일 필터링)                           |
| **Analytics**     | Vercel Analytics                                                            |
| **Infra**         | Vercel (Serverless, ISR, Cron Jobs)                                         |
| **Testing**       | Vitest, @testing-library/react                                              |

---

## 주요 구현 특징 (Key Highlights)

### 1. Structured Output으로 AI 응답 안정성 보장

Gemini API의 \`responseSchema\`로 JSON 타입 응답을 스키마 계층에서 강제합니다. \`progressPercent\` 같은 수치 필드는 수신 후에도 범위 정규화를 적용하는 이중 방어 구조입니다. 자유 텍스트 생성의 불안정성을 완전히 제거하여 파싱 오류를 원천 차단합니다.

### 2. GitHub 없이도 시작 가능한 Baseline Bootstrap

GitHub 연결 전에는 PRD만으로 초기 스냅샷을 자동 생성하고, \`fallbackReason\`으로 다음 설정 단계를 안내합니다. GitHub 연결 후 첫 새로고침에서 즉시 활동 기반 분석으로 전환됩니다. 사용자 온보딩 마찰을 최소화하는 점진적 가치 제공 흐름입니다.

### 3. PR/이슈 맥락 우선 활용으로 분석 정확도 향상

커밋 메시지만으로는 의사결정 이유를 파악하기 어렵습니다. PR 제목·본문과 이슈 맥락을 커밋 SHA에서 역추적하여 "왜 이 변경을 했는지"를 Gemini에게 제공합니다. 분석 결과의 근거(evidence)를 PR/이슈/커밋/PRD 단위로 첨부하여 추적 가능성을 확보합니다.

### 4. 멱등성 보장 결제 시스템

\`payment_events\` 테이블에 이벤트 ID를 PK로 \`upsert + ignoreDuplicates\`하여 웹훅 재전송에 의한 이중 결제를 방지합니다. 빌링키 삭제 실패 시에도 DB 상태는 정상 업데이트되는 복원력을 갖추었습니다.

### 5. Lazy Reset으로 사용량 초기화 스케줄러 제거

월별 사용량 초기화를 별도 크론 없이 처리합니다. 매 사용량 조회 시 \`usage_reset_date\`가 지났으면 즉시 초기화합니다. 스케줄러 장애나 타이밍 레이스 없이 DB 조회 한 번으로 초기화가 완성됩니다.

### 6. 시계열 스냅샷 히스토리

\`state_snapshots\` 테이블에 분석 결과를 누적 저장하여 프로젝트 상태 변화를 시계열로 추적합니다. \`analysis_runs\` 테이블로 각 분석 실행의 입력 데이터와 결과를 감사 추적할 수 있습니다.
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "GitHub API",
      "Gemini API",
      "Supabase",
      "PortOne",
      "next-intl",
    ],
    liveUrl: "https://synapso.dev",
    githubUrl: "https://github.com/tuosm9390/Synapso.dev",
    imageUrl: "/images/project-synapso-main.png",
    accentColor: "#f43f5e",
  },
  {
    id: "minions-bid",
    title: "Minions Bid (League Auction Tool)",
    summary:
      "리그 오브 레전드 커뮤니티 리그를 위한 실시간 선수 경매, 일정 편성, 경기 결과, 명예의 전당까지 이어지는 시즌 운영 도구.",
    origin:
      "여러 팀장이 동시에 참여하는 커뮤니티 리그 경매를 수동으로 운영하면 상태 동기화, 권한 관리, 일정 기록이 모두 흩어집니다. 그 운영 비용을 줄이기 위해 만들었습니다.",
    brandSignal:
      "단발성 드래프트 페이지가 아니라, 경매 결과를 리그 일정과 우승 기록까지 이어 붙인 커뮤니티 시즌 운영 시스템입니다.",
    productFlow: [
      "방 생성에서 팀장·선수 입력, Excel 업로드, 역할별 링크 발급까지 처리",
      "공개 입찰은 Firestore client transaction과 rules 검증으로 저지연 처리",
      "비공개 입찰은 서버 액션 경계에서 제출, 잠금, 공개, 낙찰을 분리",
      "완료된 경매 로스터를 리그 일정과 명예의 전당 기록으로 연결",
    ],
    keyDecisions: [
      "Firestore를 canonical state로, Realtime Database를 fanout/presence 전용으로 분리",
      "auction_revision으로 RTDB 이벤트와 Firestore snapshot의 순서 뒤집힘을 방어",
      "역할 링크는 httpOnly 쿠키와 Firebase custom token claim으로 검증",
      "방 링크에서 인증 토큰을 제거하고 private auth 문서에 역할 token을 저장",
    ],
    proofSignals: [
      "공개 입찰, 비공개 입찰, 만료 복구, 주최자 presence guard까지 경매 운영 흐름 구현",
      "리그 일정 생성, 경기 결과 등록, 일정 종료, 명예의 전당 자동 등록까지 시즌 관리로 확장",
      "Firestore rules smoke, room auth audit, Playwright fixture 기반 E2E 검증 스크립트 포함",
    ],
    description: `# Minions Bid

작성일: 2026-05-19

## 프로젝트 개요

Minions Bid는 리그 오브 레전드 커뮤니티 리그를 운영하기 위한 실시간 선수 경매 및 시즌 관리 도구입니다. 단발성 드래프트 페이지가 아니라, 경매방 생성, 선수 추첨, 공개 또는 비공개 입찰, 리그 일정 편성, 경기 결과 등록, 우승팀 명예의 전당 아카이브까지 하나의 운영 흐름으로 연결합니다.

핵심 목표는 세 가지입니다.

1. 여러 팀장이 동시에 참여하는 경매 상태를 빠르고 일관되게 동기화합니다.
2. 일반 계정 시스템 없이 역할별 링크와 서버 검증으로 운영 진입 장벽을 낮춥니다.
3. 경매 결과를 일정과 기록 관리로 이어 붙여 커뮤니티 시즌 운영 비용을 줄입니다.

시각 언어는 \`DESIGN.md\`의 Cyber-Pixel 방향을 따릅니다. 두꺼운 픽셀 테두리, 고대비 노랑/파랑/검정 조합, CRT 감성 오버레이, 3D 포인트 아이콘, 모달 중심 상호작용을 사용해 일반 SaaS 대시보드와 구분되는 이벤트 운영 도구의 정체성을 만듭니다.

## 제품 범위

### 실시간 경매

- 팀 수, 팀당 인원, 총 포인트, 팀장 포함 여부, 경매 방식을 선택해 방을 생성합니다.
- 팀장과 선수 정보는 수동 입력 또는 Excel 업로드로 등록합니다.
- Excel 업로드는 닉네임, 소환사의 협곡 티어, 주/부라인, 무작위 총력전, 전략적 팀 전투, 한마디 정보를 읽어 선수 및 팀장 데이터로 변환합니다.
- 주최자, 팀장, 관전자 링크를 생성하고 각 역할에 맞는 화면과 권한을 제공합니다.
- 방 링크는 Buly 단축 URL API를 통해 짧은 형태로 변환되어 공유됩니다. 링크에는 인증 토큰을 포함하지 않으며, 입장 시 서버에서 별도 인증합니다.
- 선수 추첨, 경매 시작, 타이머, 입찰, 낙찰, 유찰, 재경매, 드래프트 영입을 처리합니다.
- 공개 입찰과 비공개 입찰을 모두 지원합니다.

### 리그 일정 관리

- 완료된 경매 아카이브 또는 활성 방의 로스터를 바탕으로 리그 일정을 생성합니다.
- 날짜별 경기, 경기 시간, 단계 라벨, 세트 로그, 경기 결과, 메모를 관리합니다.
- 일정 변경과 결과 등록은 관리자 코드 검증을 통과한 서버 액션만 수행합니다.
- 완료 일정은 기본적으로 읽기 전용이며, 관리자 코드 확인 후 편집을 해제할 수 있습니다.
- 일정 종료 시 우승팀을 선택하고 명예의 전당에 자동 등록합니다.

### 명예의 전당

- 우승 기록을 전시 벽 형태로 조회합니다.
- 경매 아카이브 기반 수동 등록과 일정 종료 기반 자동 등록을 모두 지원합니다.
- 관리자 코드로 우승 기록을 등록하거나 삭제합니다.
- 시즌명, 우승팀, 팀장, 선수 명단, 낙찰가를 장기 기록으로 보존합니다.

### 홈과 운영 보조 기능

- 홈 화면에는 최신 업데이트 피드와 주요 이동 포털을 제공합니다.
- PWA manifest와 서비스 워커를 포함해 모바일 홈 화면 진입과 기본 정적 캐시를 지원합니다.
- 실시간 경매 지연 분석을 위해 브라우저 디버그 marker를 남길 수 있습니다.
- 운영 스크립트로 방 인증 토큰 감사, Firestore rules 스모크, legacy token 마이그레이션을 제공합니다.

## 아키텍처 요약

Minions Bid는 Next.js App Router 애플리케이션이며, Firebase를 실시간 상태 저장소와 운영 백엔드로 사용합니다.

\`\`\`text
사용자 브라우저
  -> Next.js App Router 페이지
  -> React 클라이언트 컴포넌트와 Zustand store
  -> Server Actions / Route Handlers
  -> Firebase Admin SDK
  -> Firestore canonical state
  -> Realtime Database fanout / presence
\`\`\`

### 데이터 저장소 역할

Firestore는 정본 상태입니다.

- \`rooms/{roomId}\`는 현재 경매 hot state를 가집니다.
- \`rooms/{roomId}/teams\`는 팀장, 포인트, 팀 메타데이터를 저장합니다.
- \`rooms/{roomId}/players\`는 선수 상태, 낙찰 팀, 낙찰가, 티어 정보를 저장합니다.
- \`rooms/{roomId}/bids\`는 공개 입찰 감사 이력입니다.
- \`rooms/{roomId}/messages\`는 채팅과 시스템 메시지의 영속 기록입니다.
- \`room_auth_secrets/{roomId}\`와 하위 \`team_tokens/{teamId}\`는 역할별 private token 저장소입니다.
- \`auction_archives\`는 완료된 경매 결과 스냅샷입니다.
- \`league_schedules\`와 하위 \`match_days\`는 일정과 날짜별 경기 목록입니다.
- \`hall_of_fame\`은 우승 기록입니다.

Realtime Database는 저지연 fanout과 presence 전용입니다.

- \`signals/{roomId}/auctionEvent\`는 최신 경매 이벤트 envelope를 전달합니다.
- \`signals/{roomId}/auctionEvents/{eventId}\`는 이벤트 추적과 디버그에 사용됩니다.
- \`signals/{roomId}/latestMessage\`는 최신 메시지 표시를 빠르게 퍼뜨립니다.
- \`presence/{roomId}\`는 주최자와 팀장 접속 상태를 추적합니다.

이 분리는 의도적입니다. Firestore는 정합성, 감사 이력, snapshot 복구에 강하고, RTDB는 짧은 이벤트와 접속 상태 fanout에 적합합니다. 따라서 화면은 빠르게 반응하되, 최종 수렴 기준은 항상 Firestore room canonical state와 \`auction_revision\`입니다.

## 핵심 파이프라인

### 1. 방 생성과 역할 링크 발급

방 생성은 \`CreateRoomModal\`과 \`useCreateRoom()\`에서 사용자 입력을 수집하고, \`createRoom()\` 서버 액션이 Firestore에 실제 데이터를 생성합니다.

주요 입력은 다음과 같습니다.

- 방 이름
- 팀 수와 팀당 인원
- 팀장 포함 방식
- 공개 입찰 또는 비공개 입찰 방식
- 팀별 기본 포인트
- 팀장 목록과 팀장 포인트
- 선수 목록
- 연결 일정 또는 리그명

서버는 다음 문서를 생성합니다.

- \`rooms/{roomId}\`에 방 메타데이터와 경매 hot state 초기값
- \`rooms/{roomId}/teams/{teamId}\`에 팀 정보
- \`rooms/{roomId}/players/{playerId}\`에 \`WAITING\` 상태 선수
- \`room_auth_secrets/{roomId}\`에 organizer/viewer token

반환된 링크는 Buly 단축 URL API(\`/api/short-links\`)를 통해 짧은 형태로 변환됩니다. 링크 자체에 인증 토큰을 포함하지 않으므로 URL이 유출되어도 바로 권한을 얻지 못합니다.
- \`room_auth_secrets/{roomId}/team_tokens/{teamId}\`에 팀장 token

반환된 token은 링크 생성에만 사용됩니다. 신규 방의 public room/team 문서에는 역할 token을 저장하지 않습니다. 기존 데이터 호환을 위해 인증 유틸은 legacy public token fallback을 읽을 수 있지만, 현재 구조의 정식 저장 위치는 private auth 문서입니다.

### 2. 역할 인증과 Firebase custom token

이 프로젝트는 일반 로그인 계정 대신 역할 기반 링크를 사용합니다.

\`/api/room-auth\`는 링크의 \`roomId\`, \`role\`, \`teamId\`, \`token\`을 검증하고 성공하면 \`httpOnly\` 쿠키를 기록합니다. 쿠키 이름은 방, 역할, 팀장 ID를 포함하므로 같은 사용자가 여러 역할 링크를 열어도 충돌을 줄입니다.

\`/api/room-auth/firebase-token\`은 검증된 쿠키를 바탕으로 Firebase custom token을 발급합니다. custom claim에는 다음 값이 들어갑니다.

- \`roomId\`
- \`role\`
- \`teamId\`

이 token은 공개 입찰 hot path에서 Firestore Security Rules가 요청자의 방, 역할, 팀을 검증하는 근거가 됩니다.

### 3. 공개 입찰 hot path

공개 입찰은 지연 시간이 가장 민감한 경로입니다. 그래서 \`placeBidDirect()\`가 Firestore 클라이언트 SDK transaction을 1차 경로로 사용합니다.

처리 흐름은 다음과 같습니다.

1. 팀장이 입찰 버튼을 누릅니다.
2. 클라이언트가 현재 room 문서와 \`bids\` 서브컬렉션을 transaction으로 갱신합니다.
3. Firestore rules가 role, roomId, teamId, 금액, 잔액, 현재 선수, timer, \`auction_revision\` 증가를 검증합니다.
4. 성공하면 Firestore room snapshot이 모든 클라이언트에 1차 전파됩니다.
5. \`broadcastBidEvent()\` 서버 액션이 fire-and-forget으로 RTDB 이벤트, \`last_auction_event\`, 시스템 메시지를 뒤따라 생성합니다.
6. RTDB \`auctionEvents\` 히스토리는 \`PLAYER_AWARDED\` 또는 \`SEALED_BID_AWARDED\` 발행 시 서버가 정리합니다. 이 prune 로직은 이전 선수의 이벤트가 새 경매에 간섭하는 것을 방지합니다.
6. direct bid가 실패하면 기존 Server Action \`placeBid()\`로 fallback합니다.

공개 입찰 타이머 정책은 공유 상수 \`auctionTimings.ts\`에 모여 있습니다.

- 일반 경매 시작은 10초입니다.
- 재경매 여부는 \`nextAuctionDurationMs\` 값으로 판별합니다. \`nextAuctionDurationMs\`가 재경매 지속 시간과 같으면 재경매 라운드입니다.
- 입찰 단위와 최초 최소 입찰가는 10P입니다.
- 남은 시간이 8초 이하일 때 성공한 입찰은 타이머를 8초 기준으로 연장합니다.
- 남은 시간이 8초 초과이면 기존 종료 시각을 유지합니다.

이 구조는 Vercel Server Action 왕복을 줄여 입찰 반응 속도를 높이면서도, 최종 방어선을 Firestore rules에 둡니다.

### 4. 비공개 입찰 파이프라인

비공개 입찰은 공개 입찰과 별도 경로입니다. \`auction_mode\`가 \`SEALED_BID\`일 때 활성화되며, \`active_bid\`, \`BID_PLACED\`, \`placeBidDirect()\`를 사용하지 않습니다.

처리 단계는 다음과 같습니다.

1. 주최자가 경매를 시작하면 \`startSealedBidRound()\`가 새 라운드를 만들고 \`SEALED_BID_STARTED\` 이벤트를 발행합니다.
2. 팀장은 \`submitSealedBid()\`로 본인 금액만 제출합니다.
3. 제출 문서는 \`rooms/{roomId}/sealed_bid_rounds/{roundId}/submissions/{teamId}\`에 저장됩니다.
4. 타이머 중에는 제출 금액과 제출 여부를 다른 팀장이나 주최자에게 공개하지 않습니다.
5. 타이머가 만료되면 \`lockSealedBidRound()\`가 라운드를 잠그고 \`SEALED_BID_LOCKED\`를 발행합니다.
6. 주최자가 점수 공개를 누르면 \`revealSealedBidRound()\`가 카드 결과를 계산하고 \`SEALED_BID_REVEALED\`를 발행합니다.
7. 클라이언트는 \`SealedBidBoard\`에서 카드 공개 애니메이션을 진행합니다.
8. 애니메이션이 끝난 뒤 \`completeSealedBidReveal()\`이 낙찰, 유찰, 또는 동점 재입찰을 확정합니다.

재입찰은 새 화면 상태가 아니라 \`eligibleTeamIds\`가 있는 새 비공개 입찰 라운드입니다. 최고가 동점 팀만 제출할 수 있고, 직전 최고 금액이 최소 금액이 됩니다.

### 5. 경매 종료와 복구

경매 만료 복구는 \`recoverExpiredAuction()\`이 담당합니다. 일반 공개 입찰에서는 만료된 경매를 \`awardPlayer()\`로 확정하고, 비공개 입찰에서는 라운드를 잠급니다.

중복 호출은 허용됩니다. 클라이언트는 recovery key로 반복 호출을 줄이고, 서버 transaction은 이미 처리된 선수나 맞지 않는 revision을 다시 처리하지 않습니다. 이 설계는 여러 브라우저가 동시에 만료 복구를 깨우는 환경을 전제로 합니다.

주최자 presence guard는 팀장 연결 끊김을 감지해 경매를 일시정지하고, 팀장이 돌아오면 재개할 수 있게 합니다. \`/api/auction-watchdog\`는 이 흐름의 핵심이 아니라 선택적 backup sweep입니다.

### 6. 일정 관리 파이프라인

일정 관리 도메인은 \`features/schedules\`에 분리되어 있습니다.

핵심 흐름은 다음과 같습니다.

1. \`getLeagueScheduleCatalog()\`가 일정 목록과 연결 가능한 경매 아카이브 목록을 로드합니다.
2. \`createLeagueSchedule()\`이 관리자 코드 검증 후 \`league_schedules\` 문서를 생성합니다.
3. 일정 문서는 \`rosterSourceType\`과 \`rosterSourceId\`를 저장해 room 또는 archive 로스터를 직접 조회합니다.
4. \`getLeagueScheduleTimeline()\`이 날짜별 \`match_days\`, 로스터, 다음 경기 목록을 조합합니다.
5. \`saveLeagueScheduleDay()\`가 날짜별 경기 목록을 transaction으로 저장하고 revision을 증가시킵니다.
6. \`registerLeagueMatchResult()\`가 세트 로그와 점수를 검증한 뒤 transaction으로 경기 결과를 반영합니다.
7. \`completeLeagueSchedule()\`이 우승팀을 선택하고 \`hall_of_fame\`에 \`schedule:{scheduleId}\` 문서로 기록합니다.

일정 도메인의 중요한 특징은 로스터 복원입니다. 활성 room, 완료 archive, legacy 연결 값을 순서대로 조회해 일정에 필요한 팀 목록을 재구성합니다. 경매방이 종료된 뒤에도 일정과 명예의 전당이 독립적으로 유지될 수 있게 하기 위한 설계입니다.

### 7. 명예의 전당 파이프라인

명예의 전당은 \`features/hall-of-fame\`에 구현되어 있습니다.

- \`getHallOfFameEntries()\`는 등록된 우승 기록을 조회합니다.
- \`getAvailableArchives()\`는 아직 등록되지 않은 경매 아카이브를 제공합니다.
- \`registerHallOfFameEntry()\`는 관리자 코드 검증 후 archive 기반 우승 기록을 추가합니다.
- \`deleteHallOfFameEntry()\`는 관리자 코드 검증 후 우승 기록을 삭제합니다.
- 일정 종료 경로는 \`completeLeagueSchedule()\`에서 직접 \`hall_of_fame\` 문서를 생성합니다.

이렇게 경매 결과와 리그 일정 결과가 같은 전시 계층으로 모이기 때문에, 제품은 단순한 실시간 이벤트 도구를 넘어 시즌 기록 저장소로 확장됩니다.

## 프로젝트 구조

\`\`\`text
src/
  app/
    api/
      auction-watchdog/              선택적 경매 만료 backup route
      e2e/                           Playwright fixture API
      room-auth/                     역할 링크 인증과 Firebase custom token 발급
      room-links/                    주최자 쿠키 기반 방 링크 조회
      short-links/                   Buly 단축 URL 프록시 API
    auction-timer-lab/               타이머 정책 검증용 실험 페이지
    hall-of-fame/                    명예의 전당 App Router 페이지
    league-schedule/                 리그 일정 App Router 페이지
    room/[id]/                       실시간 경매방 페이지와 room shell
    layout.tsx                       전역 metadata, PWA, 구조화 데이터
    page.tsx                         홈 런처와 업데이트 피드
  components/
    create-room/                     방 생성 단계별 UI
    ui/                              PixelIcon, 3D icon, overlay dismiss 등 공용 UI
    LeagueScheduleManager.tsx        일정 관리 클라이언트 shell
    ScheduleCalendar.tsx             날짜 선택과 day preview
    ScheduleMatchDayEditor.tsx       경기 편성 및 결과 입력
    ScheduleRosterPanel.tsx          일정 로스터 표시
    LeagueRecordSummaryPanel.tsx     순위와 경기 요약
    UpdateTicker.tsx                 홈 업데이트 공지 ticker
  content/
    updateFeed.ts                    홈 업데이트 피드 데이터
  features/
    auction/
      api/                           방, 경매, 채팅, 인증 서버 액션
      components/                    경매 보드, 팀 목록, 채팅, 입찰 컨트롤
      constants/                     타이밍, 방 기본값, 아이콘, 도움말
      hooks/                         실시간 구독, presence, 방 생성, 경매 제어
      realtime/                      Firebase client/server adapter
      store/                         Zustand room state와 selector
      utils/                         realtime event, auth, roster, display helper
    hall-of-fame/
      api/                           우승 기록 조회, 등록, 삭제
      components/                    전시 카드와 등록 모달
      types.ts                       명예의 전당 타입
    schedules/
      api/                           일정 CRUD, 결과 등록, fixture
      utils/                         경기 규칙, 시간, 다음 경기, 전적 계산
      types.ts                       일정 도메인 타입
    timer-lab/
      actions.ts                     타이머 실험용 서버 액션
  lib/
    firebase.ts                      클라이언트 Firebase 초기화
    firebaseAdmin.ts                 Admin SDK 초기화와 named database 지원
    utils.ts                         공용 className helper
  proxy.ts                           Next proxy entry
public/
  sw.js                              서비스 워커
  icons, rank images, favicon        UI 자산
scripts/
  audit_room_auth_secrets.js         private auth 구조 감사
  migrate_room_auth_secrets.js       legacy public token 마이그레이션
  smoke_room_rules.js                Firestore rules 스모크 검증
  run_auction_e2e.js                 경매 E2E 실행 wrapper
\`\`\`

## 주요 모듈 설명

| 영역 | 대표 파일 | 책임 |
| --- | --- | --- |
| 방 생성 | \`src/features/auction/hooks/useCreateRoom.ts\` | 다단계 입력, Excel 파싱, 링크 생성, 활성 방 확인 |
| 방 저장 | \`src/features/auction/api/roomActions.ts\` | room/team/player 생성, private auth token 저장, archive 저장, 방 삭제 |
| 인증 | \`src/features/auction/utils/roomAuth.ts\` | role 검증, cookie 이름, token 문서 fallback 검증 |
| 주최자 권한 | \`src/features/auction/api/organizerAuth.ts\` | 서버 액션에서 organizer cookie와 저장 token 검증 |
| 공개 입찰 | \`src/features/auction/api/placeBidClient.ts\` | Firestore client transaction direct bid |
| 경매 흐름 | \`src/features/auction/api/auctionFlowActions.ts\` | 추첨, 시작, 일시정지, 낙찰, 유찰, 비공개 입찰 흐름 |
| 실시간 계약 | \`src/features/auction/utils/auctionRealtime.ts\` | event envelope, revision ordering, 클라이언트 apply rules |
| 상태 저장 | \`src/features/auction/store/useAuctionStore.ts\` | room state, sealed bid state, messages, presence |
| 경매 UI | \`src/app/room/[id]/RoomClient.tsx\` | 역할별 방 화면 조립 |
| 비공개 입찰 UI | \`src/features/auction/components/board/SealedBidBoard.tsx\` | 입찰 대상 정보, 잠금 카드, 공개 애니메이션 |
| 일정 서버 | \`src/features/schedules/api/scheduleActions.ts\` | 일정 생성, 저장, 결과 등록, 종료, 로스터 복원 |
| 일정 계산 | \`src/features/schedules/utils/*.ts\` | 경기 규칙, 세트 스코어, 다음 경기, 전적 집계 |
| 명예의 전당 | \`src/features/hall-of-fame/api/hallOfFameActions.ts\` | 우승 기록 조회와 관리자 변경 |

## 기술 스택

### 프론트엔드

- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Framer Motion과 Motion
- Zustand
- Lucide React
- \`xlsx\`

### 백엔드와 데이터

- Firebase Firestore
- Firebase Realtime Database
- Firebase Admin SDK
- Next.js Server Actions
- Next.js Route Handlers
- Firebase custom token과 Security Rules

### 테스트와 품질

- Vitest
- Testing Library
- Playwright
- ESLint 9
- E2E fixture routes
- Firestore rules smoke script
- Room auth audit script

## 보안 모델

보안 경계는 세 층으로 나뉩니다.

### 1. 링크 인증과 쿠키

사용자는 역할 링크로 입장하지만, 링크는 단순 routing 값이 아닙니다. \`/api/room-auth\`가 token을 private auth 문서와 비교한 뒤에만 \`httpOnly\` 쿠키를 기록합니다.

### 2. Server Action 가드

추첨, 시작, 일시정지, 낙찰, 유찰, 드래프트 영입, 비공개 입찰 공개와 확정, 결과 저장, 방 삭제는 서버 액션에서 주최자 권한을 확인합니다. 일정 생성, 일정 저장, 결과 등록, 일정 종료, 명예의 전당 변경은 관리자 코드를 확인합니다.

### 3. Firestore rules direct bid 검증

공개 입찰 direct path는 클라이언트가 Firestore에 직접 쓰는 예외 경로입니다. 그래서 custom token claim과 Firestore rules가 최종 방어선입니다.

검증하는 핵심 조건은 다음과 같습니다.

- 요청자가 해당 방의 팀장입니다.
- 요청 팀과 custom token의 teamId가 일치합니다.
- 현재 경매 선수와 입찰 playerId가 일치합니다.
- 자기 팀이 이미 최고 입찰자이면 거부합니다.
- 새 입찰 금액이 기존 금액보다 큽니다.
- 팀 포인트 잔액이 충분합니다.
- \`auction_revision\`이 정확히 1 증가합니다.
- 타이머 연장 범위가 8초 정책과 맞습니다.

## 테스트 전략

단위 테스트는 도메인 로직과 React hook을 중심으로 구성되어 있습니다.

- \`auctionRealtimeUtils\` 계열은 event revision과 state apply rules를 검증합니다.
- \`useAuctionRealtime\` 테스트는 RTDB event와 Firestore fallback 수렴을 검증합니다.
- \`useBiddingControl\` 테스트는 direct bid 우선 호출과 fallback 흐름을 검증합니다.
- 일정 테스트는 관리자 가드, transaction 저장, 결과 등록, 전적 계산을 검증합니다.
- 명예의 전당 테스트는 archive 기반 등록과 삭제 흐름을 검증합니다.

E2E는 Playwright fixture 모드를 제공합니다.

- \`NEXT_PUBLIC_E2E_AUCTION_FIXTURE=1\`과 fixture API로 경매 시나리오를 결정적으로 재현합니다.
- 일정 E2E는 Firebase 없이 fixture 상태를 초기화해 생성, 저장, 결과 등록, 종료 흐름을 검증합니다.

운영 검증 스크립트도 별도로 있습니다.

\`\`\`bash
npm run audit:room-auth-secrets
npm run smoke:room-rules
npm run migrate:room-auth-secrets:dry-run
\`\`\`

## 주요 구현 특징

### Firestore 정본과 RTDB fanout 분리

실시간 시스템에서 빠른 이벤트만으로 UI를 구성하면 누락, 순서 뒤집힘, 늦은 입장 복구 문제가 생깁니다. 이 프로젝트는 Firestore room 문서를 정본으로 두고, RTDB는 빠른 이벤트 전달만 담당하게 해 이 문제를 줄입니다.

### \`auction_revision\` 기반 수렴

경매 이벤트는 \`revision\`을 포함합니다. 클라이언트는 현재 revision 이하의 이벤트를 무시합니다. RTDB event, Firestore snapshot, \`last_auction_event\` fallback이 섞여 들어와도 더 오래된 상태가 최신 상태를 덮어쓰지 못합니다.

### RTDB 이벤트 히스토리 정리

낙찰(\`PLAYER_AWARDED\`, \`SEALED_BID_AWARDED\`) 발행 시 서버가 이전 경매의 RTDB \`auctionEvents\` 히스토리를 정리합니다. 이 prune 전략은 긴 경매 세션에서 이벤트가 누적되어 새 라운드에 간섭하는 문제를 방지합니다.

### 누락 RTDB 이벤트 방어

\`applyAuctionEventToState\`는 이전 이벤트가 누락된 채 후속 이벤트만 도착하는 상황에 대비해 방어적 null 초기화를 수행합니다. 예를 들어 \`AUCTION_STARTED\` 또는 \`AUCTION_RESUMED\` 이벤트 수신 시 \`lotteryPlayer\`를 강제로 초기화하여 추첨 패널이 잔류하는 버그를 방지합니다.

### 공개 입찰과 비공개 입찰의 경계 분리

공개 입찰은 속도가 중요하므로 direct Firestore transaction을 사용합니다. 비공개 입찰은 금액 비공개와 공개 시점 통제가 중요하므로 서버 액션 경계에서만 처리합니다. 두 방식이 같은 room UI 안에서 작동하지만, 데이터 경로와 이벤트 타입은 명확히 분리되어 있습니다.

### 인증 토큰 없는 단축 링크

방 링크에서 인증 토큰을 제거하고, Buly 단축 URL API를 통해 짧은 형태로 변환합니다. 입장 시 \`/api/room-auth\`가 서버에서 토큰을 검증하므로, URL 유출 시 바로 권한을 얻지 못합니다. 이 변경은 토큰 비공개 저장 구조와 함께 보안 경계를 강화합니다.

### 토큰 비공개 저장 구조

초기 링크 기반 운영의 편의성을 유지하면서도, 신규 방의 역할 token은 public room/team 문서가 아니라 \`room_auth_secrets\` 하위로 분리했습니다. 이 구조는 Firestore rules와 감사 스크립트로 계속 확인할 수 있습니다.

### 일정과 기록까지 이어지는 운영 흐름

경매 완료 결과는 \`auction_archives\`로 저장되고, 일정은 room 또는 archive 로스터를 참조합니다. 일정 종료는 명예의 전당으로 연결됩니다. 실시간 경매라는 순간성 이벤트를 시즌 운영과 장기 기록으로 확장한 점이 이 프로젝트의 핵심 제품 구조입니다.

### UI와 도메인 상태의 분리

경매 화면은 복잡하지만, 파생 상태 계산과 event apply rules는 \`auctionRealtime.ts\`, selector, store에 모여 있습니다. \`RoomClient\`는 역할별 레이아웃과 액션 연결에 집중하고, 세부 보드는 공개 입찰, 비공개 입찰, 추첨, 채팅, 팀 목록 컴포넌트로 나뉩니다.

## 실행과 운영 명령

\`\`\`bash
npm install
npm run dev
npm run build
npm run test
npm run test:e2e:auction
npm run audit:room-auth-secrets
npm run smoke:room-rules
\`\`\`

필수 환경 변수는 README에 정리되어 있습니다. 이 프로젝트는 named Firestore database \`minionsbid\`를 사용하므로, Firebase Admin SDK와 클라이언트 SDK 양쪽에서 \`FIRESTORE_DATABASE_ID\` 또는 \`NEXT_PUBLIC_FIRESTORE_DATABASE_ID\` 설정이 중요합니다.

## 참고 진입점

- \`README.md\`
- \`DESIGN.md\`
- \`doc/ARCHITECTURE.md\`
- \`doc/AUCTION_REALTIME_CONTRACT.md\`
- \`doc/SECURITY.md\`
- \`src/app/page.tsx\`
- \`src/app/room/[id]/RoomClient.tsx\`
- \`src/features/auction/api/auctionFlowActions.ts\`
- \`src/features/auction/api/roomActions.ts\`
- \`src/features/auction/api/placeBidClient.ts\`
- \`src/features/auction/utils/auctionRealtime.ts\`
- \`src/features/auction/utils/roomAuth.ts\`
- \`src/features/schedules/api/scheduleActions.ts\`
- \`src/features/hall-of-fame/api/hallOfFameActions.ts\`
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Zustand",
      "Framer Motion",
      "Tailwind CSS",
      "Playwright",
    ],
    liveUrl: "https://minionsbid.vercel.app",
    githubUrl: "https://github.com/tuosm9390/minionsbid",
    imageUrl: "/images/project-minions-bid.png",
    accentColor: "#f59e0b",
  },
  {
    id: "persona-style",
    title: "Persona Style AI",
    summary:
      "사진 한 장으로 나를 분석할 수 있다면? 퍼스널 컬러·체형 AI 분석 → 결제 → 공유 카드 → PDF까지 6단계 풀파이프라인.",
    origin:
      "퍼스널 스타일 분석을 단순 콘텐츠가 아니라 사용자가 저장하고 공유할 수 있는 제품 흐름으로 만들고 싶었습니다.",
    brandSignal:
      "AI 분석 결과를 결제, PDF 리포트, 공유 카드까지 이어지는 완성형 사용자 경험으로 전환했습니다.",
    productFlow: [
      "사진/텍스트 입력을 분석 모드별 프롬프트로 변환",
      "Gemini 폴백 체인으로 퍼스널 컬러, 체형, 분위기 분석",
      "결제, 프리미엄 PDF 리포트, 공유 카드, 궁합 매칭으로 확장",
    ],
    keyDecisions: [
      "Supabase Auth, RLS, pgvector를 사용해 사용자 데이터와 유사도 매칭 처리",
      "Satori + Resvg로 서버사이드 공유 카드 이미지를 생성",
      "Sentry와 Gemini 에러 분류로 분석 실패 원인을 추적 가능하게 구성",
    ],
    proofSignals: [
      "AI 분석 결과가 저장, 구매, 다운로드, 공유 행동으로 이어지는 6단계 흐름",
      "LocalStorage fallback과 DB 저장을 함께 둬 로그인 전후 사용성을 유지",
      "PortOne 결제 검증과 프리미엄 분석 API를 분리해 유료 기능 경계를 명확화",
    ],
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
    imageUrl: "/images/project-persona-style.png",
    accentColor: "#a855f7",
  },
  {
    id: "spend-intervention",
    title: "멈칫",
    summary:
      "지출 후회는 항상 하루 뒤에 온다. 소비 직후 AI가 개입하는 PWA — 오픈뱅킹·익명 커뮤니티·실시간 부채 지표.",
    origin:
      "소비 후회는 늘 늦게 오기 때문에, 지출 직후에 생각을 멈추게 하는 개입 도구가 필요하다고 느꼈습니다.",
    brandSignal:
      "일상의 작은 후회를 AI 피드백, 금융 데이터, 커뮤니티 흐름이 결합된 행동 변화 제품으로 바꿨습니다.",
    description: `# 멈칫 — 소비 개입 PWA

## 프로젝트 개요 (Overview)

**멈칫**은 부채 상환을 전제로 한 소비 개입 앱이다. 사용자는 Google 로그인 후 실명 계정과 분리된 **익명 프로필**로 소비를 기록하고 커뮤니티 활동을 한다.

핵심 경험은 세 단계다.

1. 지출 기록 즉시 → Gemini 2.5 Flash 기반 AI 피드백 생성
2. "지금 이 소비가 부채 해방을 얼마나 늦추는가" 실시간 지표 제공
3. 소비를 익명 커뮤니티 이야기로 변환 → 양방향 반응(정신 차려 / 힘내) 수집

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16.2 (App Router) + React 19 |
| 언어 | TypeScript (strict) |
| AI | Gemini 2.5 Flash |
| 백엔드/DB | Firebase Auth + Firestore + Firestore REST 직접 래핑 |
| 상태관리 | Zustand (세션) + SWR (서버 상태 캐시) |
| 배포 | Vercel (PWA) |

---

## 핵심 파이프라인 (Core Pipeline)

\`\`\`
[Google 로그인]
    │
    ▼
/api/auth/bootstrap
    ├─ Firebase ID 토큰 검증 (Google Identity Toolkit)
    ├─ Users / IdentityMappings / Profiles 초기화
    └─ 익명 프로필 + 총부채 반환
           │
           ▼
[지출 등록 /api/spendings]
    ├─ generateSpendingFeedback() → Gemini 2.5 Flash
    └─ Firestore Spendings 컬렉션 저장
           │
           ▼
[홈 대시보드]
    ├─ 최근 7일 일평균 소비
    ├─ 총부채 ÷ 소비 페이스 = 상환 추정 일수
    └─ KFTC 오픈뱅킹 거래 → Spendings 변환
           │
           ▼
[익명 커뮤니티]
    └─ 지출 연결 게시글 + 양방향 반응 투표
\`\`\`

---

## 상세 기능 구현 (Technical Implementation)

### 1. 실명·익명 이중 정체성 분리

\`Users\`, \`IdentityMappings\`, \`Profiles\` 세 컬렉션으로 정체성을 명시적으로 분리했다. 로그인 UID와 커뮤니티 익명 ID는 매핑 문서로만 연결되며, 게시글·투표는 항상 익명 ID 기준으로 처리된다.

### 2. 소비 개입 포인트

지출 저장 직전 Gemini 2.5 Flash에 사용자의 총부채와 지출 이유를 포함한 프롬프트를 전송해 AI 피드백을 생성한다. AI는 브라우저가 아닌 서버에서만 호출된다.

### 3. Firestore REST + 사용자 토큰 (권한 재사용)

Firestore Admin SDK 대신 \`firestore-rest.ts\`를 통해 REST API를 호출하고 Firebase ID 토큰을 그대로 전달한다. 서버가 우회 권한을 갖지 않고 Firestore Rules를 단일 권한 경계로 재사용하는 구조다.

### 4. KFTC 오픈뱅킹 연동

- \`/api/openbanking/connect/start\`: state·UID·토큰을 httpOnly 쿠키에 저장 후 KFTC 인가 URL 반환
- \`/api/openbanking/connect/callback\`: state 검증 → access token 교환 → 계좌 메타데이터 저장
- \`syncKftcSpendings()\`: 출금 거래만 \`Spendings\`로 변환, \`OpenBankingTransactions\`에 원본 보관(중복 방지)

### 5. Dev Preview 모드

로그인 없이 홈·커뮤니티·글쓰기 전체 흐름을 확인할 수 있는 프리뷰 레이어를 1급 기능으로 포함. 별도 mock 서버 없이 더미 사용자·지표·게시글로 실제 UI 경로를 그대로 따라간다.

---

## 사용 기술 및 라이브러리 (Tech Stack)

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16.2 App Router, React 19 |
| Auth / DB | Firebase Auth, Firestore, Firestore REST |
| AI | Google Generative AI SDK (Gemini 2.5 Flash) |
| 상태 | Zustand (세션), SWR (서버 캐시) |
| Styling | Tailwind CSS v4 |
| PWA | @ducanh2912/next-pwa |
| Testing | Playwright |

---

## 주요 구현 특징 (Key Highlights)

1. **소비 개입 타이밍**: 저장 직전 AI 피드백 생성으로 지출 직후 즉각적인 인터벤션 포인트를 설계했다.
2. **이중 정체성 아키텍처**: 실명 계정과 익명 프로필을 3개 컬렉션으로 명시 분리, Firestore Rules에서 익명 ID 소유권을 강제 검증한다.
3. **오픈뱅킹 도메인 분리**: 외부 금융 데이터를 Connections / Accounts / Transactions / Tokens로 분리해 내부 Spendings 도메인과 결합도를 최소화했다.
4. **서버 권한 우회 금지**: Admin SDK 대신 사용자 토큰을 서버에서도 그대로 사용해 Firestore Rules를 단일 권한 경계로 유지했다.
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Gemini API",
      "Zustand",
      "SWR",
    ],
    liveUrl: "https://spend-intervention.vercel.app",
    imageUrl: "/images/project-spend-intervention.png",
    accentColor: "#f97316",
  },
  {
    id: "cafe-book",
    title: "Cafe Book (카페 도감)",
    summary:
      "가본 카페를 기억하고 싶었다. 카카오 지도 + Firebase 실시간 동기화로 만든 카페 기록·레시피 공유 플랫폼.",
    origin:
      "좋았던 카페와 커피 경험을 사진첩이나 메모장에 흩어두는 방식이 아쉬워서 만들었습니다.",
    brandSignal:
      "개인 기록 욕구를 지도, 실시간 동기화, 레시피 공유가 있는 생활형 서비스로 구성했습니다.",
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
  {
    id: "threads-autoposter",
    title: "Threads Auto-Poster",
    summary:
      "매일 콘텐츠 올리는 게 귀찮았다. 트렌드 수집→AI 작성→자동 발행까지, Threads 운영 전체를 자동화한 시스템.",
    origin:
      "매일 트렌드를 찾고 글을 쓰고 발행하는 반복 작업이 귀찮아서, 콘텐츠 운영 흐름 자체를 자동화했습니다.",
    brandSignal:
      "크롤링, AI 생성, 발행, 성과 추적을 연결해 반복 업무를 운영 가능한 자동화 시스템으로 만들었습니다.",
    productFlow: [
      "개발/AI 소스에서 트렌드와 뉴스를 수집",
      "Gemini로 주제를 선별하고 Threads 포맷 콘텐츠를 생성",
      "예약 발행, 인사이트 수집, 성과 기반 few-shot 개선으로 순환",
    ],
    keyDecisions: [
      "루트 Node.js 워커와 Next.js 대시보드를 분리해 운영과 분석을 나눔",
      "Firestore를 운영 상태 기준 저장소로 두고 로컬 JSON을 부트스트랩/폴백으로 사용",
      "최근 발행 이력과 품질 분석을 반영해 중복과 포맷 단조로움을 줄임",
    ],
    proofSignals: [
      "크롤링, 생성, 승인/보류, 발행, 성과 추적까지 콘텐츠 운영 전 과정을 자동화",
      "Meta Threads API 연동과 토큰/스케줄 관리 흐름 포함",
      "품질 리포트와 few-shot 예시 승격으로 생성 결과를 반복 개선",
    ],
    description: `# Threads Auto-Poster

## 개요

\`threads-autoposter\`는 매일 개발 및 AI 관련 이슈를 수집하고, 이를 Threads용 게시물로 생성한 뒤 자동 발행하고, 이후 수집한 성과 데이터를 다음 생성 과정에 다시 반영하는 TypeScript 기반 운영 시스템입니다.

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

즉, 이 저장소는 단발성 포스팅 스크립트보다는 Threads 운영 엔진에 가깝습니다.

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

## 현재 검증 레일

2026-04-20 기준 이 저장소는 세 갈래 품질 레일을 유지합니다.

- [\`.github/workflows/validate-launch.yml\`](/D:/development/threads-autoposter/.github/workflows/validate-launch.yml): 루트 \`README.md\`와 \`docs/demo/*\` 공개 표면 검증
- [\`.github/workflows/dashboard-quality.yml\`](/D:/development/threads-autoposter/.github/workflows/dashboard-quality.yml): \`dashboard/\`의 \`eslint\`와 \`next build\` 검증
- [\`.github/workflows/root-quality.yml\`](/D:/development/threads-autoposter/.github/workflows/root-quality.yml): 루트 워커의 \`tsc\`, \`vitest\`, \`smoke:dry-run\` 검증

즉, 지금은 공개 표면, 운영 대시보드, 루트 워커가 각각 별도 품질 게이트를 가집니다.
루트 워커 쪽은 단순 타입/테스트뿐 아니라 CLI 엔트리포인트 분기까지 smoke test로 확인합니다.

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
    imageUrl: "/images/project-threads-autoposter-overview.png",
    accentColor: "#000000",
  },
  {
    id: "sumpyo-flutter-app",
    title: "Sumpyo (숨표)",
    summary:
      "감정을 기록하면 AI가 처방전을 써준다면? Flutter 기반 모바일 심리 웰니스 앱 — 오프라인 대응·Supabase 동기화.",
    origin:
      "감정 기록이 단순 일기로 끝나지 않고, 바로 위로와 행동 가이드로 이어졌으면 해서 만들었습니다.",
    brandSignal:
      "개인 감정 데이터를 AI 처방, 로컬 캐시, 원격 동기화까지 이어지는 모바일 웰니스 흐름으로 설계했습니다.",
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
    imageUrl: "/images/project-sumpyo-temp.png",
    accentColor: "#0ea5e9",
  },
  {
    id: "self-growth-dashboard",
    title: "Self Growth Dashboard",
    summary:
      "루틴·목표·회고를 한 화면에 담고 싶었다. 학습·운동·달성률을 Firestore로 추적하는 개인 성장 올인원 대시보드.",
    origin:
      "학습, 운동, 회고, 목표가 여러 도구에 흩어져 있어 하루의 성장 흐름을 한 화면에서 보고 싶었습니다.",
    brandSignal:
      "개인 루틴 문제를 데이터 저장, 통계, 피드백이 가능한 성장 관리 대시보드로 만들었습니다.",
    description: `# Self-Growth Dashboard

## 1. 프로젝트 개요

**Self-Growth Dashboard**는 개인의 루틴, 할 일, 일정, 달성률을 한 화면에서 관리하는 자기성장용 대시보드 웹 애플리케이션입니다.

현재 프로젝트는 **Firestore 기반 영속성 계층**을 중심으로 동작하며, 빠른 상호작용과 시각적 피드백에 초점을 둔 개인용 생산성 도구로 정리되어 있습니다.

## 2. 기술 스택

| 분류 | 기술 및 라이브러리 | 적용 목적 |
| --- | --- | --- |
| **Framework / Core** | Next.js 16, React 19 | App Router 기반 UI와 API 라우트 구성 |
| **State Management** | Zustand | 전역 상태 관리와 도메인별 slice 구조 |
| **Database / Backend** | Firebase Admin, Firestore | 서버 측 데이터 영속화와 문서 기반 저장 |
| **Styling & UI** | Tailwind CSS v4, clsx, tailwind-merge | 유틸리티 기반 스타일링과 클래스 조합 |
| **Visualization & Animation** | Recharts, Framer Motion | 통계 차트와 화면 전환 표현 |
| **Validation & Form** | React Hook Form, Zod | 폼 상태 관리와 입력 검증 |
| **Testing** | Vitest, Testing Library | 단위 테스트와 UI 테스트 |

## 3. 아키텍처 개요

- **Presentation Layer**: \`src/app\`, \`src/components\`
- **State Layer**: \`src/store\`
- **API Layer**: \`src/app/api\`
- **Repository Layer**: \`src/repositories/Firestore*\`
- **Utility Layer**: \`src/lib\`, \`src/hooks\`, \`src/types\`

데이터 흐름은 \`UI -> Zustand action -> API Route -> Firestore Repository -> Response\` 구조를 따릅니다.

## 4. 프로젝트 구조

\`\`\`text
src/
├── app/
│   ├── (dashboard)/
│   ├── api/
│   └── layout.tsx
├── components/
├── hooks/
├── lib/
├── repositories/
├── store/
└── types/
\`\`\`

## 5. 핵심 특징

- Firestore 기반의 단순한 서버 저장 구조
- Zustand slice 패턴을 이용한 확장 가능한 상태 관리
- 루틴, 투두, 일정, 분석을 동일한 UI 언어로 통합
- 라이트/다크 모드와 PWA 사용을 고려한 개인 대시보드 UX
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "Chart.js",
      "Supabase",
      "Tailwind CSS",
    ],
    liveUrl: "https://self-growth-dashboard.vercel.app",
    imageUrl: "/images/project-growth.png",
    accentColor: "#d946ef",
  },
  {
    id: "investment-platform",
    title: "Invesight",
    summary:
      "뉴스가 너무 많아서 핵심만 보고 싶었다. 뉴스·RSS 3개 소스 AI 분석 후 WebGL 고성능 차트로 시각화하는 투자 정보 플랫폼.",
    origin:
      "투자 관련 뉴스가 너무 많아 핵심 맥락만 빠르게 보고 싶어서 만들었습니다.",
    brandSignal:
      "정보 과부하 문제를 크롤링, AI 요약, 고성능 차트 시각화가 결합된 리서치 도구로 바꿨습니다.",
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
    imageUrl: "/images/project-investment.png",
    accentColor: "#10b981",
  },
  {
    id: "quote-builder",
    title: "스마트 견적서 생성기",
    summary:
      "견적서를 Word로 만드는 게 비효율적이었다. 노션 스타일 블록 에디터로 실시간 작성·계산·PDF 변환까지.",
    origin:
      "견적서를 매번 문서 편집기로 만들고 다시 PDF로 정리하는 과정이 비효율적이라 만들었습니다.",
    brandSignal:
      "반복 문서 작업을 블록 에디터, 실시간 계산, PDF 변환까지 갖춘 업무 도구로 제품화했습니다.",
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
    imageUrl: "/images/project-quote-builder.png",
    accentColor: "#0064ff",
  },
  {
    id: "ai-doc-agent",
    title: "AI Doc Agent",
    summary:
      "요구사항과 주제를 입력하면 AI가 문서 초안을 만들고, 품질 평가까지 거쳐 마크다운 문서로 정리하는 자동 문서 생성 에이전트.",
    origin:
      "프로젝트를 만들 때마다 기획서, 기술 문서, 회고 문서를 반복해서 작성하는 과정이 비효율적이라 자동화했습니다.",
    brandSignal:
      "아이디어와 컨텍스트를 문서 초안, 품질 평가, 최종 마크다운으로 이어지게 만든 AI 문서화 워크플로우입니다.",
    productFlow: [
      "주제, 문서 유형, 참고 컨텍스트를 입력",
      "Claude Haiku로 문서 초안을 생성",
      "Claude Sonnet으로 품질을 평가하고 보완 포인트를 정리",
      "SSE 스트림으로 생성 단계를 보여주고 최종 마크다운으로 출력",
    ],
    keyDecisions: [
      "Next.js 프론트엔드와 FastAPI 백엔드를 분리해 문서 생성 작업을 독립 처리",
      "초안 작성 모델과 평가 모델을 분리해 생성 속도와 품질 검토를 함께 확보",
      "SSE Streaming으로 오래 걸리는 생성 과정을 사용자에게 단계별로 노출",
    ],
    proofSignals: [
      "문서 유형 입력부터 초안 생성, 평가, 최종 포맷까지 하나의 작업 흐름으로 구현",
      "문서 자동 생성이라는 반복 업무를 AI 파이프라인으로 제품화",
      "단순 챗봇이 아니라 문서 산출물을 목표로 한 워크플로우형 도구",
    ],
    description: `# AI Doc Agent

## 프로젝트 개요

AI Doc Agent는 반복적으로 작성해야 하는 기획서, 기술 문서, 회고 문서, 작업 정리 문서를 자동 생성하기 위해 만든 AI 문서 생성 에이전트입니다.

주제와 문서 유형, 참고 컨텍스트를 입력하면 AI가 문서 초안을 만들고, 별도 평가 단계에서 품질을 점검한 뒤, 바로 사용할 수 있는 마크다운 문서로 정리하는 흐름을 목표로 했습니다.

## 왜 만들었나

개발 과정에서는 실제 구현만큼이나 문서화가 반복적으로 필요합니다. 기능 기획, API 설계, 기술 선택 이유, 작업 회고, 릴리즈 노트처럼 매번 새로 써야 하는 문서가 많지만, 초안 작성에 드는 시간이 커서 뒤로 밀리기 쉽습니다.

AI Doc Agent는 이 반복을 줄이기 위해 시작했습니다.

1. 문서화할 주제와 목적을 입력한다.
2. 필요한 컨텍스트를 함께 전달한다.
3. AI가 문서 초안을 작성한다.
4. 별도 모델이 품질과 누락을 평가한다.
5. 최종 마크다운 문서로 정리한다.

## 핵심 흐름

- 주제와 문서 유형을 입력하면 AI가 문서 초안을 생성
- 생성 과정은 SSE 스트림으로 단계별 표시
- Claude Haiku로 초안 작성, Claude Sonnet으로 품질 평가
- FastAPI 백엔드와 Next.js 프론트엔드 분리
- 최종 결과는 재사용 가능한 마크다운 문서로 정리

## 브랜딩 관점

이 프로젝트는 "AI에게 질문한다"에서 끝나지 않고, 실제 산출물인 문서를 만드는 흐름에 초점을 둡니다.

저는 AI를 단순 답변 도구가 아니라 반복 업무를 줄이고, 결과물을 일정한 형식으로 남기는 제품 흐름에 붙이는 방식으로 사용합니다. AI Doc Agent는 그 관점을 문서화 업무에 적용한 프로젝트입니다.

## 기술 구조

\`\`\`text
frontend (Next.js)
  -> SSE stream
backend (FastAPI)
  -> Step 1: 컨텍스트 수집
  -> Step 2: 초안 작성
  -> Step 3: 품질 평가
  -> Step 4: 결과 포맷
\`\`\`

## 사용 기술

- Next.js
- TypeScript
- FastAPI
- Python
- Claude API
- SSE Streaming
`,
    techStack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Claude API",
      "SSE",
      "Markdown",
    ],
    githubUrl: "https://github.com/tuosm9390/ai-doc-agent",
    imageUrl: "/images/project-ai-doc-agent.png",
    accentColor: "#38bdf8",
  },
  {
    id: "youtube-notebooklm-platform",
    title: "YouTube → NotebookLM Learning Platform",
    summary:
      "YouTube 채널의 새 영상을 자동 감지하고 NotebookLM 소스로 등록해, 학습 자료 수집과 복습 흐름을 자동화한 개인 학습 플랫폼.",
    origin:
      "새 기술을 영상으로 학습할 때 좋은 자료가 여러 채널에 흩어지고, 다시 정리하는 일이 반복돼서 자동 수집 흐름을 만들었습니다.",
    brandSignal:
      "AI를 코드 생성 보조에만 쓰지 않고, 학습 소스 수집·NotebookLM 등록·대시보드 확인까지 이어지는 개인 학습 인프라로 확장한 프로젝트입니다.",
    productFlow: [
      "설정한 YouTube 채널의 신규 영상을 주기적으로 확인",
      "이미 처리한 영상은 상태 파일로 중복 등록 방지",
      "신규 영상을 NotebookLM 소스로 추가",
      "대시보드에서 수집 현황, 채널별 진행률, 영상 검색과 필터링 확인",
    ],
    keyDecisions: [
      "크롤러와 Next.js 대시보드를 분리해 자동 수집 작업과 모니터링 UI를 독립 구성",
      "GitHub Actions와 Windows 작업 스케줄러를 모두 지원해 로컬/클라우드 실행 선택 가능",
      "YouTube Data API, NotebookLM 연동, Slack/Telegram 알림을 모듈별로 분리",
    ],
    proofSignals: [
      "YouTube 수집, 중복 방지, NotebookLM 등록, 대시보드 확인까지 학습 자동화 흐름 구현",
      "dry-run, force 실행, 특정 채널 처리 등 운영용 실행 모드 포함",
      "채널 설정과 수집 상태를 파일로 관리해 개인 학습 루틴에 맞게 확장 가능",
    ],
    description: `# YouTube -> NotebookLM Learning Platform

## 프로젝트 개요

YouTube -> NotebookLM Learning Platform은 YouTube 채널의 새 영상을 자동으로 감지하고, NotebookLM에 학습 소스로 등록하기 위해 만든 개인 학습 자동화 플랫폼입니다.

새로운 기술을 영상으로 학습할 때 문제는 좋은 자료가 부족한 것이 아니라, 여러 채널에 흩어진 자료를 계속 확인하고 다시 정리해야 한다는 점이었습니다. 이 프로젝트는 그 반복을 줄이기 위해 YouTube 수집, 중복 방지, NotebookLM 등록, 대시보드 확인을 하나의 흐름으로 묶었습니다.

## 핵심 흐름

1. \`config/channels.json\`에 학습할 YouTube 채널을 등록한다.
2. 크롤러가 설정된 채널의 신규 영상을 확인한다.
3. 이미 등록된 영상은 상태 파일을 기준으로 건너뛴다.
4. 신규 영상을 NotebookLM 소스로 추가한다.
5. 대시보드에서 채널별 수집 현황과 영상 목록을 확인한다.

## 주요 기능

- YouTube 채널 신규 영상 자동 감지
- NotebookLM 소스 등록 워크플로우
- 중복 등록 방지
- 채널별 진행률, 영상 검색, 필터링이 가능한 학습 대시보드
- Slack / Telegram 신규 영상 알림 옵션
- GitHub Actions 또는 Windows 작업 스케줄러 기반 예약 실행
- dry-run, force 실행, 특정 채널 처리 모드

## 프로젝트 구조

\`\`\`text
youtube-notebooklm-platform/
├── crawler/
│   ├── index.ts
│   ├── youtube.ts
│   ├── notebooklm.ts
│   ├── state.ts
│   ├── notify.ts
│   └── logger.ts
├── dashboard/
│   └── src/app/
│       ├── page.tsx
│       └── api/
├── config/
│   └── channels.json
├── data/
│   └── videos.json
├── .github/workflows/
│   └── youtube-crawler.yml
└── scripts/
    └── install-scheduler.ps1
\`\`\`

## 기술 구조

- \`crawler/index.ts\`: 전체 수집 실행 흐름
- \`crawler/youtube.ts\`: YouTube Data API 클라이언트
- \`crawler/notebooklm.ts\`: NotebookLM 등록 연동
- \`crawler/state.ts\`: 처리된 영상 상태 관리
- \`dashboard\`: Next.js 기반 모니터링 UI
- \`.github/workflows/youtube-crawler.yml\`: 클라우드 예약 실행
- \`scripts/install-scheduler.ps1\`: Windows 작업 스케줄러 등록

## 사용 기술

- TypeScript
- Node.js
- Next.js
- YouTube Data API
- NotebookLM
- GitHub Actions
- Windows Task Scheduler
`,
    techStack: [
      "TypeScript",
      "Node.js",
      "Next.js",
      "YouTube API",
      "NotebookLM",
      "GitHub Actions",
    ],
    imageUrl: "/images/project-youtube-notebooklm.png",
    accentColor: "#f59e0b",
  },
];

export const projects: Project[] = [...rawProjects].sort((a, b) => {
  const aIndex = featuredOrder.indexOf(a.id);
  const bIndex = featuredOrder.indexOf(b.id);

  if (aIndex === -1 && bIndex === -1) return 0;
  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});
