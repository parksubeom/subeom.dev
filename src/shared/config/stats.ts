// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  // 확장 누적 다운로드 = Open VSX + VS Code Marketplace 합산
  extensionDownloads: 10504,
  openVsxDownloads: 8970,
  // VS Code Marketplace 는 install 773 + update 761 합산
  vscodeMarketplaceDownloads: 1534,
  // npm 주간 다운로드 합산 (maintainer:bumpist 전체 패키지) — claude-distill(9) + bumpist-code(4)
  npmWeeklyDownloads: 13,
  lastUpdated: "2026-09-02T02:00:12.566Z",
} as const;
