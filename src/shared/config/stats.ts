// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  // 확장 누적 다운로드 = Open VSX + VS Code Marketplace 합산
  extensionDownloads: 11915,
  openVsxDownloads: 10248,
  // VS Code Marketplace 는 install 883 + update 784 합산
  vscodeMarketplaceDownloads: 1667,
  // npm 주간 다운로드 합산 (maintainer:bumpist 전체 패키지) — bumpist-code(66) + claude-distill(13)
  npmWeeklyDownloads: 79,
  lastUpdated: "2026-09-29T03:18:36.277Z",
} as const;
