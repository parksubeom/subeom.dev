"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BlogSearch } from "@/features/blog-search/ui/blog-search";
import { PostCard } from "@/entities/post/ui/post-card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Post } from "@/entities/post/model/types";

// Props로 posts를 받도록 수정
interface PostListSectionProps {
  initialPosts: Post[];
  currentPage: number;
  totalPages: number;
  selectedTag?: string;
  allTags: string[];
  allPosts?: Post[]; // 검색어가 있을 때 사용할 모든 포스트
}

export function PostListSection({ initialPosts, currentPage, totalPages, selectedTag, allTags, allPosts }: PostListSectionProps) {
  const [search, setSearch] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 검색어가 변경되면 검색 페이지를 1로 리셋
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim().length === 0) {
      setSearchPage(1);
    } else if (search.trim().length === 0 && value.trim().length > 0) {
      setSearchPage(1);
    }
  };
  
  // 검색어가 있을 때는 allPosts를 사용, 없을 때는 initialPosts 사용
  const postsToFilter = search.trim().length > 0 && allPosts ? allPosts : initialPosts;
  
  const filteredPosts = postsToFilter.filter(post => {
    const searchLower = search.toLowerCase();
    
    const matchTitle = post.title.toLowerCase().includes(searchLower);
    const matchExcerpt = post.excerpt?.toLowerCase().includes(searchLower) || false;
    const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
    
    return matchTitle || matchExcerpt || matchTags;
  });

  // 검색어가 있을 때는 필터링된 결과를 기반으로 클라이언트 사이드 페이지네이션
  // 검색어가 없을 때는 서버에서 받은 totalPages 사용
  const hasSearchQuery = search.trim().length > 0;
  const limit = 5;
  const searchTotalPages = Math.ceil(filteredPosts.length / limit);
  const searchCurrentPage = hasSearchQuery ? searchPage : currentPage;
  const searchStartIndex = (searchCurrentPage - 1) * limit;
  const searchEndIndex = searchStartIndex + limit;
  const paginatedFilteredPosts = hasSearchQuery 
    ? filteredPosts.slice(searchStartIndex, searchEndIndex)
    : filteredPosts;
  
  const effectiveTotalPages = hasSearchQuery ? searchTotalPages : totalPages;
  const effectiveCurrentPage = hasSearchQuery ? searchCurrentPage : currentPage;

  const handlePageChange = (page: number) => {
    if (hasSearchQuery) {
      // 검색어가 있을 때는 클라이언트 사이드 페이지네이션만 업데이트
      setSearchPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    if (selectedTag === tag) {
      // 같은 태그를 다시 클릭하면 필터 해제
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    params.delete("page"); // tag 변경 시 첫 페이지로
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveTag = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("page"); // tag 변경 시 첫 페이지로
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

      <BlogSearch value={search} onChange={handleSearchChange} />

      {/* 모든 태그 목록 */}
      {allTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">태그로 필터링</h2>
            {selectedTag && (
              <button
                onClick={handleRemoveTag}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 self-start sm:self-auto touch-manipulation"
                aria-label="필터 초기화"
              >
                <X className="w-3.5 h-3.5" />
                <span className="sm:inline">필터 초기화</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 -mx-1 px-1">
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "gray"}
                  className={`px-3 py-2 text-sm font-normal cursor-pointer transition-all touch-manipulation min-h-[2.5rem] flex items-center ${
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
                      : "hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                  }`}
                  onClick={() => handleTagClick(tag)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTagClick(tag);
                    }
                  }}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {paginatedFilteredPosts.length > 0 ? (
            paginatedFilteredPosts.map((post) => (
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
      {effectiveTotalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (hasSearchQuery) {
                setSearchPage(prev => Math.max(1, prev - 1));
              } else {
                handlePageChange(effectiveCurrentPage - 1);
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={effectiveCurrentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((page) => {
              // 현재 페이지 주변 2페이지씩만 표시
              if (
                page === 1 ||
                page === effectiveTotalPages ||
                (page >= effectiveCurrentPage - 2 && page <= effectiveCurrentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={effectiveCurrentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (hasSearchQuery) {
                        setSearchPage(page);
                      } else {
                        handlePageChange(page);
                      }
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                );
              } else if (
                page === effectiveCurrentPage - 3 ||
                page === effectiveCurrentPage + 3
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
            onClick={() => {
              if (hasSearchQuery) {
                setSearchPage(prev => Math.min(effectiveTotalPages, prev + 1));
              } else {
                handlePageChange(effectiveCurrentPage + 1);
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={effectiveCurrentPage === effectiveTotalPages}
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