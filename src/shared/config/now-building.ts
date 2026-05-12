// "Now Building" — 지금 작업 중인 것 / 곧 발행할 글.
// 월 1회 이상 갱신 권장. 갱신 못 할 것 같으면 빈 배열로 두면 섹션이 숨겨집니다.

export const NOW_BUILDING = {
  lastUpdated: "2026-05-12",
  items: [
    {
      label: "Building",
      value: "claude-distill v0.5 — i18n 자동 분리 작업 중",
    },
    {
      label: "Writing",
      value: "AEO / GEO 최적화 (스레드 예정)",
    },
  ],
} as const;
