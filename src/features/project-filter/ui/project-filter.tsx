"use client"

import { Button } from "@/shared/ui/button"
import { Project } from "@/entities/project/model/types"
import { cn } from "@/shared/lib/utils"

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
    <div 
      role="tablist" 
      aria-label="프로젝트 카테고리 필터"
      className="flex flex-wrap w-full max-w-2xl gap-2"
    >
      {allCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          role="tab"
          aria-selected={selectedCategory === category}
          aria-controls={`category-${category}`}
          className={cn(
            "transition-all",
            selectedCategory === category && "bg-background text-primary shadow-sm"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

