import type { Metadata } from "next"
import { getAdminFirestore } from "@/lib/firebase-admin"
import { getAllCategories, Art } from "@/lib/firebase"
import { ArtGallery } from "@/components/art-gallery"

async function fetchArtworks(): Promise<Art[]> {
  try {
    const db = getAdminFirestore()
    const snap = await db.collection('art')
      .orderBy('createdAt', 'desc')
      .get()
    const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Art))
    // Filter published (or no status field = legacy published)
    return all.filter((a: any) => !a.status || a.status === 'published')
  } catch (e) {
    console.error('fetchArtworks error:', e)
    return []
  }
}

export const metadata: Metadata = {
  title: "art | Giang Hải Sơn",
  description: "Sketches, paintings, and visual experiments.",
}

// Revalidate every 60 seconds (cached between revalidations)
export const revalidate = 60

export default async function ArtPage() {
  const artworks = await fetchArtworks()
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

      {galleryArtworks.length > 0 ? (
        <ArtGallery artworks={galleryArtworks} categories={categories} />
      ) : (
        <div className="border border-border p-4">
          <div className="flex">
            <span className="shrink-0 text-primary select-none">{"$ "}</span>
            <span className="text-muted-foreground">
              {"ls art/ → (empty) — Gallery coming soon."}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
