export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-xl text-foreground">About</h1>
      </section>

      <div className="space-y-6 text-sm text-muted-foreground">
        <p>
          {"I'm Hai Son — a developer and creator based in Vietnam. I spend most of my time building tools, writing code, and experimenting with AI."}
        </p>
        <p>
          {"My work sits at the intersection of developer experience, generative AI, and minimal design. I believe the best software feels invisible — it just works, stays out of your way, and lets you focus on what matters."}
        </p>
        <p>
          {"When I'm not coding, I'm usually reading about systems thinking, exploring generative art, or tweaking my Neovim config (again)."}
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-primary text-sm">{"~"}</span>
          <h2 className="text-sm text-foreground">stack</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-baseline gap-4">
            <span className="shrink-0 text-xs text-primary">{">"}</span>
            <span>TypeScript, Go, Python</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="shrink-0 text-xs text-primary">{">"}</span>
            <span>Next.js, React, Tailwind CSS</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="shrink-0 text-xs text-primary">{">"}</span>
            <span>Neovim, tmux, Warp</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="shrink-0 text-xs text-primary">{">"}</span>
            <span>Vercel, Supabase, Cloudflare</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-primary text-sm">{"~"}</span>
          <h2 className="text-sm text-foreground">contact</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {"Reach me at "}
          <a
            href="mailto:hello@gianghaison.me"
            className="text-primary hover:underline"
          >
            hello@gianghaison.me
          </a>
          {" or find me on "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  )
}
