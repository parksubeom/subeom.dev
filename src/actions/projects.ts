"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { Tables } from "@/type/supabase"

type Project = Tables<'projects'>

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

/**
 * 특정 ID의 프로젝트를 가져옵니다.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return (data as Project) || null
}

/**
 * generateStaticParams를 위한 모든 프로젝트 ID를 가져옵니다.
 */
export async function getAllProjectIds(): Promise<string[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('id')

  if (error) {
    console.error('Error fetching project IDs:', error)
    return []
  }

  return data.map((project) => project.id) || []
}


