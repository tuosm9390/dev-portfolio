# Research Report: Project Detail Modal Performance & UX

**Date**: 2026-03-23  
**Author**: Antigravity

## 1. Markdown Support in Next.js 16
- **Decision**: `react-markdown` 사용.
- **Rationale**: 경량화된 라이브러리이며, `remark-gfm` 플러그인을 추가하여 리스트, 표 등 일반적인 마크다운 기능을 쉽게 지원 가능함. 포트폴리오의 상세 설명은 고정된 데이터이므로 MDX보다는 `react-markdown`이 더 적합함.
- **Alternatives considered**: `next-mdx-remote` (복잡도가 높고 현재 구조에는 과함), `marked` (타입 지원 및 React 호환성 면에서 `react-markdown`이 우위).

## 2. Modal URL Sync (Next.js 15+ App Router)
- **Decision**: `useSearchParams` 훅과 `?project=[id]` 쿼리 파라미터 사용.
- **Rationale**: 브라우저 히스토리와 연동되어 뒤로가기 시 모달만 닫히는 기능을 자연스럽게 구현 가능함. Next.js App Router의 내비게이션 기능을 활용하여 클라이언트 사이드에서 부드럽게 전환됨.
- **Alternatives considered**: URL 해시(`#project-id`) - SEO 및 공유성 면에서 쿼리 파라미터가 더 표준적이며 관리가 용이함.

## 3. Accessible Modal Implementation
- **Decision**: `@radix-ui/react-dialog` (shadcn/ui 기반) 사용.
- **Rationale**: 헌법(Constitution Principle V)에서 권장하는 Radix UI primitives를 활용하여 포커스 트래핑, 스크린 리더 지원 등 웹 접근성을 보장함. 모바일에서도 부드러운 오버레이 처리가 가능함.
- **Alternatives considered**: 직접 구현 - 접근성 요건(스크롤 잠금, ESC 닫기 등)을 모두 충족하기에는 개발 비용이 크고 안정성이 낮음.

## 4. Performance & Smooth Animation
- **Decision**: `framer-motion`의 `layoutId` 및 `AnimatePresence` 활용.
- **Rationale**: 카드에서 모달로 확장되는 듯한 효과(Shared Layout Animation)를 주어 시각적 연결성을 높이고, GPU 가속을 통해 60fps 인터랙션을 보장함. `AnimatePresence`를 통해 모달이 닫힐 때의 부드러운 애니메이션을 보장함.
- **Optimization Strategy**: 모달 렌더링 시 대용량 이미지는 `next/image`의 `priority` 속성을 활용하여 LCP 지연을 방지함.

## 5. Implementation Constraints (Strike Prevention)
- **Decision**: `src/components/ui/dialog.tsx`를 생성하여 shadcn/ui 스타일을 포트폴리오 테마(Toss 스타일)에 맞게 커스텀.
- **Rationale**: 헌법(Principle II)에 따라 원자 단위 컴포넌트 체계를 유지함.
