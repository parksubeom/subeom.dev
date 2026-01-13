"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { ProjectCard } from "@/entities/project/ui/project-card";
import { ProjectModal } from "@/widgets/portfolio/ui/project-modal";
import type { Project } from "@/entities/project/model/types";
import { cn } from "@/shared/lib/utils";

// ✨ Props 인터페이스 정의
interface PortfolioGridProps {
  initialProjects: Project[];
}

export function PortfolioGrid({ initialProjects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 카테고리 추출 (Real Data 기반) - useMemo로 최적화
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(
      initialProjects.map((p) => p.category).filter((c): c is string => c !== null)
    ))];
  }, [initialProjects]);

  // 필터링 로직 - useMemo로 최적화
  const filteredProjects = useMemo(() => {
    return initialProjects.filter(
      (project) => activeCategory === "All" || project.category === activeCategory
    );
  }, [initialProjects, activeCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-6 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            비즈니스 문제를 기술로 해결한 경험들입니다. <br className="hidden md:block" />
            작은 토이 프로젝트부터 실무 레벨의 서비스까지 다양한 결과물을 확인해보세요.
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <div 
          role="tablist" 
          aria-label="프로젝트 카테고리 필터"
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls={`category-${category}`}
              className={cn(
                "transition-all",
                activeCategory === category && "bg-background text-primary shadow-sm"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard 
                project={project} 
                onClick={() => handleProjectClick(project)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           해당 카테고리의 프로젝트가 없습니다.
         </div>
      )}

      {/* Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={handleModalClose} 
      />
    </div>
  );
}