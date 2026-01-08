// src/entities/post/api/get-posts.ts
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getPosts(): Promise<Post[]> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true) // 공개된 글만
    .order("published_at", { ascending: false }); // 최신순

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data as Post[];
}