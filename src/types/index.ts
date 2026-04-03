/* ============================================================
   Emblematic — Shared Types
   ============================================================ */

export type Category =
  | 'bar'
  | 'restaurant'
  | 'bookshop'
  | 'pharmacy'
  | 'shop';

export const CATEGORY_ICONS: Record<Category, string> = {
  bar:        '☕',
  restaurant: '🍽️',
  bookshop:   '📚',
  pharmacy:   '⚕️',
  shop:       '🏪',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  bar:        'Bar & Cafè',
  restaurant: 'Ristorante',
  bookshop:   'Libreria',
  pharmacy:   'Farmacia',
  shop:       'Negozio',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  bar:        '#C9A84C',
  restaurant: '#C0552A',
  bookshop:   '#5B8A72',
  pharmacy:   '#4A7FA5',
  shop:       '#8B6B9A',
};

/* ── Locale (posto storico) ─────────────────────────────── */
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SocialLinks {
  instagram?: string;
  facebook?:  string;
  website?:   string;
}

export interface Locale {
  id:           string;
  name:         string;
  category:     Category;
  coordinates:  Coordinates;
  address:      string;
  description:  string;       // breve, per la card
  full_story:   string;       // lunga, per DetailView + Audio
  founded_year: number;       // es. 1929
  image_url:    string;       // hero image
  gallery:      string[];     // array di URL
  social:       SocialLinks;
  protected:    boolean;      // patrimonio protetto
  city:         string;       // "Barcelona", "Madrid"…
}

/* ── Stamp (timbre passaporto) ──────────────────────────── */
export interface Stamp {
  localeId:    string;
  localeName:  string;
  category:    Category;
  city:        string;
  visitedAt:   string;        // ISO date string
  coordinates: Coordinates;
}

/* ── Passport ───────────────────────────────────────────── */
export interface Passport {
  uid:          string;
  stamps:       Stamp[];
  totalVisits:  number;
  createdAt:    string;
  lastVisitAt:  string;
}

/* ── Badge ──────────────────────────────────────────────── */
export interface Badge {
  id:          string;
  label:       string;
  description: string;
  icon:        string;
  unlockedAt?: string;        // undefined = non ancora sbloccato
  condition:   (stamps: Stamp[]) => boolean;
}

/* ── Ruta (percorso tematico) ───────────────────────────── */
export interface RutaStop {
  localeId:    string;
  order:       number;
  note?:       string;        // nota specifica per questa tappa
}

export interface Ruta {
  id:          string;
  title:       string;
  subtitle:    string;
  description: string;
  duration:    string;        // es. "2h 30min"
  distance:    string;        // es. "3.2 km"
  difficulty:  'easy' | 'medium' | 'hard';
  stops:       RutaStop[];
  coverImage:  string;
  color:       string;        // accent color della ruta
  tags:        string[];
}

/* ── Route (OSRM navigazione) ───────────────────────────── */
export interface RouteStep {
  instruction: string;
  distance:    number;        // metri
  duration:    number;        // secondi
}

export interface Route {
  coordinates: [number, number][];
  distance:    number;        // metri totali
  duration:    number;        // secondi totali
  steps:       RouteStep[];
}

/* ── Blog ───────────────────────────────────────────────── */
export interface BlogPost {
  id:        string;
  title:     string;
  content:   string;
  image_url: string;
  published: boolean;
  createdAt: string;
}

/* ── User ───────────────────────────────────────────────── */
export type UserRole = 'user' | 'admin';

export interface AppUser {
  uid:         string;
  displayName: string;
  email:       string;
  photoURL?:   string;
  role:        UserRole;
}
