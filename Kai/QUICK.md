# gianghaison.me — QUICK STATUS

**Last updated:** 18/03/2026  
**Stack:** Next.js 16 + React 19 + TypeScript + Firebase + Cloudflare R2 + Vercel  
**URL:** https://gianghaison.me  
**Branch:** main → Production (Vercel auto-deploy)

---

## STATUS HIỆN TẠI

### ✅ Đã hoạt động
- Blog CRUD qua MCP
- Art gallery CRUD qua MCP
- Upload ảnh lên R2 qua MCP
- Auth: session cookie + Firebase Admin SDK
- Sitemap động (blog + art)
- Umami analytics
- Scheduled posts
- Analytics đếm đúng publishedPosts/draftPosts/scheduledPosts
- Art POST có status field
- Revalidate hỗ trợ Bearer token
- Art detail page dùng Admin Firestore (fix 404)
- MarkdownRenderer auto-correct internal links thiếu /blog prefix

### ⏳ Todo tiếp theo
- Thêm REVALIDATE_SECRET_TOKEN vào Vercel dashboard ⚠️
- OG image cho blog posts (SEO)

---

## KNOWN ISSUES ĐÃ FIX (18/03/2026)
- analytics publishedPosts dùng p.published cũ → p.status
- art POST thiếu status field
- revalidate chỉ hỗ trợ session cookie → thêm Bearer token
- art detail page 404 → dùng Admin Firestore
- internal links thiếu /blog prefix → auto-correct trong MarkdownRenderer

---

## MCP TOOLS (gianghaison-blog)
- `upload_image` — upload file local lên R2
- `create_post` / `update_post` / `publish_post` / `delete_post`
- `list_posts` / `get_post`
- `create_artwork` / `update_artwork` / `delete_artwork` / `list_artworks`

Revalidate cache (sau khi có token):
```
POST https://gianghaison.me/api/revalidate
Authorization: Bearer <REVALIDATE_SECRET_TOKEN>
```

---

## QUY TẮC LÀM VIỆC

### CLI Workflow (BẮT BUỘC)
1. Kai tạo file `tasks/Task_XXX_CLI.md`
2. Kai đưa Sơn đúng 1 câu để paste vào CLI:
   `Đọc file tasks/Task_XXX_CLI.md và thực thi theo đúng hướng dẫn trong đó.`
3. CLI tự đọc file → tự thực thi → báo kết quả
4. Sơn không cần mở file, không cần copy nội dung

### Deploy rule
```bash
npm run build  # pass → push, fail → fix → build lại
```

---

## ENV VARS (Vercel)
- NEXT_PUBLIC_FIREBASE_* — Firebase client config
- FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY
- R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL
- REVALIDATE_SECRET_TOKEN ⚠️ Chưa thêm vào Vercel
