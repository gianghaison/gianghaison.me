export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readingTime: number
  tags: string[]
  content: string
}

export const posts: BlogPost[] = [
  {
    slug: "how-i-use-ai-to-build-faster",
    title: "How I Use AI to Build Faster",
    description:
      "A solo developer's workflow for shipping products with Claude, Cursor, and V0.",
    date: "2026-02-10",
    readingTime: 5,
    tags: ["ai", "dev", "tools"],
    content: `## The Problem

As a solo developer, time is my most limited resource. I needed a workflow that lets me ship fast without sacrificing code quality. After months of experimentation, here's the system I've built around AI tools.

## My Stack

I currently use three main AI tools in my daily workflow:

- **Claude** — for architecture decisions, debugging complex problems, and writing documentation
- **Cursor** — as my primary IDE with AI-powered autocomplete and inline editing
- **V0** — for rapid UI prototyping and component generation

## The Workflow

### 1. Planning with Claude

Before writing any code, I describe the feature to Claude. I'll lay out:

\`\`\`
- What the feature does
- Edge cases I can think of
- How it fits into the existing architecture
\`\`\`

Claude helps me think through the design before I write a single line of code. This saves hours of refactoring later.

### 2. Prototyping with V0

For any UI work, I start with V0. I describe the component I need and iterate on the design. Once I'm happy with the look, I pull the code into my project.

> "The best code is the code you don't have to write from scratch."

### 3. Building with Cursor

With the plan and UI prototype ready, I switch to Cursor. The AI autocomplete understands my codebase context and suggests relevant completions. For complex logic, I use inline chat to work through problems.

### Example Session

Here's a real example from building the auth flow for [huvang.vn](https://huvang.vn):

\`\`\`typescript
// I described what I needed to Cursor:
// "Create a middleware that checks JWT tokens,
//  handles refresh, and redirects to login"

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, refreshToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const verified = await verifyToken(token)
  if (!verified) {
    const newToken = await refreshToken(token)
    if (!newToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
\`\`\`

The AI generated about 80% of this. I reviewed, adjusted the error handling, and added logging. Total time: **10 minutes** instead of an hour.

## Results

Since adopting this workflow:

- Shipping speed increased by roughly **3x**
- Code quality stayed the same (or improved, thanks to AI-suggested patterns)
- I spend more time on **product decisions** and less on boilerplate

## Caveats

AI isn't magic. You still need to:

1. Understand the code it generates
2. Review everything carefully
3. Know when to override its suggestions

The AI is a *collaborator*, not a replacement. Treat it like a very fast junior developer who needs code review.`,
  },
  {
    slug: "launching-hu-vang",
    title: "Launching Hu Vang",
    description:
      "Behind the scenes of building and launching a Vietnamese gold price tracker.",
    date: "2026-02-08",
    readingTime: 4,
    tags: ["dev", "diary"],
    content: `## Why Build a Gold Price Tracker?

In Vietnam, gold isn't just an investment — it's cultural. People buy gold for weddings, Tet celebrations, and as a store of value. But checking gold prices has always been a pain.

Most existing sites are cluttered with ads, slow to load, and have terrible mobile experiences. I wanted to build something **fast, clean, and actually useful**.

## The Tech Stack

\`\`\`
Framework:   Next.js 16
Styling:     Tailwind CSS
Database:    Supabase
Deployment:  Vercel
Scraping:    Custom Node.js workers
\`\`\`

### Data Pipeline

Gold prices in Vietnam come from multiple sources — SJC, DOJI, PNJ, and others. Each updates at different intervals and formats their data differently.

I built a scraping pipeline that:

1. Polls each source every 5 minutes
2. Normalizes the data into a consistent schema
3. Stores historical data in Supabase
4. Pushes real-time updates via WebSocket

\`\`\`typescript
interface GoldPrice {
  source: 'sjc' | 'doji' | 'pnj'
  type: 'ring' | 'bar'
  buy: number
  sell: number
  updatedAt: Date
}
\`\`\`

## Design Decisions

I kept the UI minimal. The homepage shows:

- Current prices from all sources in a comparison table
- A simple chart showing today's price movement
- Historical trend (7d, 30d, 90d views)

> "Every pixel should earn its place on screen."

No ads, no pop-ups, no newsletter sign-ups blocking the content.

## Launch Day

I soft-launched on a Vietnamese tech forum and shared it in a few Facebook groups. The response was immediate — people appreciated the clean design and fast load times.

**First week stats:**
- 2,400 unique visitors
- 45% mobile traffic
- Average session: 2.1 minutes
- Bounce rate: 28%

## What's Next

I'm working on push notifications for price alerts and adding more data sources. The goal is to become the go-to resource for Vietnamese gold prices.`,
  },
  {
    slug: "my-dev-setup-2026",
    title: "My Dev Setup 2026",
    description:
      "Hardware, software, and configurations for a productive development environment.",
    date: "2026-02-05",
    readingTime: 6,
    tags: ["tools", "dev"],
    content: `## Hardware

After years of tweaking, here's my current setup:

- **MacBook Pro M3 Pro** — 18GB RAM, 512GB SSD
- **Dell U2723QE** — 27" 4K monitor, USB-C hub
- **Keychron Q1 Pro** — with Gateron Oil King switches
- **Logitech MX Master 3S** — the GOAT mouse

The M3 Pro handles everything I throw at it. Docker containers, multiple dev servers, heavy IDE usage — all smooth.

## Terminal Setup

\`\`\`bash
# Shell
zsh + oh-my-zsh
starship prompt
tmux for session management

# Core tools
nvim (primary for quick edits)
cursor (primary IDE)
lazygit
fzf + ripgrep
\`\`\`

### My .zshrc Essentials

\`\`\`bash
# Aliases
alias g="git"
alias gc="git commit -m"
alias gp="git push"
alias gpl="git pull"
alias gs="git status"
alias ll="eza -la --icons"
alias cat="bat"
alias cd="z"

# Functions
function mkcd() {
  mkdir -p "$1" && cd "$1"
}

function port() {
  lsof -i ":$1"
}
\`\`\`

## Editor Configuration

### Cursor Settings

I use Cursor as my primary IDE with these key settings:

- **Theme:** One Dark Pro Monokai Darker
- **Font:** JetBrains Mono, 14px, ligatures enabled
- **AI Model:** Claude 3.5 Sonnet (for inline edits)

### Key Extensions

\`\`\`
- ESLint + Prettier (auto-format on save)
- Tailwind CSS IntelliSense
- GitLens
- Error Lens
- Thunder Client (API testing)
\`\`\`

## Development Workflow

My typical day starts with:

1. **\`tmux\`** — restore previous session
2. **\`lazygit\`** — check overnight PRs and changes
3. **\`cursor .\`** — open project
4. **Terminal split** — dev server + logs

> "A good setup should be invisible. You shouldn't have to think about your tools — they should think for you."

## Browser Setup

- **Arc Browser** — for the split views and spaces
- **React DevTools** — essential
- **Vercel Toolbar** — for quick deployments
- **uBlock Origin** — sanity

## What Changed from 2025

The biggest change was moving from VS Code to Cursor full-time. The AI integration is seamless enough that I no longer context-switch between an IDE and a chat window. Everything happens inline.

I also switched from iTerm2 to the native macOS Terminal + tmux. Fewer moving parts, and tmux gives me everything I need for session management.`,
  },
  {
    slug: "building-flashkid",
    title: "Building FlashKid",
    description:
      "How I built a flashcard app for kids learning English with spaced repetition.",
    date: "2026-01-28",
    readingTime: 7,
    tags: ["dev", "ai", "diary"],
    content: `## The Idea

My nephew was struggling to learn English vocabulary. Existing apps were either too complex for a 7-year-old or too simplistic to be effective. I wanted to build something that was:

- **Simple enough** for a child to use independently
- **Smart enough** to adapt to their learning pace
- **Fun enough** to keep them coming back

## Spaced Repetition for Kids

The SM-2 algorithm is great for adults, but kids need a gentler approach. I modified the algorithm to:

\`\`\`typescript
function calculateNextReview(
  difficulty: number,
  streak: number,
  age: 'child' | 'teen' | 'adult'
): number {
  const baseInterval = age === 'child' ? 0.5 : 1
  const easeFactor = Math.max(1.3, 2.5 - (difficulty * 0.2))
  
  if (streak === 0) return baseInterval
  if (streak === 1) return baseInterval * 2
  
  return baseInterval * easeFactor * streak
}
\`\`\`

Key changes for kids:
- Shorter intervals (review more often)
- More generous with "correct" answers (fuzzy matching)
- Visual rewards instead of statistics
- Maximum 10 new cards per day (prevent overwhelm)

## The Card Design

Each card shows:

1. A colorful illustration (generated with DALL-E)
2. The English word in large, friendly text
3. Audio pronunciation (text-to-speech)
4. Vietnamese translation on flip

> "Education is not the filling of a pail, but the lighting of a fire." — W.B. Yeats

## Tech Stack

\`\`\`
Next.js + TypeScript
Supabase (auth + database)
Vercel (hosting)
OpenAI (image generation + TTS)
\`\`\`

## Results

After testing with my nephew and a few of his classmates:

- Average daily usage: **12 minutes**
- Words learned per week: **15-20**
- Retention rate after 30 days: **78%**

The kids especially loved the streak system and the animated celebrations when they completed a set.

## Open Source

The core flashcard engine is open-source. The kid-friendly UI and Vietnamese content pack are in the main app. If you want to contribute or adapt it for another language, check out the repo.`,
  },
  {
    slug: "terminal-aesthetic-web-design",
    title: "Terminal Aesthetic in Web Design",
    description:
      "Why I chose a terminal-inspired design for my portfolio and how to build one.",
    date: "2026-01-20",
    readingTime: 4,
    tags: ["dev", "tools", "diary"],
    content: `## Why Terminal?

Most developer portfolios look the same — clean sans-serif fonts, pastel colors, smooth rounded corners. Nothing wrong with that, but I wanted something that felt more *me*.

I spend most of my day in a terminal. The monospace text, the green-on-black color scheme, the blinking cursor — these are my comfort zone. Why not bring that aesthetic to the web?

## Design Principles

### 1. Monospace Everything

\`\`\`css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
\`\`\`

Monospace fonts create a specific rhythm. Every character takes the same space, creating natural alignment. Code blocks feel at home. ASCII art becomes possible.

### 2. Limited Color Palette

\`\`\`
Background:  #0a0a0a (near black)
Text:        #e5e5e5 (soft white)
Accent:      #4ade80 (terminal green)
Muted:       #6b7280 (comment gray)
Border:      #1e1e1e (subtle lines)
\`\`\`

Five colors. That's it. Constraints breed creativity.

### 3. Sharp Edges

\`\`\`css
border-radius: 0;
\`\`\`

Terminals don't have rounded corners. Neither does this site. Every element is sharp, precise, deliberate.

### 4. Content as Commands

Instead of "About Me", I use \`$ whoami\`. Instead of "Projects", I use \`$ ls projects/\`. The metaphor isn't forced — it's a natural extension of the terminal aesthetic.

## Implementation Tips

### Custom Markdown Rendering

For blog posts, headings show the raw markdown syntax:

\`\`\`
## This is a heading    →    ## This is a heading
\`\`\`

The \`##\` prefix is visible but muted, making it look like you're reading a raw markdown file.

### Cursor Animation

\`\`\`css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor::after {
  content: '█';
  animation: blink 1s step-end infinite;
  color: #4ade80;
}
\`\`\`

### Terminal Window Chrome

The fake traffic lights (red, yellow, green dots) at the top of code blocks add authenticity without being distracting.

> "Good design is as little design as possible." — Dieter Rams

## Performance

The terminal aesthetic is inherently performant:

- No heavy images or illustrations
- System/web fonts load fast
- Minimal CSS (no complex gradients or animations)
- Content-first layout

This site scores 100/100 on Lighthouse across all categories. The terminal aesthetic isn't just a style choice — it's a performance strategy.`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export function getAdjacentPosts(slug: string) {
  const index = posts.findIndex((p) => p.slug === slug)
  return {
    previous: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  }
}
