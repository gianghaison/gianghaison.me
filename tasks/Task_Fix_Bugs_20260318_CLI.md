# Task: Fix 3 Bugs — gianghaison.me
# Date: 18/03/2026
# Chạy trong: Claude Code CLI, thư mục C:\MyJourney\gianghaison.me

## Prompt cho Claude Code CLI — paste nguyên đoạn này:

---

Tôi cần fix 3 bugs trong project này. Thực hiện lần lượt, từng bước rõ ràng.

---

### FIX 1: app/api/analytics/route.ts — Sai logic đếm publishedPosts

Tìm đoạn code này:
```ts
const publishedPosts = posts.filter(p => p.published).length
const draftPosts = posts.length - publishedPosts
```

Thay bằng:
```ts
const publishedPosts = posts.filter(p => p.status === 'published').length
const draftPosts = posts.filter(p => p.status === 'draft').length
const scheduledPosts = posts.filter(p => p.status === 'scheduled').length
```

Tìm object `stats` trong return, thêm `scheduledPosts` vào:
```ts
stats: {
  totalPosts: posts.length,
  publishedPosts,
  draftPosts,
  scheduledPosts,
  totalArt: artworks.length,
  totalViews,
},
```

---

### FIX 2: app/api/art/route.ts — POST handler thiếu `status` field

Trong hàm POST, tìm dòng destructure:
```ts
const { title, slug, image, medium, dimensions, description, category, tags } = body
```

Thêm `status` vào:
```ts
const { title, slug, image, medium, dimensions, description, category, tags, status } = body
```

Sau dòng validate `category`, thêm validate status:
```ts
const artStatus = ['draft', 'published'].includes(status) ? status : 'published'
```

Tìm object `art` được tạo ra:
```ts
const art: Omit<Art, 'id' | 'createdAt'> = {
  title,
  slug,
  image,
  medium,
  dimensions,
  description: description || '',
  category,
  tags: tags || [],
}
```

Thêm `status` vào và đổi cách gọi createArt:
```ts
const art: Omit<Art, 'id' | 'createdAt'> = {
  title,
  slug,
  image,
  medium,
  dimensions,
  description: description || '',
  category,
  tags: tags || [],
}

const id = await createArt({ ...art, status: artStatus } as any)
```

Xóa dòng `const id = await createArt(art)` cũ.

---

### FIX 3: app/api/revalidate/route.ts — Thêm secret token auth

File hiện tại chỉ cho phép session cookie. Cần thêm Bearer token để MCP gọi được.

Thay toàn bộ nội dung file bằng:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// POST /api/revalidate - Clear cache and rebuild static pages
// Supports two auth methods:
// 1. Bearer token via Authorization header (for MCP/external services)
// 2. Session cookie (for admin UI)
export async function POST(request: NextRequest) {
  try {
    let authorized = false

    // Method 1: Secret token (for MCP/external calls)
    const authHeader = request.headers.get('authorization')
    const secretToken = process.env.REVALIDATE_SECRET_TOKEN

    if (secretToken && authHeader === `Bearer ${secretToken}`) {
      authorized = true
    }

    // Method 2: Session cookie (for admin UI)
    if (!authorized) {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')?.value

      if (sessionCookie) {
        const decodedClaims = await verifySessionCookie(sessionCookie)
        if (decodedClaims) {
          authorized = true
        }
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Revalidate all main paths
    revalidatePath('/', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath('/art', 'page')
    revalidatePath('/about', 'page')

    return NextResponse.json({
      message: 'Cache cleared successfully',
      revalidated: ['/', '/blog', '/art', '/about']
    })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
```

---

### SAU KHI FIX XONG CẢ 3:

1. Chạy: `npm run build`
2. Nếu build PASS: `git add -A && git commit -m "fix: analytics status count, art status field, revalidate bearer token auth" && git push`
3. Nếu build FAIL: báo lỗi đầy đủ để xem xét

---

### NHẮC SAU KHI PUSH XONG:

Cần thêm env var này vào Vercel dashboard (Settings → Environment Variables):
- Key: `REVALIDATE_SECRET_TOKEN`  
- Value: tạo random string 32 ký tự, ví dụ chạy lệnh: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
- Environment: Production + Preview

Sau đó cũng thêm vào file `.env.local` ở local để test.
