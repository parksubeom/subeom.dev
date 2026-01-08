"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, Eye, ThumbsUp } from "lucide-react"; // 아이콘 추가
import { Badge } from "@/shared/ui/badge";
import type { Post } from "@/entities/post/model/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // 날짜 포맷팅 (YYYY.MM.DD)
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
        
        {/* excerpt (요약)가 있을 때만 표시 */}
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground/80 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          
          {/* reading_time (숫자) 분 처리 */}
          {post.reading_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.reading_time} min</span>
            </div>
          )}

          {/* 조회수 (선택 사항 - 데이터 있으면 표시) */}
          {post.view_count !== null && (
             <div className="flex items-center gap-1.5 ml-auto md:ml-0">
               <Eye className="w-3.5 h-3.5" />
               <span>{post.view_count}</span>
             </div>
          )}

          {/* 태그 리스트 */}
          <div className="flex gap-2 ml-auto">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}