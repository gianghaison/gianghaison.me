# Project Context - gianghaison.me

## Thông tin dự án
- **Website**: gianghaison.me (personal website/blog)
- **Tech stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth + Firestore), Cloudflare R2 (images)
- **Hosting**: Vercel

## Quy trình làm việc

### Git workflow
- **Branch chính**: `main` → Production (gianghaison.me)
- **Không có branch test** - push thẳng production
- Test local (`npm run dev`) trước khi push

### Trước khi commit, luôn hỏi:
```
Bạn đã test local chưa? Nếu OK, push lên Production?

🚀 Push lên Production (gianghaison.me)
⏸️ Để sau, tiếp tục code
```

### Commit message format
- Sử dụng conventional commits (feat, fix, chore, etc.)
- Kết thúc bằng: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`

## Cấu hình đặc biệt
- `devIndicators: false` trong next.config.mjs (tắt V0 Dev Tools)
- `.npmrc` với `legacy-peer-deps=true` (React 19 compatibility)
- `vercel.json` với `installCommand: "npm install"`

## Tính năng đã hoàn thiện (100%)
- ✅ Public pages (Home, About, Blog, Art Gallery)
- ✅ Admin dashboard với real analytics
- ✅ Blog CRUD (tạo, sửa, xóa bài viết)
- ✅ Art CRUD (tạo, sửa, xóa artwork)
- ✅ Media upload với xử lý ảnh (Sharp, WebP)
- ✅ Settings page kết nối Firestore
- ✅ Page view tracking
- ✅ SEO (robots.txt, sitemap)
- ✅ Authentication với session cookies

## Lưu ý
- Ngôn ngữ giao tiếp: Tiếng Việt
- Ưu tiên đơn giản, không over-engineering
