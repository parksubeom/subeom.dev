"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ProjectCard } from "@/entities/project/ui/project-card";
import { ProjectModal } from "@/widgets/portfolio/ui/project-modal"; // ✨ 모달 추가
import type { Project } from "@/entities/project/model/types";
import type { Tables } from "@/type/supabase";

interface FeaturedProjectsProps {
  projects: Project[] | Tables<'projects'>[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | Tables<'projects'> | null>(null); // ✨ 상태 관리 추가

  // Featured된 프로젝트만 최대 4개 보여주기 - useMemo로 최적화
  const displayedProjects = useMemo(() => {
    return projects
      .filter(p => p.featured)
      .slice(0, 4);
  }, [projects]);

  const handleProjectClick = useCallback((project: Project | Tables<'projects'>) => {
    setSelectedProject(project);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
        <Link href="/portfolio">
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                onClick={() => handleProjectClick(project)} // ✨ 클릭 시 모달 열기
                priority={index < 2} // 첫 2개 이미지에 priority 부여 (LCP 최적화)
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ✨ 모달 컴포넌트 추가 */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={handleModalClose} 
      />
    </section>
  );
}