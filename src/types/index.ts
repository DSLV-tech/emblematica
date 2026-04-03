export interface RouteStep {
  instruction: string
  distance: number
  duration: number
}

export interface Route {
  distance: number
  duration: number
  steps: RouteStep[]
}

export interface RutaStop {
  localeId: string
  order?: number
  note?: string
}

export interface Ruta {
  id: string
  title: string
  subtitle: string
  description: string
  duration: string
  distance: string
  difficulty: 'easy' | 'medium' | 'hard'
  stops: RutaStop[]
  coverImage?: string
  color?: string
  tags?: string[]
}

export interface Stamp {
  localeId: string
  localeName: string
  category: string
  visitedAt: any
  coordinates: { lat: number; lng: number }
}

export interface Passport {
  uid: string
  stamps: Stamp[]
  totalVisits: number
  createdAt: any
  lastVisitAt: any
}

export interface Badge {
  id: string
  label: string
  description: string
  icon: string
  condition: (stamps: Stamp[]) => boolean
  unlockedAt?: string
}

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: 'admin' | 'user' | 'guest'
  createdAt?: any
  lastLoginAt?: any
}

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
  city?: string
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

export const CATEGORY_LABELS: Record<Category, string> = {
  Tutti:      'Tutti',
  Caffè:      'Caffè',
  Farmacia:   'Farmacia',
  Pasticceria:'Pasticceria',
  Bar:        'Bar',
  Ristorante: 'Ristorante',
  Libreria:   'Libreria',
  Mercato:    'Mercato',
  Hotel:      'Hotel',
  Teatro:     'Teatro',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Tutti:      '#C9A84C',
  Caffè:      '#6F4E37',
  Farmacia:   '#2E7D32',
  Pasticceria:'#C4722A',
  Bar:        '#7B1FA2',
  Ristorante: '#C62828',
  Libreria:   '#1565C0',
  Mercato:    '#F57F17',
  Hotel:      '#00695C',
  Teatro:     '#AD1457',
}

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
