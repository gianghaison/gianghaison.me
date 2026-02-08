import type { Metadata } from "next"
import { getArtworks, getAllCategories, Art } from "@/lib/firebase"
import { ArtGallery } from "@/components/art-gallery"

export const metadata: Metadata = {
  title: "art | gianghaison.me",
  description: "Sketches, paintings, and visual experiments.",
}

// Make this page dynamic - don't generate at build time
export const dynamic = 'force-dynamic'

// Revalidate every 60 seconds
export const revalidate = 60

export default async function ArtPage() {
  let artworks: Art[] = []
  try {
    artworks = await getArtworks()
  } catch (error) {
    console.error('Error fetching artworks:', error)
  }
  const categories = getAllCategories(artworks)

  // Convert Firestore artworks to the format expected by ArtGallery component
  const galleryArtworks = artworks.map((art) => ({
    slug: art.slug,
    title: art.title,
    medium: art.medium,
    category: art.category,
    date: art.createdAt instanceof Date
      ? art.createdAt.toISOString().split('T')[0]
      : new Date((art.createdAt as { seconds: number }).seconds * 1000).toISOString().split('T')[0],
    dimensions: art.dimensions,
    image: art.image,
    description: art.description,
  }))

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

      <ArtGallery artworks={galleryArtworks} categories={categories} />
    </div>
  )
}
