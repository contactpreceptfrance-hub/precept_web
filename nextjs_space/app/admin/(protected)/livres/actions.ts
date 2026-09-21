'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { bookSchema, productIdSchema } from '@/lib/validation'
import { returnPath, withNote } from '@/lib/admin-redirect'
import { removeCover, uploadCover } from '@/lib/book-images'

const LIST = '/admin/livres'

/**
 * Every place a book shows up. The public pages are ISR with an hour of
 * caching, so without this a price change would take up to an hour to reach
 * the shop — and a hidden book would stay visible for as long.
 */
function revalidateCatalogue() {
  revalidatePath('/boutique')
  revalidatePath('/boutique/[id]', 'page')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  revalidatePath(LIST)
  revalidatePath('/admin')
}

/** A file-name-safe slug for the blob path. Cosmetic: uniqueness comes from the random suffix. */
function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'livre'
  )
}

function parseBookForm(formData: FormData) {
  return bookSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    type: formData.get('type'),
    series: formData.get('series') ?? '',
  })
}

/** The note to show for a form that did not validate: price gets its own message. */
function invalidNote(issues: { path: (string | number)[] }[]): string {
  return issues.some((issue) => issue.path[0] === 'price') ? 'prix' : 'invalide'
}

/** Next free position at the end of a series. */
async function nextSortOrder(series: string | null): Promise<number> {
  const { _max } = await getPrisma().product.aggregate({
    where: { series },
    _max: { sortOrder: true },
  })
  return (_max.sortOrder ?? 0) + 1
}

export async function createBook(formData: FormData) {
  await requireAdmin()

  const back = `${LIST}/nouveau`
  const parsed = parseBookForm(formData)
  if (!parsed.success) redirect(withNote(back, invalidNote(parsed.error.issues)))

  const slug = slugify(parsed.data.name)

  const front = await uploadCover(formData.get('cover'), slug)
  if (!front) redirect(withNote(back, 'image-requise'))
  if ('problem' in front) redirect(withNote(back, front.problem))

  const verso = await uploadCover(formData.get('backCover'), `${slug}-verso`)
  if (verso && 'problem' in verso) {
    // The front cover is already stored; do not leave it orphaned.
    await removeCover(front.url)
    redirect(withNote(back, verso.problem))
  }

  await getPrisma().product.create({
    data: {
      ...parsed.data,
      imageUrl: front.url,
      backImageUrl: verso?.url ?? null,
      published: formData.get('published') === 'on',
      soldOut: formData.get('soldOut') === 'on',
      sortOrder: await nextSortOrder(parsed.data.series),
    },
  })

  revalidateCatalogue()
  redirect(withNote(LIST, 'cree'))
}

export async function updateBook(formData: FormData) {
  await requireAdmin()

  const id = productIdSchema.safeParse(formData.get('bookId'))
  if (!id.success) redirect(withNote(LIST, 'invalide'))

  const back = `${LIST}/${id.data}`
  const parsed = parseBookForm(formData)
  if (!parsed.success) redirect(withNote(back, invalidNote(parsed.error.issues)))

  const prisma = getPrisma()
  const existing = await prisma.product.findUnique({ where: { id: id.data } })
  if (!existing) redirect(withNote(LIST, 'invalide'))

  const slug = slugify(parsed.data.name)

  const front = await uploadCover(formData.get('cover'), slug)
  if (front && 'problem' in front) redirect(withNote(back, front.problem))

  const verso = await uploadCover(formData.get('backCover'), `${slug}-verso`)
  if (verso && 'problem' in verso) {
    if (front) await removeCover(front.url)
    redirect(withNote(back, verso.problem))
  }

  const dropBack = !verso && formData.get('removeBack') === 'on'
  const seriesChanged = parsed.data.series !== existing.series

  await prisma.product.update({
    where: { id: existing.id },
    data: {
      ...parsed.data,
      imageUrl: front?.url ?? existing.imageUrl,
      backImageUrl: verso?.url ?? (dropBack ? null : existing.backImageUrl),
      published: formData.get('published') === 'on',
      soldOut: formData.get('soldOut') === 'on',
      // A book moved to another series goes to the end of it.
      ...(seriesChanged ? { sortOrder: await nextSortOrder(parsed.data.series) } : {}),
    },
  })

  // Only once the row points at the new files is it safe to drop the old ones.
  if (front) await removeCover(existing.imageUrl)
  if (verso || dropBack) await removeCover(existing.backImageUrl)

  revalidateCatalogue()
  redirect(withNote(LIST, 'ok'))
}

/** Same idempotent shape as the order actions: the current value is part of the WHERE. */
async function setFlag(formData: FormData, flag: 'published' | 'soldOut') {
  await requireAdmin()

  const id = productIdSchema.safeParse(formData.get('bookId'))
  const back = returnPath(formData, LIST)
  if (!id.success) redirect(withNote(back, 'invalide'))

  const to = formData.get('to') === '1'
  const { count } = await getPrisma().product.updateMany({
    where: { id: id.data, [flag]: !to },
    data: { [flag]: to },
  })

  revalidateCatalogue()
  redirect(withNote(back, count === 0 ? 'inchange' : 'ok'))
}

export async function setPublished(formData: FormData) {
  await setFlag(formData, 'published')
}

export async function setSoldOut(formData: FormData) {
  await setFlag(formData, 'soldOut')
}

/**
 * Swap a book with its neighbour in the same series.
 *
 * The whole series is renumbered 1..n rather than swapping two values: the
 * backfilled and hand-edited positions can contain gaps or duplicates, and a
 * plain swap of equal numbers would do nothing.
 */
export async function moveBook(formData: FormData) {
  await requireAdmin()

  const id = productIdSchema.safeParse(formData.get('bookId'))
  const back = returnPath(formData, LIST)
  const direction = formData.get('direction')
  if (!id.success || (direction !== 'up' && direction !== 'down')) {
    redirect(withNote(back, 'invalide'))
  }

  const prisma = getPrisma()
  const book = await prisma.product.findUnique({
    where: { id: id.data },
    select: { id: true, series: true },
  })
  if (!book) redirect(withNote(back, 'invalide'))

  const siblings = await prisma.product.findMany({
    where: { series: book.series },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    select: { id: true, sortOrder: true },
  })

  const from = siblings.findIndex((s) => s.id === book.id)
  const to = direction === 'up' ? from - 1 : from + 1
  if (to < 0 || to >= siblings.length) redirect(withNote(back, 'inchange'))

  const reordered = [...siblings]
  ;[reordered[from], reordered[to]] = [reordered[to], reordered[from]]

  await prisma.$transaction(
    reordered.flatMap((s, index) =>
      s.sortOrder === index + 1
        ? []
        : [prisma.product.update({ where: { id: s.id }, data: { sortOrder: index + 1 } })],
    ),
  )

  revalidateCatalogue()
  redirect(withNote(back, 'ok'))
}

/**
 * Delete a book that was never ordered.
 *
 * OrderItem holds a RESTRICT foreign key, so a book with orders cannot go —
 * the edit page tells the team to hide it instead. The "no orders" condition
 * is in the WHERE rather than checked beforehand, so an order landing between
 * the check and the delete cannot slip through.
 */
export async function deleteBook(formData: FormData) {
  await requireAdmin()

  const id = productIdSchema.safeParse(formData.get('bookId'))
  if (!id.success) redirect(withNote(LIST, 'invalide'))

  const prisma = getPrisma()
  const existing = await prisma.product.findUnique({ where: { id: id.data } })
  if (!existing) redirect(withNote(LIST, 'inchange'))

  const { count } = await prisma.product.deleteMany({
    where: { id: existing.id, orderItems: { none: {} } },
  })
  if (count === 0) redirect(withNote(`${LIST}/${existing.id}`, 'commandes'))

  await removeCover(existing.imageUrl)
  await removeCover(existing.backImageUrl)

  revalidateCatalogue()
  redirect(withNote(LIST, 'supprime'))
}
