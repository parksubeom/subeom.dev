"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BlogSearch } from "@/features/blog-search/ui/blog-search";
import { PostCard } from "@/entities/post/ui/post-card";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/entities/post/model/types";

// Props로 posts를 받도록 수정
interface PostListSectionProps {
  initialPosts: Post[];
  currentPage: number;
  totalPages: number;
}

export function PostListSection({ initialPosts, currentPage, totalPages }: PostListSectionProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const filteredPosts = initialPosts.filter(post => {
    const searchLower = search.toLowerCase();
    
    const matchTitle = post.title.toLowerCase().includes(searchLower);
    const matchExcerpt = post.excerpt?.toLowerCase().includes(searchLower) || false;
    const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
    
    return matchTitle || matchExcerpt || matchTags;
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-8 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground text-lg">
          개발 경험과 기술적인 고민들을 기록합니다.
        </p>
      </motion.div>

      <BlogSearch value={search} onChange={setSearch} />

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <PostCard post={post} />
                <div className="h-px bg-border/40 my-2" /> 
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              검색 결과가 없습니다.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // 현재 페이지 주변 2페이지씩만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}