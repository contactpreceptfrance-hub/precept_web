import { PrismaClient } from '@prisma/client'
import books from '../data/books.json'

const prisma = new PrismaClient()

async function main() {
  console.log(`Seeding ${books.length} books…`)

  for (const book of books) {
    const id = `seed-${book.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30)}`
    await prisma.product.upsert({
      where: { id },
      update: {
        name: book.name,
        description: book.description,
        price: book.price,
        imageUrl: book.imageUrl,
        type: book.type as 'LIVRE' | 'FORMATION',
        series: book.series,
      },
      create: {
        id,
        name: book.name,
        description: book.description,
        price: book.price,
        imageUrl: book.imageUrl,
        type: book.type as 'LIVRE' | 'FORMATION',
        series: book.series,
      },
    })
    console.log(`  ✔ ${book.name}`)
  }

  console.log('Done.')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
