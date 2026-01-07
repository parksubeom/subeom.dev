"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BlogSearch } from "@/features/blog-search"
import { PostCard } from "@/entities/post/ui/post-card"
import { Post } from "@/entities/post/model/types"

interface PostListSectionProps {
  posts: Post[]
}

export function PostListSection({ posts }: PostListSectionProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)

  return (
    <div className="space-y-8">
      {/* 검색 및 필터 */}
      <BlogSearch posts={posts} onFilteredPostsChange={setFilteredPosts} />

      {/* 게시글 그리드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filteredPosts.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

