import Link from "next/link"

export function RecentPosts() {
  return (
    <section className="space-y-6">
      <h2 className="text-sm">
        <span className="text-muted-foreground select-none">## </span>
        <span className="text-foreground">recent posts</span>
      </h2>

      <div className="border border-border p-4">
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-muted-foreground">
            {"echo 'First post coming soon...'"}
          </span>
        </div>
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
