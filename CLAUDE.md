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
