import Link from "next/link"

const recentPosts = [
  {
    date: "2026-02-10",
    filename: "how-i-use-ai-to-build-faster.md",
    slug: "how-i-use-ai-to-build-faster",
  },
  {
    date: "2026-02-08",
    filename: "launching-hu-vang.md",
    slug: "launching-hu-vang",
  },
  {
    date: "2026-02-05",
    filename: "my-dev-setup-2026.md",
    slug: "my-dev-setup-2026",
  },
]

export function RecentPosts() {
  return (
    <section className="space-y-6">
      <h2 className="text-sm">
        <span className="text-muted-foreground select-none">## </span>
        <span className="text-foreground">recent posts</span>
      </h2>

      <div className="border border-border divide-y divide-border">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-baseline gap-4 px-4 py-3 group transition-colors hover:bg-secondary"
          >
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {post.date}
            </span>
            <span className="text-sm text-primary transition-colors group-hover:text-foreground">
              {post.filename}
            </span>
          </Link>
        ))}
      </div>

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
