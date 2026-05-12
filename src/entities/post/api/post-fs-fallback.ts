// .env 가 없거나 Supabase 호출이 실패할 때 사용하는 로컬 파일시스템 fallback.
// posts/*.md 의 frontmatter 를 읽어 Post 객체로 변환한다.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post } from "@/entities/post/model/types";

export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

let cached: Post[] | null = null;

export function getAllPostsFromMd(): Post[] {
  if (cached) return cached;

  const dir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(dir)) {
    cached = [];
    return cached;
  }

  const now = new Date().toISOString();
  const rows: Post[] = [];

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      if (!data.slug || !data.title) continue;
      const publishedAt = data.date
        ? new Date(data.date).toISOString()
        : data.published_at
          ? new Date(data.published_at).toISOString()
          : now;
      rows.push({
        id: data.slug,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt ?? null,
        content: content.trim() || null,
        category: data.category ?? null,
        tags: data.tags ?? null,
        featured: data.featured ?? false,
        published: data.published ?? true,
        published_at: publishedAt,
        thumbnail_url: data.thumbnail_url ?? null,
        reading_time: data.reading_time ?? null,
        like_count: 0,
        view_count: 0,
        created_at: publishedAt,
        updated_at: publishedAt,
      } as unknown as Post);
    } catch (e) {
      console.warn(`[post-fs-fallback] failed to parse ${file}:`, e);
    }
  }

  rows.sort((a, b) => {
    const ad = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bd = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bd - ad;
  });

  cached = rows;
  return rows;
}

export function getPostFromMdBySlug(slug: string): Post | null {
  return getAllPostsFromMd().find((p) => p.slug === slug) ?? null;
}

export function getAllTagsFromMd(): string[] {
  const tags = getAllPostsFromMd().flatMap((p) => p.tags ?? []);
  return Array.from(new Set(tags)).sort();
}
