// 스레드 인사이트 로더 — data/threads-insights.md 의 frontmatter 를 읽음.
// 서버 컴포넌트에서만 호출.
// 개발 모드에서는 md 수정이 바로 보이도록 캐시하지 않음(프로덕션만 메모리 캐시).

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ThreadsInsight {
  topic: string;
  date: string;
  title: string;
  lead: string;
  body: string;
  threadUrl: string;
}

let cached: ThreadsInsight[] | null = null;

const useInsightCache = process.env.NODE_ENV === "production";

function parseInsightDate(s: string): number {
  if (!s) return 0;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T12:00:00`).getTime();
  }
  if (/^\d{4}-\d{2}$/.test(s)) {
    return new Date(`${s}-01T12:00:00`).getTime();
  }
  return 0;
}

function parseInsightsFromList(
  list: Partial<ThreadsInsight>[],
): ThreadsInsight[] {
  return list
    .filter(
      (item): item is ThreadsInsight =>
        !!item.title && !!item.lead && !!item.body,
    )
    .map((item) => ({
      topic: item.topic ?? "Thinking",
      date: item.date ?? "",
      title: item.title,
      lead: item.lead,
      body: item.body,
      threadUrl: item.threadUrl ?? "https://www.threads.net/@water_bum_2",
    }));
}

/** 홈 등 — date 기준으로 골라낸 대표 1건(카피상으로는 ‘요즘 붙잡히는 한 편’). */
export function getLatestThreadsInsight(): ThreadsInsight | null {
  const all = getThreadsInsights();
  if (all.length === 0) return null;
  const sorted = [...all].sort(
    (a, b) => parseInsightDate(b.date) - parseInsightDate(a.date),
  );
  return sorted[0] ?? null;
}

export function getThreadsInsights(): ThreadsInsight[] {
  if (useInsightCache && cached) return cached;

  const filePath = path.join(process.cwd(), "data/threads-insights.md");
  if (!fs.existsSync(filePath)) {
    if (useInsightCache) cached = [];
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const list = (data.insights ?? []) as Partial<ThreadsInsight>[];
    const parsed = parseInsightsFromList(list);
    if (useInsightCache) cached = parsed;
    return parsed;
  } catch (e) {
    console.warn("[get-threads-insights] failed to parse:", e);
    if (useInsightCache) cached = [];
    return [];
  }
}
