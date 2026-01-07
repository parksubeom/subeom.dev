"use client"

import { useState } from "react"
import { Heart, Eye } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"

interface PostInteractionProps {
  postId: string
  initialLikeCount?: number | null
  initialViewCount?: number | null
  className?: string
}

export function PostInteraction({
  postId,
  initialLikeCount = 0,
  initialViewCount = 0,
  className,
}: PostInteractionProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (isLiked || isLoading) return

    // Optimistic UI 업데이트
    setIsLiked(true)
    setLikeCount((prev) => prev + 1)
    setIsLoading(true)

    try {
      // TODO: Supabase에서 좋아요 수 업데이트
      // const { error } = await supabase
      //   .from('posts')
      //   .update({ like_count: likeCount + 1 })
      //   .eq('id', postId)
      
      // if (error) throw error
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(false)
      setLikeCount((prev) => prev - 1)
      console.error("좋아요 업데이트 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2",
          isLiked && "text-primary"
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            isLiked && "fill-current"
          )}
        />
        <span>{likeCount}</span>
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{initialViewCount || 0}</span>
      </div>
    </div>
  )
}

