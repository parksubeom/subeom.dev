"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Calendar, Users, User, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { Project } from "@/entities/project/model/types";
import type { Tables } from "@/type/supabase";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap"; // 훅 import

interface ProjectModalProps {
  project: Project | Tables<'projects'> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // ✨ useFocusTrap 훅 사용 (기존 useEffect 대체)
  // 반환된 ref를 모달 컨테이너에 연결해줍니다.
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!project || !isOpen) return null;

  if (!('detailInfo' in project) || !project.detailInfo) {
    return null;
  }

  const { detailInfo } = project;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            aria-hidden="true" // 스크린 리더가 배경을 무시하도록 설정
          />

          {/* Modal Container Wrapper (Focus Trap 적용을 위한 ref 연결 없음, 위치 잡기용) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            
            {/* ✨ 실제 모달 컨텐츠 */}
            <motion.div
              ref={modalRef} // ✨ 여기에 ref 연결!
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[85vh] bg-card border border-border/50 rounded-xl shadow-2xl flex flex-col pointer-events-auto focus:outline-none"
              role="dialog" // 접근성 역할 명시
              aria-modal="true" // 모달임을 명시
              aria-labelledby="modal-title" // 제목 연결
              tabIndex={-1} // 프로그램적으로 포커스를 받을 수 있게 설정
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/40">
                <h2 id="modal-title" className="text-2xl font-bold tracking-tight">
                  {project.title}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="rounded-full"
                  aria-label="Close modal" // 접근성 라벨 추가
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. Overview & Meta Info */}
                <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full" aria-hidden="true"/>
                      Overview
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {detailInfo.overview}
                    </p>
                  </div>
                  
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/40 h-fit">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{detailInfo.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{detailInfo.team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{detailInfo.role}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Tech Stack */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code2 className="w-5 h-5" aria-hidden="true" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detailInfo.techStack.map((tech) => (
                      <Badge key={tech} variant="brand" className="px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-border/40" aria-hidden="true" />

                {/* 3. Detail Sections (Markdown Support) */}
                <div className="space-y-10">
                  {detailInfo.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {section.title}
                      </h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {section.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer (Links) */}
              <div className="p-4 border-t border-border/40 bg-muted/10 flex justify-end gap-3 rounded-b-xl">
                {detailInfo.links.github && (
                  <Button variant="outline" asChild>
                    <a href={detailInfo.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {detailInfo.links.demo && (
                  <Button asChild>
                    <a href={detailInfo.links.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}