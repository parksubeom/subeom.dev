import { notFound } from "next/navigation";
import { PostDetailSection } from "@/widgets/blog/ui/post-detail-section";
import { getAllPostSlugs } from "@/entities/post/api/get-all-post-slugs";
import { getPostBySlug } from "@/entities/post/api/get-post-by-slug";

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

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      authors: ["Subeom Park"],
    },
  };
}

// 3. 페이지 렌더링
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <PostDetailSection post={post} />;
}