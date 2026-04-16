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
    type: 'LIVRE' | 'FORMATION'
    series: string | null
  }[]
}

export const SERIES_CONFIG: { key: string; label: string }[] = [
  { key: '40min',     label: 'Série 40 Minutes' },
  { key: 'in-out',    label: 'In & Out' },
  { key: 'pup',       label: 'Précept sur Précept' },
  { key: 'yarrow',    label: 'Yarrow' },
  { key: 'enfants',   label: 'Pour les enfants' },
  { key: 'formation', label: 'Formations' },
]