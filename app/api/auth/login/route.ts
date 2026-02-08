import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/firebase-admin'

// POST /api/auth/login - Exchange Firebase ID token for session cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    // Create session cookie (5 days expiry)
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days in milliseconds
    const sessionCookie = await createSessionCookie(idToken, expiresIn)

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 401 })
    }

    // Set cookie in response
    const response = NextResponse.json({ message: 'Logged in successfully' })

    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
