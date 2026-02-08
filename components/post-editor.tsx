"use client"

import { useState, useCallback } from "react"
import { Save, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface PostEditorProps {
  initialData?: {
    title: string
    slug: string
    description: string
    tags: string[]
    content: string
    status: "published" | "draft"
  }
  isNew?: boolean
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function PostEditor({ initialData, isNew }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  )
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(", ") ?? ""
  )
  const [content, setContent] = useState(initialData?.content ?? "")
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status ?? "draft"
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      if (isNew || !initialData) {
        setSlug(generateSlug(value))
      }
    },
    [isNew, initialData]
  )

  const handleSave = useCallback(async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  // Count lines for line numbers
  const lines = content.split("\n")

  return (
    <div className="flex h-[calc(100vh-1px)] flex-col">
      {/* Top bar */}
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/posts"
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to posts
            </Link>
            <div className="flex items-center gap-3">
              {!isNew && (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-1.5 border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 border border-primary bg-primary/10 px-4 py-1.5 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                <Save className="h-3 w-3" />
                {saving ? "Saving..." : saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            className="w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Tags */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">tags:</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ai, dev, tools"
                className="w-40 border-b border-border bg-transparent py-0.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Tag pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    --{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Status toggle */}
            <button
              type="button"
              onClick={() =>
                setStatus((s) => (s === "draft" ? "published" : "draft"))
              }
              className={`ml-auto px-2 py-0.5 text-[10px] ${
                status === "published"
                  ? "border border-primary/30 bg-primary/10 text-primary"
                  : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
              }`}
            >
              {status}
            </button>
          </div>
        </div>
      </div>

      {/* Split editor / preview */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Editor pane */}
        <div className="flex min-h-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-4 py-2">
            <span className="text-[10px] text-muted-foreground">
              editor.md
            </span>
          </div>
          <div className="flex min-h-0 flex-1">
            {/* Line numbers */}
            <div className="flex w-10 shrink-0 flex-col items-end border-r border-border bg-card px-2 pt-3 text-[10px] leading-[1.7] text-muted-foreground/40 select-none">
              {lines.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in markdown..."
              className="min-h-0 flex-1 resize-none bg-card p-3 text-xs leading-[1.7] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border px-4 py-2">
            <span className="text-[10px] text-muted-foreground">
              preview.html
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-xs text-muted-foreground/50">
                Preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">slug:</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-60 border-b border-border bg-transparent py-0.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              excerpt:
            </span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              className="flex-1 border-b border-border bg-transparent py-0.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-background p-6">
            <h2 className="mb-2 text-sm text-foreground">Confirm Delete</h2>
            <p className="mb-6 text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{title}&rdquo;? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(false)}
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
