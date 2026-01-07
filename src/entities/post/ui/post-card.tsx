"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Post } from "../model/types"
import { cn } from "@/shared/lib/utils"

interface PostCardProps {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "yyyy년 M월 d일", { locale: ko })
    : null

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className={cn(
          "h-full overflow-hidden hover:shadow-lg transition-shadow group",
          className
        )}
      >
        {post.thumbnail_url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            {post.category && (
              <Badge variant="secondary" className="shrink-0">
                {post.category}
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 mb-2">{post.title}</CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            {publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at || undefined}>
                  {publishedDate}
                </time>
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time}분</span>
              </div>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

