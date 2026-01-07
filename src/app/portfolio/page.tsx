import { getProjects } from "@/entities/project/api"
import { PortfolioGrid } from "@/widgets/portfolio"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "포트폴리오 | 프로젝트",
  description: "제가 작업한 프로젝트들을 소개합니다",
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">포트폴리오</h1>
        <p className="text-muted-foreground text-lg">
          제가 작업한 프로젝트들을 소개합니다
        </p>
      </div>
      <PortfolioGrid projects={projects} />
    </div>
  )
}
