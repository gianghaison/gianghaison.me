import type { Metadata } from "next"
import { getPosts, getAllTags, Post } from "@/lib/firebase"
import { BlogList } from "@/components/blog-list"

export const metadata: Metadata = {
  title: "blog | gianghaison.me",
  description: "Thoughts on code, AI, and building things",
}

// Make this page dynamic - don't generate at build time
export const dynamic = 'force-dynamic'

// Revalidate every 60 seconds
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
  const blogPosts = posts.map((post: Post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.createdAt instanceof Date
      ? post.createdAt.toISOString().split('T')[0]
      : new Date(post.createdAt.seconds * 1000).toISOString().split('T')[0],
    readingTime: Math.ceil(post.content.split(/\s+/).length / 200), // Estimate reading time
    tags: post.tags,
    content: post.content,
  }))

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl text-foreground">
          # blog
          <span className="ml-1 inline-block h-5 w-2.5 animate-cursor-blink bg-primary align-middle" />
        </h1>
        <p className="text-sm text-muted-foreground">
          Thoughts on code, AI, and building things
        </p>
      </header>

      <BlogList posts={blogPosts} allTags={allTags} />
    </div>
  )
}
