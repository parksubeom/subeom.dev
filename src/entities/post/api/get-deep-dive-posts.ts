import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getDeepDivePosts(): Promise<Post[]> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "Engineering") // 'Engineering' 카테고리만 필터링
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deep dive posts:", error);
    return [];
  }

  return data as Post[];
}