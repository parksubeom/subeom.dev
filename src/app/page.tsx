import { HeroSection } from "@/widgets/home/ui/hero-section";
import { FeaturedProjects } from "@/widgets/home/ui/featured-projects";
import { SkillsSection } from "@/widgets/home/ui/skills-section";
// 👇 이전에 만든 LatestArticles 컴포넌트로 교체 (파일명을 latest-articles.tsx로 바꿨다고 가정)
import { LatestArticles } from "@/widgets/home/ui/latest-articles"; 
import { getProjects } from "@/entities/project/api/get-projects";
import { getRecentPosts } from "@/entities/post/api/get-recent-posts"; // 👈 API 변경

export default async function Home() {
  // 1. 병렬로 데이터 가져오기 (Waterfall 방지)
  const [projects, recentPosts] = await Promise.all([
    getProjects(),
    getRecentPosts(3), // 👈 딥다이브 대신 최신 글 3개 가져오기
  ]);

  return (
    <div className="space-y-32 pb-24">
      {/* Hero */}
      <HeroSection />
      
      {/* Featured Projects */}
      <FeaturedProjects projects={projects} />
      
      {/* Skills */}
      <SkillsSection />

      {/* ✨ Latest Articles Section으로 변경 */}
      <LatestArticles posts={recentPosts} />
    </div>
  );
}