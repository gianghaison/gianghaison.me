# gianghaison.me

Personal website & blog c\u1ee7a Giang H\u1ea3i S\u01a1n - Designer & Indie Maker.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS |
| Components | shadcn/ui (Radix UI primitives) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Cloudflare R2 (S3-compatible) |
| Image Processing | Sharp |
| Analytics | Umami (self-hosted, privacy-first) |
| Hosting | Vercel |

## Project Structure

```
app/
├── (site)/                    # Public pages
│   ├── page.tsx               # Home - Hero, projects, recent posts
│   ├── about/page.tsx         # About - Bio, tech stack, contact
│   ├── blog/page.tsx          # Blog listing with tag filter
│   ├── blog/[slug]/page.tsx   # Blog post detail
│   ├── art/page.tsx           # Art gallery with category filter
│   ├── art/[slug]/page.tsx    # Art piece detail
│   └── layout.tsx             # Site layout + PageViewTracker
│
├── admin/                     # Admin panel (protected)
│   ├── page.tsx               # Dashboard - stats, chart, quick actions
│   ├── login/page.tsx         # Firebase auth login
│   ├── posts/page.tsx         # Blog posts management
│   ├── posts/new/page.tsx     # Create new post
│   ├── posts/[id]/page.tsx    # Edit post
│   ├── art/page.tsx           # Artworks management
│   ├── media/page.tsx         # Image upload & management
│   ├── settings/page.tsx      # Site settings
│   └── layout.tsx             # Admin sidebar layout
│
├── api/                       # API Routes
│   ├── posts/route.ts         # GET all, POST new
│   ├── posts/[id]/route.ts    # GET, PUT, DELETE single
│   ├── art/route.ts           # GET all, POST new
│   ├── art/[slug]/route.ts    # GET, PUT, DELETE single
│   ├── upload/route.ts        # GET list, POST upload, DELETE
│   ├── settings/route.ts      # GET, PUT site settings
│   ├── analytics/route.ts     # GET stats, POST track view
│   ├── revalidate/route.ts    # POST clear cache
│   ├── auth/login/route.ts    # POST login
│   ├── auth/logout/route.ts   # POST logout
│   └── auth/check/route.ts    # GET session check
│
├── robots.ts                  # SEO robots.txt
├── sitemap.ts                 # Dynamic XML sitemap
└── layout.tsx                 # Root layout

components/
├── ui/                        # shadcn/ui components (50+ files)
├── post-editor.tsx            # Markdown editor with preview
├── markdown-renderer.tsx      # Custom markdown renderer
├── page-view-tracker.tsx      # Analytics tracking component
├── umami-analytics.tsx        # Umami Analytics script loader
├── navigation.tsx             # Header navigation
├── admin-sidebar.tsx          # Admin panel sidebar
├── terminal-hero.tsx          # Animated hero section
├── blog-list.tsx              # Blog post listing
├── art-gallery.tsx            # Art gallery grid
├── lightbox.tsx               # Image lightbox viewer
└── ...

lib/
├── firebase.ts                # Client SDK - Auth, Firestore CRUD
├── firebase-admin.ts          # Admin SDK - Session verification
├── r2.ts                      # Cloudflare R2 - Upload, list, delete
├── image-processing.ts        # Sharp - Resize, WebP conversion
├── blog-data.ts               # Sample blog data (fallback)
├── art-data.ts                # Sample art data (fallback)
└── utils.ts                   # Utility functions

middleware.ts                  # Auth protection for /admin routes
```

## Features

### Public Website

#### Home Page (`/`)
- Animated terminal-style hero section
- Featured projects showcase
- Recent blog posts

#### About Page (`/about`)
- Personal bio & story
- Tech stack display
- Contact information
- Social links

#### Blog (`/blog`)
- List all published posts
- Filter by tags
- Reading time estimation
- SEO metadata (Open Graph, Twitter cards)

#### Blog Post (`/blog/[slug]`)
- Markdown content rendering
- Code syntax highlighting
- Previous/Next navigation
- Auto-generated from Firestore

#### Art Gallery (`/art`)
- Grid layout with hover effects
- Category filter (watercolor, digital, sketch)
- Lightbox viewer

#### Art Detail (`/art/[slug]`)
- Full image display
- Metadata (medium, dimensions, date)
- Story/description
- Previous/Next navigation

### Admin Dashboard

#### Login (`/admin/login`)
- Firebase email/password auth
- Session cookie (5-day expiry)
- Error handling

#### Dashboard (`/admin`)
- Real-time stats from Firestore:
  - Total posts, published, drafts
  - Total artworks
  - Total page views
- 7-day page views chart (Recharts)
- Quick action buttons

#### Posts Management (`/admin/posts`)
- List all posts (published & drafts)
- Search by title
- Edit/Delete actions
- Publish/Draft toggle

#### Post Editor (`/admin/posts/new`, `/admin/posts/[id]`)
- Title with auto-slug generation
- Markdown editor with live preview
- Tag management
- Publish/Draft toggle
- Image insertion from Media library

#### Art Management (`/admin/art`)
- List all artworks
- Create with image upload
- Edit metadata
- Delete with confirmation

#### Media Library (`/admin/media`)
- Drag & drop upload
- Folder organization (blog/art)
- Auto image processing:
  - Resize to max 1200px width
  - Convert to WebP
  - Quality optimization (85%)
- Copy URL to clipboard
- Delete with confirmation
- Preview modal

#### Settings (`/admin/settings`)
- Site name & description
- Author info (name, email, GitHub)
- Save to Firestore
- Clear cache (revalidate pages)

### Analytics

#### Umami Analytics
- **Privacy-first**: No cookies, GDPR compliant
- **Self-hosted** tại `analytics.gianghaison.me`
- **Realtime tracking**: Xem visitors đang online
- **Multi-site support**: Có thể track nhiều website
- **Metrics**: Page views, visitors, bounce rate, referrers, countries, devices, browsers
- **Dashboard**: `https://analytics.gianghaison.me`

### API Endpoints

#### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post (auth required) |
| GET | `/api/posts/[id]` | Get single post |
| PUT | `/api/posts/[id]` | Update post (auth required) |
| DELETE | `/api/posts/[id]` | Delete post (auth required) |

#### Art
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/art` | Get all artworks |
| POST | `/api/art` | Create artwork (auth required) |
| GET | `/api/art/[slug]` | Get single artwork |
| PUT | `/api/art/[slug]` | Update artwork (auth required) |
| DELETE | `/api/art/[slug]` | Delete artwork (auth required) |

#### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/upload?folder=blog` | List files in folder |
| POST | `/api/upload` | Upload image (auth required) |
| DELETE | `/api/upload?key=...` | Delete file (auth required) |

#### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get site settings |
| PUT | `/api/settings` | Update settings (auth required) |

#### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get stats & daily views (auth required) |
| POST | `/api/analytics` | Track page view |

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Exchange Firebase token for session |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/check` | Verify session |

#### Cache
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/revalidate` | Clear cache (auth required) |

## Firestore Collections

```
posts/
├── {id}/
│   ├── title: string
│   ├── slug: string
│   ├── content: string (markdown)
│   ├── description: string
│   ├── tags: string[]
│   ├── published: boolean
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

art/
├── {id}/
│   ├── title: string
│   ├── slug: string
│   ├── image: string (URL)
│   ├── medium: string
│   ├── dimensions: string
│   ├── description: string
│   ├── category: "watercolor" | "digital" | "sketch"
│   ├── tags: string[]
│   └── createdAt: timestamp

settings/
├── site/
│   ├── siteName: string
│   ├── siteDescription: string
│   ├── authorName: string
│   ├── authorEmail: string
│   ├── githubUrl: string
│   └── updatedAt: timestamp

pageViews/
├── {path_encoded}/
│   ├── path: string
│   ├── views: number
│   └── lastUpdated: timestamp

dailyViews/
├── {YYYY-MM-DD}/
│   ├── date: string
│   └── views: number
```

## Environment Variables

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (choose one method)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
# OR
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Umami Analytics (optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

- Hosted on **Vercel**
- Auto-deploy on push to `main` branch
- Environment variables configured in Vercel dashboard

## License

Private - All rights reserved.
