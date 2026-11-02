// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  // 확장 누적 다운로드 = Open VSX + VS Code Marketplace 합산
  extensionDownloads: 16292,
  openVsxDownloads: 14474,
  // VS Code Marketplace 는 install 1024 + update 794 합산
  vscodeMarketplaceDownloads: 1818,
  // npm 주간 다운로드 합산 (maintainer:bumpist 전체 패키지) — claude-distill(21) + bumpist-code(16)
  npmWeeklyDownloads: 37,
  lastUpdated: "2026-11-02T03:26:20.361Z",
} as const;
