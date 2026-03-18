# gianghaison.me — QUICK STATUS

**Last updated:** 18/03/2026  
**Stack:** Next.js 16 + React 19 + TypeScript + Firebase + Cloudflare R2 + Vercel  
**URL:** https://gianghaison.me  
**Branch:** main → Production (Vercel auto-deploy)

---

## STATUS HIỆN TẠI

### ✅ Đã hoạt động
- Blog CRUD qua MCP (create/update/publish/delete)
- Art gallery CRUD qua MCP
- Upload ảnh lên R2 qua MCP
- Auth: session cookie + Firebase Admin SDK
- Sitemap động (blog + art)
- Umami analytics
- Scheduled posts
- POST /api/posts → Admin SDK
- Analytics đếm đúng publishedPosts/draftPosts/scheduledPosts ✅ (fixed 18/03)
- Art POST có status field ✅ (fixed 18/03)
- Revalidate hỗ trợ Bearer token ✅ (fixed 18/03)

### ⏳ Todo tiếp theo
- Thêm REVALIDATE_SECRET_TOKEN vào Vercel dashboard ⚠️ (chưa làm)
- Thêm OG image cho blog posts (SEO)
- On-demand revalidate từ MCP sau khi publish

---

## KNOWN ISSUES ĐÃ FIX
- POST /api/posts → PERMISSION_DENIED (fixed: Admin Firestore)
- analytics publishedPosts dùng p.published cũ (fixed 18/03)
- art POST thiếu status field (fixed 18/03)
- revalidate chỉ hỗ trợ session cookie (fixed 18/03: thêm Bearer token)

---

## MCP TOOLS (gianghaison-blog)
Dùng trong Claude Desktop:
- `upload_image` — upload file local lên R2
- `create_post` / `update_post` / `publish_post` / `delete_post`
- `list_posts` / `get_post`
- `create_artwork` / `update_artwork` / `delete_artwork` / `list_artworks`

Revalidate cache sau publish (sau khi có token):
```
POST https://gianghaison.me/api/revalidate
Authorization: Bearer <REVALIDATE_SECRET_TOKEN>
```

---

## QUY TẮC LÀM VIỆC

### Workflow chuẩn với CLI
1. Kai tạo file `tasks/Task_XXX_TenTask_CLI.md`
2. File chứa prompt chia thành **nhiều đoạn ngắn** (mỗi đoạn < 50 dòng)
3. Sơn paste từng đoạn vào Claude Code CLI trong Cursor
4. CLI thực thi → báo kết quả
5. Kai update QUICK.md

### Deploy rule (BẮT BUỘC)
```bash
npm run build  # pass → push, fail → fix → build lại
```

---

## ENV VARS (Vercel)
- NEXT_PUBLIC_FIREBASE_* — Firebase client config
- FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY — Admin SDK
- R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL
- REVALIDATE_SECRET_TOKEN ⚠️ Chưa thêm vào Vercel
