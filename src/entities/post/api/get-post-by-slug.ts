import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 더미 데이터 로직 제거! 바로 Supabase 조회
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching post (${slug}):`, error);
    return null;
  }

  return data as Post;
}