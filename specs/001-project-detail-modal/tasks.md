# Tasks: Project Detail Modal

**Input**: Design documents from `/specs/001-project-detail-modal/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui.md

**Tests**: Vitest 기반 단위 테스트 포함 (계획서의 Testing 섹션 반영)

**Organization**: 각 사용자 스토리별로 독립적인 구현 및 테스트가 가능하도록 구성됨.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (서로 다른 파일, 의존성 없음)
- **[Story]**: 해당 태스크가 속한 사용자 스토리 (US1, US2, US3)
- 모든 설명에는 정확한 파일 경로 포함

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 초기화 및 필수 의존성 설치

- [x] T001 [P] Install dependencies: `@radix-ui/react-dialog`, `react-markdown`, `remark-gfm`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] T002 [P] Configure Vitest for component testing in `vitest.config.ts` (if not exists)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리 구현 전에 완료되어야 하는 핵심 인프라

- [x] T003 [P] Create atomic Dialog component in `src/components/ui/dialog.tsx` (Radix UI based, following shadcn/ui standards with cva and tailwind-merge)
- [x] T004 Update Project interface and add Zod validation schema in `src/data/projects.ts` to support rich markdown description (Constitution IV)
- [x] T005 [P] Implement URL search params utility in `src/lib/utils.ts` for consistent query handling

---

## Phase 3: User Story 1 - 프로젝트 상세 정보 확인 (Priority: P1) 🎯 MVP

**Goal**: 프로젝트 카드의 '자세히 보기' 클릭 시 기본 모달이 열리고 데이터가 표시됨

**Independent Test**: 특정 카드를 클릭했을 때 `?project=id` 쿼리가 추가되고 해당 프로젝트 제목이 포함된 모달이 나타나는지 확인

### Tests for User Story 1

- [x] T006 [P] [US1] Create unit test for `ProjectModal` visibility in `src/components/__tests__/ProjectModal.test.tsx`
- [x] T007 [P] [US1] Create integration test for card-to-modal trigger in `src/app/__tests__/page.test.tsx`

### Implementation for User Story 1

- [x] T008 [US1] Implement `ProjectModal` skeleton in `src/components/ProjectModal.tsx`
- [x] T009 [US1] Update `ProjectCard` in `src/components/ProjectsSection.tsx` to handle click events and update URL
- [x] T010 [US1] Integrate `ProjectModal` into `ProjectsSection.tsx` using `useSearchParams` for visibility control
- [x] T011 [US1] Implement Modal Close logic (X button, Overlay click) with URL update

**Checkpoint**: US1 완료 시, 기본 데이터 바인딩과 모달 개폐 기능이 정상 동작해야 함

---

## Phase 4: User Story 2 - 부드럽고 쾌적한 사용자 경험 (Priority: P2)

**Goal**: Framer Motion을 활용한 GPU 가속 애니메이션 및 성능 최적화

**Independent Test**: 저사양 환경 시뮬레이션 시 애니메이션 끊김이 없고 LCP 점수가 유지되는지 확인

### Implementation for User Story 2

- [x] T012 [US1] Apply `layoutId` to `ProjectCard` image and `ProjectModal` header image for shared layout transition
- [x] T013 [US2] Wrap `ProjectModal` with `AnimatePresence` in `ProjectsSection.tsx` for smooth exit animations
- [x] T014 [US2] Optimize image loading in `ProjectModal.tsx` using `next/image` with `priority` for the main header image
- [x] T014b [US2] Implement image fallback and skeleton loading in `ProjectModal.tsx` to prevent layout shift (SC-002)
- [x] T015 [US2] Implement Body Scroll Lock when modal is open using Radix UI built-in functionality

**Checkpoint**: US2 완료 시, 카드에서 모달로 자연스럽게 확장되는 애니메이션과 부드러운 스크롤 제어가 가능해야 함

---

## Phase 5: User Story 3 - 프로젝트 링크 연결 및 마크다운 (Priority: P3)

**Goal**: 상세 설명의 마크다운 렌더링 및 외부 링크 연결

**Independent Test**: 상세 설명 내 리스트/강조 서식이 올바르게 표시되고 'Live Demo' 버튼 클릭 시 새 창이 열리는지 확인

### Implementation for User Story 3

- [x] T016 [US3] Integrate `react-markdown` into `ProjectModal.tsx` to render `project.description`
- [x] T017 [US3] Add `remark-gfm` plugin and custom CSS for markdown elements (lists, bold, etc.)
- [x] T018 [US3] Implement Link buttons (Live Demo, GitHub) in `ProjectModal.tsx` with proper styles and icons
- [x] T019 [US3] Implement conditional rendering for optional fields (githubUrl, etc.) and ensure empty state UI is graceful in `ProjectModal.tsx`

**Checkpoint**: 모든 사용자 스토리가 독립적으로 기능하며 상세 정보가 풍부하게 표현됨

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 전체적인 완성도 향상 및 접근성 검증

- [x] T020 [P] Ensure Accessibility: Add `aria-labels` and ensure focus trapping in `ProjectModal.tsx`
- [x] T021 [P] Verify Browser Back Button behavior: Ensure modal closes without reloading the page
- [x] T022 Clean up CSS and ensure Toss-style premium shadows and rounding (24px) are consistent
- [x] T023 Run `npm run lint` and `tsc` to verify code quality
- [x] T024 Final validation using `quickstart.md` test scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 시작 - 모든 US의 차단(Blocking) 요소
- **User Stories (Phase 3+)**: Foundational 완료 후 병렬 또는 순차 진행
- **Polish (Final Phase)**: 모든 US 완료 후 진행

### User Story Dependencies

- **US1 (P1)**: Foundation 이후 즉시 시작 (핵심 기능)
- **US2 (P2)**: US1의 기본 컴포넌트 구조에 의존함
- **US3 (P3)**: US1의 데이터 바인딩 구조에 의존함

### Parallel Opportunities

- T001, T002 (Setup) 동시 진행 가능
- T003, T005 (Foundational) 동시 진행 가능
- T006, T007 (US1 Tests) 동시 진행 가능
- US2와 US3는 US1의 기본 구현이 완료된 후 각기 다른 부분(애니메이션 vs 콘텐츠 렌더링)을 다루므로 병렬 작업 가능

---

## Parallel Example: User Story 1

```bash
# US1 테스트와 모달 스켈레톤 구현 병렬 시작
Task: "Create unit test for ProjectModal visibility in src/components/__tests__/ProjectModal.test.tsx"
Task: "Implement ProjectModal skeleton in src/components/ProjectModal.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. 필수 라이브러리 설치 및 Dialog 원자 컴포넌트 준비.
2. URL 쿼리 파라미터 연동 로직 구현.
3. 기본 텍스트 중심의 모달 표시 기능 완성 후 1차 검증.

### Incremental Delivery
- **Step 1**: 기본 모달 오픈/클로즈 및 데이터 표시 (US1).
- **Step 2**: 시각적 완성도를 위한 애니메이션 및 이미지 최적화 (US2).
- **Step 3**: 마크다운 렌더링 및 외부 링크 기능 강화 (US3).
- **Step 4**: 접근성 및 브라우저 호환성 최종 폴리싱 (Polish).
