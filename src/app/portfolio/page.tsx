import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortfolioGrid } from "@/widgets/portfolio/ui/portfolio-grid";
import { getProjects } from "@/entities/project/api/get-projects";
import { getRecentPosts } from "@/entities/post/api/get-recent-posts"; // ✨ 변경된 API import
import { PostCard } from "@/entities/post/ui/post-card";
import { Button } from "@/shared/ui/button";

export const metadata = {
  title: "Portfolio",
  description: "프로젝트 포트폴리오",
};

export default async function PortfolioPage() {
  // 병렬로 데이터 가져오기 (최신 글 3개 요청)
  const [projects, recentPosts] = await Promise.all([
    getProjects(),
    getRecentPosts(3), // ✨ 최신 글 3개만 가져오기
  ]);

  return (
    <div className="space-y-24">
      {/* 1. 프로젝트 섹션 */}
      <PortfolioGrid initialProjects={projects} />
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* 2. 최신 블로그 글 섹션 */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              지속적인 학습과 성장을 기록합니다. 최근 작성한 블로그 글들을 확인해보세요.
            </p>
          </div>
          
          {/* 전체보기 버튼 추가 (선택사항) */}
          <Button variant="ghost" asChild className="hidden md:flex gap-2 group">
            <Link href="/blog">
              View all posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* 게시글 목록 (3개) */}
        <div className="grid gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-muted-foreground py-10 text-center border rounded-lg bg-muted/20">
              작성된 게시물이 없습니다.
            </div>
          )}
        </div>

        {/* 모바일용 전체보기 버튼 (하단 배치) */}
        <Button variant="outline" asChild className="w-full md:hidden gap-2">
          <Link href="/blog">
            View all posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}