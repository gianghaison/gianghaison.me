import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArtworks, getArtworkBySlug, getAdjacentArtworks } from "@/lib/firebase"
import { ArtDetail } from "@/components/art-detail"

interface ArtDetailPageProps {
  params: Promise<{ slug: string }>
}

// Make this page dynamic - don't generate at build time
export const dynamic = 'force-dynamic'

// Revalidate every 60 seconds
export const revalidate = 60

export async function generateMetadata({
  params,
}: ArtDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = await getArtworkBySlug(slug)

  if (!artwork) return { title: "Not Found" }

  return {
    title: `${artwork.title} | art | gianghaison.me`,
    description: artwork.description || `${artwork.title} — ${artwork.medium}`,
    openGraph: {
      title: artwork.title,
      description: artwork.description || `${artwork.title} — ${artwork.medium}`,
      type: "article",
      url: `https://gianghaison.me/art/${artwork.slug}`,
      images: artwork.image ? [{ url: artwork.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: artwork.title,
      description: artwork.description || `${artwork.title} — ${artwork.medium}`,
      images: artwork.image ? [artwork.image] : undefined,
    },
  }
}

export async function generateStaticParams() {
  try {
    const artworks = await getArtworks()
    return artworks.map((artwork) => ({
      slug: artwork.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function ArtDetailPage({ params }: ArtDetailPageProps) {
  const { slug } = await params
  const artwork = await getArtworkBySlug(slug)

  if (!artwork) notFound()

  const allArtworks = await getArtworks()
  const { previous, next } = getAdjacentArtworks(allArtworks, slug)

  // Convert to the format expected by ArtDetail component
  const artworkData = {
    slug: artwork.slug,
    title: artwork.title,
    medium: artwork.medium,
    category: artwork.category,
    date: artwork.createdAt instanceof Date
      ? artwork.createdAt.toISOString().split('T')[0]
      : new Date((artwork.createdAt as { seconds: number }).seconds * 1000).toISOString().split('T')[0],
    dimensions: artwork.dimensions,
    image: artwork.image,
    description: artwork.description,
  }

  const previousData = previous ? {
    slug: previous.slug,
    title: previous.title,
    medium: previous.medium,
    category: previous.category,
    date: previous.createdAt instanceof Date
      ? previous.createdAt.toISOString().split('T')[0]
      : new Date((previous.createdAt as { seconds: number }).seconds * 1000).toISOString().split('T')[0],
    dimensions: previous.dimensions,
    image: previous.image,
    description: previous.description,
  } : null

  const nextData = next ? {
    slug: next.slug,
    title: next.title,
    medium: next.medium,
    category: next.category,
    date: next.createdAt instanceof Date
      ? next.createdAt.toISOString().split('T')[0]
      : new Date((next.createdAt as { seconds: number }).seconds * 1000).toISOString().split('T')[0],
    dimensions: next.dimensions,
    image: next.image,
    description: next.description,
  } : null

  return <ArtDetail artwork={artworkData} previous={previousData} next={nextData} />
}
