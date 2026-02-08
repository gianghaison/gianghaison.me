import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth'

// ===========================================
// Firebase Configuration
// Replace these with your actual Firebase credentials
// ===========================================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

// ===========================================
// Initialize Firebase (singleton pattern)
// ===========================================
let app: FirebaseApp
let db: Firestore
let auth: Auth

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return app
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

// ===========================================
// Types
// ===========================================
export type PostStatus = 'draft' | 'published' | 'scheduled'
export type PostLang = 'en' | 'vi'

export interface Post {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  status: PostStatus
  author: string
  lang: PostLang
  publishedAt?: Date | Timestamp
  scheduledAt?: Date | Timestamp
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
  // Legacy fields (backward compat reads from Firestore)
  published?: boolean
  description?: string
}

export interface Art {
  id?: string
  title: string
  slug: string
  image: string
  medium: string
  dimensions: string
  description?: string
  category: 'watercolor' | 'digital' | 'sketch'
  tags: string[]
  createdAt: Date | Timestamp
}

export interface PageView {
  path: string
  views: number
  lastUpdated: Date | Timestamp
}

export interface DailyView {
  date: string
  views: number
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  authorName: string
  authorEmail: string
  githubUrl: string
  updatedAt?: Date | Timestamp
}

// ===========================================
// Helper to convert Firestore document
// ===========================================
function convertTimestamps<T extends DocumentData>(data: T): T {
  const result = { ...data }
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = (result[key] as Timestamp).toDate() as unknown as T[Extract<keyof T, string>]
    }
  }
  return result
}

function normalizePost(raw: Post): Post {
  const post = { ...raw }

  // Backward compat: map old "description" → "excerpt"
  if (!post.excerpt && post.description) {
    post.excerpt = post.description
  }
  if (!post.excerpt) post.excerpt = ''

  // Backward compat: map old "published: boolean" → "status"
  if (!post.status) {
    if (typeof post.published === 'boolean') {
      post.status = post.published ? 'published' : 'draft'
    } else {
      post.status = 'draft'
    }
  }

  // Default new fields
  if (!post.author) post.author = 'Giang H\u1ea3i S\u01a1n'
  if (!post.lang) post.lang = 'vi'

  // If published but no publishedAt, use createdAt as fallback
  if (post.status === 'published' && !post.publishedAt) {
    post.publishedAt = post.createdAt
  }

  return post
}

function docToPost(doc: QueryDocumentSnapshot<DocumentData>): Post {
  const data = doc.data()
  const raw = {
    id: doc.id,
    ...convertTimestamps(data),
  } as Post
  return normalizePost(raw)
}

function docToArt(doc: QueryDocumentSnapshot<DocumentData>): Art {
  const data = doc.data()
  return {
    id: doc.id,
    ...convertTimestamps(data),
  } as Art
}

// ===========================================
// Posts CRUD
// ===========================================
export async function getPosts(publishedOnly = true): Promise<Post[]> {
  const db = getFirestoreDb()
  const postsRef = collection(db, 'posts')

  // Fetch all posts and filter in JS (simple, handles backward compat + scheduled)
  const q = query(postsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  let posts = snapshot.docs.map(docToPost)

  if (publishedOnly) {
    const now = new Date()
    posts = posts.filter(p => {
      if (p.status === 'published') return true
      if (p.status === 'scheduled' && p.scheduledAt) {
        const scheduledDate = p.scheduledAt instanceof Date
          ? p.scheduledAt
          : new Date((p.scheduledAt as Timestamp).seconds * 1000)
        return scheduledDate <= now
      }
      return false
    })
  }

  return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = getFirestoreDb()
  const postsRef = collection(db, 'posts')
  const q = query(postsRef, where('slug', '==', slug), limit(1))

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  return docToPost(snapshot.docs[0])
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'posts', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  const raw = {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Post
  return normalizePost(raw)
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'published' | 'description'>): Promise<string> {
  const db = getFirestoreDb()
  const now = Timestamp.now()

  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    publishedAt: post.status === 'published' ? now : (post.publishedAt || null),
    scheduledAt: post.scheduledAt || null,
    createdAt: now,
    updatedAt: now,
  })

  return docRef.id
}

export async function updatePost(id: string, post: Partial<Post>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'posts', id)

  const updateData: Record<string, unknown> = { ...post }

  // Auto-set publishedAt when transitioning to "published"
  if (post.status === 'published' && !post.publishedAt) {
    updateData.publishedAt = Timestamp.now()
  }

  // Clear scheduledAt when status is not "scheduled"
  if (post.status && post.status !== 'scheduled') {
    updateData.scheduledAt = null
  }

  updateData.updatedAt = Timestamp.now()

  await updateDoc(docRef, updateData)
}

export async function deletePost(id: string): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'posts', id)
  await deleteDoc(docRef)
}

// ===========================================
// Art CRUD
// ===========================================
export async function getArtworks(): Promise<Art[]> {
  const db = getFirestoreDb()
  const artRef = collection(db, 'art')
  const q = query(artRef, orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToArt)
}

export async function getArtworkBySlug(slug: string): Promise<Art | null> {
  const db = getFirestoreDb()
  const artRef = collection(db, 'art')
  const q = query(artRef, where('slug', '==', slug), limit(1))

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  return docToArt(snapshot.docs[0])
}

export async function getArtworkById(id: string): Promise<Art | null> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'art', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Art
}

export async function createArt(art: Omit<Art, 'id' | 'createdAt'>): Promise<string> {
  const db = getFirestoreDb()
  const now = Timestamp.now()

  const docRef = await addDoc(collection(db, 'art'), {
    ...art,
    createdAt: now,
  })

  return docRef.id
}

export async function updateArt(id: string, art: Partial<Art>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'art', id)

  await updateDoc(docRef, art)
}

export async function deleteArt(id: string): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'art', id)
  await deleteDoc(docRef)
}

// ===========================================
// Analytics
// ===========================================
export async function getPageViews(): Promise<PageView[]> {
  const db = getFirestoreDb()
  const viewsRef = collection(db, 'pageViews')
  const q = query(viewsRef, orderBy('views', 'desc'))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    path: doc.id,
    ...convertTimestamps(doc.data()),
  })) as PageView[]
}

export async function incrementPageView(path: string): Promise<void> {
  const db = getFirestoreDb()
  const { setDoc, increment } = await import('firebase/firestore')

  // Update total page views
  const pageId = path.replace(/\//g, '_') || '_home'
  const pageRef = doc(db, 'pageViews', pageId)
  await setDoc(pageRef, {
    path,
    views: increment(1),
    lastUpdated: Timestamp.now(),
  }, { merge: true })

  // Update daily views
  const today = new Date().toISOString().split('T')[0]
  const dailyRef = doc(db, 'dailyViews', today)
  await setDoc(dailyRef, {
    date: today,
    views: increment(1),
  }, { merge: true })
}

export async function getDailyViews(days: number = 7): Promise<DailyView[]> {
  const db = getFirestoreDb()
  const dailyRef = collection(db, 'dailyViews')
  const q = query(dailyRef, orderBy('date', 'desc'), limit(days))

  const snapshot = await getDocs(q)
  const views = snapshot.docs.map((doc) => ({
    date: doc.id,
    views: doc.data().views || 0,
  }))

  // Fill in missing days with 0 views
  const result: DailyView[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const existing = views.find(v => v.date === dateStr)
    result.push({
      date: dateStr,
      views: existing?.views || 0,
    })
  }

  return result
}

// ===========================================
// Settings
// ===========================================
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'gianghaison.me',
  siteDescription: 'A designer lost in the land of code. Building products with AI, sharing the real journey.',
  authorName: 'Giang H\u1ea3i S\u01a1n',
  authorEmail: 'hello@gianghaison.me',
  githubUrl: 'https://github.com/gianghaison',
}

export async function getSettings(): Promise<SiteSettings> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'settings', 'site')
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return DEFAULT_SETTINGS
  }

  return {
    ...DEFAULT_SETTINGS,
    ...convertTimestamps(docSnap.data()),
  } as SiteSettings
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'settings', 'site')
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now(),
    })
  } else {
    const { setDoc } = await import('firebase/firestore')
    await setDoc(docRef, {
      ...DEFAULT_SETTINGS,
      ...settings,
      updatedAt: Timestamp.now(),
    })
  }
}

// ===========================================
// Auth
// ===========================================
export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth()
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}

export async function getCurrentUser(): Promise<User | null> {
  const auth = getFirebaseAuth()
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// ===========================================
// Helper functions
// ===========================================
export function getAllTags(posts: Post[]): string[] {
  const tagSet = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export function getAdjacentPosts(posts: Post[], slug: string) {
  const index = posts.findIndex((p) => p.slug === slug)
  return {
    previous: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  }
}

export function getAllCategories(artworks: Art[]): string[] {
  const cats = new Set<string>()
  for (const art of artworks) {
    cats.add(art.category)
  }
  return Array.from(cats).sort()
}

export function getAdjacentArtworks(artworks: Art[], slug: string) {
  const index = artworks.findIndex((a) => a.slug === slug)
  return {
    previous: index > 0 ? artworks[index - 1] : null,
    next: index < artworks.length - 1 ? artworks[index + 1] : null,
  }
}
