"use client"

import { useState, useEffect } from "react"
import { FileText, Eye, PenLine, Palette, Loader2 } from "lucide-react"
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

interface DailyView {
  date: string
  views: number
}

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalArt: number
  totalViews: number
}

interface ChartData {
  day: string
  views: number
}

const quickActions = [
  { label: "New Post", href: "/admin/posts/new" },
  { label: "Upload Image", href: "/admin/media" },
  { label: "View Site", href: "/", external: true },
]

function formatDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

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
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalArt: 0,
    totalViews: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()

      if (data.stats) {
        setStats(data.stats)
      }

      if (data.dailyViews) {
        const formatted = data.dailyViews.map((dv: DailyView) => ({
          day: formatDay(dv.date),
          views: dv.views,
        }))
        setChartData(formatted)
      }
    } catch (err) {
      console.error("Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: Eye,
    },
    {
      label: "Drafts",
      value: stats.draftPosts,
      icon: PenLine,
    },
    {
      label: "Total Art",
      value: stats.totalArt,
      icon: Palette,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 pt-16 md:pt-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
        {statCards.map((stat) => (
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
        {/* Total views card */}
        <div className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm text-foreground">Total Page Views</h2>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{stats.totalViews.toLocaleString()}</p>
              <p className="mt-2 text-xs text-muted-foreground">all time views</p>
            </div>
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
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
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
              ) : (
                <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
