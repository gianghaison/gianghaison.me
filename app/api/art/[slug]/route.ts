import { NextRequest, NextResponse } from 'next/server'
import { getArtworkBySlug, getArtworkById, updateArt, deleteArt, getArtworks } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/art/[slug] - Get a single artwork by slug or ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    // Try to find by slug first
    let artwork = await getArtworkBySlug(slug)

    // If not found, try by ID
    if (!artwork) {
      artwork = await getArtworkById(slug)
    }

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    // Get adjacent artworks for navigation
    const allArtworks = await getArtworks()
    const currentIndex = allArtworks.findIndex((a) => a.slug === artwork!.slug)

    const adjacent = {
      previous: currentIndex > 0 ? allArtworks[currentIndex - 1] : null,
      next: currentIndex < allArtworks.length - 1 ? allArtworks[currentIndex + 1] : null,
    }

    return NextResponse.json({ artwork, adjacent })
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  }
}

// PUT /api/art/[slug] - Update an artwork
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { slug } = await params
    const body = await request.json()

    // Find artwork by slug or ID
    let artwork = await getArtworkBySlug(slug)
    if (!artwork) {
      artwork = await getArtworkById(slug)
    }

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    // Validate category if provided
    if (body.category && !['watercolor', 'digital', 'sketch'].includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: watercolor, digital, or sketch' },
        { status: 400 }
      )
    }

    // Update artwork with provided fields
    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.image !== undefined) updateData.image = body.image
    if (body.medium !== undefined) updateData.medium = body.medium
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.tags !== undefined) updateData.tags = body.tags

    await updateArt(artwork.id!, updateData)

    return NextResponse.json({ message: 'Artwork updated successfully' })
  } catch (error) {
    console.error('Error updating artwork:', error)
    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    )
  }
}

// DELETE /api/art/[slug] - Delete an artwork
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { slug } = await params

    // Find artwork by slug or ID
    let artwork = await getArtworkBySlug(slug)
    if (!artwork) {
      artwork = await getArtworkById(slug)
    }

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    await deleteArt(artwork.id!)

    return NextResponse.json({ message: 'Artwork deleted successfully' })
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    )
  }
}
