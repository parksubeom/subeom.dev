"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ProjectCard } from "@/entities/project/ui/project-card";
import type { Project } from "@/entities/project/model/types";
import type { Tables } from "@/type/supabase";

// 동적 import로 코드 스플리팅 - 모달은 필요할 때만 로드
const ProjectModal = dynamic(
  () => import("@/widgets/portfolio/ui/project-modal").then(mod => ({ default: mod.ProjectModal })),
  { ssr: false }
);

interface FeaturedProjectsProps {
  projects: Project[] | Tables<'projects'>[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | Tables<'projects'> | null>(null); // ✨ 상태 관리 추가

  // Featured된 프로젝트만 최신순으로 최대 4개 보여주기 - useMemo로 최적화
  const displayedProjects = useMemo(() => {
    return projects
      .filter(p => p.featured)
      .sort((a, b) => {
        // updated_at 기준 최신순
        if (a.updated_at && b.updated_at) {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        // updated_at이 없으면 start_date 기준
        if (a.start_date && b.start_date) {
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        }
        return 0;
      })
      .slice(0, 4);
  }, [projects]);

  // 핸들러 메모이제이션
  const handleProjectClick = useCallback((project: Project | Tables<'projects'>) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
        </div>
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
                onClick={() => handleProjectClick(project)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ✨ 모달 컴포넌트 추가 */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={handleCloseModal} 
      />
    </section>
  );
}