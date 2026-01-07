import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { getProjects } from "@/entities/project/api"
import { Project } from "@/entities/project/model/types"
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectDetailProps {
  project: Project
}

export async function ProjectDetail({
  project,
}: ProjectDetailProps) {
  // 이전/다음 프로젝트 찾기
  const allProjects = await getProjects()
  const currentIndex = allProjects.findIndex((p) => p.id === project.id)
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  const formatDate = (date: string | null) => {
    if (!date) return null
    return format(new Date(date), "yyyy년 M월", { locale: ko })
  }

  const startDate = formatDate(project.start_date)
  const endDate = formatDate(project.end_date)
  const dateRange =
    startDate && endDate
      ? `${startDate} - ${endDate}`
      : startDate
        ? `${startDate} 시작`
        : null

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="mb-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            포트폴리오로 돌아가기
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg text-muted-foreground mb-4">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {dateRange && <span>{dateRange}</span>}
              {project.category && (
                <Badge variant="secondary">{project.category}</Badge>
              )}
              {project.status && (
                <Badge
                  variant={project.status === "completed" ? "default" : "secondary"}
                >
                  {project.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {project.demo_url && (
              <Button asChild variant="default">
                <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  데모 보기
                </Link>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline">
                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  코드 보기
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech, index) => (
              <Badge key={index} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Section */}
      {project.images && project.images.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">갤러리</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-video w-full overflow-hidden rounded-lg border"
              >
                <Image
                  src={imageUrl}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description Section */}
      {project.long_description && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">프로젝트 소개</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.long_description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="border-t pt-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.id}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <div>
                <div className="text-xs uppercase tracking-wide">이전 프로젝트</div>
                <div className="font-medium">{prevProject.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextProject && (
            <Link
              href={`/portfolio/${nextProject.id}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:text-right"
            >
              <div>
                <div className="text-xs uppercase tracking-wide">다음 프로젝트</div>
                <div className="font-medium">{nextProject.title}</div>
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

