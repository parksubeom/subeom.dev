"use client"

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Project } from "@/entities/project/model/types"

interface ProjectFilterProps {
  projects: Project[]
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

export function ProjectFilter({
  projects,
  onCategoryChange,
  selectedCategory,
}: ProjectFilterProps) {
  // 모든 카테고리 추출 (중복 제거)
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean) as string[])
  )
  const allCategories = ["전체", ...categories]

  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="flex flex-wrap w-full max-w-2xl gap-2">
        {allCategories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

