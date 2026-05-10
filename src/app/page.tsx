import { HeroSection } from "@/widgets/home/ui/hero-section";
import { FeaturedProjects } from "@/widgets/home/ui/featured-projects";
import { SkillsSection } from "@/widgets/home/ui/skills-section";
import { LatestArticles } from "@/widgets/home/ui/latest-articles";
import { getProjects } from "@/entities/project/api/get-projects";
import { getRecentPosts } from "@/entities/post/api/get-recent-posts";
import { AiWorkflow } from "@/widgets/home/ui/ai-workflow";
import { SITE_URL, SITE_NAME } from "@/shared/config/site";
import { PROFILE } from "@/shared/config/profile";

// 60초 ISR — Featured Projects DB 변경 시 자동 반영
export const revalidate = 60;

export default async function Home() {
  // 1. 병렬로 데이터 가져오기 (Waterfall 방지)
  const [projects, recentPosts] = await Promise.all([
    getProjects(),
    getRecentPosts(3),
  ]);

  // Person JSON-LD 구조화된 데이터
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    alternateName: ["Subeom Park", SITE_NAME, "subeomdev"],
    jobTitle: PROFILE.role,
    description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자",
    email: PROFILE.email,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    sameAs: [
      PROFILE.links.github,
      PROFILE.links.threads,
    ],
    knowsAbout: [
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "Web Development",
      "Web Performance Optimization",
      "AI-Augmented Development",
    ],
    alumniOf: PROFILE.education.map((edu) => ({
      "@type":
        edu.type === "university" ? "CollegeOrUniversity" : "EducationalOrganization",
      name: edu.name,
    })),
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