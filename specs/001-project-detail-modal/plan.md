# Implementation Plan: Project Detail Modal

**Branch**: `001-project-detail-modal` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-detail-modal/spec.md`

## Summary
포트폴리오 프로젝트 카드의 '자세히 보기'를 클릭했을 때, URL 쿼리 파라미터(`?project=id`)와 연동된 부드럽고 접근성 있는 모달을 구현합니다. Radix UI Dialog와 Framer Motion을 결합하여 버벅임 없는(Lags-free) UX를 제공하며, 프로젝트 상세 내용은 마크다운 형식으로 렌더링합니다.

## Technical Context

**Language/Version**: TypeScript, React 19, Next.js 16  
**Primary Dependencies**: `framer-motion`, `@radix-ui/react-dialog`, `react-markdown`, `lucide-react`, `tailwind-merge`  
**Storage**: N/A (Local TS Data)  
**Testing**: Vitest (Assumed standard for React 19 projects)  
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web Application (Portfolio)  
**Performance Goals**: 60 fps Animation, <100ms Response Time  
**Constraints**: Zero `any` types, Toss-style UI, Accessibility Compliance (WCAG)  
**Scale/Scope**: Single Feature (Modal Implementation)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I: Toss-Style Modern UX/UI**: 24px 라운드값 및 부드러운 그림자 반영 계획 확인.
- [x] **Principle II: Atomic UI System**: `src/components/ui/dialog.tsx` 생성 및 공통 컴포넌트화 준수.
- [x] **Principle III: Data-Driven Centralization**: `src/data/projects.ts`의 데이터 스키마 활용 확인.
- [x] **Principle IV: Strict Validation & Type Safety**: `Project` 인터페이스 및 URL 쿼리 유효성 검사 계획 포함.
- [x] **Principle V: Performance & Accessibility First**: Radix UI 및 Next/Image 최적화 전략 수립 완료.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-detail-modal/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology research and decisions
├── data-model.md        # Data entities and state transitions
├── quickstart.md        # Implementation summary
├── contracts/           # UI interaction contracts
│   └── ui.md
└── checklists/          # Quality validation
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── layout.tsx       # Root layout check
├── components/
│   ├── ProjectsSection.tsx # Modal controller logic
│   ├── ProjectCard.tsx    # Trigger logic
│   ├── ProjectModal.tsx   # New component for detailed view
│   └── ui/
│       └── dialog.tsx     # New atomic component (Radix UI)
├── data/
│   └── projects.ts      # Data source
└── lib/
    └── utils.ts         # Tailwind-merge utility
```

**Structure Decision**: 기존 Next.js 16 App Router 구조를 유지하며, `src/components/ui`에 원자 컴포넌트를 추가하고 `ProjectModal`을 별도 컴포넌트로 분리하여 재사용성과 가독성을 높임.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
