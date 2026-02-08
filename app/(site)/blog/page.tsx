import type { Metadata } from "next"
import { posts, getAllTags } from "@/lib/blog-data"
import { BlogList } from "@/components/blog-list"

export const metadata: Metadata = {
  title: "blog | gianghaison.me",
  description: "Thoughts on code, AI, and building things",
}

export default function BlogPage() {
  const allTags = getAllTags()

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

      <BlogList posts={posts} allTags={allTags} />
    </div>
  )
}
