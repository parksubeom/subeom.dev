"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PostCard } from "@/entities/post/ui/post-card";
import type { Post } from "@/entities/post/model/types";

interface LatestArticlesProps {
  posts: Post[];
}

export function LatestArticles({ posts }: LatestArticlesProps) {
  // 💡 수정 사항: 
  // 1. slice(0, 2)를 제거하여 부모 컴포넌트에서 넘겨준 개수(3개)만큼 그대로 보여줍니다.
  // 2. 만약 여기서 강제로 개수를 자르고 싶다면 posts.slice(0, 3)으로 변경하세요.
  
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            지속적인 학습과 성장을 기록합니다. 최근 작성한 블로그 글들을 확인해보세요.
          </p>
        </div>
        
        <Link href="/blog">
          <Button variant="ghost" className="gap-2 group">
            View all posts 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-muted-foreground py-10 text-center bg-muted/30 rounded-xl border border-border/50">
            아직 등록된 게시물이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}