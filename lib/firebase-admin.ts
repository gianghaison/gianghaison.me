import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

// ===========================================
// Firebase Admin Configuration
// For server-side operations (API routes, middleware)
// ===========================================

let adminApp: App
let adminAuth: Auth
let adminDb: Firestore

function getAdminApp(): App {
  if (!adminApp) {
    const apps = getApps()
    if (apps.length === 0) {
      // Option 1: Use service account JSON file (recommended for production)
      // Download from Firebase Console > Project Settings > Service Accounts
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : null

      if (serviceAccount) {
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
      } else {
        // Option 2: Use individual environment variables
        const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL
        const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY

        if (!projectId || !clientEmail || !privateKey) {
          throw new Error('Firebase Admin SDK: Missing required environment variables (FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY)')
        }

        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
          projectId,
        })
      }
    } else {
      adminApp = apps[0]
    }
  }
  return adminApp
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp())
  }
  return adminAuth
}

export function getAdminFirestore(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp())
  }
  return adminDb
}

// ===========================================
// Verify Firebase ID Token
// ===========================================
export async function verifyIdToken(token: string) {
  try {
    const auth = getAdminAuth()
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

// ===========================================
// Verify Session Cookie
// ===========================================
export async function verifySessionCookie(sessionCookie: string) {
  try {
    const auth = getAdminAuth()
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
    return decodedClaims
  } catch (error) {
    console.error('Error verifying session cookie:', error)
    return null
  }
}

// ===========================================
// Create Session Cookie
// ===========================================
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) {
  const auth = getAdminAuth()
  return await auth.createSessionCookie(idToken, { expiresIn })
}
