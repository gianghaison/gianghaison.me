import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    let authorized = false

    const authHeader = request.headers.get('authorization')
    const secretToken = process.env.REVALIDATE_SECRET_TOKEN
    if (secretToken && authHeader === `Bearer ${secretToken}`) {
      authorized = true
    }

    if (!authorized) {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('session')?.value
      if (sessionCookie) {
        const decodedClaims = await verifySessionCookie(sessionCookie)
        if (decodedClaims) authorized = true
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    revalidatePath('/', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath('/art', 'page')
    revalidatePath('/about', 'page')

    return NextResponse.json({ message: 'Cache cleared successfully', revalidated: ['/', '/blog', '/art', '/about'] })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
