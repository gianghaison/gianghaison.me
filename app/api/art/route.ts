import { NextRequest, NextResponse } from 'next/server'
import { getArtworks, createArt, Art } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// GET /api/art - Get all artworks
export async function GET() {
  try {
    const artworks = await getArtworks()
    return NextResponse.json({ artworks })
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}

// POST /api/art - Create a new artwork
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, slug, image, medium, dimensions, description, category, tags } = body

    // Validate required fields
    if (!title || !slug || !image || !medium || !dimensions || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, image, medium, dimensions, category' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['watercolor', 'digital', 'sketch'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: watercolor, digital, or sketch' },
        { status: 400 }
      )
    }

    const art: Omit<Art, 'id' | 'createdAt'> = {
      title,
      slug,
      image,
      medium,
      dimensions,
      description: description || '',
      category,
      tags: tags || [],
    }

    const id = await createArt(art)

    return NextResponse.json({ id, message: 'Artwork created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating artwork:', error)
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    )
  }
}
