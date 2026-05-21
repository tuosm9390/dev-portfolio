// 프로젝트별 표시 상태를 판별하는 홈 화면 유틸리티

const inProgressProjectIds = new Set([
  "investment-platform",
  "persona-style",
  "spend-intervention",
  "sumpyo-flutter-app",
]);

export function isProjectInProgress(projectId: string) {
  return inProgressProjectIds.has(projectId);
}
