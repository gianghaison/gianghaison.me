import { NextResponse } from 'next/server'

// POST /api/auth/logout - Clear session cookie
export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' })

    // Clear the session cookie
    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
