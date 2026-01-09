"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PostCard } from "@/entities/post/ui/post-card";
import type { Post } from "@/entities/post/model/types";

interface LatestDeepDivesProps {
  posts: Post[];
}

export function LatestDeepDives({ posts }: LatestDeepDivesProps) {
  // 최신순 2개만 노출
  const displayedPosts = posts.slice(0, 2);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Technical Deep Dive</h2>
          <p className="text-muted-foreground">
            기술적 난제를 해결한 엔지니어링 기록입니다.
          </p>
        </div>
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            View Blog <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
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