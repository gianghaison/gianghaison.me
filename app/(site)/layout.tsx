import React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="mx-auto min-h-screen max-w-3xl px-6 pt-24 pb-16">
        {children}
      </main>
      <Footer />
    </>
  )
}
