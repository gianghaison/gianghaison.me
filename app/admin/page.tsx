"use client"

import { FileText, Eye, PenLine, Palette } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { posts } from "@/lib/blog-data"
import { artworks } from "@/lib/art-data"

const publishedCount = posts.filter(
  (p) => p.tags.length > 0
).length
const draftCount = posts.length - publishedCount

const stats = [
  {
    label: "Total Posts",
    value: posts.length,
    icon: FileText,
  },
  {
    label: "Published",
    value: publishedCount,
    icon: Eye,
  },
  {
    label: "Drafts",
    value: draftCount,
    icon: PenLine,
  },
  {
    label: "Total Art",
    value: artworks.length,
    icon: Palette,
  },
]

const activityItems = [
  {
    text: "Published 'How I Use AI to Build Faster'",
    time: "2h ago",
  },
  {
    text: "Uploaded image dalat-01.webp",
    time: "5h ago",
  },
  {
    text: "Draft saved 'Launching Hu Vang'",
    time: "1d ago",
  },
  {
    text: "Updated art piece 'Saigon Rain'",
    time: "2d ago",
  },
  {
    text: "Published 'My Dev Setup 2026'",
    time: "3d ago",
  },
]

const pageViewsData = [
  { day: "Mon", views: 124 },
  { day: "Tue", views: 89 },
  { day: "Wed", views: 156 },
  { day: "Thu", views: 201 },
  { day: "Fri", views: 178 },
  { day: "Sat", views: 95 },
  { day: "Sun", views: 142 },
]

const quickActions = [
  { label: "New Post", href: "/admin/posts/new" },
  { label: "Upload Image", href: "/admin/media" },
  { label: "View Site", href: "/", external: true },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-border bg-background px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-primary">{payload[0].value} views</p>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6 pt-16 md:p-8 md:pt-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-foreground">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="border border-primary px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          New Post
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm text-foreground">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {activityItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-xs text-foreground/80">{item.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + chart */}
        <div className="flex flex-col gap-6">
          {/* Quick actions */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm text-foreground">Quick Actions</h2>
            </div>
            <div className="flex flex-wrap gap-3 p-5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Page views chart */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm text-foreground">
                Page Views{" "}
                <span className="text-muted-foreground">/ last 7 days</span>
              </h2>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pageViewsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(0 0% 12%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "hsl(220 5% 46%)", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(0 0% 12%)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(220 5% 46%)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "hsl(0 0% 12% / 0.5)" }}
                  />
                  <Bar
                    dataKey="views"
                    fill="hsl(142 69% 58%)"
                    radius={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
