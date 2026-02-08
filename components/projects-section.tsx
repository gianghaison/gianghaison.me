const projects = [
  {
    name: "HuVang.vn",
    description:
      "Real-time gold prices & stock tracking for Vietnam. Simple enough for everyone.",
    status: "building" as const,
    tags: ["React", "Firebase"],
  },
  {
    name: "FlashBee.app",
    description: "English flashcards for Vietnamese kids. Fun, easy, effective.",
    status: "building" as const,
    tags: ["React"],
  },
  {
    name: "VocabVault",
    description: "Vocabulary illustration API for developers.",
    status: "building" as const,
    tags: ["Node.js", "Cloudflare R2"],
  },
  {
    name: "SCOUT v4",
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
        className={`h-1.5 w-1.5 ${isLive ? "bg-primary" : "bg-yellow-500"}`}
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
          <div
            key={project.name}
            className="group border border-border p-4 transition-colors hover:border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-bold text-primary">
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
          </div>
        ))}
      </div>
    </section>
  )
}
