"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Pencil, Trash2, Plus, X, Upload, Loader2 } from "lucide-react"

const categoryOptions = ["watercolor", "digital", "sketch"] as const

interface Artwork {
  id: string
  slug: string
  title: string
  medium: string
  category: "watercolor" | "digital" | "sketch"
  dimensions: string
  description?: string
  image: string
  date: string
}

interface ArtFormData {
  title: string
  slug: string
  medium: string
  category: "watercolor" | "digital" | "sketch"
  dimensions: string
  description: string
  image: string
  tags: string[]
}

const emptyForm: ArtFormData = {
  title: "",
  slug: "",
  medium: "watercolor on paper",
  category: "watercolor",
  dimensions: "",
  description: "",
  image: "",
  tags: [],
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function AdminArtPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ArtFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchArtworks()
  }, [])

  async function fetchArtworks() {
    try {
      const response = await fetch("/api/art")
      const data = await response.json()

      if (data.artworks) {
        const items: Artwork[] = data.artworks.map((a: {
          id: string
          slug: string
          title: string
          medium: string
          category: "watercolor" | "digital" | "sketch"
          dimensions: string
          description?: string
          image: string
          createdAt: Date | { seconds: number }
        }) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          medium: a.medium,
          category: a.category,
          dimensions: a.dimensions,
          description: a.description,
          image: a.image,
          date: a.createdAt instanceof Date
            ? a.createdAt.toISOString().split('T')[0]
            : new Date(a.createdAt.seconds * 1000).toISOString().split('T')[0],
        }))
        setArtworks(items)
      }
    } catch (err) {
      console.error("Error fetching artworks:", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = artworks.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError("")
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
      tags: [],
    })
    setEditingId(artwork.id)
    setError("")
    setShowForm(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "art")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      setForm((prev) => ({ ...prev, image: data.url }))
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.image || !form.dimensions) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError("")

    const artData = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      medium: form.medium,
      category: form.category,
      dimensions: form.dimensions,
      description: form.description,
      image: form.image,
      tags: form.tags,
    }

    try {
      let response: Response

      if (editingId) {
        response = await fetch(`/api/art/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artData),
        })
      } else {
        response = await fetch("/api/art", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artData),
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save artwork")
      }

      setShowForm(false)
      fetchArtworks()
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Failed to save artwork")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/art/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete artwork")
      }

      setArtworks(artworks.filter((a) => a.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete artwork")
    } finally {
      setDeleting(false)
    }
  }

  const updateField = <K extends keyof ArtFormData>(field: K, value: ArtFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === "title" && !editingId) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value as string) }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 pt-16 md:pt-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
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
          <span>Category</span>
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
              key={artwork.id}
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
                  onClick={() => setDeleteTarget(artwork)}
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
                {editingId ? "Edit Artwork" : "New Artwork"}
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
              {error && (
                <div className="p-3 text-xs text-red-500 bg-red-500/10 rounded">
                  {error}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Image *
                </label>
                {form.image ? (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-40 object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1 bg-background/80 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center justify-center border border-dashed border-border py-8 cursor-pointer hover:border-muted-foreground transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : (
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload artwork image"}
                      </span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Category dropdown */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value as typeof form.category)}
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medium */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Medium
                </label>
                <input
                  type="text"
                  value={form.medium}
                  onChange={(e) => updateField("medium", e.target.value)}
                  placeholder="e.g. watercolor on paper, digital (Procreate)"
                  className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="mb-1.5 block text-[10px] text-muted-foreground">
                  Dimensions *
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
                disabled={saving || uploading}
                className="flex items-center gap-2 border border-primary bg-primary/10 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
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
              Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;? This action cannot
              be undone.
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
