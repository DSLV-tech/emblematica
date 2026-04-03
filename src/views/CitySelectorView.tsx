'use client'

import { CITIES, type CityConfig } from '../data/cities'
import { useCity } from '../context/CityContext'

interface CitySelectorViewProps {
    onClose: () => void
}

export default function CitySelectorView({ onClose }: CitySelectorViewProps) {
    const { city: activeCity, setCity } = useCity()

    const available = CITIES.filter(c => c.available)
    const comingSoon = CITIES.filter(c => !c.available)

    const handleSelect = (c: CityConfig) => {
        if (!c.available) return
        setCity(c.id)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="text-xl">🌍</span>
                </div>
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">Scegli la città</h1>
                    <p className="font-sans text-xs text-anthracite/50">Emblematica è disponibile in queste città</p>
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
                <div className="max-w-lg mx-auto px-6 py-8 space-y-8">

                    {/* Active */}
                    <div>
                        <h2 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-[0.2em] mb-4">Disponibile ora</h2>
                        {available.map(c => (
                            <CityCard
                                key={c.id}
                                city={c}
                                isActive={c.id === activeCity.id}
                                onSelect={() => handleSelect(c)}
                            />
                        ))}
                    </div>

                    {/* Coming soon */}
                    <div>
                        <h2 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-[0.2em] mb-4">In arrivo</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {comingSoon.map(c => (
                                <div key={c.id} className="bg-white rounded-2xl border border-anthracite/5 p-4 opacity-60 flex items-center gap-3">
                                    <span className="text-2xl">{c.flag}</span>
                                    <div>
                                        <p className="font-serif text-sm font-bold text-anthracite">{c.name}</p>
                                        <p className="font-sans text-[10px] text-anthracite/40">{c.country}</p>
                                    </div>
                                    <span className="ml-auto font-sans text-[10px] font-bold text-gold/60 uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded-full">Presto</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Propose CTA */}
                    <div className="rounded-3xl border-2 border-dashed border-gold/30 p-6 text-center">
                        <p className="font-sans text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2">Vuoi la tua città?</p>
                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mb-4 max-w-xs mx-auto">
                            Sei un'associazione culturale o un ente municipale? Possiamo portare Emblematica nella tua città.
                        </p>
                        <a
                            href="mailto:info@barnaemblematica.com?subject=Proposta%20nuova%20citt%C3%A0"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm hover:bg-anthracite/80 transition-colors"
                        >
                            <span>✉️</span> Proponi la tua città
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}

function CityCard({ city, isActive, onSelect }: { city: CityConfig; isActive: boolean; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className={`w-full text-left rounded-3xl overflow-hidden mb-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${isActive ? 'ring-2 ring-offset-2 ring-gold' : ''
                }`}
        >
            {/* City background strip */}
            <div
                className="relative h-28 w-full overflow-hidden"
                style={{ backgroundImage: `url(${city.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${city.accentColor}CC, transparent)` }} />
                <div className="absolute inset-0 flex items-center px-6 gap-4">
                    <span className="text-4xl">{city.flag}</span>
                    <div>
                        <p className="font-serif text-2xl font-bold text-white drop-shadow">{city.name}</p>
                        <p className="font-sans text-xs text-white/80">{city.tagline.slice(0, 50)}…</p>
                    </div>
                    {isActive && (
                        <div className="ml-auto bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-sans text-xs font-bold text-white">Attiva</span>
                        </div>
                    )}
                </div>
            </div>
        </button>
    )
}
