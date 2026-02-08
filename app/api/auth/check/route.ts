import { NextResponse } from 'next/server'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// GET /api/auth/check - Check if user is authenticated
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false })
    }

    const decodedClaims = await verifySessionCookie(sessionCookie)

    if (!decodedClaims) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
      },
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    return NextResponse.json({ authenticated: false })
  }
}
