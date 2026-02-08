import sharp from 'sharp'

// ===========================================
// Image Processing Configuration
// ===========================================
const MAX_WIDTH = 1200
const WEBP_QUALITY = 85

// ===========================================
// Process image: resize if needed and convert to webp
// ===========================================
export async function processImage(
  buffer: Buffer,
  options: {
    maxWidth?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): Promise<Buffer> {
  const { maxWidth = MAX_WIDTH, quality = WEBP_QUALITY, format = 'webp' } = options

  let image = sharp(buffer)
  const metadata = await image.metadata()

  // Resize if wider than maxWidth
  if (metadata.width && metadata.width > maxWidth) {
    image = image.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }

  // Convert to specified format
  switch (format) {
    case 'webp':
      image = image.webp({ quality })
      break
    case 'jpeg':
      image = image.jpeg({ quality })
      break
    case 'png':
      image = image.png({ quality })
      break
  }

  return image.toBuffer()
}

// ===========================================
// Generate thumbnail
// ===========================================
export async function generateThumbnail(
  buffer: Buffer,
  width: number = 300,
  height: number = 200
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toBuffer()
}

// ===========================================
// Get image metadata
// ===========================================
export async function getImageMetadata(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata()
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: buffer.length,
  }
}

// ===========================================
// Validate image
// ===========================================
export async function validateImage(buffer: Buffer): Promise<{ valid: boolean; error?: string }> {
  try {
    const metadata = await sharp(buffer).metadata()

    if (!metadata.format) {
      return { valid: false, error: 'Invalid image format' }
    }

    const allowedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'avif']
    if (!allowedFormats.includes(metadata.format)) {
      return { valid: false, error: `Unsupported format: ${metadata.format}` }
    }

    // Max file size: 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Could not process image' }
  }
}
