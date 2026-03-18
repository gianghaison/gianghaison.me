import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env từ .env.local manually
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return
  const eqIndex = trimmed.indexOf('=')
  if (eqIndex === -1) return
  const key = trimmed.slice(0, eqIndex)
  let value = trimmed.slice(eqIndex + 1)
  // Remove surrounding quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  process.env[key] = value
})

// Init Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null

if (!serviceAccount) {
  // Dùng individual env vars
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ?.replace(/^"(.*)"$/, '$1')
    .replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Missing Firebase Admin env vars')
    process.exit(1)
  }

  if (getApps().length === 0) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  }
} else {
  if (getApps().length === 0) {
    initializeApp({ credential: cert(serviceAccount) })
  }
}

const db = getFirestore()

// Known valid prefixes — KHÔNG auto-prefix những path này
const VALID_PREFIXES = [
  '/blog/',
  '/art/',
  '/about',
  '/khaosat',
  '/#',
  'http',
  'https',
  'mailto',
]

function needsFixing(href) {
  if (!href) return false
  if (!href.startsWith('/')) return false
  return !VALID_PREFIXES.some(p => href.startsWith(p))
}

function fixLinks(content) {
  // Regex: tìm markdown links [text](href) và raw hrefs trong HTML <a href="...">
  // Pattern 1: markdown [text](/slug)
  // Pattern 2: href="/slug"
  let fixed = content
  let count = 0

  // Fix markdown links
  fixed = fixed.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, text, href) => {
    if (needsFixing(href)) {
      count++
      console.log(`  🔧 Markdown: ${href} → /blog${href}`)
      return `[${text}](/blog${href})`
    }
    return match
  })

  // Fix HTML href attributes
  fixed = fixed.replace(/href="([^"]+)"/g, (match, href) => {
    if (needsFixing(href)) {
      count++
      console.log(`  🔧 HTML href: ${href} → /blog${href}`)
      return `href="/blog${href}"`
    }
    return match
  })

  return { fixed, count }
}

async function main() {
  console.log('🔍 Scanning all posts for broken internal links...\n')

  const snap = await db.collection('posts').orderBy('createdAt', 'desc').get()
  console.log(`📝 Total posts: ${snap.docs.length}\n`)

  let totalFixed = 0
  let postsFixed = 0

  for (const doc of snap.docs) {
    const data = doc.data()
    const title = data.title || doc.id
    const content = data.content || ''

    const { fixed, count } = fixLinks(content)

    if (count > 0) {
      console.log(`\n📄 "${title}"`)
      console.log(`   ID: ${doc.id}`)
      await doc.ref.update({
        content: fixed,
        updatedAt: new Date(),
      })
      console.log(`   ✅ Fixed ${count} link(s)`)
      totalFixed += count
      postsFixed++
    }
  }

  console.log('\n' + '='.repeat(50))
  if (totalFixed === 0) {
    console.log('✅ No broken links found. All clean!')
  } else {
    console.log(`✅ Done! Fixed ${totalFixed} link(s) in ${postsFixed} post(s)`)
  }
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
