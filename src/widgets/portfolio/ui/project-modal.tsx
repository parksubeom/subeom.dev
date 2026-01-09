"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Calendar, Users, User, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import type { Project } from "@/entities/project/model/types";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // ESC 키로 닫기 & 바디 스크롤 잠금
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!project || !isOpen) return null;

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
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[85vh] bg-card border border-border/50 rounded-xl shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/40">
                <h2 className="text-2xl font-bold tracking-tight">{project.title}</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. Overview & Meta Info */}
                <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full" />
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
                    <Code2 className="w-5 h-5" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detailInfo.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-border/40" />

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