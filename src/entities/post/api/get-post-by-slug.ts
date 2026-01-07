"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { Post } from "../model/types"

/**
 * 특정 slug의 게시글 상세 정보를 가져옵니다.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }

  return (data as Post) || null
}

