"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { Project } from "../model/types"

/**
 * 특정 ID의 프로젝트 상세 정보를 가져옵니다.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching project by id:', error)
    return null
  }

  return (data as Project) || null
}

