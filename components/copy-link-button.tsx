"use client"

import { useState } from "react"
import { Check, Link as LinkIcon } from "lucide-react"

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          copied!
        </>
      ) : (
        <>
          <LinkIcon className="h-3.5 w-3.5" />
          copy link
        </>
      )}
    </button>
  )
}
