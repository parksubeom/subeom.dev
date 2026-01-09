import { createStaticClient } from "@/shared/lib/supabase/static"; // 👈 static 클라이언트 사용
import type { Project } from "../model/types";

/**
 * 특정 ID의 프로젝트 상세 정보를 가져옵니다.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }

  return (data as unknown as Project) || null;
}