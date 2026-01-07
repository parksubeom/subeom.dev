"use server"

import { createServerClient } from "@/shared/lib/supabase/server"

/**
 * 모든 프로젝트 ID를 가져옵니다 (generateStaticParams용).
 */
export async function getAllProjectIds(): Promise<string[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('id')

  if (error) {
    console.error('Error fetching project ids:', error)
    return []
  }

  return data?.map((project) => project.id) || []
}

