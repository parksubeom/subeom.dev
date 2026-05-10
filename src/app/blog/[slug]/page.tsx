import { notFound } from "next/navigation";
import { PostDetailSection } from "@/widgets/blog/ui/post-detail-section";
import { getAllPostSlugs } from "@/entities/post/api/get-all-post-slugs";
import { getPostBySlug } from "@/entities/post/api/get-post-by-slug";
import { SITE_URL, SITE_NAME, SITE_LOCALE, TWITTER_HANDLE } from "@/shared/config/site";
import { PROFILE } from "@/shared/config/profile";

// 개발 환경에서는 캐시 없이 최신 데이터 사용, 프로덕션에서는 60초 ISR
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

interface Props {
  params: {
    slug: string;
  };
}

// 1. SSG를 위한 정적 경로 생성 (이제 에러가 안 날 것입니다)
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// 2. 메타데이터 생성
export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.thumbnail_url
    ? `${SITE_URL}${post.thumbnail_url}`
    : `${SITE_URL}/opengraph-image`;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    keywords: post.tags || [],
    authors: [{ name: PROFILE.name, url: SITE_URL }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: postUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.published_at || post.created_at,
      authors: [PROFILE.name],
      tags: post.tags || [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: [ogImage],
    },
  };
}

// 3. 페이지 렌더링
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.thumbnail_url
    ? `${SITE_URL}${post.thumbnail_url}`
    : `${SITE_URL}/opengraph-image`;

  // BlogPosting JSON-LD 구조화된 데이터
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: ogImage,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      "@type": "Person",
      name: PROFILE.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: PROFILE.name,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags?.join(", ") || "",
    articleSection: "Blog",
    inLanguage: "ko-KR",
  };

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <PostDetailSection post={post} />
    </>
  );
}