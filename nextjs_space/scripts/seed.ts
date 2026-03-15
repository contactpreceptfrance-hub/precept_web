import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Livres
  {
    id: 'livre-1',
    name: 'Seigneur, enseigne-moi à étudier la Bible en 28 jours',
    description: 'Un guide pratique pour apprendre la méthode d\'étude biblique inductive en seulement 28 jours.',
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
    type: 'LIVRE' as const,
  },
  {
    id: 'livre-2',
    name: 'Comment étudier la Bible par soi-même',
    description: 'Découvrez les secrets de l\'étude biblique personnelle et enrichissante.',
    price: 22.50,
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=400&fit=crop',
    type: 'LIVRE' as const,
  },
  {
    id: 'livre-3',
    name: 'Les fondements de la foi chrétienne',
    description: 'Un livre essentiel pour comprendre les bases de la foi chrétienne.',
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
    type: 'LIVRE' as const,
  },
  // Formations
  {
    id: 'formation-1',
    name: 'Précepte sur Précepte : Épître aux Romains',
    description: 'Une étude approfondie verset par verset de l\'épître aux Romains.',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    type: 'FORMATION' as const,
  },
  {
    id: 'formation-2',
    name: 'Série 40 Minutes : Le Sermon sur la Montagne',
    description: 'Étude thématique sans devoirs, idéale pour les débutants.',
    price: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
    type: 'FORMATION' as const,
  },
  {
    id: 'formation-3',
    name: 'In & Out : Les Psaumes',
    description: 'Version condensée de notre étude sur les Psaumes avec un temps d\'étude modéré.',
    price: 40.00,
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop',
    type: 'FORMATION' as const,
  },
]

async function main() {
  console.log('Seeding database...')

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
    console.log(`Upserted product: ${product.name}`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
