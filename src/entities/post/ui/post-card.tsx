"use client";

import { memo, useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, Eye } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import type { Post } from "@/entities/post/model/types";

interface PostCardProps {
  post: Post;
}

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const formattedDate = useMemo(() => {
    return new Date(post.published_at || post.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, [post.published_at, post.created_at]);

  const handleTagClick = useCallback((e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    });
  }, [router]);

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className="group relative flex flex-col gap-3 p-5 -mx-4 rounded-xl hover:bg-card/50 transition-colors border border-transparent hover:border-border/50"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors break-keep">
            {post.title}
          </h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" />
        </div>
        
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* 메타데이터 영역 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground/80 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          
          {post.reading_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.reading_time} min</span>
            </div>
          )}

          {post.view_count !== null && (
             <div className="flex items-center gap-1.5">
               <Eye className="w-3.5 h-3.5" />
               <span>{post.view_count}</span>
             </div>
          )}

          {/* ✨ 태그 리스트 - 클릭 시 해당 tag로 필터링 */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto md:ml-auto mt-2 md:mt-0">
            {post.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="gray"
                className={`text-[10px] px-2 py-0.5 font-normal whitespace-nowrap cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors ${isPending ? "opacity-70" : ""}`}
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
});