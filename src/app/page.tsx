import { HeroSection } from "@/widgets/home/ui/hero-section";
import { FeaturedProjects } from "@/widgets/home/ui/featured-projects";
import { SkillsSection } from "@/widgets/home/ui/skills-section";
import { LatestDeepDives } from "@/widgets/home/ui/latest-deep-dives"; // ✨ 위젯 추가
import { getProjects } from "@/entities/project/api/get-projects";
import { getDeepDivePosts } from "@/entities/post/api/get-deep-dive-posts"; // ✨ API 추가

export default async function Home() {
  // 1. 병렬로 데이터 가져오기 (Waterfall 방지)
  const [projects, deepDivePosts] = await Promise.all([
    getProjects(),
    getDeepDivePosts(),
  ]);

  return (
    <div className="space-y-32 pb-24">
      {/* Hero */}
      <HeroSection />
      
      {/* Featured Projects */}
      <FeaturedProjects projects={projects} />
      
      {/* Skills */}
      <SkillsSection />

      {/* ✨ Deep Dive Section 복구 */}
      <LatestDeepDives posts={deepDivePosts} />
    </div>
  );
}