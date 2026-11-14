// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  // 확장 누적 다운로드 = Open VSX + VS Code Marketplace 합산
  extensionDownloads: 17072,
  openVsxDownloads: 15206,
  // VS Code Marketplace 는 install 1070 + update 796 합산
  vscodeMarketplaceDownloads: 1866,
  // npm 주간 다운로드 합산 (maintainer:bumpist 전체 패키지) — bumpist-code(30) + claude-distill(11)
  npmWeeklyDownloads: 41,
  lastUpdated: "2026-11-14T04:03:53.645Z",
} as const;
