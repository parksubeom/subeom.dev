import { MetadataRoute } from "next";
import { getAllPosts } from "@/entities/post/api/get-posts";

const baseUrl = "https://subeomdev.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 모든 공개 블로그 포스트 가져오기
  const posts = await getAllPosts();

  // 블로그 포스트 URL 생성
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at || post.created_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 정적 페이지 URL
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...staticPages, ...postEntries];
}

