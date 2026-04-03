/**
 * City configuration registry for Emblematica multi-city expansion.
 *
 * Each entry defines everything needed to run the app for a different city:
 * - Firestore collection name
 * - Map center & default zoom
 * - Brand accent color
 * - Display strings
 */

export interface CityConfig {
    id: string
    name: string           // Display name e.g. "Barcellona"
    fullName: string       // e.g. "Emblematica Barcelona"
    tagline: string
    flag: string           // emoji
    country: string
    collection: string     // Firestore collection name e.g. "locales"
    center: { lat: number; lng: number }
    zoom: number
    accentColor: string    // Hex, used for themed UI
    accentColorLight: string
    backgroundImage: string // Unsplash URL for splash
    available: boolean     // false = "coming soon"
}

export const CITIES: CityConfig[] = [
    {
        id: 'barcelona',
        name: 'Barcellona',
        fullName: 'Emblematica Barcelona',
        tagline: 'Scopri il patrimonio unico dei locali storici di Barcellona',
        flag: '🇪🇸',
        country: 'Spagna',
        collection: 'locales',
        center: { lat: 41.3851, lng: 2.1734 },
        zoom: 14,
        accentColor: '#B8860B',
        accentColorLight: '#D4AF37',
        backgroundImage: 'https://images.unsplash.com/photo-1583422409516-15951797f0a9?q=80&w=2600&auto=format&fit=crop',
        available: true,
    },
    {
        id: 'napoli',
        name: 'Napoli',
        fullName: 'NapoliEmblemàtica',
        tagline: 'I locali storici che raccontano l\'anima di Napoli',
        flag: '🇮🇹',
        country: 'Italia',
        collection: 'locales_napoli',
        center: { lat: 40.8518, lng: 14.2681 },
        zoom: 14,
        accentColor: '#C4722A',
        accentColorLight: '#E8956D',
        backgroundImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2600&auto=format&fit=crop',
        available: false,
    },
    {
        id: 'lisbona',
        name: 'Lisbona',
        fullName: 'LisboaEmblemàtica',
        tagline: 'Fado, azulejos e i locais históricos che resistono al tempo',
        flag: '🇵🇹',
        country: 'Portogallo',
        collection: 'locales_lisbona',
        center: { lat: 38.7223, lng: -9.1393 },
        zoom: 14,
        accentColor: '#1E6B8C',
        accentColorLight: '#3AAAD4',
        backgroundImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2600&auto=format&fit=crop',
        available: false,
    },
    {
        id: 'bologna',
        name: 'Bologna',
        fullName: 'BolognaEmblemàtica',
        tagline: 'Le osterie e le botteghe che hanno nutrito la città dotta',
        flag: '🇮🇹',
        country: 'Italia',
        collection: 'locales_bologna',
        center: { lat: 44.4949, lng: 11.3426 },
        zoom: 14,
        accentColor: '#8B0000',
        accentColorLight: '#C41E3A',
        backgroundImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=2600&auto=format&fit=crop',
        available: false,
    },
    {
        id: 'porto',
        name: 'Porto',
        fullName: 'PortoEmblemàtica',
        tagline: 'Ribeira, vinho do Porto e i locales que resistem ao tempo',
        flag: '🇵🇹',
        country: 'Portogallo',
        collection: 'locales_porto',
        center: { lat: 41.1579, lng: -8.6291 },
        zoom: 14,
        accentColor: '#6B2D8B',
        accentColorLight: '#9B59B6',
        backgroundImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2600&auto=format&fit=crop',
        available: false,
    },
    {
        id: 'palermo',
        name: 'Palermo',
        fullName: 'PalermoEmblemàtica',
        tagline: 'I mercati arabi-normanni e le pasticcerie centenarie',
        flag: '🇮🇹',
        country: 'Italia',
        collection: 'locales_palermo',
        center: { lat: 38.1157, lng: 13.3615 },
        zoom: 14,
        accentColor: '#C8A951',
        accentColorLight: '#F0D080',
        backgroundImage: 'https://images.unsplash.com/photo-1589825743636-b78e9889e8ba?q=80&w=2600&auto=format&fit=crop',
        available: false,
    },
]

export const DEFAULT_CITY = CITIES[0] // Barcelona

export function getCityById(id: string): CityConfig {
    return CITIES.find(c => c.id === id) ?? DEFAULT_CITY
}
