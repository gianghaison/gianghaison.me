"use client"

import { useState } from "react"
import { Search, Pencil, Trash2, Plus, X, Upload } from "lucide-react"
import { artworks as allArtworks, type Artwork } from "@/lib/art-data"

const mediumOptions = ["watercolor", "digital", "sketch", "oil", "mixed"]

interface ArtFormData {
  title: string
  slug: string
  medium: string
  category: string
  dimensions: string
  description: string
  image: string
}

const emptyForm: ArtFormData = {
  title: "",
  slug: "",
  medium: "watercolor",
  category: "watercolor",
  dimensions: "",
  description: "",
  image: "",
}

export default function AdminArtPage() {
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<ArtFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const filtered = allArtworks.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setForm(emptyForm)
    setEditingSlug(null)
    setShowForm(true)
  }

  const openEdit = (artwork: Artwork) => {
    setForm({
      title: artwork.title,
      slug: artwork.slug,
      medium: artwork.medium,
      category: artwork.category,
      dimensions: artwork.dimensions,
      description: artwork.description || "",
      image: artwork.image,
    })
    setEditingSlug(artwork.slug)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setShowForm(false)
  }

  const updateField = (field: keyof ArtFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6 p-6 pt-16 md:p-8 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Art</h1>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 border border-primary px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-3 w-3" />
          New Artwork
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search artworks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-card py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="border border-border">
        <div className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-xs text-muted-foreground">
          <span>Title</span>
          <span>Medium</span>
          <span>Dimensions</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-muted-foreground">
            No artworks found.
          </div>
        ) : (
          filtered.map((artwork) => (
            <div
              key={artwork.slug}
              className="grid grid-cols-[1fr_120px_100px_100px_80px] items-center gap-4 border-b border-border px-5 py-3 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => openEdit(artwork)}
                className="truncate text-left text-xs text-foreground transition-colors hover:text-primary"
              >
                {artwork.title}
              </button>
              <span className="text-xs text-muted-foreground">
                {artwork.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {artwork.dimensions}
              </span>
              <span className="text-xs text-muted-foreground">
                {artwork.date}
              </span>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(artwork)}
                  className="p-1 text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`Edit ${artwork.title}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(artwork.slug)}
                  className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Delete ${artwork.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Art form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm text-foreground">
                {editingSlug ? "Edit Artwork" : "New Artwork"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Image
                </label>
                <div className="flex items-center justify-center border border-dashed border-border py-8 cursor-pointer hover:border-muted-foreground transition-colors">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      Click to upload artwork image
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Medium dropdown */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Medium
                </label>
                <select
                  value={form.medium}
                  onChange={(e) => updateField("medium", e.target.value)}
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {mediumOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => updateField("dimensions", e.target.value)}
                  placeholder="e.g. 30x40cm or 3840x2160px"
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Story / Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full resize-none border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                  placeholder="Tell the story behind this piece..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="border border-primary bg-primary/10 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
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
              Are you sure you want to delete this artwork? This action cannot
              be undone.
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
