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

  const seeded: string[] = []

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
    await prisma.product.upsert({
      where: { id },
      update: fields,
      create: { id, ...fields },
    })
    seeded.push(id)
    console.log(`  ✔ ${book.name}`)
  }

  // Drop previously seeded products that are no longer in books.json, so
  // retired titles stop showing up in the boutique. Anything attached to a
  // real order is left alone — deleting it would break that order's history.
  const stale = await prisma.product.findMany({
    where: {
      id: { startsWith: 'seed-', notIn: seeded },
      orderItems: { none: {} },
    },
    select: { id: true, name: true },
  })

  if (stale.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: stale.map(p => p.id) } } })
    console.log(`\nRemoved ${stale.length} retired product(s):`)
    for (const p of stale) console.log(`  ✘ ${p.name}`)
  }

  const kept = await prisma.product.count({
    where: { id: { startsWith: 'seed-', notIn: seeded } },
  })
  if (kept > 0) {
    console.log(`\n⚠ ${kept} retired product(s) kept — they are referenced by existing orders.`)
  }

  console.log('\nDone.')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
