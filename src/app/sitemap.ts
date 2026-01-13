import { MetadataRoute } from 'next';
import { getProjects } from '@/entities/project/api/get-projects';
import { getPosts } from '@/entities/post/api/get-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://subeom.dev';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // 동적 페이지: 프로젝트
    const projects = await getProjects();
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // 동적 페이지: 블로그 포스트
    const posts = await getPosts();
    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at || post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...projectPages, ...postPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}

