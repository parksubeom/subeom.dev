import { format } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/shared/ui/badge"
import { PostToc } from "@/features/post-toc"
import { PostInteraction } from "@/features/post-interaction"
import { MdxComponent } from "@/shared/mdx/mdx-component"
import { mdxOptions } from "@/shared/mdx/mdx-options"
import { getPosts } from "@/entities/post/api"
import { Post } from "@/entities/post/model/types"

interface PostDetailSectionProps {
  post: Post
}

export async function PostDetailSection({
  post,
}: PostDetailSectionProps) {
  // MDX 소스 직렬화
  const mdxSource = await serialize(post.content || "", {
    ...mdxOptions.mdxOptions,
    parseFrontmatter: true,
  })

  // 이전/다음 게시글 찾기
  const allPosts = await getPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "yyyy년 M월 d일", { locale: ko })
    : null

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          블로그로 돌아가기
        </Link>

        <div className="mb-6">
          {post.category && (
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 상호작용 버튼 */}
        <PostInteraction
          postId={post.id}
          initialLikeCount={post.like_count}
          initialViewCount={post.view_count}
        />
      </div>

      {/* 본문 및 목차 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
        {/* 본문 */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <MdxComponent source={mdxSource} />
        </article>

        {/* 목차 (사이드바) */}
        <aside className="hidden lg:block">
          <PostToc content={post.content || ""} />
        </aside>
      </div>

      {/* 네비게이션 */}
      <div className="border-t mt-12 pt-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <div>
                <div className="text-xs uppercase tracking-wide">이전 글</div>
                <div className="font-medium">{prevPost.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors sm:ml-auto sm:text-right"
            >
              <div>
                <div className="text-xs uppercase tracking-wide">다음 글</div>
                <div className="font-medium">{nextPost.title}</div>
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
