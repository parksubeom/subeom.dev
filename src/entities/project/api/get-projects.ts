import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Project, ProjectDetail } from "@/entities/project/model/types";

function loadProjectsFromMarkdown(): Project[] {
  const dir = path.join(process.cwd(), "projects");
  if (!fs.existsSync(dir)) return [];

  const now = new Date().toISOString();
  const rows: Project[] = [];

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      if (!data.title) continue;
      rows.push({
        id: file.replace(/\.md$/, ""),
        title: data.title,
        description: data.description ?? null,
        long_description: content.trim() || null,
        category: data.category ?? null,
        status: data.status ?? null,
        tech_stack: data.tech_stack ?? null,
        github_url: data.github_url ?? null,
        demo_url: data.demo_url ?? null,
        thumbnail_url: data.thumbnail_url ?? null,
        images: data.images ?? null,
        featured: data.featured ?? false,
        order: data.order ?? null,
        start_date: data.start_date
          ? new Date(data.start_date).toISOString()
          : null,
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        created_at: now,
        updated_at: now,
        detailInfo: (data.detailInfo ?? null) as ProjectDetail,
      } as unknown as Project);
    } catch (e) {
      console.warn(`[get-projects] failed to parse ${file}:`, e);
    }
  }

  rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return rows;
}

function loadDetailInfoMap(): Map<string, ProjectDetail> {
  const map = new Map<string, ProjectDetail>();
  const dir = path.join(process.cwd(), "projects");
  if (!fs.existsSync(dir)) return map;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    try {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      if (data.title && data.detailInfo) {
        map.set(data.title, data.detailInfo as ProjectDetail);
      }
    } catch (e) {
      console.warn(`[get-projects] failed to parse ${file}:`, e);
    }
  }
  return map;
}

export async function getProjects(): Promise<Project[]> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) {
    return loadProjectsFromMarkdown();
  }

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false }); // 최신 순으로 정렬

  if (error) {
    console.error("Error fetching projects:", error);
    return loadProjectsFromMarkdown();
  }

  const detailMap = loadDetailInfoMap();
  return (data ?? []).map((row) => {
    const existing = (row as unknown as { detailInfo?: ProjectDetail })
      .detailInfo;
    const detailInfo = existing ?? detailMap.get(row.title);
    return { ...row, detailInfo } as unknown as Project;
  });
}
