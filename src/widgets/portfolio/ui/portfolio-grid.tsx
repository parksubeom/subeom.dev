"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ProjectCard } from "@/entities/project/ui/project-card";
import type { Project } from "@/entities/project/model/types";

// Supabase 타입에 맞춘 더미 데이터
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "애니스쿨 (Anyschool)",
    description: "얼굴 공개 부담 없이 개성을 표현할 수 있는 랜덤 동물 캐릭터 생성 서비스. AWS Lambda를 활용한 이미지 처리 파이프라인 구축.",
    long_description: null,
    thumbnail_url: null,
    images: [],
    tech_stack: ["React", "AWS Lambda", "S3"],
    category: "Web",
    demo_url: null,
    github_url: "https://github.com/sooknise",
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
    start_date: "2023-02-01",
    end_date: "2023-03-01",
    featured: true,
    status: "Completed",
    order: 1
  },
  {
    id: "2",
    title: "언커버 (Uncover)",
    description: "저작권 문제없는 음원을 찾고 영상과 미리 매칭해보는 스트리밍 플랫폼. Recoil 상태 관리와 Audio/Video 동기화 로직 구현.",
    long_description: null,
    thumbnail_url: null,
    images: [],
    tech_stack: ["React", "TypeScript", "Recoil"],
    category: "Web",
    demo_url: null,
    github_url: "https://github.com/sooknise",
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2023-05-01T00:00:00Z",
    start_date: "2023-05-01",
    end_date: "2023-05-30",
    featured: true,
    status: "Completed",
    order: 2
  },
  {
    id: "3",
    title: "항해플러스 아카이빙",
    description: "LMS 과제 제출 이력 영구 보존 서비스. 결함 허용 PR 매칭 알고리즘 설계 및 4-Layer Fallback 로직 구현.",
    long_description: null,
    thumbnail_url: null,
    images: [],
    tech_stack: ["Node.js", "NestJS", "GitHub API"],
    category: "Backend",
    demo_url: null,
    github_url: "https://github.com/sooknise",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    start_date: "2025-12-01",
    end_date: "2026-01-01",
    featured: true,
    status: "Completed",
    order: 3
  }
];

// 카테고리 목록 추출 (null 제외 및 중복 제거)
const CATEGORIES = ["All", ...Array.from(new Set(
  PROJECTS.map((p) => p.category).filter((c): c is string => c !== null)
))];

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = PROJECTS.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="space-y-12">
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

        {/* 카테고리 필터 Tabs */}
        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="bg-muted/50 backdrop-blur-sm p-1 inline-flex flex-wrap h-auto">
            {CATEGORIES.map((category) => (
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

      {/* 프로젝트 그리드 */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           해당 카테고리의 프로젝트가 없습니다.
         </div>
      )}
    </div>
  );
}