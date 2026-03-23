# Tasks: 프로젝트 모달 이미지 표시 방식 수정

**Input**: Design documents from `/specs/002-modal-image-as-is/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: 별도의 테스트 코드가 요청되지 않았으므로 수동 검증 및 린트 체크를 우선함.

**Organization**: 사용자 스토리별로 태스크를 그룹화하여 단계별 구현 및 테스트가 가능하도록 구성함.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (서로 다른 파일 또는 의존성 없음)
- **[Story]**: 해당 태스크가 속한 사용자 스토리 (예: US1, US2)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 작업 환경 확인 및 기초 구조 설정

- [X] T001 현재 브랜치(`002-modal-image-as-is`) 및 작업 디렉토리 상태 확인
- [X] T002 [P] 기존 `src/components/ProjectModal.tsx`의 이미지 관련 스타일 코드 분석 및 백업

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 핵심 인프라 및 공통 스타일 설정

- [X] T003 [P] Tailwind CSS 환경에서 가변 높이 이미지 처리를 위한 스타일 전략 확립

**Checkpoint**: 기초 분석 완료 - 사용자 스토리 구현 시작 가능

---

## Phase 3: User Story 1 - 프로젝트 이미지 원본 비율 확인 (Priority: P1) 🎯 MVP

**Goal**: 모달창 이미지의 고정 비율을 제거하고 원본 비율 유지 구현

**Independent Test**: 모달을 열어 다양한 비율의 이미지가 잘림 없이 전체적으로 표시되는지 확인

### Implementation for User Story 1

- [X] T004 [US1] `src/components/ProjectModal.tsx`에서 이미지 컨테이너의 `aspect-[16/9]` 클래스 제거
- [X] T005 [US1] `src/components/ProjectModal.tsx`의 `Image` 컴포넌트에서 `object-cover` 제거 및 원본 비율 유지 스타일 적용
- [X] T006 [US1] 이미지 로딩 중 레이아웃 시프트 방지를 위한 `relative w-full overflow-hidden` 구조 최적화
- [X] T007 [US1] `src/components/ProjectModal.tsx`의 이미지 영역에 최대 높이(`max-h-[70vh]`) 제한 적용

**Checkpoint**: User Story 1 구현 완료 - 이미지 크롭 현상 해결 여부 확인 가능

---

## Phase 4: User Story 2 - 반응형 이미지 레이아웃 (Priority: P2)

**Goal**: 모바일 환경에서의 이미지 최적화 및 레이아웃 검증

**Independent Test**: 모바일 뷰에서 이미지가 화면 너비에 맞게 적절히 축소되는지 확인

### Implementation for User Story 2

- [X] T008 [US2] `src/components/ProjectModal.tsx`의 모바일 대응 클래스(`h-[90vh] md:h-auto`)와 이미지 배치 정합성 검토
- [X] T009 [US2] 화면 크기 변화에 따라 하단 콘텐츠(제목, 설명 등)가 유연하게 배치되는지 확인

**Checkpoint**: 모든 디바이스에서 이미지가 잘림 없이 최적으로 표시됨

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 최종 품질 점검 및 마무리

- [X] T010 [P] 이미지 로드 실패 시의 Fallback UI(`imgError`) 작동 여부 재검증
- [X] T011 전체 프로젝트 빌드 및 린트 체크 (`npm run lint`, `tsc`)
- [X] T012 [P] `specs/002-modal-image-as-is/quickstart.md`의 검증 시나리오 최종 수행

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 진행
- **User Stories (Phase 3+)**: Foundational 단계 완료 후 병렬 또는 순차 진행 가능
- **Polish (Final Phase)**: 모든 사용자 스토리 구현 완료 후 진행

### Parallel Opportunities

- T002와 T003은 동시에 진행 가능
- T010과 T012는 최종 단계에서 병렬 확인 가능
- US1과 US2는 긴밀히 연결되어 있으므로 순차적으로 진행하는 것을 권장 (US1 → US2)

---

## Parallel Example: Setup & Analysis

```bash
# 초기 분석 및 스타일 전략 수립 병렬 실행
Task: "기존 ProjectModal.tsx의 이미지 관련 스타일 코드 분석 및 백업"
Task: "Tailwind CSS 환경에서 가변 높이 이미지 처리를 위한 스타일 전략 확립"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 & 2 완료 (기초 다지기)
2. Phase 3 (User Story 1) 집중 구현 - 이미지 크롭 문제 해결
3. **독립 검증**: 다양한 프로젝트 이미지를 클릭하여 원본 비율 유지 확인

### Incremental Delivery

1. 이미지 비율 수정 완료 (MVP)
2. 모바일 반응형 최적화 추가 (US2)
3. 전체 빌드 및 린트 체크 (Polish)

---

## Notes

- 모든 태스크는 `src/components/ProjectModal.tsx` 파일을 중심으로 진행됨.
- `framer-motion`의 `layoutId`가 비율 변경 시에도 자연스러운 애니메이션을 유지하는지 모니터링 필요.
- `Next.js`의 `Image` 컴포넌트 `fill` 속성을 유지할지, 아니면 `width/height`를 명시할지 구현 과정에서 결정.
