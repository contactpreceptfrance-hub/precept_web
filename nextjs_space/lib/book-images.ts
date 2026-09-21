import { del, put } from '@vercel/blob'

/**
 * Cover uploads for the admin book manager.
 *
 * Server-only. Covers go to Vercel Blob because /public is read-only on Vercel;
 * the covers that shipped with the site stay as paths under /public and keep
 * working untouched.
 */

/**
 * Per image. A Vercel function accepts a request body of 4.5 MB in total, and a
 * book form can carry two covers, so 2 MB each leaves headroom for the text
 * fields. The covers already on the site are ~70 KB.
 */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export type ImageProblem = 'image-type' | 'image-taille' | 'stockage'

export function isStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/**
 * The real format, from the first bytes — the browser-supplied MIME type is only
 * a claim. Returns the extension, or null when it is not a JPEG, PNG or WebP.
 */
function sniffExtension(bytes: Uint8Array): 'jpg' | 'png' | 'webp' | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png'
  const riff = String.fromCharCode(...Array.from(bytes.slice(0, 4)))
  const webp = String.fromCharCode(...Array.from(bytes.slice(8, 12)))
  if (riff === 'RIFF' && webp === 'WEBP') return 'webp'
  return null
}

/**
 * Stores one cover and returns its public URL.
 *
 * `null` means no file was chosen (an untouched file input submits an empty
 * File), so the caller keeps whatever image the book already has.
 */
export async function uploadCover(
  file: FormDataEntryValue | null,
  slug: string,
): Promise<{ url: string } | { problem: ImageProblem } | null> {
  if (!(file instanceof File) || file.size === 0) return null

  if (file.size > MAX_IMAGE_BYTES) return { problem: 'image-taille' }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const extension = sniffExtension(buffer)
  if (!extension) return { problem: 'image-type' }

  if (!isStorageConfigured()) return { problem: 'stockage' }

  const { url } = await put(`books/${slug}.${extension}`, buffer, {
    access: 'public',
    // Two covers with the same name must not overwrite each other, and a fresh
    // URL sidesteps the CDN serving the previous cover after a replacement.
    addRandomSuffix: true,
    contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  })
  return { url }
}

/**
 * Deletes a cover that was uploaded from the admin. Files under /public are left
 * alone, and a failure is only logged: an orphaned blob costs nothing, whereas
 * failing the save over it would lose the team's edit.
 */
export async function removeCover(url: string | null | undefined): Promise<void> {
  if (!url || !/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url)) return
  try {
    await del(url)
  } catch (error) {
    console.error('book-images: could not delete old cover', url, error)
  }
}
