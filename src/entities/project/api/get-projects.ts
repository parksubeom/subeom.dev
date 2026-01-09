import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Project } from "@/entities/project/model/types";

export async function getProjects(): Promise<Project[]> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true }); // 순서대로 정렬

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data as unknown as Project[];
}