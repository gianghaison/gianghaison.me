"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"

interface LightboxProps {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

export function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen view of ${alt}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Close lightbox"
      >
        [ESC]
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={1600}
          height={1200}
          className="max-h-[90vh] w-auto object-contain"
          priority
        />
      </div>
    </div>
  )
}
