import { notFound } from "next/navigation"
import { getProjectById, getAllProjectIds } from "@/entities/project/api"
import { ProjectDetail } from "@/widgets/project-detail"
import { Metadata } from "next"

export async function generateStaticParams() {
  const ids = await getAllProjectIds()
  return ids.map((id) => ({
    id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    return {
      title: "프로젝트를 찾을 수 없습니다",
    }
  }

  return {
    title: `${project.title} | 포트폴리오`,
    description: project.description || undefined,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
