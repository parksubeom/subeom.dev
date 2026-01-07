"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { Post } from "../model/types"

/**
 * 모든 게시글을 가져옵니다 (목록용).
 */
export async function getPosts(): Promise<Post[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return (data as Post[]) || []
}

