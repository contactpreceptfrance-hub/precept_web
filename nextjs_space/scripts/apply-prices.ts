import { PrismaClient } from '@prisma/client'
import books from '../data/books.json'

const prisma = new PrismaClient()

const idFor = (imageUrl: string) =>
  `seed-${imageUrl.split('/').pop()!.replace(/\.[a-z0-9]+$/i, '')}`

async function main() {
  console.log(`Updating prices for ${books.length} books in database...`)
  let updated = 0

  for (const book of books) {
    const id = idFor(book.imageUrl)
    const res = await prisma.product.updateMany({
      where: {
        OR: [
          { id },
          { name: book.name },
        ],
      },
      data: {
        price: book.price,
      },
    })
    console.log(`✔ ${book.name} -> ${book.price.toFixed(2)} € (${res.count} updated)`)
    updated += res.count
  }

  console.log(`\nDone! Total products updated: ${updated}`)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
