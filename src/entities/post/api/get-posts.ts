// src/entities/post/api/get-posts.ts
import { createStaticClient } from "@/shared/lib/supabase/static";
import type { Post } from "@/entities/post/model/types";

export async function getPosts(page: number = 1, limit: number = 5, tag?: string): Promise<Post[]> {
  const supabase = createStaticClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true) // 공개된 글만
    .order("published_at", { ascending: false }); // 최신순

  // 태그 필터링 추가
  if (tag) {
    query = query.contains("tags", [tag]); // tags 배열에 해당 tag가 포함된 경우
  }

  const { data, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data as Post[];
}

export async function getTotalPostsCount(tag?: string): Promise<number> {
  const supabase = createStaticClient();
  
  let query = supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  // 태그 필터링 추가
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching posts count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * 모든 공개 포스트를 가져옵니다 (페이지네이션 없음)
 */
export async function getAllPosts(tag?: string): Promise<Post[]> {
  const supabase = createStaticClient();
  
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  // 태그 필터링 추가
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }

  return data as Post[];
}

/**
 * 모든 포스트에서 사용된 고유 태그 목록을 가져옵니다.
 */
export async function getAllTags(): Promise<string[]> {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select("tags")
    .eq("published", true);

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  // 모든 태그를 하나의 배열로 합치고 중복 제거
  const allTags = data
    .flatMap((post) => post.tags || [])
    .filter((tag): tag is string => tag !== null && tag !== undefined);
  
  // 중복 제거 및 정렬
  const uniqueTags = Array.from(new Set(allTags)).sort();

  return uniqueTags;
}