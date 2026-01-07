"use server"

import { createServerClient } from "@/shared/lib/supabase/server"

/**
 * 모든 게시글 slug를 가져옵니다 (generateStaticParams용).
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true)

  if (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }

  return data?.map((post) => post.slug) || []
}

