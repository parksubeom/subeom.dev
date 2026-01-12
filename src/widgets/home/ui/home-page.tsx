import { HeroSection } from "./hero-section"
import { FeaturedProjects } from "./featured-projects"
import { LatestPosts } from "./latest-posts"
import { SkillsSection } from "./skills-section"
import { getFeaturedProjects, getLatestPosts } from "@/lib/supabase/queries"

export async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <LatestPosts posts={latestPosts} />
      <SkillsSection />
    </>
  )
}

