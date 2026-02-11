# CLAUDE.md - Project Instructions

## Ngôn ngữ
- Giao tiếp bằng **Tiếng Việt**

## Quy trình commit
Trước khi commit, **luôn hỏi**:
```
Bạn đã test local chưa? Nếu OK, push lên Production?

🚀 Push lên Production (gianghaison.me)
⏸️ Để sau, tiếp tục code
```

## Git
- Branch: `main` → Production
- Không có staging/test environment
- Commit message: conventional commits + Co-Authored-By

## Tech stack
- Next.js 16, React 19, TypeScript
- Firebase (Auth + Firestore)
- Cloudflare R2 (images)
- Vercel (hosting)

## Commands
- `npm run dev` - Development server
- `npm run build` - Build production
- `npm install` - Install dependencies (với legacy-peer-deps)

## Firestore Collections

### `posts` - Blog posts
| Field | Type | Description |
|-------|------|-------------|
| title | string | Tiêu đề bài viết |
| slug | string | URL slug |
| content | string | Nội dung markdown |
| excerpt | string | Mô tả ngắn |
| tags | array | Danh sách tags |
| status | string | `draft` / `published` / `scheduled` |
| publishedAt | timestamp | Ngày publish |
| scheduledAt | timestamp | Ngày hẹn publish (nếu scheduled) |
| createdAt | timestamp | Ngày tạo |

### `art` - Artworks gallery
| Field | Type | Description |
|-------|------|-------------|
| title | string | Tên tác phẩm |
| slug | string | URL slug |
| image | string | URL ảnh từ R2 (https://r2.gianghaison.me/art/...) |
| medium | string | Chất liệu (oil, watercolor, digital...) |
| category | string | Thể loại |
| dimensions | string | Kích thước |
| description | string | Mô tả |
| createdAt | timestamp | Ngày tạo |

## Cloudflare R2 Storage

### Config (.env.local)
```
R2_ACCOUNT_ID=<cloudflare_account_id>
R2_ACCESS_KEY_ID=<api_token_access_key>
R2_SECRET_ACCESS_KEY=<api_token_secret>
R2_BUCKET_NAME=gianghaison-assets
R2_PUBLIC_URL=https://r2.gianghaison.me
```

### Folder structure
- `art/` - Artwork images
- `blog/` - Blog post images

### Upload flow
1. Upload file lên R2 qua API `/api/upload`
2. Tạo document trong Firestore với field `image` = URL từ R2
3. Frontend đọc từ Firestore và hiển thị ảnh từ R2

## Key Files
- `lib/firebase.ts` - Firebase client & CRUD functions
- `lib/r2.ts` - Cloudflare R2 upload functions
- `components/recent-posts.tsx` - Homepage recent posts (async server component)
- `components/art-gallery.tsx` - Art gallery grid
- `next.config.mjs` - Next.js config (includes R2 domain in remotePatterns)

## Social Links
- GitHub: https://github.com/gianghaison
- X/Twitter: https://x.com/gianghaison
- Facebook: https://www.facebook.com/gianghaison.me
