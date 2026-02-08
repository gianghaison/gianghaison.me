import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  artworks,
  getArtworkBySlug,
  getAdjacentArtworks,
} from "@/lib/art-data"
import { ArtDetail } from "@/components/art-detail"

interface ArtDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArtDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) return { title: "Not Found" }

  return {
    title: `${artwork.title} | art | gianghaison.me`,
    description: artwork.description || `${artwork.title} — ${artwork.medium}`,
  }
}

export function generateStaticParams() {
  return artworks.map((artwork) => ({
    slug: artwork.slug,
  }))
}

export default async function ArtDetailPage({ params }: ArtDetailPageProps) {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)

  if (!artwork) notFound()

  const { previous, next } = getAdjacentArtworks(slug)

  return <ArtDetail artwork={artwork} previous={previous} next={next} />
}
