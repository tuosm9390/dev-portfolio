Date: 2026-03-18 10:00:00
Author: Antigravity

# 📊 UI 개선 및 프로젝트 추가 분석 보고서

## 1. 개요

본 보고서는 기존 포트폴리오의 UI를 shadcn/ui 기반의 Toss(TDS) 스타일로 개선하고, 신규 프로젝트 2종을 추가하기 위한 분석 내용을 담고 있습니다.

## 2. 현재 상태 분석

- **기술 스택**: Next.js 16 (App Router), Tailwind CSS 4.x, React 19, Framer Motion 12.
- **디자인 컨셉**: 다크 모드 중심, Indigo/Violet 그라디언트 포인트.
- **컴포넌트 구조**: 섹션별 단일 파일 구성 (`src/components/*`).
- **프로젝트 데이터**: `src/data/projects.ts`에서 중앙 관리.

## 3. Toss 스타일 (TDS) 분석 및 적용 전략

- **타이포그래피**:
  - 현재 Noto Sans KR 사용 중 -> **Pretendard** 도입 제안 (Toss의 시그니처 가독성 확보).
  - 자간(letter-spacing) 및 행간(line-height) 최적화.
- **컬러 팔레트**:
  - Primary: Toss Blue (`#0064ff`).
  - Neutrals: 부드러운 회색조 (`#f9fafb`, `#111111`).
- **UI 패턴**:
  - 큰 Border Radius (보통 16px~24px).
  - Subtle Shadows 및 Glassmorphism.
  - 인터랙티브 피드백: Hover 시 미세한 스케일 업 및 그림자 변화.
- **애니메이션**:
  - Framer Motion을 활용한 'Natural Motion' 구현 (Ease-out 큐빅 베지어 곡선 활용).

## 4. shadcn/ui 도입 방안

- **Tailwind 4 호환성**: Tailwind 4는 CSS-first 구성을 지향하므로, `globals.css`의 `@theme` 블록을 활용하여 shadcn 변수 정의.
- **주요 컴포넌트**: Button, Card, Badge, Navigation Menu, Dialog(프로젝트 상세용) 등 도입.

## 5. 신규 프로젝트 분석

- **추가 대상**:
  1. `self-growth-dashboard`: 개인 성장 지표 대시보드.
  2. `sumpyo-flutter-app`: Flutter 기반 앱 프로젝트.
- **필요 정보**: 기술 스택, 주요 기능 요약, 대표 이미지, GitHub/Live URL. (사용자 힌트를 참고하여 상세 내용 구성 예정)

## 6. 결론 및 제언

단순한 스타일 변경을 넘어, shadcn/ui를 통한 컴포넌트 시스템 구축으로 유지보수성을 높이고 Toss 스타일의 UX를 통해 전문성을 강조하는 방향으로 개선을 진행합니다.
