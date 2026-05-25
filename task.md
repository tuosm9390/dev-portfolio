# 프론트엔드 디자인 최적화 구현 태스크 리스트

이 태스크 리스트는 [DESIGN.md](file:///D:/development/dev-portfolio/DESIGN.md)의 디자인 시스템 명세 및 [/plan-design-review](file:///C:/Users/tuosm/.gemini/antigravity-cli/brain/bfd9860b-80b0-42e9-8bc6-f5cd1dd6ad87/implementation_plan.md)의 마이크로 인터랙션 및 에지 케이스 검토 결과를 기반으로 작성되었습니다.

## 마일스톤 1: 디자인 토큰 및 글로벌 설정 리팩토링
- [x] [globals.css](file:///D:/development/dev-portfolio/src/app/globals.css) 내 Apple 디자인 시스템 색상 변수(다크 서피스 1~5, Link Blue, Bright Blue 등) 추가 정의
- [x] SF Pro Display 및 Text 폰트 규격에 따른 자간(`tracking`) 및 행간(`leading`) 관련 전역 유틸리티 클래스 설계

## 마일스톤 2: 고정 내비게이션 바(Header) 리디자인
- [x] [Header.tsx](file:///D:/development/dev-portfolio/src/components/home/Header.tsx)의 배경을 다크 반투명 유리(`rgba(0,0,0,0.8)` + `backdrop-filter: saturate(180%) blur(20px)`)로 변경
- [x] 로고 및 내비게이션 링크 텍스트 색상을 흰색 테마로 전환하고 Hover/Active 페이드 트랜션 적용
- [x] 테두리(`border-b`)를 제거하여 완전한 글래스 플로팅 효과 완성

## 마일스톤 3: Pure Black 오프닝 섹션 개편 (Hero)
- [/] [HeroSection.tsx](file:///D:/development/dev-portfolio/src/components/home/HeroSection.tsx)의 배경을 Pure Black (`#000000`)으로 변경 및 텍스트 전체 흰색화
- [/] 메인 헤드라인 폰트 스타일을 SF Pro Display 명세(56px, Line-height 1.07, Letter-spacing -0.28px)로 정밀 튜닝
- [/] CTA 버튼의 반경을 `rounded-[980px]` (Pill 형태)로 개선하고 Hover/Active 시 마이크로 스케일 모션(`scale(0.97)`) 적용
- [/] 모바일 해상도(<360px ~ 480px) 진입 시의 타이포그래피 스케일링 세부 코드 적용

## 마일스톤 4: 프로젝트 목록 및 카드 UI 최적화
- [ ] [ProjectCard.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectCard.tsx)의 외부 경계선(Border) 제거 및 플랫 스타일 적용
- [ ] Apple 스튜디오 형태의 와이드 소프트 섀도우(`rgba(0,0,0,0.22) 3px 5px 30px 0px`) 연동
- [ ] 이미지 비동기 로드 시 CLS를 방지하는 스켈레톤 홀더 구조 배치
- [ ] [ProjectsSection.tsx](file:///D:/development/dev-portfolio/src/components/home/ProjectsSection.tsx)에 프로젝트 필터링 결과가 없을 때의 Empty State UI 구현 및 "모든 프로젝트 보기" 액션 추가

## 마일스톤 5: 섹션별 교차 테마 배치 및 UI 폴리싱
- [ ] 전체 페이지 섹션 순서에 맞게 교차 배경 적용: `Hero(Black) -> Projects(Light Gray) -> Story(White) -> Strengths(Light Gray) -> Contact(Black)`
- [ ] 각 섹션 내부 컴포넌트(텍스트 색상, 서피스 카드 색상, 버튼 테두리 등)가 해당 섹션 배경(다크/라이트)에 맞춰 올바르게 반전되도록 동적 클래스 분기 처리
- [ ] [Footer.tsx](file:///D:/development/dev-portfolio/src/components/home/Footer.tsx)의 여백 및 글꼴 비율을 `SF Pro Text` 가이드라인에 맞춰 정리
