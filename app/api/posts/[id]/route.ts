import { NextRequest, NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/posts/[id] - Get a single post by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const post = await getPostById(id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update a post
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

    const { id } = await params
    const body = await request.json()

    // Check if post exists
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update post with provided fields
    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.content !== undefined) updateData.content = body.content
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    else if (body.description !== undefined) updateData.excerpt = body.description
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.status !== undefined) updateData.status = body.status
    if (body.scheduledAt !== undefined) {
      updateData.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null
    }
    if (body.author !== undefined) updateData.author = body.author
    if (body.lang !== undefined) updateData.lang = body.lang

    // Backward compat: if client sends "published" boolean without "status"
    if (body.published !== undefined && body.status === undefined) {
      updateData.status = body.published ? 'published' : 'draft'
    }

    await updatePost(id, updateData)

    return NextResponse.json({ message: 'Post updated successfully' })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete a post
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

    const { id } = await params

    // Check if post exists
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await deletePost(id)

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
