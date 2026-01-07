import { notFound } from "next/navigation"
import { getPostBySlug, getAllPostSlugs } from "@/entities/post/api"
import { PostDetailSection } from "@/widgets/blog"
import { Metadata } from "next"

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다",
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || post.description || undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || !post.content) {
    notFound()
  }

  return <PostDetailSection post={post} />
}

