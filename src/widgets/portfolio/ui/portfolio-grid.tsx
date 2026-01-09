"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ProjectCard } from "@/entities/project/ui/project-card";
import { ProjectModal } from "@/widgets/portfolio/ui/project-modal";
import type { Project } from "@/entities/project/model/types";

// ✨ Props 인터페이스 정의
interface PortfolioGridProps {
  initialProjects: Project[];
}

export function PortfolioGrid({ initialProjects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 카테고리 추출 (Real Data 기반)
  // category가 null이 아닌 것만 추출하고 중복 제거
  const categories = ["All", ...Array.from(new Set(
    initialProjects.map((p) => p.category).filter((c): c is string => c !== null)
  ))];

  // 필터링 로직
  const filteredProjects = initialProjects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

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

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="bg-muted/50 backdrop-blur-sm p-1 inline-flex flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
                onClick={() => setSelectedProject(project)} 
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
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}