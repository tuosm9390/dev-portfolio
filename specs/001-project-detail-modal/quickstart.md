# Quickstart: Project Detail Modal

**Date**: 2026-03-23  
**Author**: Antigravity

## 1. Prerequisites
- **shadcn/ui 설정**: `@radix-ui/react-dialog` 설치 및 `Dialog` 원자 컴포넌트 추가 필요.
- **마크다운 렌더러**: `react-markdown` 라이브러리 추가 필요.

## 2. Setup Commands
```bash
# 필수 라이브러리 설치
npm install @radix-ui/react-dialog react-markdown
```

## 3. Implementation Workflow
1. **Dialog UI 컴포넌트 생성**: `src/components/ui/dialog.tsx`에 Radix UI 기반 모달 베이스 구현.
2. **ProjectModal 컴포넌트 구현**: `src/components/ProjectModal.tsx` 생성 및 마크다운 렌더링 추가.
3. **URL 쿼리 연동**: `src/components/ProjectsSection.tsx`에서 `useSearchParams`로 모달 가시성 제어.
4. **인터랙션 업데이트**: `ProjectCard.tsx`의 "자세히 보기" 버튼 클릭 시 `router.push`로 쿼리 업데이트.
5. **애니메이션 최적화**: `framer-motion`의 `layoutId` 속성을 카드 이미지와 모달 이미지에 동일하게 적용하여 자연스러운 전환 효과 구현.

## 4. Verification
- 특정 카드를 클릭했을 때 모달이 부드럽게 열리는가?
- 뒤로가기 클릭 시 모달이 닫히고 목록이 유지되는가?
- 마크다운 서식이 깨짐 없이 정상적으로 표시되는가?
- 'ESC' 키로 모달이 닫히는가?
