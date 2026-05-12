import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Project, ProjectDetail } from "@/entities/project/model/types";

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
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false }); // 최신 순으로 정렬

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  const detailMap = loadDetailInfoMap();

  return (data ?? []).map((row) => {
    const existing = (row as unknown as { detailInfo?: ProjectDetail }).detailInfo;
    const detailInfo = existing ?? detailMap.get(row.title);
    return { ...row, detailInfo } as unknown as Project;
  });
}
