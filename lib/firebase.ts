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
export interface Post {
  id?: string
  title: string
  slug: string
  content: string
  description: string
  tags: string[]
  published: boolean
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
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

function docToPost(doc: QueryDocumentSnapshot<DocumentData>): Post {
  const data = doc.data()
  return {
    id: doc.id,
    ...convertTimestamps(data),
  } as Post
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

  let q = query(postsRef, orderBy('createdAt', 'desc'))
  if (publishedOnly) {
    q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToPost)
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

  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Post
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getFirestoreDb()
  const now = Timestamp.now()

  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    createdAt: now,
    updatedAt: now,
  })

  return docRef.id
}

export async function updatePost(id: string, post: Partial<Post>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'posts', id)

  await updateDoc(docRef, {
    ...post,
    updatedAt: Timestamp.now(),
  })
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
  siteDescription: 'Making useful things with code & AI',
  authorName: 'Giang Hai Son',
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
