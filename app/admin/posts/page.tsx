"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Pencil, Trash2 } from "lucide-react"
import { posts as allPosts } from "@/lib/blog-data"

interface PostRow {
  slug: string
  title: string
  date: string
  status: "published" | "draft"
}

const postRows: PostRow[] = allPosts.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  status: i < 3 ? "published" : "draft",
}))

export default function AdminPostsPage() {
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const filtered = postRows.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6 pt-16 md:p-8 md:pt-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="border border-primary px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-card py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="border border-border">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-xs text-muted-foreground">
          <span>Title</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-muted-foreground">
            No posts found.
          </div>
        ) : (
          filtered.map((post) => (
            <div
              key={post.slug}
              className="grid grid-cols-[1fr_100px_100px_80px] items-center gap-4 border-b border-border px-5 py-3 last:border-b-0"
            >
              <Link
                href={`/admin/posts/${post.slug}`}
                className="truncate text-xs text-foreground transition-colors hover:text-primary"
              >
                {post.title}
              </Link>
              <span>
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] ${
                    post.status === "published"
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {post.status}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className="p-1 text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`Edit ${post.title}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(post.slug)}
                  className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Delete ${post.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-background p-6">
            <h2 className="mb-2 text-sm text-foreground">Confirm Delete</h2>
            <p className="mb-6 text-xs text-muted-foreground">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="border border-destructive px-4 py-2 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
