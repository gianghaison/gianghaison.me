import { NextRequest, NextResponse } from 'next/server'
import { getPageViews, getDailyViews, incrementPageView, getPosts, getArtworks } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// GET /api/analytics - Get page view analytics
export async function GET() {
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

    // Fetch all data in parallel
    const [pageViews, dailyViews, posts, artworks] = await Promise.all([
      getPageViews(),
      getDailyViews(7),
      getPosts(false), // Get all posts including drafts
      getArtworks(),
    ])

    // Calculate stats
    const totalViews = pageViews.reduce((sum, pv) => sum + pv.views, 0)
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = posts.length - publishedPosts

    return NextResponse.json({
      pageViews,
      dailyViews,
      stats: {
        totalPosts: posts.length,
        publishedPosts,
        draftPosts,
        totalArt: artworks.length,
        totalViews,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST /api/analytics - Track a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    await incrementPageView(path)

    return NextResponse.json({ message: 'Page view recorded' })
  } catch (error) {
    console.error('Error recording page view:', error)
    return NextResponse.json(
      { error: 'Failed to record page view' },
      { status: 500 }
    )
  }
}
