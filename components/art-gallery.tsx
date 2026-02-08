"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Artwork } from "@/lib/art-data"

interface ArtGalleryProps {
  artworks: Artwork[]
  categories: string[]
}

export function ArtGallery({ artworks, categories }: ArtGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? artworks.filter((a) => a.category === activeCategory)
    : artworks

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <nav aria-label="Filter artworks by category" className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`text-sm transition-colors ${
            activeCategory === null
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          --all
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`text-sm transition-colors ${
              activeCategory === cat
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            --{cat}
          </button>
        ))}
      </nav>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((artwork) => (
          <Link
            key={artwork.slug}
            href={`/art/${artwork.slug}`}
            className="group block border border-border transition-colors hover:border-primary"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-[filter] duration-300 group-hover:brightness-110"
                loading="lazy"
              />
            </div>
            <div className="space-y-1 border-t border-border p-4">
              <p className="text-sm">
                <span className="text-muted-foreground">title: </span>
                <span className="text-primary">{`"${artwork.title}"`}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">medium: </span>
                <span className="text-foreground">{artwork.medium}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">date: </span>
                <span className="text-foreground">{artwork.date}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No artworks found for --{activeCategory}
        </p>
      )}
    </div>
  )
}
