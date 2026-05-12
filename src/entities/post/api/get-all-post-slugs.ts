import { createStaticClient } from "@/shared/lib/supabase/static";
import {
  getAllPostsFromMd,
  isSupabaseConfigured,
} from "./post-fs-fallback";

export async function getAllPostSlugs() {
  if (!isSupabaseConfigured()) {
    return getAllPostsFromMd().map((p) => p.slug);
  }

  const supabase = createStaticClient();
  const { data } = await supabase.from("posts").select("slug");
  return data?.map((post) => post.slug) || [];
}
