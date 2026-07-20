// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  openVsxDownloads: 7164,
  // npm 주간 다운로드 합산 — claude-distill(8) + bumpist-code(11)
  npmWeeklyDownloads: 19,
  lastUpdated: "2026-07-20T03:25:00.581Z",
} as const;
