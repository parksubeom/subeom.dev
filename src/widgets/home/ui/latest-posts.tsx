"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { Tables } from "@/type/supabase"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { motion } from "framer-motion"

type Post = Tables<'posts'>

interface LatestPostsProps {
  posts: Post[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (posts.length === 0) {
    return (
      <section className="py-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-8">최신 게시글</h2>
          <p className="text-muted-foreground">아직 게시글이 없습니다.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">최신 게시글</h2>
          <Button asChild variant="ghost" className="group">
            <Link href="/blog">
              전체 보기
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
                <Link href={`/blog/${post.slug}`}>
                  {post.thumbnail_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {post.published_at && (
                        <>
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.published_at}>
                            {format(new Date(post.published_at), "yyyy년 M월 d일", { locale: ko })}
                          </time>
                        </>
                      )}
                      {post.reading_time && (
                        <span>· {post.reading_time}분</span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-muted-foreground">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {post.tags && post.tags.length > 0 && (
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
