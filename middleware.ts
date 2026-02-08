import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('session')?.value

    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify the session cookie by calling our API
    // Note: We can't use firebase-admin directly in Edge runtime
    // So we verify the session on the server-side when the page loads
    // For now, we just check if the cookie exists
    // The actual verification happens in API routes and server components

    // For enhanced security, you could make a fetch to /api/auth/check
    // but this adds latency to every admin page request
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
