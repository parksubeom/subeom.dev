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

// 프로젝트 title 매칭으로 "왜 만들었는가 → 결과" 한 줄을 카드 위에 띄움.
// .md frontmatter 의 title 과 일치해야 함.
const WHY_BY_TITLE: Record<string, { pain: string; outcome: string }> = {
  "claude-distill": {
    pain: "Claude 가 어제 배운 걸 까먹어서",
    outcome: "npm weekly 506 · 비용 약 90% 절감 (4단 게이트)",
  },
  "Claude Code Skills Panel": {
    pain: "슬래시 커맨드 30개 외우다가",
    outcome: "Open VSX 3,762 · 평점 5.0 · 4 IDE × 4 언어",
  },
  "AI 협업 포트폴리오 (subeom.dev)": {
    pain: "vercel.app 권한 0 에서 이름 검색 1위 만들고 싶어서",
    outcome: "구조와 의미에 베팅 · WCAG 정공법",
  },
  "A11yGym: 웹 접근성(KWCAG 2.2) 실습 플랫폼": {
    pain: "KWCAG 가이드를 이론으로만 배워서",
    outcome: "Monaco + axe-core 실시간 검증",
  },
};

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

  // Featured된 프로젝트만 최대 4개 보여주기 - useMemo로 최적화
  const displayedProjects = useMemo(() => {
    return projects
      .filter(p => p.featured)
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
          <p className="text-sm text-muted-foreground">
            제가 답답해하던 문제 → 출시까지의 한 줄
          </p>
        </div>
        <Link href="/portfolio">
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {displayedProjects.map((project, index) => {
            const why = WHY_BY_TITLE[project.title];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                {why && (
                  <div className="px-1 text-xs md:text-[13px] text-muted-foreground leading-relaxed break-keep">
                    <span className="text-foreground/80">{why.pain}</span>
                    <span className="mx-1.5 text-primary/70">→</span>
                    <span className="text-foreground/90 font-medium">
                      {why.outcome}
                    </span>
                  </div>
                )}
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              </motion.div>
            );
          })}
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