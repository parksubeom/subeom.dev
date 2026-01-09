import { PortfolioGrid } from "@/widgets/portfolio/ui/portfolio-grid";
import { getProjects } from "@/entities/project/api/get-projects";
import { getDeepDivePosts } from "@/entities/post/api/get-deep-dive-posts"; // ✨ 방금 만든 API
import { PostCard } from "@/entities/post/ui/post-card"; // ✨ 기존 블로그 카드 재사용

export const metadata = {
  title: "Portfolio",
  description: "프로젝트 포트폴리오",
};

export default async function PortfolioPage() {
  // 병렬로 데이터 가져오기 (Waterfall 방지)
  const [projects, deepDivePosts] = await Promise.all([
    getProjects(),
    getDeepDivePosts(),
  ]);

  return (
    <div className="space-y-24">
      {/* 1. 프로젝트 섹션 */}
      <PortfolioGrid initialProjects={projects} />
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* 2. 테크니컬 딥다이브 섹션 (블로그 글 연동) */}
      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Technical Deep Dive</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            단순한 구현을 넘어, <strong>기술적 난제</strong>를 해결하고 성능을 최적화했던 엔지니어링 기록입니다.
          </p>
        </div>

        <div className="grid gap-6">
          {deepDivePosts.length > 0 ? (
            deepDivePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-muted-foreground py-10">
              등록된 딥다이브 게시물이 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}