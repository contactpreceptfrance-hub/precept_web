export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type CartItem = {
  productId: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export type SeriesGroup = {
  series: string
  label: string
  products: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    backImageUrl: string | null
    type: 'LIVRE' | 'FORMATION'
    series: string | null
  }[]
}

// These series print one generic back cover shared across every title in them —
// the keyword bookmark and the study-difficulty ladder — rather than artwork
// specific to the book. Labelled differently so it doesn't read as this title's
// own back cover.
const SHARED_BACK_SERIES = new Set(['pup', 'saisir'])

export const backCoverLabel = (series: string | null) =>
  series && SHARED_BACK_SERIES.has(series) ? 'Au dos de la série' : 'Verso'

// Ordered from the lightest commitment to the most intensive, matching the
// difficulty ladder Precept prints on the back of its study books.
export const SERIES_CONFIG: { key: string; label: string }[] = [
  { key: '40min',    label: 'La série 40 Minutes' },
  { key: 'seigneur', label: 'La série Seigneur' },
  { key: 'etudes',   label: 'La collection Études inductives' },
  { key: 'saisir',   label: 'La série Saisir et Agir' },
  { key: 'pup',      label: 'La série Précepte sur Précepte' },
  { key: 'enfants',  label: 'Découvrir par toi-même (7-12 ans)' },
]