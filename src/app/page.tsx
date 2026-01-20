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

  const baseUrl = "https://subeomdev.vercel.app";

  // Person JSON-LD 구조화된 데이터
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "박수범",
    alternateName: "Subeom Park",
    jobTitle: "Frontend Developer",
    description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자",
    url: baseUrl,
    sameAs: [
      "https://github.com/parksubeom",
      // 추가 SNS 링크가 있다면 여기에 추가
    ],
    knowsAbout: [
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "Web Development",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "프론트엔드 개발자",
    },
  };

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
    </>
  );
}