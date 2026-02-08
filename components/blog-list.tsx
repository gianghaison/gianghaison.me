"use client"

import { useState } from "react"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog-data"

interface BlogListProps {
  posts: BlogPost[]
  allTags: string[]
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts

  return (
    <div className="space-y-8">
      {/* Tag filter bar */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={`text-sm transition-colors ${
            activeTag === null
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          --all
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-sm transition-colors ${
              activeTag === tag
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            --{tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div>
        {filteredPosts.map((post, index) => (
          <article key={post.slug}>
            {index > 0 && <div className="h-px bg-border" />}
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-6"
            >
              <div className="flex items-baseline gap-3 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span>|</span>
                <span>reading: {post.readingTime} min</span>
              </div>
              <h2 className="mt-2 text-base text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted-foreground"
                  >
                    --{tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No posts found for --{activeTag}
        </p>
      )}
    </div>
  )
}
