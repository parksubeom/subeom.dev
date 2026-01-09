"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Folder } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import type { Project } from "@/entities/project/model/types";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const displayTechStack = project.detailInfo?.techStack || project.tech_stack || [];
  

  const previewUrl = project.thumbnail_url; 
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
        
        {/* 썸네일 영역 */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted/50 border-b border-border/50">
          
          {/* 1. 기본 정적 이미지 (항상 렌더링) */}
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isHovered && previewUrl ? "opacity-0" : "opacity-100"
              }`}
              // 이미지가 로드되지 않을 경우를 대비해 priority 설정 (LCP 개선)
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <Folder className="w-12 h-12" />
            </div>
          )}

          {/* 2. 호버 시 보여줄 영상 */}
          {previewUrl && (
            <video
              ref={videoRef}
              src={previewUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* 카테고리 배지 */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-border/20 shadow-sm">
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
              <Badge key={tech} variant="secondary" className="text-xs font-normal border-border/50">
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