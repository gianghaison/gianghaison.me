"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PageViewTracker() {
  const pathname = usePathname()
  const tracked = useRef<string | null>(null)

  useEffect(() => {
    // Skip if already tracked this path or if it's an admin page
    if (tracked.current === pathname || pathname.startsWith("/admin")) {
      return
    }

    // Track the page view
    tracked.current = pathname

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch((err) => {
      console.error("Failed to track page view:", err)
    })
  }, [pathname])

  return null
}
