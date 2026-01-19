import { PostListSection } from "@/widgets/blog";
import { getPosts, getTotalPostsCount, getAllPosts, getAllTags } from "@/entities/post/api/get-posts";

// 개발 환경에서는 캐시 없이 최신 데이터 사용, 프로덕션에서는 60초 ISR
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

export const metadata = {
  title: "Blog",
  description: "기술 블로그",
};

interface BlogPageProps {
  searchParams: { page?: string; tag?: string };
}

// Next.js 14 서버 컴포넌트
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 5;
  const tag = searchParams.tag;
  
  // DB에서 데이터 가져오기 (Real Data)
  // 검색 기능을 위해 모든 포스트도 함께 가져옴
  const [posts, totalCount, allPosts, allTags] = await Promise.all([
    getPosts(currentPage, limit, tag),
    getTotalPostsCount(tag),
    getAllPosts(tag), // 검색 시 사용할 모든 포스트
    getAllTags(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PostListSection 
      initialPosts={posts} 
      currentPage={currentPage}
      totalPages={totalPages}
      selectedTag={tag}
      allTags={allTags}
      allPosts={allPosts}
    />
  );
}