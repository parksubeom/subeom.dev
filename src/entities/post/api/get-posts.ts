import { createStaticClient } from "@/shared/lib/supabase/static";
import {
  getAllPostsFromMd,
  getAllTagsFromMd,
  isSupabaseConfigured,
} from "./post-fs-fallback";
import type { Post } from "@/entities/post/model/types";

function filterByTag<T extends { tags: string[] | null }>(
  posts: T[],
  tag?: string,
): T[] {
  if (!tag) return posts;
  return posts.filter((p) => (p.tags ?? []).includes(tag));
}

export async function getPosts(
  page: number = 1,
  limit: number = 5,
  tag?: string,
): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    const all = filterByTag(getAllPostsFromMd(), tag);
    const from = (page - 1) * limit;
    return all.slice(from, from + limit);
  }

  const supabase = createStaticClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    const all = filterByTag(getAllPostsFromMd(), tag);
    return all.slice(from, from + limit);
  }

  return data as Post[];
}

export async function getTotalPostsCount(tag?: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    return filterByTag(getAllPostsFromMd(), tag).length;
  }

  const supabase = createStaticClient();

  let query = supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching posts count:", error);
    return filterByTag(getAllPostsFromMd(), tag).length;
  }

  return count || 0;
}

/**
 * 모든 공개 포스트를 가져옵니다 (페이지네이션 없음)
 */
export async function getAllPosts(tag?: string): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return filterByTag(getAllPostsFromMd(), tag);
  }

  const supabase = createStaticClient();

  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all posts:", error);
    return filterByTag(getAllPostsFromMd(), tag);
  }

  return data as Post[];
}

/**
 * 모든 포스트에서 사용된 고유 태그 목록을 가져옵니다.
 */
export async function getAllTags(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return getAllTagsFromMd();
  }

  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("posts")
    .select("tags")
    .eq("published", true);

  if (error) {
    console.error("Error fetching tags:", error);
    return getAllTagsFromMd();
  }

  const allTags = data
    .flatMap((post) => post.tags || [])
    .filter((tag): tag is string => tag !== null && tag !== undefined);

  return Array.from(new Set(allTags)).sort();
}
