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
  description: string
  tags: string[]
  content: string
  published: boolean
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

  return (
    <PostEditor
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        description: post.description,
        tags: post.tags,
        content: post.content,
        status: post.published ? "published" : "draft",
      }}
    />
  )
}
