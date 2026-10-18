import { del, put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import {
  AVAILABLE_PDF_GROUPS,
  getPdfDisplayName,
  type AvailablePdfFile,
  type AvailablePdfGroup,
} from '@/lib/sample-pdfs'

/**
 * PDF management for the admin book and atelier editors.
 *
 * Re-exports the static PDF catalogue from `@/lib/sample-pdfs` and adds
 * server-only upload/delete helpers (Vercel Blob with local `/public` fallback).
 */

export { AVAILABLE_PDF_GROUPS, getPdfDisplayName, type AvailablePdfFile, type AvailablePdfGroup }

export const MAX_PDF_BYTES = 8 * 1024 * 1024 // 8 MB

export type PdfProblem = 'pdf-type' | 'pdf-taille' | 'pdf-stockage'

export function isPdfStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/** Check %PDF- magic bytes: 0x25, 0x50, 0x44, 0x46 */
function sniffPdf(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  )
}

/**
 * Stores one PDF and returns its public URL.
 * Supports Vercel Blob (default when BLOB_READ_WRITE_TOKEN is set)
 * or local filesystem storage in /public/pdfs/uploads/ for offline/dev.
 */
export async function uploadPdf(
  file: FormDataEntryValue | null,
  slug: string,
): Promise<{ url: string } | { problem: PdfProblem } | null> {
  if (!(file instanceof File) || file.size === 0) return null

  if (file.size > MAX_PDF_BYTES) return { problem: 'pdf-taille' }

  const buffer = new Uint8Array(await file.arrayBuffer())
  if (!sniffPdf(buffer)) return { problem: 'pdf-type' }

  if (isPdfStorageConfigured()) {
    const { url } = await put(`pdfs/${slug}.pdf`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'application/pdf',
    })
    return { url }
  }

  // Fallback to local /public/pdfs/uploads/ directory
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'pdfs', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const safeName = `${slug}-${Date.now()}.pdf`
    const filePath = path.join(uploadsDir, safeName)
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return { url: `/pdfs/uploads/${safeName}` }
  } catch (error) {
    console.error('book-pdfs: could not save local PDF file', error)
    return { problem: 'pdf-stockage' }
  }
}

/**
 * Deletes a PDF that was uploaded from the admin.
 * Files under pre-existing /public/pdfs/ directories (outside uploads) are left alone.
 */
export async function removePdf(url: string | null | undefined): Promise<void> {
  if (!url) return

  // 1. Vercel Blob
  if (/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
    try {
      await del(url)
    } catch (error) {
      console.error('book-pdfs: could not delete old blob PDF', url, error)
    }
    return
  }

  // 2. Local uploaded file
  if (url.startsWith('/pdfs/uploads/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', url)
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
      }
    } catch (error) {
      console.error('book-pdfs: could not delete old local PDF', url, error)
    }
  }
}
