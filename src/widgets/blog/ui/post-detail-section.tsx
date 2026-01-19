"use client";

import { useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { PostToc } from "@/features/post-toc";
import { ViewCounter } from "@/components/view-counter";
import { Comments } from "@/widgets/comments";
import type { Post } from "@/entities/post/model/types";
// ✨ 추가됨: 마크다운 뷰어 컴포넌트 import
import { MarkdownViewer } from "@/shared/ui/markdown-viewer";

interface PostDetailSectionProps {
  post: Post;
}

export function PostDetailSection({ post }: PostDetailSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // 날짜 포맷팅 메모이제이션
  const formattedDate = useMemo(() => {
    return new Date(post.published_at || post.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [post.published_at, post.created_at]);

  const handleTagClick = useCallback((tag: string) => {
    startTransition(() => {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    });
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <article className="max-w-3xl mx-auto space-y-12">
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
            <ViewCounter 
              slug={post.slug} 
              initialViews={post.view_count || 0}
            />
          </motion.div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {post.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="gray"
              className={`px-3 py-1 text-sm font-normal cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors ${isPending ? "opacity-70" : ""}`}
              onClick={() => handleTagClick(tag)}
            >
              <Tag className="w-3 h-3 mr-1.5 opacity-70" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="w-full h-px bg-border/50" />

        {/* TOC - 모바일/태블릿: 상단에 표시 */}
        <div className="lg:hidden border-b border-border/50 pb-6">
          <PostToc content={post.content || ""} />
        </div>

        {/* Content Area with TOC */}
        <div className="relative">
          {/* TOC - 데스크탑: 화면에 고정 (페이지 스크롤과 무관하게 같은 위치) */}
          <div className="hidden lg:block fixed top-24 left-1/2 translate-x-[calc(384px+2rem)] w-64">
            <PostToc content={post.content || ""} />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="min-h-[300px]" 
          >
            {post.content ? (
              <MarkdownViewer content={post.content} />
            ) : (
              <p className="text-muted-foreground italic">작성된 내용이 없습니다.</p>
            )}
          </motion.div>
        </div>

        {/* Comments Section */}
        <Comments />
      </article>
    </div>
  );
}