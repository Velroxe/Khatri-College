import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

/* ---------------------- Supabase Initialization ---------------------- */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.')
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

/* --------------------------- Type Definitions --------------------------- */

export interface UploadedImageInfo {
  id: string
  publicUrl: string
  path: string
  name: string
  size: number
  type: string
}

/* --------------------------- Upload Function --------------------------- */

/**
 * Uploads a PNG/JPG/WEBP file to Supabase Storage with a UUID-based filename
 * and returns its public URL and metadata.
 *
 * @param file The image file to upload
 * @param bucket The Supabase bucket name (default: 'Images')
 * @returns Uploaded image metadata and public URL
 */
export async function uploadImageToSupabaseBucket(
  file: File,
  bucket: string = 'Images'
): Promise<UploadedImageInfo> {
  if (!file) throw new Error('No file provided.')

  // Validate allowed file types
  if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
    throw new Error('Only PNG, JPG, or WEBP files are allowed.')
  }

  // Optional: limit file size to 1 MB (adjust if needed)
  const MAX_SIZE = 1 * 1024 * 1024 // 1MB
  if (file.size > MAX_SIZE) throw new Error('File too large (max 1MB).')

  // Generate a unique filename
  const id = uuidv4()
  const ext = file.name.split('.').pop()
  const filePath = `${id}.${ext}`

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) throw uploadError

  // Get public URL
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)

  if (!publicData?.publicUrl) throw new Error('Failed to get public URL.')

  // Return uploaded image info
  return {
    id,
    publicUrl: publicData.publicUrl,
    path: filePath,
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

/* --------------------------- Delete Function --------------------------- */

/**
 * Deletes an image from Supabase Storage by its path.
 *
 * @param path The exact file path in the bucket (e.g. "c1b02cf7-5c4b-476f-9a44.png")
 * @param bucket The Supabase bucket name (default: 'Images')
 * @returns true if deletion was successful
 */
export async function deleteImageFromSupabaseBucket(
  path: string | undefined,
  bucket: string = 'Images'
): Promise<boolean> {
  if (!path) throw new Error('No file path provided.')

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error

  return true
}
