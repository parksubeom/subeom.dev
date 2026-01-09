"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/entities/project/ui/project-card"
import { Tables } from "@/type/supabase"

type Project = Tables<'projects'>

interface PortfolioListProps {
  projects: Project[]
}

export function PortfolioList({ projects }: PortfolioListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // 모든 카테고리 추출 (중복 제거)
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean) as string[])
  )
  const allCategories = ["All", ...categories]

  // 카테고리별 필터링
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* 카테고리 필터 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap w-full max-w-2xl gap-2">
          {allCategories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 프로젝트 그리드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


