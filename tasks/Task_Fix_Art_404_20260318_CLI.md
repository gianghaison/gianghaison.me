# Task: Fix Art 404 — gianghaison.me
# Date: 18/03/2026
# Chạy trong: Claude Code CLI, thư mục C:\MyJourney\gianghaison.me

## Root cause
- `getArtworkBySlug()` trong lib/firebase.ts dùng client SDK
- `generateStaticParams()` trong art/[slug]/page.tsx gọi `getArtworks(publishedOnly=true)`
- Artwork cũ không có field `status` → bị filter out → slug không được pre-generate → 404
- Art list page (/art) dùng Admin SDK nên hiển thị đúng, nhưng detail page thì 404

## ĐOẠN 1 — Paste vào CLI:

Đọc file `app/(site)/art/[slug]/page.tsx`.

Tìm hàm `generateStaticParams`, hiện tại đang dùng `getArtworks()` từ client SDK.
Thay toàn bộ hàm `generateStaticParams` bằng cách dùng Admin Firestore trực tiếp:

```ts
export async function generateStaticParams() {
  try {
    const { getAdminFirestore } = await import('@/lib/firebase-admin')
    const db = getAdminFirestore()
    const snap = await db.collection('art')
      .orderBy('createdAt', 'desc')
      .get()
    const artworks = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((a: any) => !a.status || a.status === 'published')
    return artworks.map((artwork: any) => ({ slug: artwork.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
```

Tiếp theo, trong hàm `ArtDetailPage`, tìm dòng:
```ts
const artwork = await getArtworkBySlug(slug)
```

Thay bằng cách dùng Admin Firestore:
```ts
const { getAdminFirestore } = await import('@/lib/firebase-admin')
const db = getAdminFirestore()
const snap = await db.collection('art')
  .where('slug', '==', slug)
  .limit(1)
  .get()

if (snap.empty) notFound()

const doc = snap.docs[0]
const artData = { id: doc.id, ...doc.data() } as any

// Check visibility
if (artData.status && artData.status !== 'published') notFound()

const artwork = artData
```

Sau đó tìm dòng:
```ts
const allArtworks = await getArtworks()
```

Thay bằng:
```ts
const allSnap = await db.collection('art').orderBy('createdAt', 'desc').get()
const allArtworks = allSnap.docs
  .map(d => ({ id: d.id, ...d.data() } as any))
  .filter((a: any) => !a.status || a.status === 'published')
```

Giữ nguyên phần còn lại của file (getAdjacentArtworks, artworkData mapping, return).

## ĐOẠN 2 — Paste vào CLI sau khi đoạn 1 xong:

Chạy `npm run build`.

Nếu pass: `git add -A && git commit -m "fix: art detail page 404 - use Admin Firestore for slug generation and detail fetch" && git push`

Nếu fail: báo lỗi đầy đủ.
