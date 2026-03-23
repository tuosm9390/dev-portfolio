# UI Interaction Contract: Project Detail Modal

**Date**: 2026-03-23  
**Author**: Antigravity

## 1. Trigger Interface (Card → URL)
- **Action**: "자세히 보기" 버튼 클릭
- **Payload**: `project.id`
- **Side Effect**: 브라우저 URL을 `?project={id}`로 업데이트 (히스토리 추가)

## 2. Modal Controller Interface (URL → Modal)
- **Input**: SearchParams (`project`)
- **Logic**: 
    1. `project` 파라미터가 유효한 `id`인지 확인.
    2. 유효할 경우 `projects` 데이터에서 해당 객체 추출.
    3. `isOpen` 상태를 `true`로 설정하고 모달 렌더링.
- **Output**: 프로젝트 상세 팝업 표시

## 3. Exit Interface (Modal → URL)
- **Action**: 'X' 버튼 클릭, 배경 클릭, 'ESC' 키 입력
- **Side Effect**: 브라우저 URL에서 `project` 파라미터 제거 (히스토리 유지 또는 뒤로가기)
- **Visual Transition**: `framer-motion`의 `AnimatePresence`로 페이드아웃 및 축소 효과.

## 4. Accessibility Requirements
- **Focus Trapping**: 모달 오픈 시 포커스가 모달 내부의 닫기 버튼이나 첫 번째 링크로 이동해야 함.
- **Aria Labels**: 
    - `role="dialog"`
    - `aria-labelledby="[modal-title-id]"`
    - `aria-describedby="[modal-description-id]"`
