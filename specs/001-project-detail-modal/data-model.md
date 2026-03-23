# Data Model: Project Detail Modal

**Date**: 2026-03-23  
**Author**: Antigravity

## 1. Project Entity
포트폴리오 각 프로젝트를 정의하는 핵심 엔티티입니다. 기존 `src/data/projects.ts`의 인터페이스를 준수하며, 상세 모달에서 필요한 상세 텍스트를 마크다운 형식으로 포함합니다.

| Field | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| id | string | 고유 식별자 (URL 쿼리 파라미터로 사용) | Yes |
| title | string | 프로젝트 제목 | Yes |
| summary | string | 프로젝트 요약 (카드 뷰에 표시) | Yes |
| description | string | 상세 설명 (마크다운 형식 지원) | Yes |
| techStack | string[] | 사용된 기술 스택 리스트 | Yes |
| liveUrl | string | 실제 서비스 연결 URL | Yes |
| githubUrl | string | GitHub 레포지토리 연결 URL | No |
| imageUrl | string | 대표 이미지 경로 | Yes |
| accentColor | string | 프로젝트 테마 강조 색상 (HEX) | Yes |

## 2. Modal State (URL Managed)
모달의 가시성 및 선택된 프로젝트 데이터는 브라우저 URL 쿼리 파라미터와 연동되어 관리됩니다.

| Query Param | Value | Purpose |
| :--- | :--- | :--- |
| project | [project.id] | 선택된 프로젝트의 모달을 화면에 표시 |

- **State Transition**:
    - `Default`: `project` 파라미터 없음 → 모달 닫힘
    - `Open`: `project=persona-style` → `id`가 `persona-style`인 프로젝트 모달 열림
    - `Close`: `project` 파라미터 삭제 → 모달 닫힘 (뒤로가기 포함)

## 3. Component Architecture
- **ProjectsSection**: 프로젝트 목록을 렌더링하고, URL 쿼리를 감시하여 모달 표시 여부를 결정함.
- **ProjectCard**: '자세히 보기' 클릭 시 URL 쿼리를 업데이트함.
- **ProjectModal**: 선택된 프로젝트 데이터를 받아 Radix UI Dialog로 렌더링하며, 마크다운 컨텐츠를 표시함.
