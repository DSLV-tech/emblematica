import type { Locale } from '../types'

export interface Ruta {
    id: string
    title: string
    subtitle: string
    emoji: string
    color: string          // Tailwind bg class
    colorHex: string
    duration: string       // e.g. "2h 30min"
    distance: string       // e.g. "3,2 km"
    difficulty: 'facile' | 'media' | 'impegnativa'
    localeIds: string[]    // References to Locale.id
    description: string
    highlights: string[]
    tip?: string
}

export const RUTAS: Ruta[] = [
    {
        id: 'picasso-trail',
        title: 'Barcellona di Picasso',
        subtitle: 'Sui passi del giovane Pablo',
        emoji: '🎨',
        color: 'bg-blue-600',
        colorHex: '#2563EB',
        duration: '2h',
        distance: '2,1 km',
        difficulty: 'facile',
        localeIds: ['1', '2', '9'],
        description: 'Un percorso nel cuore del Barri Gòtic e del Raval sulle orme del giovane Pablo Picasso, che frequentò questi luoghi durante i suoi anni formativi a Barcellona tra il 1895 e il 1904.',
        highlights: [
            'La prima mostra di Picasso a Els Quatre Gats nel 1900',
            'Le serate di assenzio al Bar Marsella con i bohémien',
            'I concerti lirici al Gran Teatre del Liceu',
        ],
        tip: 'Inizia la mattina presto — Els Quatre Gats apre alle 9:00 ed è quasi deserto.',
    },
    {
        id: 'modernisme-route',
        title: 'Ruta Modernista',
        subtitle: 'Art Nouveau e belle époque catalana',
        emoji: '🏛️',
        color: 'bg-amber-600',
        colorHex: '#D97706',
        duration: '2h 30min',
        distance: '3,2 km',
        difficulty: 'facile',
        localeIds: ['3', '1', '4'],
        description: 'Un itinerario tra i capolavori del Modernisme catalano — da Puig i Cadafalch a Antoni Ros i Güell — attraverso i negozi storici che hanno conservato intatti i loro interni art nouveau.',
        highlights: [
            'La facciata in ceramica policroma della Casa Figueres (Escribà)',
            'L\'edificio neogotico di Els Quatre Gats firmato da Puig i Cadafalch',
            'I mobili in noce originali della Farmàcia Bolós (1896)',
        ],
        tip: 'Porta una macchina fotografica — gli interni sono fotogenici e generalmente ben illuminati.',
    },
    {
        id: 'gastronomia-storica',
        title: 'Gastronomia Storica',
        subtitle: 'Sapori e memorie del mercato barcellonese',
        emoji: '🍷',
        color: 'bg-red-700',
        colorHex: '#B91C1C',
        duration: '3h',
        distance: '2,8 km',
        difficulty: 'facile',
        localeIds: ['5', '3', '6', '10'],
        description: 'Un tour gastronomico attraverso i luoghi dove si è costruita la cucina catalana moderna — dal mercato ottocentesco alla pasticceria art nouveau, dai caffè borghesi ai ristoranti di pesce della Barceloneta.',
        highlights: [
            'Il Mercat de la Boqueria — più di 160 anni di storia gastronomica',
            'La pasticceria Escribà e le sculture in cioccolato',
            'Can Solé alla Barceloneta: la paella con aragosta dal 1903',
        ],
        tip: 'Fai il giro al mattino (9:00-12:00) — la Boqueria è più autentica e meno affollata.',
    },
    {
        id: 'letteratura-barcellona',
        title: 'Barcellona Letteraria',
        subtitle: 'Librerie e caffè degli intellettuali',
        emoji: '📚',
        color: 'bg-emerald-700',
        colorHex: '#047857',
        duration: '1h 45min',
        distance: '1,6 km',
        difficulty: 'facile',
        localeIds: ['7', '1', '6'],
        description: 'Un itinerario tra le librerie antiquarie e i caffè frequentati dagli intellettuali barcellonesi del Novecento — da Borges a Vázquez Montalbán, da Picasso a García Lorca.',
        highlights: [
            'La Llibreria Antiquaria Farré al Carrer de la Palla (1917)',
            'Els Quatre Gats dove Picasso stampò le sue prime cartoline',
            'Il Gran Café degli scrittori e giornalisti d\'inizio Novecento',
        ],
        tip: 'Il Carrer de la Palla è la "strada dei libri" di Barcellona — esplora tutte le librerie lungo il percorso.',
    },
    {
        id: 'mare-olimpiadi',
        title: 'Dal Mare alle Olimpiadi',
        subtitle: 'La Barcellona che guardò al futuro',
        emoji: '⚓',
        color: 'bg-sky-600',
        colorHex: '#0284C7',
        duration: '2h 15min',
        distance: '4,1 km',
        difficulty: 'media',
        localeIds: ['10', '8', '9'],
        description: 'Da Can Solé alla Barceloneta fino all\'Hotel Arts, un percorso che racconta come Barcellona si reinventò grazie ai Giochi Olimpici del 1992 — trasformando il waterfront industriale in una delle passeggiate più belle d\'Europa.',
        highlights: [
            'Can Solé: un secolo di cucina marinara nella Barceloneta storica',
            'Il Pez de Oro di Frank Gehry davanti all\'Hotel Arts',
            'La trasformazione della Vila Olímpica — da quartiere industriale a waterfront',
        ],
        tip: 'Percorso ideale nel tardo pomeriggio — tramonto sul Mediterràneo dal lungomare della Vila Olímpica.',
    },
]
