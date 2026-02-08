"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, RefreshCw } from "lucide-react"

interface SiteSettings {
  siteName: string
  siteDescription: string
  authorName: string
  authorEmail: string
  githubUrl: string
}

const defaultSettings: SiteSettings = {
  siteName: "gianghaison.me",
  siteDescription: "Making useful things with code & AI",
  authorName: "Giang Hai Son",
  authorEmail: "hello@gianghaison.me",
  githubUrl: "https://github.com/gianghaison",
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save settings")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleClearCache = async () => {
    setClearing(true)
    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cache")
      }

      alert("Cache cleared successfully! Pages will be rebuilt on next visit.")
    } catch (err) {
      console.error("Clear cache error:", err)
      alert("Failed to clear cache. Please try again.")
    } finally {
      setClearing(false)
    }
  }

  const updateField = <K extends keyof SiteSettings>(field: K, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 pt-16 md:pt-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 pt-16 md:p-8 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Settings</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 border border-primary bg-primary/10 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="max-w-lg p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="max-w-lg space-y-8">
        {/* Site settings */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-sm text-foreground">Site</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateField("siteName", e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Description
              </label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => updateField("siteDescription", e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Author settings */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-sm text-foreground">Author</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={settings.authorName}
                onChange={(e) => updateField("authorName", e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={settings.authorEmail}
                onChange={(e) => updateField("authorEmail", e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                GitHub URL
              </label>
              <input
                type="url"
                value={settings.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="space-y-4">
          <div className="border-b border-destructive/30 pb-2">
            <h2 className="text-sm text-destructive">Danger Zone</h2>
          </div>
          <div className="flex items-center justify-between border border-destructive/20 p-4">
            <div>
              <p className="text-xs text-foreground">Clear all cache</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                This will rebuild all static pages
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              disabled={clearing}
              className="flex items-center gap-1.5 border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              {clearing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {clearing ? "Clearing..." : "Clear Cache"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
