# Task: Update Projects Section — gianghaison.me
# Date: 18/03/2026

## Mô tả
- Thêm XuLangEdu (app.xulangeducation.com)
- Thêm LaKinh (lakinh.vn)
- Bỏ VocabVault
- Thêm clickable link cho tất cả projects

## Thực thi

Thay toàn bộ nội dung file `components/projects-section.tsx` bằng:

```tsx
import Link from "next/link"

const projects = [
  {
    name: "XuLangEdu",
    url: "https://app.xulangeducation.com",
    description: "School management system for tutoring centers. Built for a real friend's real problem.",
    status: "live" as const,
    tags: ["Next.js", "Firebase"],
  },
  {
    name: "FlashBee.app",
    url: "https://flashbee.app",
    description: "English flashcards for Vietnamese kids. Fun, easy, effective.",
    status: "building" as const,
    tags: ["Next.js", "Firebase"],
  },
  {
    name: "LaKinh",
    url: "https://lakinh.vn",
    description: "Vietnamese Tử Vi astrology app. Multi-school engine, modern UI.",
    status: "building" as const,
    tags: ["React Native", "Expo"],
  },
  {
    name: "HuVang.vn",
    url: "https://huvang.vn",
    description: "Real-time gold prices & stock tracking for Vietnam. Simple enough for everyone.",
    status: "building" as const,
    tags: ["React", "Firebase"],
  },
  {
    name: "SCOUT v4",
    url: "https://scout.gianghaison.me",
    description: "AI-powered opportunity analysis for indie makers.",
    status: "live" as const,
    tags: ["Next.js", "Claude API"],
  },
]

function StatusBadge({ status }: { status: "live" | "building" }) {
  const isLive = status === "live"
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs ${
        isLive
          ? "border-primary/30 text-primary"
          : "border-yellow-500/30 text-yellow-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-primary animate-pulse" : "bg-yellow-500"}`}
      />
      {status}
    </span>
  )
}

export function ProjectsSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-sm">
        <span className="text-muted-foreground select-none">## </span>
        <span className="text-foreground">projects</span>
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border p-4 transition-colors hover:border-primary block"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-bold text-primary group-hover:underline underline-offset-4">
                {project.name}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

## Hoàn thành
npm run build → pass → git add -A && git commit -m "feat: update projects - add XuLangEdu, LaKinh, remove VocabVault, add links" && git push
