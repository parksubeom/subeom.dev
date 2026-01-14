"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogSearch } from "@/features/blog-search/ui/blog-search";
import { PostCard } from "@/entities/post/ui/post-card";
import type { Post } from "@/entities/post/model/types";

// Props로 posts를 받도록 수정
interface PostListSectionProps {
  initialPosts: Post[];
}

export function PostListSection({ initialPosts }: PostListSectionProps) {
  const [search, setSearch] = useState("");
  
  const filteredPosts = initialPosts.filter(post => {
    const searchLower = search.toLowerCase();
    
    const matchTitle = post.title.toLowerCase().includes(searchLower);
    const matchExcerpt = post.excerpt?.toLowerCase().includes(searchLower) || false;
    const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
    
    return matchTitle || matchExcerpt || matchTags;
  });

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
    </section>
  );
}