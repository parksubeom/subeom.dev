// 스레드 인사이트 로더 — data/threads-insights.md 의 frontmatter 를 읽음.
// 서버 컴포넌트에서만 호출.

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

export function getThreadsInsights(): ThreadsInsight[] {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "data/threads-insights.md");
  if (!fs.existsSync(filePath)) {
    cached = [];
    return cached;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const list = (data.insights ?? []) as Partial<ThreadsInsight>[];
    cached = list
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
  } catch (e) {
    console.warn("[get-threads-insights] failed to parse:", e);
    cached = [];
  }

  return cached;
}
