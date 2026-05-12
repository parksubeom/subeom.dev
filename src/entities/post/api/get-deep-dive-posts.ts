import { createStaticClient } from "@/shared/lib/supabase/static";
import {
  getAllPostsFromMd,
  isSupabaseConfigured,
} from "./post-fs-fallback";
import type { Post } from "@/entities/post/model/types";

export async function getDeepDivePosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return getAllPostsFromMd().filter((p) => p.category === "Engineering");
  }

  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "Engineering")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deep dive posts:", error);
    return getAllPostsFromMd().filter((p) => p.category === "Engineering");
  }

  return data as Post[];
}
