import { TerminalHero } from "@/components/terminal-hero"
import { ProjectsSection } from "@/components/projects-section"
import { RecentPosts } from "@/components/recent-posts"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      <TerminalHero />
      <ProjectsSection />
      <RecentPosts />
    </div>
  )
}
