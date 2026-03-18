# Task: Fix Art Detail Page 500 Error — gianghaison.me
# Date: 18/03/2026

## Mô tả
generateMetadata() vẫn dùng getArtworkBySlug() từ client SDK → Firestore rules chặn → 500.
Cần chuyển toàn bộ file sang Admin Firestore, kể cả generateMetadata.

## Thực thi

Thay toàn bộ nội dung file `app/(site)/art/[slug]/page.tsx` bằng:

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAdminFirestore } from "@/lib/firebase-admin"
import { getAdjacentArtworks } from "@/lib/firebase"
import { ArtDetail } from "@/components/art-detail"

interface ArtDetailPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

async function fetchArtworkBySlug(slug: string) {
  const db = getAdminFirestore()
  const snap = await db.collection('art').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  const data = doc.data()
  return { id: doc.id, ...data } as any
}

async function fetchAllArtworks() {
  const db = getAdminFirestore()
  const snap = await db.collection('art').orderBy('createdAt', 'desc').get()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as any))
    .filter((a: any) => !a.status || a.status === 'published')
}

function toDateString(val: any): string {
  if (!val) return ''
  if (val instanceof Date) return val.toISOString().split('T')[0]
  if (val?.seconds) return new Date(val.seconds * 1000).toISOString().split('T')[0]
  return ''
}

export async function generateStaticParams() {
  try {
    const artworks = await fetchAllArtworks()
    return artworks.map((a: any) => ({ slug: a.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: ArtDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = await fetchArtworkBySlug(slug)
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

export default async function ArtDetailPage({ params }: ArtDetailPageProps) {
  const { slug } = await params

  const artwork = await fetchArtworkBySlug(slug)
  if (!artwork) notFound()
  if (artwork.status && artwork.status !== 'published') notFound()

  const allArtworks = await fetchAllArtworks()
  const { previous, next } = getAdjacentArtworks(allArtworks, slug)

  const toArtCard = (a: any) => a ? {
    slug: a.slug,
    title: a.title,
    medium: a.medium,
    category: a.category,
    date: toDateString(a.createdAt),
    dimensions: a.dimensions,
    image: a.image,
    description: a.description,
  } : null

  return (
    <ArtDetail
      artwork={toArtCard(artwork)!}
      previous={toArtCard(previous)}
      next={toArtCard(next)}
    />
  )
}
```

## Hoàn thành
npm run build → pass → git add -A && git commit -m "fix: art detail 500 - move generateMetadata to Admin Firestore" && git push
