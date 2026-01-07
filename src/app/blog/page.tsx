import { getPosts } from "@/entities/post/api"
import { PostListSection } from "@/widgets/blog"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | 기술 블로그",
  description: "개발 관련 글과 기술적인 내용을 공유합니다",
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">블로그</h1>
        <p className="text-muted-foreground text-lg">
          개발 관련 글과 기술적인 내용을 공유합니다
        </p>
      </div>
      <PostListSection posts={posts} />
    </div>
  )
}

