import { NextRequest, NextResponse } from 'next/server'
import { getPosts, createPost, Post } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get('published') !== 'false'

    const posts = await getPosts(publishedOnly)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
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
    const { title, slug, content, excerpt, description, tags, status, scheduledAt, author, lang } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['draft', 'published', 'scheduled']
    const postStatus = validStatuses.includes(status) ? status : 'draft'

    // scheduledAt is required when status is "scheduled"
    if (postStatus === 'scheduled' && !scheduledAt) {
      return NextResponse.json(
        { error: 'scheduledAt is required when status is "scheduled"' },
        { status: 400 }
      )
    }

    const post = {
      title,
      slug,
      content,
      excerpt: excerpt || description || '',
      tags: tags || [],
      status: postStatus as Post['status'],
      author: author || 'Giang H\u1ea3i S\u01a1n',
      lang: (lang === 'en' ? 'en' : 'vi') as Post['lang'],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    }

    const id = await createPost(post)

    return NextResponse.json({ id, message: 'Post created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
