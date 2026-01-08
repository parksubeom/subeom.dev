import { PostListSection } from "@/widgets/blog";
import { getPosts } from "@/entities/post/api/get-posts";

export const metadata = {
  title: "Blog",
  description: "기술 블로그",
};

// Next.js 14 서버 컴포넌트
export default async function BlogPage() {
  // DB에서 데이터 가져오기 (Real Data)
  const posts = await getPosts();

  return <PostListSection initialPosts={posts} />;
}