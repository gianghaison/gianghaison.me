import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { posts, getPostBySlug, getAdjacentPosts } from "@/lib/blog-data"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { CopyLinkButton } from "@/components/copy-link-button"

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found" }
  return {
    title: `${post.title} | gianghaison.me`,
    description: post.description,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { previous, next } = getAdjacentPosts(slug)

  return (
    <article className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground">
        <Link href="/blog" className="transition-colors hover:text-foreground">
          blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{post.slug}.md</span>
      </nav>

      {/* Metadata */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span>|</span>
          <span>{post.readingTime} min read</span>
          <span>|</span>
          {post.tags.map((tag) => (
            <span key={tag}>--{tag}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
      </div>

      {/* Separator */}
      <div className="h-px bg-border" />

      {/* Content */}
      <MarkdownRenderer content={post.content} />

      {/* Separator */}
      <div className="h-px bg-border" />

      {/* Bottom section */}
      <footer className="space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href="/blog"
              className="border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              --{tag}
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between text-sm">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {"<-"} {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="text-right text-muted-foreground transition-colors hover:text-primary"
            >
              {next.title} {"->"}
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Share */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">share:</span>
          <CopyLinkButton />
        </div>
      </footer>
    </article>
  )
}
