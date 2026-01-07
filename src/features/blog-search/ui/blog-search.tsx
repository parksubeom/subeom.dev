"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { Post } from "@/entities/post/model/types"
import { cn } from "@/shared/lib/utils"

interface BlogSearchProps {
  posts: Post[]
  onFilteredPostsChange: (filteredPosts: Post[]) => void
}

export function BlogSearch({ posts, onFilteredPostsChange }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 모든 태그 추출
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // 필터링된 게시글
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
      )
    }

    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags?.includes(tag))
      )
    }

    return filtered
  }, [posts, searchQuery, selectedTags])

  // 필터링 결과를 부모에게 전달
  useMemo(() => {
    onFilteredPostsChange(filteredPosts)
  }, [filteredPosts, onFilteredPostsChange])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="게시글 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 태그 필터 */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">태그로 필터링</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedTags.includes(tag) && "bg-primary text-primary-foreground"
                )}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 결과 개수 */}
      <div className="text-sm text-muted-foreground">
        {filteredPosts.length}개의 게시글을 찾았습니다
      </div>
    </div>
  )
}

