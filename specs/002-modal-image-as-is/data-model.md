# Data Model: 프로젝트 이미지 메타데이터

## 개요
프로젝트 데이터 구조는 기존 `ProjectSchema`를 그대로 유지하되, 이미지의 가로세로 비율(AspectRatio)을 추정하거나 고정된 렌더링 방식을 탈피하는 데 중점을 둠.

## Project (기존 유지)
- `id`: string
- `title`: string
- `imageUrl`: string (이미지 경로)
- `accentColor`: hex string

## UI 상태 관리
- `imgError`: boolean (이미지 로드 실패 여부)
- `imageLoaded`: boolean (이미지 로드 완료 여부 - 레이아웃 시프트 방지용)

## 관계
`ProjectModal`은 단일 `Project` 객체를 받아 해당 이미지와 상세 정보를 렌더링함.
