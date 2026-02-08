import { notFound } from "next/navigation"
import { posts, getPostBySlug } from "@/lib/blog-data"
import { PostEditor } from "@/components/post-editor"

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.slug }))
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = getPostBySlug(id)

  if (!post) notFound()

  return (
    <PostEditor
      initialData={{
        title: post.title,
        slug: post.slug,
        description: post.description,
        tags: post.tags,
        content: post.content,
        status: "published",
      }}
    />
  )
}
