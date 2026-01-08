import { createStaticClient } from "@/shared/lib/supabase/static";

export async function getAllPostSlugs() {
  const supabase = createStaticClient();
  
  // DB에서 실제로 slug 조회
  const { data } = await supabase
    .from("posts")
    .select("slug");

  return data?.map((post) => post.slug) || [];
}