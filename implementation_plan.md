# 프론트엔드 디자인 최적화 구현 계획 (DESIGN.md 기반 - 디자인 리뷰 완료)

이 구현 계획서는 프로젝트 내 [DESIGN.md](file:///D:/development/dev-portfolio/DESIGN.md) 파일에 명시된 Apple 디자인 시스템(Controlled Drama)을 기준으로 현재 프론트엔드 코드를 분석하고, `/plan-design-review` 스킬의 9가지 디자인 원칙을 적용하여 수립한 **10/10 완결성 수준의 디자인 개선 계획**입니다.

---

## 1. 디자인 시스템(DESIGN.md) 분석 및 현 상태 GAP 진단

[DESIGN.md](file:///D:/development/dev-portfolio/DESIGN.md)에서 규정한 핵심 정체성은 **"Apple Design System (Controlled Drama)"**입니다. 그러나 현재 프론트엔드 코드는 아래와 같은 불일치(GAP)를 보이고 있어 최적화가 필요합니다.

### 1) Cinematic Pacing (시네마틱 리듬) 부재
- **가이드라인**: Pure Black (`#000000`) 배경(흰색 텍스트)의 어두운 섹션과 Light Gray (`#f5f5f7`) 배경(어두운 텍스트)의 밝은 섹션이 교차하며 강렬한 시각적 대비와 리듬을 만들어야 합니다.
- **현 상태**: 전체 페이지가 거의 흰색(`bg-white`)과 `#f5f5f7` 배경 위주로 구성되어 있어 밋밋한 인상을 줍니다. 특히 첫인상을 결정하는 [HeroSection.tsx](file:///D:/development/dev-portfolio/src/components/home/HeroSection.tsx)가 흰색 배경으로 구현되어 있어 Apple 특유의 몰입감 넘치는 느낌이 부족합니다.

### 2) 내비게이션 바(Header)의 비토글 투명도 설정
- **가이드라인**: "The navigation glass effect (translucent dark + blur) is non-negotiable" (rgba(0,0,0,0.8) + backdrop-filter: saturate(180%) blur(20px)). 어두운 반투명 유리가 항상 스크롤 위에 떠 있어야 합니다.
- **현 상태**: [Header.tsx](file:///D:/development/dev-portfolio/src/components/home/Header.tsx)는 `bg-white/80`에 밝은 회색 테두리(`border-b`)를 사용하고 있습니다. 이는 가이드라인의 시그니처 다크 글래스(Dark Glass) 명세에 어긋납니다.

### 3) 타이포그래피 정밀도 및 Optical Sizing 미적용
- **가이드라인**: 20px 이상은 SF Pro Display, 19px 이하는 SF Pro Text를 사용해야 하며, 모든 텍스트 크기에 맞춘 미세한 음수 자간(Negative letter-spacing) 및 헤드라인의 타이트한 줄높이(Line-height 1.07~1.14)가 적용되어야 합니다.
- **현 상태**: 일부 컴포넌트에서 테일윈드 클래스로 구현했으나, 전역적으로 폰트 최적화 및 크기별 자간/줄높이가 매끄럽게 정의되어 있지 않고 개 개별로 임의 지정되어 있습니다.

### 4) 버튼 및 인터랙티브 요소의 일관성 부족
- **가이드라인**: 액센트 컬러는 오직 Apple Blue (`#0071e3`) 계열만 사용해야 하며, CTA 버튼은 980px의 Pill(캡슐) 반경을 활용해야 합니다.
- **현 상태**: 둥근 캡슐형태(`rounded-full`)는 부분적으로 적용되었으나, 마우스를 올렸을 때(hover)의 처리나 포커스 링(`focus-visible:outline-[#0071e3]`) 등이 다소 파편화되어 있습니다.

---

## 2. 디자인 최적화를 위한 전제조건 (Pre-requisites)

디자인 다듬기 작업을 수행하기 위해 반드시 해결 및 정의해야 할 전제조건입니다.

> [!IMPORTANT]
> **전제조건 1: Tailwind CSS 변수화 및 디자인 토큰 정의**
> `globals.css` 및 테일윈드 설정에 Apple 디자인 시스템에서 요구하는 색상과 그림자, 자간 규칙을 CSS 변수 및 테일윈드 테마로 연동하여 하드코딩을 방지해야 합니다.

> [!NOTE]
> **전제조건 2: 다크/라이트 테마 변경에 따른 텍스트 대비 확보**
> 섹션 배경을 블랙(`#000000`)과 라이트그레이(`#f5f5f7`)로 번갈아 교차 적용하려면, 각 섹션이 포함하는 컴포넌트(예: 제목, 본문, 버튼)가 배경색에 따라 동적으로 다크/라이트 버전을 지원해야 합니다.
> - 예: 블랙 섹션 내의 링크 텍스트는 `Bright Blue` (`#2997ff`) 사용
> - 라이트 섹션 내의 링크 텍스트는 `Link Blue` (`#0066cc`) 사용

---

## 3. 인터랙션 및 세부 상태 명세 (Interaction & Edge Case Specs)

`/plan-design-review` 디자인 검토를 통해 추가된 정밀 명세입니다.

### 1) 마이크로 인터랙션 (Micro-animations & States)
- **Primary CTA Button** (예: 프로젝트 보기):
  - **Default**: `bg-[#0071e3]` (Apple Blue), `text-[#ffffff]`, `border-radius: 980px` (Pill), 높이 최소 44px 확보.
  - **Hover**: `bg-[#0077ed]` (약간 밝아짐). `transition: background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1)`.
  - **Active (눌림)**: `scale(0.97)`, `bg-[#0062c3]`. `transition: transform 0.1s ease`.
  - **Focus-visible**: `outline outline-2 outline-offset-4 outline-[#0071e3]`.
- **Secondary Outline Button** (예: 연락하기):
  - **Default**: `bg-transparent`, `text-[#0066cc]` (라이트 bg 기준), `border 1px solid #0066cc`, `border-radius: 980px`.
  - **Hover**: `bg-[rgba(0,102,204,0.04)]` (미세한 블루 틴트 투명 배경).
  - **Active**: `scale(0.97)`, `bg-[rgba(0,102,204,0.08)]`.
- **Pill Link (Learn More / 펼쳐보기)**:
  - **Default**: `text-[#0066cc]` (라이트 bg) / `text-[#2997ff]` (다크 bg), `font-size: 14px`, chevron `>` 동반.
  - **Hover**: `underline` 장식 활성화, chevron 우측으로 2px 트랜슬레이트 (`translate-x-0.5` with smooth transition).
  - **Active**: `opacity-70`.
- **Glass Navigation Links**:
  - **Default**: `text-[rgba(255,255,255,0.8)]` (다크 반투명 유리 위에서 항상 가시성 확보).
  - **Hover**: `text-[#ffffff]`, 아래에 미세한 하이라이트 라인 인디케이터 페이드인.

### 2) 에지 케이스 및 예외 처리 (Edge Cases & Empty States)
- **빈 상태 (Empty State)**:
  - 필터링 또는 검색 결과가 없을 때, 단순히 "결과가 없습니다."라고 방치하지 않고 절제된 레이아웃 제공.
  - **디자인**: SF Pro Text 17px, 색상 `rgba(0,0,0,0.48)` (Black 48%)로 배치하고 아래에 "모든 프로젝트 보기" 파란색 Pill Link 배치.
- **이미지 로딩 & Fallback (Skeleton UI)**:
  - 느린 네트워크 환경에서 큰 레이아웃 시프트(CLS)를 방지하기 위해 [ProjectCard.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectCard.tsx)의 이미지 영역에 고정 종횡비(`aspect-[16/10]`) 컨테이너 및 `#e5e5ea` 색상의 스켈레톤 홀더 배치.
- **긴 텍스트 대응 (Text Overflow)**:
  - 타이틀이나 본문 요약이 예상보다 길어질 경우 레이아웃이 무너지지 않도록 `line-clamp` 속성을 명확히 적용하여 UI 일관성 유지.

### 3) 반응형 타이포그래피 및 레이아웃 스케일링
- **Typography Scale**:
  - **Hero Headline**: Desktop `56px` (leading-1.07, tracking -0.28px) -> Tablet `40px` -> Mobile `28px`
  - **Section Heading**: Desktop `40px` (leading-1.10, normal tracking) -> Mobile `32px`
  - **Body Copy**: Desktop `17px` (leading-1.47, tracking -0.374px) -> Mobile `15px`
- **Layout Margins & Spacing**:
  - 8px 그리드 스케일을 준수하여 내부 패딩과 마진을 `space-y-4` (16px), `space-y-8` (32px), `space-y-12` (48px) 등으로 일관되게 구조화.
  - 모바일 해상도(<360px)에서 최소 좌우 마진 16px 확보.

---

## 4. 세부 개선 제안 (Proposed Changes)

프론트엔드 최적화를 위해 제안하는 구체적인 수정 내용입니다.

### 1) [MODIFY] [globals.css](file:///D:/development/dev-portfolio/src/app/globals.css)
- 가이드라인의 모든 디자인 토큰(다크 서피스 색상, 액센트 블루 색상 코드들)을 CSS 변수로 추가합니다.
- `SF Pro Display` 및 `SF Pro Text` 폰트 스케일에 맞춘 자간(Letter spacing)과 행간(Line height) 유틸리티 클래스를 정의합니다.

### 2) [MODIFY] [Header.tsx](file:///D:/development/dev-portfolio/src/components/home/Header.tsx)
- 가이드라인 명세에 부합하도록 내비게이션 바를 다크 반투명 글래스 테마로 리디자인합니다.
  - 배경: `rgba(0, 0, 0, 0.8)`
  - 블러: `backdrop-filter: saturate(180%) blur(20px)`
  - 텍스트 색상: `#ffffff` (Hover 시 `#2997ff` 또는 밝은 블루 적용)
  - 하단 보더 제거

### 3) [MODIFY] [HeroSection.tsx](file:///D:/development/dev-portfolio/src/components/home/HeroSection.tsx)
- 배경을 **Pure Black (`#000000`)**으로 변경하여 몰입감 있는 오프닝 섹션을 완성합니다.
- 모든 텍스트를 흰색 테마로 전환하고, 자간과 행간을 정확히 가이드라인(SF Pro Display 56px, Line-height 1.07, Letter-spacing -0.28px)에 맞춰 튜닝합니다.
- 버튼 2개(Learn More 형태와 Filled Apple Blue 형태)를 가이드라인의 규격(Pill 980px radius, 터치 영역 44px 이상)에 맞춰 최적화합니다.

### 4) [MODIFY] [ProjectsSection.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectsSection.tsx) & [ProjectCard.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectCard.tsx)
- 프로젝트 섹션은 라이트 섹션(`bg-[#f5f5f7]`)으로 두어 Hero의 블랙과 대비를 이루게 합니다.
- 카드 컴포넌트([ProjectCard.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectCard.tsx))에 있는 불필요한 보더나 모션을 걷어내고, 가이드라인에 따른 부드러운 스튜디오 그림자(`rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`)를 적용합니다.

### 5) [MODIFY] [StorySection.tsx](file:///D:/development/dev-portfolio/src/components/home/StorySection.tsx) / [StrengthsSection.tsx](file:///D:/development/dev-portfolio/src/components/home/StrengthsSection.tsx) / [ContactSection.tsx](file:///D:/development/dev-portfolio/src/components/home/ContactSection.tsx)
- 섹션 흐름을 `Hero(Black) -> Projects(Light Gray) -> Story(Black 또는 White) -> Strengths(Light Gray) -> Contact(Black)` 등으로 교차 배치하여 리듬감을 극대화합니다.
- 이에 맞는 각 섹션별 내부 컴포넌트의 테마 색상(텍스트, 버튼)을 반전시킵니다.

---

## 5. 검증 계획 (Verification Plan)

### 수동 검증 (Visual QA)
- 헤드리스 브라우저 또는 로컬 서버 실행 후 크롬 데브툴즈를 활용해 각 해상도별 자간/줄높이가 피그마 명세와 일치하는지 확인합니다.
- 스크롤 시 내비게이션 바의 글래스 블러 효과가 블랙/라이트 섹션 위에서 매끄럽게 오버레이되는지 눈으로 확인합니다.
- 각 디바이스 뷰포트 너비(<360px 모바일 ~ >1440px 데스크톱)에 맞춰 폰트 크기와 패딩이 유기적으로 무너지지 않고 줄어드는지 확인합니다.

---

## ## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | DONE | GAP 진단 및 마이크로 인터랙션 명세 추가 완료 |

**VERDICT:** DESIGN REVIEW COMPLETED. READY FOR IMPLEMENTATION.
