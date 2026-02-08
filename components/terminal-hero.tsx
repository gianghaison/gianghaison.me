"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const lines = [
  { type: "command" as const, text: "whoami" },
  { type: "output" as const, text: "" },
  { type: "name" as const, text: "Giang Hai Son" },
  { type: "role" as const, text: "Software Developer" },
  { type: "output" as const, text: "" },
  { type: "command" as const, text: "cat bio.txt" },
  { type: "output" as const, text: "" },
  { type: "bio" as const, text: "Making useful things with code & AI" },
]

function TerminalCursor() {
  return (
    <span
      className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-cursor-blink bg-primary"
      aria-hidden="true"
    />
  )
}

export function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)

  useEffect(() => {
    if (visibleLines < lines.length) {
      const current = lines[visibleLines]
      let delay = 150
      if (current?.type === "command") delay = 500
      if (current?.type === "name") delay = 300
      if (current?.type === "output") delay = 100
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setAnimationDone(true), 400)
      return () => clearTimeout(timer)
    }
  }, [visibleLines])

  return (
    <section>
      <div className="border border-border">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <span className="h-2.5 w-2.5 bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 bg-[#27c93f]" />
          <span className="ml-3 text-xs text-muted-foreground">
            haison@dev:~
          </span>
        </div>
        <div className="p-4 text-sm leading-relaxed">
          <div className="space-y-0.5">
            {lines.slice(0, visibleLines).map((line, i) => {
              if (line.type === "output") {
                return <div key={i} className="h-3" />
              }
              if (line.type === "command") {
                return (
                  <div key={i} className="flex">
                    <span className="shrink-0 text-primary select-none">
                      {"$ "}
                    </span>
                    <span className="text-foreground">{line.text}</span>
                  </div>
                )
              }
              if (line.type === "name") {
                return (
                  <div key={i}>
                    <span className="text-lg font-bold text-foreground">
                      {line.text}
                    </span>
                  </div>
                )
              }
              if (line.type === "role") {
                return (
                  <div key={i}>
                    <span className="text-muted-foreground">{line.text}</span>
                  </div>
                )
              }
              if (line.type === "bio") {
                return (
                  <div key={i}>
                    <span className="text-muted-foreground">{line.text}</span>
                  </div>
                )
              }
              return null
            })}
            {visibleLines >= lines.length && (
              <div className="flex">
                <span className="shrink-0 text-primary select-none">
                  {"$ "}
                </span>
                <TerminalCursor />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-6 flex flex-col gap-2 transition-opacity duration-500 sm:flex-row sm:gap-8 ${
          animationDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          href="/blog"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-primary select-none">$</span>
          <span className="group-hover:text-primary transition-colors">
            ls blog/
          </span>
          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {"-->"}
          </span>
        </Link>
        <Link
          href="/art"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-primary select-none">$</span>
          <span className="group-hover:text-primary transition-colors">
            ls art/
          </span>
          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {"-->"}
          </span>
        </Link>
      </div>
    </section>
  )
}
