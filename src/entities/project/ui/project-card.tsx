"use client"

import Link from "next/link"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Project } from "../model/types"
import { cn } from "@/shared/lib/utils"

const projectCardVariants = cva(
  "h-full overflow-hidden transition-shadow group",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        featured: "hover:shadow-xl border-2 border-primary/20",
        compact: "hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProjectCardProps
  extends VariantProps<typeof projectCardVariants> {
  project: Project
  className?: string
}

export function ProjectCard({ project, variant, className }: ProjectCardProps) {
  const techStack = project.tech_stack || []
  const displayTechs = techStack.slice(0, 3)
  const remainingCount = techStack.length - 3

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Link href={`/portfolio/${project.id}`}>
        <Card className={cn(
          projectCardVariants({ variant }),
          "bg-card/50 backdrop-blur-sm border-border/50",
          "hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl",
          "transition-all duration-300"
        )}>
          {project.thumbnail_url && (
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              {project.category && (
                <Badge variant="secondary" className="shrink-0">
                  {project.category}
                </Badge>
              )}
            </div>
            {project.description && (
              <CardDescription className="line-clamp-2 text-muted-foreground">
                {project.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayTechs.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs hover:bg-primary/10 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{remainingCount}
                  </Badge>
                )}
              </div>
            )}
            {project.status && (
              <div className="mt-3">
                <Badge
                  variant={project.status === "completed" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {project.status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

