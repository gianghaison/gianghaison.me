import type { Metadata } from "next"
import { getPosts, getAllTags, Post } from "@/lib/firebase"
import { BlogList } from "@/components/blog-list"

export const metadata: Metadata = {
  title: "blog | Giang H\u1ea3i S\u01a1n",
  description: "Thoughts on design, AI, and building things as an indie maker",
}

// Revalidate every 60 seconds (cached between revalidations)
export const revalidate = 60

export default async function BlogPage() {
  let posts: Post[] = []
  try {
    posts = await getPosts(true) // Only published posts
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
  const allTags = getAllTags(posts)

  // Convert Firestore posts to BlogPost format for the component
  const blogPosts = posts.map((post: Post) => {
    // Use publishedAt for display date, fallback to createdAt
    const displayDate = post.publishedAt || post.createdAt
    const date = displayDate instanceof Date
      ? displayDate.toISOString().split('T')[0]
      : new Date((displayDate as { seconds: number }).seconds * 1000).toISOString().split('T')[0]

    return {
      slug: post.slug,
      title: post.title,
      description: post.excerpt || post.description || '',
      date,
      readingTime: Math.ceil(post.content.split(/\s+/).length / 200),
      tags: post.tags,
      content: post.content,
    }
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl text-foreground">
          # blog
          <span className="ml-1 inline-block h-5 w-2.5 animate-cursor-blink bg-primary align-middle" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Thoughts on design, AI, and building things
        </p>
      </header>

      {blogPosts.length > 0 ? (
        <BlogList posts={blogPosts} allTags={allTags} />
      ) : (
        <div className="border border-border p-4">
          <div className="flex">
            <span className="shrink-0 text-primary select-none">{"$ "}</span>
            <span className="text-muted-foreground">
              {"ls blog/ \u2192 (empty) \u2014 First post coming soon."}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
