"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { Loader2 } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  description?: string
  tags: string[]
  content: string
  status?: string
  published?: boolean
  author?: string
  lang?: string
  scheduledAt?: string | { seconds: number }
}

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError(true)
          }
          return
        }
        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-1px)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !post) {
    notFound()
  }

  // Parse scheduledAt for datetime-local input
  let scheduledAtStr = ""
  if (post.scheduledAt) {
    const date = typeof post.scheduledAt === "object" && "seconds" in post.scheduledAt
      ? new Date(post.scheduledAt.seconds * 1000)
      : new Date(post.scheduledAt as string)
    if (!isNaN(date.getTime())) {
      scheduledAtStr = date.toISOString().slice(0, 16)
    }
  }

  return (
    <PostEditor
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || post.description || "",
        tags: post.tags,
        content: post.content,
        status: (post.status as "draft" | "published" | "scheduled")
          || (post.published ? "published" : "draft"),
        author: post.author || "Giang H\u1ea3i S\u01a1n",
        lang: post.lang || "vi",
        scheduledAt: scheduledAtStr,
      }}
    />
  )
}
