import { HeroSection } from "@/widgets/home/ui/hero-section";
import { FeaturedProjects } from "@/widgets/home/ui/featured-projects";
import { SkillsSection } from "@/widgets/home/ui/skills-section";
import { LatestArticles } from "@/widgets/home/ui/latest-articles"; 
import { getProjects } from "@/entities/project/api/get-projects";
import { getRecentPosts } from "@/entities/post/api/get-recent-posts"; 
import { AiWorkflow } from "@/widgets/home/ui/ai-workflow";

export default async function Home() {
  // 1. 병렬로 데이터 가져오기 (Waterfall 방지)
  const [projects, recentPosts] = await Promise.all([
    getProjects(),
    getRecentPosts(3), 
  ]);

  return (
    <div className="space-y-32 pb-24">
      {/* Hero */}
      <HeroSection />
      
      {/* AI kills  */}
      <AiWorkflow />
      
      {/* Skills */}
      <SkillsSection />

      {/* Featured Projects */}
      <FeaturedProjects projects={projects} />
      
      {/* Latest Articles */}
      <LatestArticles posts={recentPosts} />
    </div>
  );
}