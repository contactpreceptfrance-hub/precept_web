import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { SAMPLE_PDFS_BY_TITLE } from '../lib/sample-pdfs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Syncing sample PDFs to Database & data/books.json ---')

  // 1. Update Neon PostgreSQL
  const booksInDb = await prisma.product.findMany()
  let updatedInDb = 0

  for (const book of booksInDb) {
    const pdf = SAMPLE_PDFS_BY_TITLE[book.name]
    if (pdf) {
      await prisma.product.update({
        where: { id: book.id },
        data: { samplePdfUrl: pdf },
      })
      console.log(`[DB] Updated "${book.name}" -> ${pdf}`)
      updatedInDb++
    }
  }

  console.log(`\nUpdated ${updatedInDb} / ${booksInDb.length} books in Database.\n`)

  // 2. Update data/books.json
  const booksJsonPath = path.join(process.cwd(), 'data', 'books.json')
  if (fs.existsSync(booksJsonPath)) {
    const booksData = JSON.parse(fs.readFileSync(booksJsonPath, 'utf-8'))
    let updatedInJson = 0

    for (const b of booksData) {
      const pdf = SAMPLE_PDFS_BY_TITLE[b.name]
      if (pdf) {
        b.samplePdfUrl = pdf
        updatedInJson++
      } else if (!('samplePdfUrl' in b)) {
        b.samplePdfUrl = null
      }
    }

    fs.writeFileSync(booksJsonPath, JSON.stringify(booksData, null, 2) + '\n', 'utf-8')
    console.log(`[JSON] Updated ${updatedInJson} books with samplePdfUrl in data/books.json`)
  }

  console.log('--- Sync complete ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
