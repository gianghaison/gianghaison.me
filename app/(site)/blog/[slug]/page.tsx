import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPosts, getPostBySlug, getAdjacentPosts, Post } from "@/lib/firebase"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { CopyLinkButton } from "@/components/copy-link-button"

// Revalidate every 60 seconds (cached between revalidations)
export const revalidate = 60

export async function generateStaticParams() {
  try {
    const posts = await getPosts(true)
    return posts.map((post) => ({ slug: post.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: "Post not found" }

  return {
    title: `${post.title} | gianghaison.me`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://gianghaison.me/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(date: Date | { seconds: number }): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }
  return new Date(date.seconds * 1000).toISOString().split('T')[0]
}

function calculateReadingTime(content: string): number {
  return Math.ceil(content.split(/\s+/).length / 200)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || !post.published) {
    notFound()
  }

  const allPosts = await getPosts(true)
  const { previous, next } = getAdjacentPosts(allPosts, slug)

  const date = formatDate(post.createdAt)
  const readingTime = calculateReadingTime(post.content)

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
          <span>{date}</span>
          <span>|</span>
          <span>{readingTime} min read</span>
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
