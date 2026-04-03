'use client'

interface Sponsor {
    name: string
    tagline: string
    logo: string        // emoji or URL
    category: string
    website?: string
    description: string
    featured?: boolean
}

// Placeholder sponsors — replace with Firestore data when real sponsors are onboarded
const PLACEHOLDER_SPONSORS: Sponsor[] = [
    {
        name: 'El Corte Inglés',
        tagline: 'La grande distribuzione del cuore di Barcellona',
        logo: '🏬',
        category: 'Retail',
        website: 'https://www.elcorteingles.es',
        description: 'Partner storico per la valorizzazione del commercio tradizionale barcellonese.',
        featured: true,
    },
    {
        name: 'Turisme de Barcelona',
        tagline: 'L\'ente ufficiale del turismo di Barcellona',
        logo: '🌆',
        category: 'Istituzionale',
        website: 'https://www.barcelonaturisme.com',
        description: 'Collaboriamo per promuovere il patrimonio culturale e commerciale della città.',
        featured: true,
    },
    {
        name: 'Cava Codorníu',
        tagline: 'Il cava catalano dal 1551',
        logo: '🍾',
        category: 'Enogastronomia',
        website: 'https://www.codorniu.com',
        description: 'Supporta la narrazione delle tradizioni gastronomiche catalane.',
    },
    {
        name: 'Arxiu Nacional de Catalunya',
        tagline: 'Memoria storica della Catalogna',
        logo: '📜',
        category: 'Cultura',
        description: 'Fornitore di documentazione storica per le schede dei locali.',
    },
]

interface SponsorsViewProps {
    onClose: () => void
}

export default function SponsorsView({ onClose }: SponsorsViewProps) {
    const featured = PLACEHOLDER_SPONSORS.filter(s => s.featured)
    const regular = PLACEHOLDER_SPONSORS.filter(s => !s.featured)

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="text-xl">🤝</span>
                </div>
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">Sponsors & Partner</h1>
                    <p className="font-sans text-xs text-anthracite/50">Chi rende possibile Emblematica</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors"
                >
                    <svg className="w-5 h-5 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">

                    {/* Hero strip */}
                    <div
                        className="rounded-3xl p-8 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #B8860B 0%, transparent 60%), radial-gradient(circle at 70% 50%, #B8860B 0%, transparent 60%)' }}
                        />
                        <p className="font-sans text-xs font-bold text-gold/80 uppercase tracking-[0.3em] mb-3 relative">Con il supporto di</p>
                        <h2 className="font-serif text-3xl font-bold text-cream relative">
                            I nostri partner<br />
                            <span className="text-gold italic font-normal text-xl">rendono viva la storia</span>
                        </h2>
                    </div>

                    {/* Featured sponsors */}
                    {featured.length > 0 && (
                        <div>
                            <h3 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-[0.2em] mb-4">Partner principali</h3>
                            <div className="space-y-4">
                                {featured.map(sponsor => (
                                    <SponsorCard key={sponsor.name} sponsor={sponsor} featured />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular sponsors */}
                    {regular.length > 0 && (
                        <div>
                            <h3 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-[0.2em] mb-4">Sostenitori</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {regular.map(sponsor => (
                                    <SponsorCard key={sponsor.name} sponsor={sponsor} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Become a sponsor CTA */}
                    <div className="rounded-3xl border-2 border-gold/30 p-8 text-center bg-gold/5">
                        <p className="font-sans text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2">Vuoi diventare partner?</p>
                        <h3 className="font-serif text-2xl font-bold text-anthracite mb-3">Collabora con noi</h3>
                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mb-6 max-w-xs mx-auto">
                            Raggiungi un pubblico di appassionati di cultura, storia e turismo di qualità a Barcellona.
                        </p>
                        <a
                            href="mailto:info@barnaemblematica.com"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold hover:bg-gold-dark text-cream font-sans font-bold text-sm transition-colors shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Contattaci via email
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}

function SponsorCard({ sponsor, featured }: { sponsor: Sponsor; featured?: boolean }) {
    const card = (
        <div className={`bg-white rounded-3xl border border-anthracite/5 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${featured ? 'p-6' : 'p-5'}`}>
            <div className="flex items-start gap-4">
                <div className={`${featured ? 'w-14 h-14 text-3xl' : 'w-11 h-11 text-2xl'} rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0`}>
                    {sponsor.logo.startsWith('http') ? (
                        <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain p-1" />
                    ) : (
                        <span>{sponsor.logo}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-serif font-bold text-anthracite ${featured ? 'text-lg' : 'text-base'}`}>{sponsor.name}</h3>
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full">{sponsor.category}</span>
                    </div>
                    <p className={`font-sans text-anthracite/50 mt-0.5 ${featured ? 'text-sm' : 'text-xs'}`}>{sponsor.tagline}</p>
                    {featured && (
                        <p className="font-sans text-sm text-anthracite/70 leading-relaxed mt-2">{sponsor.description}</p>
                    )}
                </div>
            </div>
            {sponsor.website && (
                <div className="mt-4 pt-4 border-t border-anthracite/5">
                    <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="font-sans text-xs font-semibold text-gold hover:underline flex items-center gap-1"
                    >
                        Visita il sito
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>
            )}
        </div>
    )

    return card
}
