"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { Tables } from "@/type/supabase"
import { motion } from "framer-motion"

type Project = Tables<'projects'>

interface FeaturedProjectsProps {
  projects: Project[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return (
      <section className="py-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-8">추천 프로젝트</h2>
          <p className="text-muted-foreground">아직 추천 프로젝트가 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight mb-12"
        >
          추천 프로젝트
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
                {project.thumbnail_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {project.demo_url && (
                      <Button asChild variant="outline" size="sm" className="flex-1 group/btn">
                        <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          데모
                        </Link>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button asChild variant="outline" size="sm" className="flex-1 group/btn">
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          코드
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
