import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/firebase'
import { verifySessionCookie } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update site settings
export async function PUT(request: NextRequest) {
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
    const { siteName, siteDescription, authorName, authorEmail, githubUrl } = body

    // Build update object with only provided fields
    const updateData: Record<string, string> = {}
    if (siteName !== undefined) updateData.siteName = siteName
    if (siteDescription !== undefined) updateData.siteDescription = siteDescription
    if (authorName !== undefined) updateData.authorName = authorName
    if (authorEmail !== undefined) updateData.authorEmail = authorEmail
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl

    await updateSettings(updateData)

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
