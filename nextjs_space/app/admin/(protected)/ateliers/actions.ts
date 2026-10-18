'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { atelierSchema, idSchema } from '@/lib/validation'
import { returnPath, withNote } from '@/lib/admin-redirect'
import { removeCover, uploadCover } from '@/lib/book-images'
import { removePdf, uploadPdf } from '@/lib/book-pdfs'

const LIST = '/admin/ateliers'

function revalidateAteliers() {
  revalidatePath('/ateliers')
  revalidatePath('/sitemap.xml')
  revalidatePath(LIST)
  revalidatePath('/admin')
}

function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'atelier'
  )
}

function parseAtelierForm(formData: FormData) {
  return atelierSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    scheduleText: formData.get('scheduleText'),
    nextDate: formData.get('nextDate') ?? '',
    durationMin: formData.get('durationMin') ?? '',
    leaderName: formData.get('leaderName') ?? '',
    zoomUrl: formData.get('zoomUrl'),
    zoomInfo: formData.get('zoomInfo') ?? '',
    productId: formData.get('productId') ?? '',
  })
}

function invalidNote(issues: { path: (string | number)[] }[]): string {
  if (issues.some((issue) => issue.path[0] === 'zoomUrl')) return 'zoom-invalide'
  if (issues.some((issue) => issue.path[0] === 'durationMin')) return 'duree-invalide'
  if (issues.some((issue) => issue.path[0] === 'nextDate')) return 'date-invalide'
  return 'invalide'
}

async function nextSortOrder(): Promise<number> {
  const { _max } = await getPrisma().atelier.aggregate({
    _max: { sortOrder: true },
  })
  return (_max.sortOrder ?? 0) + 1
}

export async function createAtelier(formData: FormData) {
  await requireAdmin()

  const back = `${LIST}/nouveau`
  const parsed = parseAtelierForm(formData)
  if (!parsed.success) redirect(withNote(back, invalidNote(parsed.error.issues)))

  const slug = slugify(parsed.data.title)

  const cover = await uploadCover(formData.get('customImage'), `${slug}-atelier`)
  if (cover && 'problem' in cover) redirect(withNote(back, cover.problem))

  const pdfUpload = await uploadPdf(formData.get('customPdfFile'), `${slug}-atelier`)
  if (pdfUpload && 'problem' in pdfUpload) {
    if (cover) await removeCover(cover.url)
    redirect(withNote(back, pdfUpload.problem))
  }

  const existingPdf = (formData.get('existingPdf') as string)?.trim()
  const customPdfUrlInput = (formData.get('customPdfUrl') as string)?.trim()
  const customPdfUrl =
    pdfUpload?.url ||
    customPdfUrlInput ||
    (existingPdf && existingPdf !== '__NONE__' ? existingPdf : null)

  await getPrisma().atelier.create({
    data: {
      ...parsed.data,
      customImageUrl: cover?.url ?? null,
      customPdfUrl,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
      sortOrder: await nextSortOrder(),
    },
  })

  revalidateAteliers()
  redirect(withNote(LIST, 'atelier-cree'))
}

export async function updateAtelier(formData: FormData) {
  await requireAdmin()

  const id = idSchema.safeParse(formData.get('atelierId'))
  if (!id.success) redirect(withNote(LIST, 'invalide'))

  const back = `${LIST}/${id.data}`
  const parsed = parseAtelierForm(formData)
  if (!parsed.success) redirect(withNote(back, invalidNote(parsed.error.issues)))

  const prisma = getPrisma()
  const existing = await prisma.atelier.findUnique({ where: { id: id.data } })
  if (!existing) redirect(withNote(LIST, 'invalide'))

  const slug = slugify(parsed.data.title)

  const cover = await uploadCover(formData.get('customImage'), `${slug}-atelier`)
  if (cover && 'problem' in cover) redirect(withNote(back, cover.problem))

  const pdfUpload = await uploadPdf(formData.get('customPdfFile'), `${slug}-atelier`)
  if (pdfUpload && 'problem' in pdfUpload) {
    if (cover) await removeCover(cover.url)
    redirect(withNote(back, pdfUpload.problem))
  }

  const dropImage = !cover && formData.get('removeCustomImage') === 'on'
  const dropPdf = formData.get('removeCustomPdf') === 'on'
  const existingPdf = (formData.get('existingPdf') as string)?.trim()
  const customPdfUrlInput = (formData.get('customPdfUrl') as string)?.trim()

  let finalPdfUrl: string | null = existing.customPdfUrl
  if (dropPdf || existingPdf === '__NONE__') {
    finalPdfUrl = null
  } else if (pdfUpload) {
    finalPdfUrl = pdfUpload.url
  } else if (customPdfUrlInput) {
    finalPdfUrl = customPdfUrlInput
  } else if (existingPdf) {
    finalPdfUrl = existingPdf
  }

  const finalImageUrl = cover?.url ?? (dropImage ? null : existing.customImageUrl)

  await prisma.atelier.update({
    where: { id: existing.id },
    data: {
      ...parsed.data,
      customImageUrl: finalImageUrl,
      customPdfUrl: finalPdfUrl,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
    },
  })

  if (cover || dropImage) await removeCover(existing.customImageUrl)
  if (finalPdfUrl !== existing.customPdfUrl) {
    await removePdf(existing.customPdfUrl)
  }

  revalidateAteliers()
  redirect(withNote(LIST, 'ok'))
}

async function setAtelierFlag(formData: FormData, flag: 'published' | 'featured') {
  await requireAdmin()

  const id = idSchema.safeParse(formData.get('atelierId'))
  const back = returnPath(formData, LIST)
  if (!id.success) redirect(withNote(back, 'invalide'))

  const to = formData.get('to') === '1'
  const { count } = await getPrisma().atelier.updateMany({
    where: { id: id.data, [flag]: !to },
    data: { [flag]: to },
  })

  revalidateAteliers()
  redirect(withNote(back, count === 0 ? 'inchange' : 'ok'))
}

export async function setAtelierPublished(formData: FormData) {
  await setAtelierFlag(formData, 'published')
}

export async function setAtelierFeatured(formData: FormData) {
  await setAtelierFlag(formData, 'featured')
}

export async function moveAtelier(formData: FormData) {
  await requireAdmin()

  const id = idSchema.safeParse(formData.get('atelierId'))
  const back = returnPath(formData, LIST)
  const direction = formData.get('direction')
  if (!id.success || (direction !== 'up' && direction !== 'down')) {
    redirect(withNote(back, 'invalide'))
  }

  const prisma = getPrisma()
  const siblings = await prisma.atelier.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    select: { id: true, sortOrder: true },
  })

  const from = siblings.findIndex((s) => s.id === id.data)
  if (from === -1) redirect(withNote(back, 'invalide'))

  const to = direction === 'up' ? from - 1 : from + 1
  if (to < 0 || to >= siblings.length) redirect(withNote(back, 'inchange'))

  const reordered = [...siblings]
  ;[reordered[from], reordered[to]] = [reordered[to], reordered[from]]

  await prisma.$transaction(
    reordered.flatMap((s, index) =>
      s.sortOrder === index + 1
        ? []
        : [prisma.atelier.update({ where: { id: s.id }, data: { sortOrder: index + 1 } })],
    ),
  )

  revalidateAteliers()
  redirect(withNote(back, 'ok'))
}

export async function deleteAtelier(formData: FormData) {
  await requireAdmin()

  const id = idSchema.safeParse(formData.get('atelierId'))
  if (!id.success) redirect(withNote(LIST, 'invalide'))

  const prisma = getPrisma()
  const existing = await prisma.atelier.findUnique({ where: { id: id.data } })
  if (!existing) redirect(withNote(LIST, 'inchange'))

  await prisma.atelier.delete({ where: { id: existing.id } })

  await removeCover(existing.customImageUrl)
  await removePdf(existing.customPdfUrl)

  revalidateAteliers()
  redirect(withNote(LIST, 'atelier-supprime'))
}
