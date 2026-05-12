// 자동 갱신되는 라이브 통계.
// `pnpm update:stats` 가 매일 09:00 cron 으로 갱신하고, 이 파일을 그대로 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  openVsxDownloads: 3762,
  npmWeeklyDownloads: 506,
  lastUpdated: "2026-05-12T00:00:00.000Z",
} as const;
