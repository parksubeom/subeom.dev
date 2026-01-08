"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import type { Project } from "@/entities/project/model/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
        {/* 썸네일 영역 */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted/50 border-b border-border/50">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <Folder className="w-12 h-12" />
            </div>
          )}
          
          {/* 카테고리 배지 (값이 있을 때만 표시) */}
          {project.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-border/20 shadow-sm">
                {project.category}
              </Badge>
            </div>
          )}
        </div>

        {/* 컨텐츠 영역 */}
        <CardContent className="flex-1 p-5 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
          
          {/* 기술 스택 (Null 체크) */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack?.slice(0, 5).map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="text-xs font-normal border-primary/20 text-muted-foreground bg-primary/5"
              >
                {tech}
              </Badge>
            ))}
            {(project.tech_stack?.length || 0) > 5 && (
               <span className="text-xs text-muted-foreground self-center">
                 +{project.tech_stack!.length - 5}
               </span>
            )}
          </div>
        </CardContent>

        {/* 하단 액션 버튼 */}
        <CardFooter className="p-5 pt-0 flex gap-3 mt-auto">
          {project.github_url && (
            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
              <Link href={project.github_url} target="_blank">
                <Github className="w-4 h-4" />
                Code
              </Link>
            </Button>
          )}
          {project.demo_url && (
            <Button size="sm" className="flex-1 gap-2" asChild>
              <Link href={project.demo_url} target="_blank">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}