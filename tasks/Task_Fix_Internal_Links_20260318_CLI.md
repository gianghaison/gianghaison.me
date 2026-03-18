# Task: Fix Internal Blog Links — gianghaison.me
# Date: 18/03/2026
# File: gianghaison.me/tasks/Task_Fix_Internal_Links_20260318_CLI.md

## Mô tả
MarkdownRenderer không auto-correct internal links thiếu /blog prefix.
Bài cũ Kai viết link dạng /ten-bai thay vì /blog/ten-bai → 404.
Fix: thêm logic tự patch trong component `a` của MarkdownRenderer.

## Prompt — copy toàn bộ phần dưới đây vào CLI:
---
Đọc file `components/markdown-renderer.tsx`. Tìm component `a`, thay toàn bộ bằng:

```ts
a: ({ href, children }) => {
  let finalHref = href || ''

  if (
    finalHref.startsWith('/') &&
    !finalHref.startsWith('/blog/') &&
    !finalHref.startsWith('/art/') &&
    !finalHref.startsWith('/about') &&
    !finalHref.startsWith('/khaosat') &&
    !finalHref.startsWith('/#')
  ) {
    finalHref = `/blog${finalHref}`
  }

  const isExternal = finalHref.startsWith('http')

  return (
    <a
      href={finalHref}
      className="text-primary underline-offset-4 hover:underline"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
},
```

Sau khi sửa xong: npm run build → nếu pass thì git add -A && git commit -m "fix: auto-correct internal blog links missing /blog prefix" && git push. Nếu fail thì báo lỗi.
---
