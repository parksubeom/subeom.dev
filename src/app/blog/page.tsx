import { PostListSection } from "@/widgets/blog";
import { getPosts, getTotalPostsCount } from "@/entities/post/api/get-posts";

// 개발 환경에서는 캐시 없이 최신 데이터 사용, 프로덕션에서는 60초 ISR
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

export const metadata = {
  title: "Blog",
  description: "기술 블로그",
};

interface BlogPageProps {
  searchParams: { page?: string };
}

// Next.js 14 서버 컴포넌트
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 5;
  
  // DB에서 데이터 가져오기 (Real Data)
  const [posts, totalCount] = await Promise.all([
    getPosts(currentPage, limit),
    getTotalPostsCount(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PostListSection 
      initialPosts={posts} 
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}