import Link from "next/link"
import { getPosts, Post } from "@/lib/firebase"

export async function RecentPosts() {
  let posts: Post[] = []
  try {
    posts = await getPosts(true) // Only published posts
    posts = posts.slice(0, 3) // Limit to 3 most recent
  } catch (error) {
    console.error('Error fetching recent posts:', error)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-sm">
        <span className="text-muted-foreground select-none">## </span>
        <span className="text-foreground">recent posts</span>
      </h2>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const displayDate = post.publishedAt || post.createdAt
            const date = displayDate instanceof Date
              ? displayDate.toISOString().split('T')[0]
              : new Date((displayDate as { seconds: number }).seconds * 1000).toISOString().split('T')[0]
            const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block border border-border p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-baseline gap-3 text-xs text-muted-foreground">
                  <span>{date}</span>
                  <span>|</span>
                  <span>reading: {readingTime} min</span>
                </div>
                <h3 className="mt-2 text-base text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {(post.excerpt || post.description) && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt || post.description}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="border border-border p-4">
          <div className="flex">
            <span className="shrink-0 text-primary select-none">{"$ "}</span>
            <span className="text-muted-foreground">
              {"echo 'First post coming soon...'"}
            </span>
          </div>
        </div>
      )}

      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="text-primary select-none">$</span>
        <span className="group-hover:text-primary transition-colors">
          cd blog/
        </span>
        <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {"-->"}
        </span>
      </Link>
    </section>
  )
}
