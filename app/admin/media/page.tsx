"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Copy, Trash2, Check, X, ImageIcon, Loader2 } from "lucide-react"

interface MediaItem {
  key: string
  url: string
  size: number
  lastModified: Date | string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [folder, setFolder] = useState<"blog" | "art">("blog")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [folder])

  async function fetchMedia() {
    setLoading(true)
    try {
      const response = await fetch(`/api/upload?folder=${folder}`)
      const data = await response.json()

      if (data.files) {
        setMedia(data.files)
      }
    } catch (err) {
      console.error("Error fetching media:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Upload failed")
        }
      }

      fetchMedia()
    } catch (err) {
      console.error("Upload error:", err)
      alert(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/upload?key=${encodeURIComponent(deleteTarget.key)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      setMedia(media.filter((m) => m.key !== deleteTarget.key))
      setDeleteTarget(null)
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete file")
    } finally {
      setDeleting(false)
    }
  }

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url)
    setCopiedKey(item.key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6 p-6 pt-16 md:p-8 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Media</h1>
        <div className="flex items-center gap-4">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value as "blog" | "art")}
            className="border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="blog">Blog</option>
            <option value="art">Art</option>
          </select>
          <span className="text-xs text-muted-foreground">
            {media.length} files
          </span>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed py-10 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <Upload
            className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
          />
        )}
        <div className="text-center">
          <p className="text-xs text-foreground">
            {uploading ? "Uploading..." : "Drop images here or click to upload"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            JPG, PNG, WebP up to 10MB • Auto-converted to WebP
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
          aria-label="Upload images"
          disabled={uploading}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : media.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          No files in {folder} folder
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.key}
              className="group border border-border bg-card transition-colors hover:border-primary/50"
            >
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="relative aspect-square w-full overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.key.split('/').pop() || 'Image'}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <ImageIcon className="h-5 w-5 text-foreground" />
                </div>
              </button>
              {/* Meta */}
              <div className="border-t border-border p-3">
                <p className="truncate text-[10px] text-foreground">
                  {item.key.split('/').pop()}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {formatFileSize(item.size)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(item)}
                      className="p-0.5 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`Copy URL for ${item.key}`}
                    >
                      {copiedKey === item.key ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Delete ${item.key}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {formatDate(item.lastModified)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setPreviewItem(null)}
            className="absolute top-4 right-4 border border-border p-2 text-foreground transition-colors hover:bg-secondary"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="max-h-[80vh] max-w-3xl px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewItem.url}
              alt={previewItem.key.split('/').pop() || 'Image'}
              className="max-h-[60vh] w-auto border border-border object-contain"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">{previewItem.key.split('/').pop()}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(previewItem.size)} &middot; {formatDate(previewItem.lastModified)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyUrl(previewItem)}
                className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {copiedKey === previewItem.key ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-background p-6">
            <h2 className="mb-2 text-sm text-foreground">Confirm Delete</h2>
            <p className="mb-6 text-xs text-muted-foreground">
              Are you sure you want to delete &ldquo;{deleteTarget.key.split('/').pop()}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 border border-destructive px-4 py-2 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-3 w-3 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
