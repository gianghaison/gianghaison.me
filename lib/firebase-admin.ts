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
        adminApp = initializeApp({
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'YOUR_CLIENT_EMAIL',
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || 'YOUR_PRIVATE_KEY').replace(/\\n/g, '\n'),
          }),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
  try {
    const auth = getAdminAuth()
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    return sessionCookie
  } catch (error) {
    console.error('Error creating session cookie:', error)
    return null
  }
}
