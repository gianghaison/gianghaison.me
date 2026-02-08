"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-lg text-foreground">
        <span className="text-muted-foreground">## </span>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-base text-foreground">
        <span className="text-muted-foreground">### </span>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-sm leading-[1.8] text-foreground/90">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline-offset-4 hover:underline"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 space-y-1 pl-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 space-y-1 pl-1 [counter-reset:list-counter]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="flex gap-2 text-sm leading-[1.8] text-foreground/90">
        <span className="shrink-0 text-primary select-none">{">"}</span>
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.startsWith("language-")
      if (isBlock) {
        return (
          <code className="block text-xs leading-relaxed">
            {String(children).replace(/\n$/, "")}
          </code>
        )
      }
      return (
        <code className="bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto border border-border bg-[#111] p-4 text-foreground">
        {children}
      </pre>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground/80">{children}</em>
    ),
    hr: () => <hr className="my-8 border-border" />,
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src || "/placeholder.svg"}
        alt={alt || ""}
        className="my-6 w-full border border-border"
      />
    ),
  }

  return (
    <div className="prose-terminal">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
