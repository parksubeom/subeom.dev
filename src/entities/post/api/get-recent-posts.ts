// src/entities/post/api/get-recent-posts.ts
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getRecentPosts(limit: number = 3): Promise<Post[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)       // 발행된 글만
    .order("published_at", { ascending: false }) // 최신순 정렬
    .limit(limit);               // 개수 제한 (기본 3개)

  if (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }

  return data as Post[];
}