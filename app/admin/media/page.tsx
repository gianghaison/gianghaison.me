"use client"

import { useState, useRef } from "react"
import { Upload, Copy, Trash2, Check, X, ImageIcon } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  url: string
  size: string
  date: string
  thumbnail: string
}

const mockMedia: MediaItem[] = [
  {
    id: "1",
    name: "ho-xuan-huong.jpg",
    url: "/art/ho-xuan-huong.jpg",
    size: "2.4 MB",
    date: "2026-02-01",
    thumbnail: "/art/ho-xuan-huong.jpg",
  },
  {
    id: "2",
    name: "saigon-rain.jpg",
    url: "/art/saigon-rain.jpg",
    size: "3.1 MB",
    date: "2026-01-18",
    thumbnail: "/art/saigon-rain.jpg",
  },
  {
    id: "3",
    name: "old-quarter-sketch.jpg",
    url: "/art/old-quarter-sketch.jpg",
    size: "1.8 MB",
    date: "2026-01-10",
    thumbnail: "/art/old-quarter-sketch.jpg",
  },
  {
    id: "4",
    name: "mekong-delta.jpg",
    url: "/art/mekong-delta.jpg",
    size: "2.7 MB",
    date: "2025-12-20",
    thumbnail: "/art/mekong-delta.jpg",
  },
  {
    id: "5",
    name: "street-food-dusk.jpg",
    url: "/art/street-food-dusk.jpg",
    size: "2.9 MB",
    date: "2025-12-05",
    thumbnail: "/art/street-food-dusk.jpg",
  },
  {
    id: "6",
    name: "morning-coffee.jpg",
    url: "/art/morning-coffee.jpg",
    size: "1.2 MB",
    date: "2025-11-15",
    thumbnail: "/art/morning-coffee.jpg",
  },
]

export default function AdminMediaPage() {
  const [media] = useState<MediaItem[]>(mockMedia)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-6 p-6 pt-16 md:p-8 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Media</h1>
        <span className="text-xs text-muted-foreground">
          {media.length} files
        </span>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed py-10 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        <Upload
          className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
        />
        <div className="text-center">
          <p className="text-xs text-foreground">
            Drop images here or click to upload
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            JPG, PNG, WebP up to 10MB
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          aria-label="Upload images"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div
            key={item.id}
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
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                <ImageIcon className="h-5 w-5 text-foreground" />
              </div>
            </button>
            {/* Meta */}
            <div className="border-t border-border p-3">
              <p className="truncate text-[10px] text-foreground">
                {item.name}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {item.size}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(item)}
                    className="p-0.5 text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`Copy URL for ${item.name}`}
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>

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
              src={previewItem.thumbnail || "/placeholder.svg"}
              alt={previewItem.name}
              className="max-h-[60vh] w-auto border border-border object-contain"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">{previewItem.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {previewItem.size} &middot; {previewItem.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyUrl(previewItem)}
                className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {copiedId === previewItem.id ? (
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
    </div>
  )
}
