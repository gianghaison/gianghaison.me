import React from "react"
import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Giang H\u1ea3i S\u01a1n — Designer & Indie Maker",
  description: "A designer lost in the land of code. Building products with AI, sharing the real journey.",
  openGraph: {
    title: "Giang H\u1ea3i S\u01a1n — Designer & Indie Maker",
    description: "A designer lost in the land of code. Building products with AI, sharing the real journey.",
    siteName: "gianghaison.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giang H\u1ea3i S\u01a1n — Designer & Indie Maker",
    description: "A designer lost in the land of code. Building products with AI, sharing the real journey.",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased leading-[1.7]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
