import { MetadataRoute } from 'next'
import { getPosts, getArtworks, Post, Art } from '@/lib/firebase'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gianghaison.me'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/art`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Dynamic blog posts
  let posts: Post[] = []
  let artworks: Art[] = []

  try {
    posts = await getPosts(true)
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  try {
    artworks = await getArtworks()
  } catch (error) {
    console.error('Error fetching artworks for sitemap:', error)
  }

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = post.updatedAt instanceof Date
      ? post.updatedAt
      : new Date((post.updatedAt as { seconds: number }).seconds * 1000)

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // Dynamic art pages
  const artPages: MetadataRoute.Sitemap = artworks.map((art) => {
    const lastModified = art.createdAt instanceof Date
      ? art.createdAt
      : new Date((art.createdAt as { seconds: number }).seconds * 1000)

    return {
      url: `${baseUrl}/art/${art.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  return [...staticPages, ...blogPages, ...artPages]
}
