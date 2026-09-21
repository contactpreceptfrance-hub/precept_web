import { PrismaClient } from '@prisma/client'
import books from '../data/books.json'

const prisma = new PrismaClient()

// Derive the id from the cover filename rather than the title: the slug is
// already accent-folded and unique per book, whereas slugifying the French
// title drops accents entirely ("Genèse, partie 1" -> "gense-partie-1").
const idFor = (imageUrl: string) =>
  `seed-${imageUrl.split('/').pop()!.replace(/\.[a-z0-9]+$/i, '')}`

async function main() {
  console.log(`Seeding ${books.length} books…`)

  for (const book of books) {
    const id = idFor(book.imageUrl)
    const fields = {
      name: book.name,
      description: book.description,
      price: book.price,
      imageUrl: book.imageUrl,
      backImageUrl: book.backImageUrl,
      type: book.type as 'LIVRE' | 'FORMATION',
      series: book.series,
    }
    // Insert-only. Books are edited from /admin/livres now, so re-running the
    // seed must not overwrite a price, a description or a cover the team has
    // changed — it only adds titles that are missing (a seeded title deleted from
    // the admin would therefore come back on the next run).
    await prisma.product.upsert({
      where: { id },
      update: {},
      create: { id, ...fields },
    })
    console.log(`  ✔ ${book.name}`)
  }

  // Nothing is deleted here any more: removing a retired title is done from
  // /admin/livres (delete, or hide it if it has orders).

  console.log('\nDone.')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
