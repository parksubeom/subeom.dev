import { HeroSection } from "./hero-section"
import { FeaturedProjects } from "./featured-projects"
import { LatestPosts } from "./latest-posts"
import { SkillsSection } from "./skills-section"
import { getFeaturedProjects, getLatestPosts, getProfile } from "@/lib/supabase/queries"

export async function HomePage() {
  const [featuredProjects, latestPosts, profile] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
    getProfile(),
  ])

  return (
    <>
      <HeroSection
        name={profile?.name}
        title={profile?.title}
        bio={profile?.bio}
      />
      <FeaturedProjects projects={featuredProjects} />
      <LatestPosts posts={latestPosts} />
      <SkillsSection skills={profile?.skills} />
    </>
  )
}

