import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { Tables } from "@/type/supabase"
import { format } from "date-fns"

type Post = Tables<'posts'>

interface LatestPostsProps {
  posts: Post[]
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (posts.length === 0) {
    return (
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Latest Posts</h2>
          <p className="text-muted-foreground">No posts yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
          <Button asChild variant="ghost">
            <Link href="/blog">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                {post.thumbnail_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    {post.published_at && (
                      <>
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.published_at}>
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </time>
                      </>
                    )}
                    {post.reading_time && (
                      <span>· {post.reading_time} min read</span>
                    )}
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription>{post.excerpt}</CardDescription>
                  )}
                </CardHeader>
                {post.tags && post.tags.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

