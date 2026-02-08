export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* whoami */}
      <section>
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-foreground">whoami</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            {"Giang H\u1ea3i S\u01a1n \u2014 Designer & Indie Maker from Vietnam."}
          </p>
        </div>
      </section>

      {/* story */}
      <section>
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-foreground">cat story.txt</span>
        </div>
        <div className="mt-2 space-y-4 text-sm text-muted-foreground">
          <p>
            {"I'm a designer. Photoshop, Illustrator, Canva, hand sketching — that was my world for years."}
          </p>
          <p>
            {"Then in 2026, I discovered AI can write code. Not bad code — code that actually works. So I jumped in."}
          </p>
          <p>
            {"Now I use Claude Code, Cursor, and V0 to build products. Solo. No traditional coding background. Just design skills and the ability to talk to AI."}
          </p>
        </div>
      </section>

      {/* projects */}
      <section>
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-foreground">ls projects/</span>
        </div>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span><span className="text-foreground">{"H\u0169 V\u00e0ng"}</span>{" \u2014 real-time asset tracking app for Vietnam"}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span><span className="text-foreground">{"FlashKid"}</span>{" \u2014 English flashcards for Vietnamese kids"}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span><span className="text-foreground">{"VocabVault"}</span>{" \u2014 vocabulary illustration API"}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span><span className="text-foreground">{"SCOUT v4"}</span>{" \u2014 AI opportunity analysis for indie makers"}</span>
          </div>
        </div>
      </section>

      {/* philosophy */}
      <section>
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-foreground">cat philosophy.txt</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            {"Ship fast. Learn by doing. Share the real journey — wins and failures alike."}
          </p>
        </div>
      </section>

      {/* connect */}
      <section>
        <div className="flex">
          <span className="shrink-0 text-primary select-none">{"$ "}</span>
          <span className="text-foreground">cat connect.txt</span>
        </div>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span>
              {"GitHub: "}
              <a
                href="https://github.com/gianghaison"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/gianghaison
              </a>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span>
              {"Twitter/X: "}
              <a
                href="https://twitter.com/gianghaison"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @gianghaison
              </a>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary select-none">{"\u2192"}</span>
            <span>
              {"Blog: "}
              <a
                href="/blog"
                className="text-primary hover:underline"
              >
                gianghaison.me/blog
              </a>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
