import { TerminalHero } from "@/components/terminal-hero"
import { ProjectsSection } from "@/components/projects-section"
import { RecentPosts } from "@/components/recent-posts"

// Revalidate every 60 seconds (cached between revalidations)
export const revalidate = 60

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      <TerminalHero />
      <ProjectsSection />
      <RecentPosts />
    </div>
  )
}
