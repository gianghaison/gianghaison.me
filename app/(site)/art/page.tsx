import type { Metadata } from "next"
import { artworks, getAllCategories } from "@/lib/art-data"
import { ArtGallery } from "@/components/art-gallery"

export const metadata: Metadata = {
  title: "art | gianghaison.me",
  description: "Sketches, paintings, and visual experiments.",
}

export default function ArtPage() {
  const categories = getAllCategories()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl text-foreground">
          <span className="text-muted-foreground"># </span>
          art
          <span className="ml-1 inline-block h-5 w-2 bg-primary animate-cursor-blink" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Sketches, paintings, and visual experiments
        </p>
      </header>

      <ArtGallery artworks={artworks} categories={categories} />
    </div>
  )
}
