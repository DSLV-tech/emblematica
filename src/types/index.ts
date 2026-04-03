export interface GeoPoint {
  lat: number
  lng: number
}

export interface Locale {
  id: string
  name: string
  category: Category
  coordinates: GeoPoint
  short_desc: string
  full_story: string
  image_url: string
  gallery?: string[]
  social?: {
    website?: string
    instagram?: string
    facebook?: string
  }
  address: string
  is_protected: boolean
  founded_year?: number
}

export type Category =
  | 'Tutti'
  | 'Caffè'
  | 'Farmacia'
  | 'Pasticceria'
  | 'Bar'
  | 'Ristorante'
  | 'Libreria'
  | 'Mercato'
  | 'Hotel'
  | 'Teatro'

export const CATEGORIES: Category[] = [
  'Tutti',
  'Caffè',
  'Bar',
  'Pasticceria',
  'Farmacia',
  'Ristorante',
  'Libreria',
  'Mercato',
  'Hotel',
  'Teatro',
]

export const CATEGORY_ICONS: Record<Category, string> = {
  Tutti: '🗺️',
  Caffè: '☕',
  Farmacia: '⚕️',
  Pasticceria: '🥐',
  Bar: '🍷',
  Ristorante: '🍽️',
  Libreria: '📚',
  Mercato: '🛍️',
  Hotel: '🏨',
  Teatro: '🎭',
}
