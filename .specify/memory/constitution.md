<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: 
    - Principle IV: Strict Validation & Contextual Integrity (상태 초기화 및 컨텍스트 무결성 원칙 강화)
- Added sections: 없음
- Templates status: 
    - .specify/templates/plan-template.md (✅ updated)
    - .specify/templates/spec-template.md (✅ align)
    - .specify/templates/tasks-template.md (✅ updated)
- Deferred items: 없음
-->

# Dev Portfolio Constitution

## Core Principles

### I. Toss-Style Modern UX/UI
모든 인터페이스는 Toss(TDS) 스타일의 프리미엄 감성을 지향한다. 24px 라운드값, 부드러운 그림자(0 20px 40px -15px rgba(0,0,0,0.1)), Pretendard 폰트 및 tracking-tighter 속성을 기본으로 사용한다. Framer Motion을 활용하여 자연스러운 인터랙션을 구현하며, 프로젝트별 고유 강조색(Accent Color)을 통해 시각적 몰입도를 극대화한다.

### II. Atomic UI System (shadcn/ui)
UI 컴포넌트는 `src/components/ui` 디렉토리에서 원자 단위로 관리한다. shadcn/ui 표준을 준수하며, `class-variance-authority(cva)`와 `tailwind-merge`를 사용하여 확장 가능하고 일관된 스타일링 구조를 유지한다. 새로운 UI 요소 도입 시 반드시 공통 컴포넌트로 분리하여 재사용성을 확보한다.

### III. Data-Driven Centralization
프로젝트 메타데이터, 프로필 정보 등 모든 콘텐츠 데이터는 `src/data/` 디렉토리 내의 TypeScript 파일에서 중앙 집중식으로 관리한다. 컴포넌트 내부에 하드코딩된 데이터를 지양하고, 데이터 구조 변경이 UI 전체에 안전하게 반영될 수 있도록 엄격한 타입을 정의한다.

### IV. Strict Validation & Contextual Integrity
모든 사용자 입력과 데이터 연동 시 Zod를 활용한 유효성 검사를 수행한다. 특히 **컴포넌트 재사용이나 컨텍스트 전환(예: 프로젝트 변경) 시 이전 상태가 잔존하여 오작동하지 않도록 명시적인 상태 초기화(Reset) 로직을 필수적으로 구현**한다. TypeScript의 `any` 타입 사용을 절대 금지한다.

### V. Performance & Accessibility First
Next.js의 Image 컴포넌트를 활용하여 LCP 최적화를 달성하고, 배포 환경의 성능을 극대화한다. Radix UI primitives를 적극 도입하여 웹 접근성(WCAG) 표준을 준수하며, 모든 사용자가 불편함 없이 포트폴리오를 탐색할 수 있도록 보장한다.

## 기술적 제약 및 보안 요구사항
Next.js 16 (App Router) 및 Tailwind CSS 4.x 환경을 준수한다. 환경 변수는 `.env.local`에서 관리하며, 민감한 API 키(EmailJS 등)가 클라이언트에 노출되지 않도록 서버 측 로직을 우선 고려한다. 배포 전 반드시 `npm run lint`와 `tsc`를 통과해야 한다.

## 개발 워크플로우 및 품질 게이트
모든 기능 구현은 `.specify/templates`의 계획서와 체크리스트를 기반으로 수행한다. 새로운 기능을 추가할 때는 해당 기능의 목적과 아키텍처를 문서화해야 하며, 기존 UI 패턴과의 일관성을 유지하는지 검증하는 단계를 포함한다. 컨텍스트 전환이 발생하는 UI의 경우 상태 초기화 테스트를 필수적으로 수행한다.

## Governance
이 헌장은 프로젝트의 모든 개발 관행보다 우선한다. 헌장의 수정은 명확한 이유와 영향 분석 보고서가 수반되어야 하며, 버전 관리 정책에 따라 업데이트된다. 모든 PR 및 코드 리뷰 시 이 헌장의 원칙 준수 여부를 필수적으로 검증한다.

**Version**: 1.1.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23
