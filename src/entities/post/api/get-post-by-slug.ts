import { createStaticClient } from "@/shared/lib/supabase/static";
import {
  getPostFromMdBySlug,
  isSupabaseConfigured,
} from "./post-fs-fallback";
import type { Post } from "@/entities/post/model/types";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return getPostFromMdBySlug(slug);
  }

  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching post (${slug}):`, error);
    return getPostFromMdBySlug(slug);
  }

  return data as Post;
}
