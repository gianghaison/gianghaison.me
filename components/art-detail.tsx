"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Artwork } from "@/lib/art-data"
import { Lightbox } from "@/components/lightbox"

interface ArtDetailProps {
  artwork: Artwork
  previous: Artwork | null
  next: Artwork | null
}

export function ArtDetail({ artwork, previous, next }: ArtDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link
          href="/art"
          className="transition-colors hover:text-primary"
        >
          art
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{artwork.slug}.jpg</span>
      </nav>

      {/* Image */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative block w-full cursor-zoom-in border border-border transition-colors hover:border-primary"
        aria-label={`View ${artwork.title} fullscreen`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
          <Image
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
            priority
          />
        </div>
        <span className="absolute bottom-3 right-3 border border-border bg-background/80 px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          click to expand
        </span>
      </button>

      {/* Metadata */}
      <div className="space-y-1 border border-border p-4">
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
        <p className="text-sm">
          <span className="text-muted-foreground">dimensions: </span>
          <span className="text-foreground">{artwork.dimensions}</span>
        </p>
      </div>

      {/* Description */}
      {artwork.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artwork.description}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {previous ? (
          <Link
            href={`/art/${previous.slug}`}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {"<-"} prev
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/art/${next.slug}`}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            next {"->"}
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* Back link */}
      <div>
        <Link
          href="/art"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          $ cd /art
        </Link>
      </div>

      {/* Lightbox */}
      <Lightbox
        src={artwork.image}
        alt={artwork.title}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
