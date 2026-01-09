import { createStaticClient } from "@/shared/lib/supabase/static"; // 👈 static 클라이언트 사용

/**
 * 모든 프로젝트 ID를 가져옵니다 (generateStaticParams용).
 */
export async function getAllProjectIds(): Promise<string[]> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('id');

  if (error) {
    console.error('Error fetching project ids:', error);
    return [];
  }

  return data?.map((project) => project.id) || [];
}