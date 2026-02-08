import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, generateFilename, listR2Objects, deleteFromR2 } from '@/lib/r2'
import { processImage, validateImage, getImageMetadata } from '@/lib/image-processing'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// POST /api/upload - Upload an image
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

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'blog'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate folder
    if (!['blog', 'art'].includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder. Must be: blog or art' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate image
    const validation = await validateImage(buffer)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Get original metadata
    const originalMetadata = await getImageMetadata(buffer)

    // Process image: resize if > 1200px width and convert to webp
    const processedBuffer = await processImage(buffer, {
      maxWidth: 1200,
      quality: 85,
      format: 'webp',
    })

    // Generate unique filename
    const filename = generateFilename(file.name, 'webp')

    // Upload to R2
    const result = await uploadToR2(
      processedBuffer,
      filename,
      'image/webp',
      folder as 'blog' | 'art'
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Get processed metadata
    const processedMetadata = await getImageMetadata(processedBuffer)

    return NextResponse.json({
      url: result.url,
      key: result.key,
      original: {
        width: originalMetadata.width,
        height: originalMetadata.height,
        size: originalMetadata.size,
        format: originalMetadata.format,
      },
      processed: {
        width: processedMetadata.width,
        height: processedMetadata.height,
        size: processedMetadata.size,
        format: 'webp',
      },
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET /api/upload - List uploaded files
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || undefined

    const files = await listR2Objects(folder || undefined)

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete a file
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 })
    }

    const success = await deleteFromR2(key)

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
