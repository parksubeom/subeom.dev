// src/entities/post/api/get-posts.ts
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getPosts(page: number = 1, limit: number = 5): Promise<Post[]> {
  const supabase = createStaticClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true) // 공개된 글만
    .order("published_at", { ascending: false }) // 최신순
    .range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data as Post[];
}

export async function getTotalPostsCount(): Promise<number> {
  const supabase = createStaticClient();
  
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  if (error) {
    console.error("Error fetching posts count:", error);
    return 0;
  }

  return count || 0;
}