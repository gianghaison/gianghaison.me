export function StatusBar() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-primary text-sm select-none">{"~"}</span>
        <h2 className="text-sm text-foreground">find me</h2>
      </div>

      <div className="border border-border px-4 py-3">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            { label: "github", href: "https://github.com" },
            { label: "twitter", href: "https://twitter.com" },
            { label: "email", href: "mailto:hello@gianghaison.me" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-primary select-none">{"-> "}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border border-border px-4 py-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>
            <span className="text-primary">os</span> macOS
          </span>
          <span>
            <span className="text-primary">editor</span> neovim
          </span>
          <span>
            <span className="text-primary">shell</span> zsh
          </span>
          <span>
            <span className="text-primary">theme</span> tokyonight
          </span>
        </div>
      </div>
    </section>
  )
}
