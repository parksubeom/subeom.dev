"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { Project } from "../model/types"

/**
 * 모든 프로젝트를 order 순으로 가져옵니다.
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data as Project[]) || []
}

