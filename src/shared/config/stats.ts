// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  // 확장 누적 다운로드 = Open VSX + VS Code Marketplace 합산
  extensionDownloads: 10357,
  openVsxDownloads: 8866,
  // VS Code Marketplace 는 install 748 + update 743 합산
  vscodeMarketplaceDownloads: 1491,
  // npm 주간 다운로드 합산 (maintainer:bumpist 전체 패키지) — bumpist-code(14) + claude-distill(12)
  npmWeeklyDownloads: 26,
  lastUpdated: "2026-08-23T00:43:13.817Z",
} as const;
