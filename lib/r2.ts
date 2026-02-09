import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3'

// ===========================================
// Cloudflare R2 Configuration
// R2 is S3-compatible, so we use the AWS SDK
// ===========================================

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'YOUR_ACCOUNT_ID'
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID'
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY'
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'gianghaison-assets'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://r2.gianghaison.me'

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

export { r2Client }

// ===========================================
// Types
// ===========================================
export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface R2Object {
  key: string
  url: string
  size: number
  lastModified: Date
}

// ===========================================
// Upload file to R2
// ===========================================
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: 'blog' | 'art' = 'blog'
): Promise<UploadResult> {
  try {
    const key = `${folder}/${filename}`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    })

    await r2Client.send(command)

    return {
      success: true,
      url: `${R2_PUBLIC_URL}/${key}`,
      key,
    }
  } catch (error) {
    console.error('Error uploading to R2:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// ===========================================
// Delete file from R2
// ===========================================
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
    return true
  } catch (error) {
    console.error('Error deleting from R2:', error)
    return false
  }
}

// ===========================================
// List files in R2 bucket
// ===========================================
export async function listR2Objects(prefix?: string): Promise<R2Object[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    })

    const response = await r2Client.send(command)

    if (!response.Contents) {
      return []
    }

    return response.Contents.map((obj) => ({
      key: obj.Key || '',
      url: `${R2_PUBLIC_URL}/${obj.Key}`,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    }))
  } catch (error) {
    console.error('Error listing R2 objects:', error)
    return []
  }
}

// ===========================================
// Get file from R2
// ===========================================
export async function getFromR2(key: string): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    const response = await r2Client.send(command)

    if (!response.Body) {
      return null
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    const body = response.Body as AsyncIterable<Uint8Array>
    for await (const chunk of body) {
      chunks.push(chunk)
    }

    return Buffer.concat(chunks)
  } catch (error) {
    console.error('Error getting from R2:', error)
    return null
  }
}

// ===========================================
// Generate unique filename
// ===========================================
export function generateFilename(originalName: string, extension: string = 'webp'): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const baseName = originalName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .substring(0, 50) // Limit length

  return `${baseName}-${timestamp}-${randomSuffix}.${extension}`
}

// ===========================================
// Get public URL for a key
// ===========================================
export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}
