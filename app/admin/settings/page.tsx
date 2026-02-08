"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("gianghaison.me")
  const [siteDescription, setSiteDescription] = useState(
    "Making useful things with code & AI"
  )
  const [authorName, setAuthorName] = useState("Giang Hai Son")
  const [authorEmail, setAuthorEmail] = useState("hello@gianghaison.me")
  const [githubUrl, setGithubUrl] = useState("https://github.com/gianghaison")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          <Save className="h-3 w-3" />
          {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

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
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Description
              </label>
              <input
                type="text"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
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
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] text-muted-foreground">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
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
              className="border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              Clear Cache
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
