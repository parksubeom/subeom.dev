"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectFilter } from "@/features/project-filter"
import { ProjectCard } from "@/entities/project/ui/project-card"
import { Project } from "@/entities/project/model/types"

interface PortfolioGridProps {
  projects: Project[]
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체")

  // 카테고리별 필터링
  const filteredProjects =
    selectedCategory === "전체"
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* 카테고리 필터 */}
      <ProjectFilter
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

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
              이 카테고리에 해당하는 프로젝트가 없습니다.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

