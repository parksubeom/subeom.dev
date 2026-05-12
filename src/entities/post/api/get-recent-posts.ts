import { createStaticClient } from "@/shared/lib/supabase/static";
import {
  getAllPostsFromMd,
  isSupabaseConfigured,
} from "./post-fs-fallback";
import type { Post } from "@/entities/post/model/types";

export async function getRecentPosts(limit: number = 3): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return getAllPostsFromMd().slice(0, limit);
  }

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent posts:", error);
    return getAllPostsFromMd().slice(0, limit);
  }

  return data as Post[];
}
