"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Folder } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import type { Project } from "@/entities/project/model/types";
import type { Tables } from "@/type/supabase";

interface ProjectCardProps {
  project: Project | Tables<'projects'>;
  onClick: () => void;
  priority?: boolean; // LCP 최적화를 위한 속성 유지
}

export function ProjectCard({ project, onClick, priority = false }: ProjectCardProps) {
  const displayTechStack = ('detailInfo' in project && project.detailInfo?.techStack) || project.tech_stack || [];

  return (
    <motion.div
      whileHover={{ y: -8 }} // 마우스 올렸을 때 살짝 위로 뜨는 효과만 유지
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onClick={onClick}
    >
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
        
        {/* 썸네일 영역 */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted/50 border-b border-border/50">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105" // 호버 시 이미지 살짝 확대 효과 추가
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <Folder className="w-12 h-12" />
            </div>
          )}

          {/* 카테고리 배지 */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="brand" className="bg-background/80 backdrop-blur-md border-border/20 shadow-sm">
              {project.category}
            </Badge>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <CardContent className="flex-1 p-5 flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="mt-2 text-muted-foreground text-sm line-clamp-3 leading-relaxed break-keep">
              {project.description}
            </p>
          </div>
          
          <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
            {displayTechStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="brand" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
             {displayTechStack.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{displayTechStack.length - 4}
              </span>
            )}
          </div>
        </CardContent>
        
        <div className="p-4 pt-0 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end">
          View Details <ArrowRight className="w-3 h-3" />
        </div>
      </Card>
    </motion.div>
  );
}