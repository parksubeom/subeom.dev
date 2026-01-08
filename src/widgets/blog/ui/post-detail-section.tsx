"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { Post } from "@/entities/post/model/types";

// 실제로는 MDX 렌더러가 필요하지만, 일단 내용(content)을 텍스트로 뿌려주는 형태로 구현합니다.
// 추후 'next-mdx-remote' 등을 도입하면 content 부분을 교체하면 됩니다.

interface PostDetailSectionProps {
  post: Post;
}

export function PostDetailSection({ post }: PostDetailSectionProps) {
  // 날짜 포맷팅
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto space-y-12 pb-20">
      {/* Header Area */}
      <div className="space-y-6 text-center md:text-left">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="pl-0 gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight leading-tight break-keep"
        >
          {post.title}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground justify-center md:justify-start"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          {post.reading_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {post.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-normal">
            <Tag className="w-3 h-3 mr-1.5 opacity-70" />
            {tag}
          </Badge>
        ))}
      </div>

      <div className="w-full h-px bg-border/50" />

      {/* Content Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg dark:prose-invert max-w-none break-keep leading-8"
      >
        {/* 임시: content가 줄바꿈되어 보이도록 처리 */}
        {post.content ? (
          <div className="whitespace-pre-wrap">{post.content}</div>
        ) : (
          <p className="text-muted-foreground italic">작성된 내용이 없습니다.</p>
        )}
      </motion.div>
    </article>
  );
}