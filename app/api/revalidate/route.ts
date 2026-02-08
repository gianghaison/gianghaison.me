import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// POST /api/revalidate - Clear cache and rebuild static pages
export async function POST() {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedClaims = await verifySessionCookie(sessionCookie)
    if (!decodedClaims) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Revalidate all main paths
    revalidatePath('/', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath('/art', 'page')
    revalidatePath('/about', 'page')

    return NextResponse.json({
      message: 'Cache cleared successfully',
      revalidated: ['/', '/blog', '/art', '/about']
    })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
