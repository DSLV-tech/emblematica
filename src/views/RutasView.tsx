'use client'

import { useState } from 'react'
import { RUTAS, type Ruta } from '../data/rutas'
import { SAMPLE_LOCALES } from '../data/sampleData'
import type { Locale } from '../types'

interface RutasViewProps {
    onClose: () => void
    /** Called when user taps "Apri sulla mappa" — highlights the ruta's locales */
    onStartRuta: (localeIds: string[]) => void
}

const DIFFICULTY_LABEL = { facile: '🟢 Facile', media: '🟡 Media', impegnativa: '🔴 Impegnativa' }

export default function RutasView({ onClose, onStartRuta }: RutasViewProps) {
    const [selected, setSelected] = useState<Ruta | null>(null)

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                {selected ? (
                    <button
                        onClick={() => setSelected(null)}
                        className="w-9 h-9 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                        <span className="text-xl">🧭</span>
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">
                        {selected ? selected.title : 'Rutas Temàtiques'}
                    </h1>
                    {!selected && <p className="font-sans text-xs text-anthracite/50">Percorsi tematici a piedi nella Barcellona storica</p>}
                    {selected && <p className="font-sans text-xs text-anthracite/50">{selected.subtitle}</p>}
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {selected ? (
                    <RutaDetail ruta={selected} onStartRuta={onStartRuta} onClose={onClose} />
                ) : (
                    <RutaList onSelect={setSelected} />
                )}
            </div>
        </div>
    )
}

// ─── List view ──────────────────────────────────────────────────────────────
function RutaList({ onSelect }: { onSelect: (r: Ruta) => void }) {
    return (
        <div className="p-6 max-w-2xl mx-auto space-y-5">
            {/* Intro */}
            <div
                className="rounded-3xl p-7 relative overflow-hidden mb-2"
                style={{ background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, #B8860B 0%, transparent 60%)' }} />
                <p className="font-sans text-xs font-bold text-gold/70 uppercase tracking-[0.3em] mb-2 relative">Itinerari curati</p>
                <h2 className="font-serif text-2xl text-cream font-bold leading-snug relative">
                    5 percorsi<br />
                    <span className="text-gold italic font-normal">per scoprire la città vera</span>
                </h2>
                <p className="font-sans text-sm text-cream/60 mt-3 leading-relaxed relative">
                    Ogni ruta è progettata per essere percorsa a piedi, collegando locali storici con un filo narrativo comune.
                </p>
            </div>

            {/* Ruta cards */}
            {RUTAS.map(ruta => (
                <button
                    key={ruta.id}
                    onClick={() => onSelect(ruta)}
                    className="w-full text-left bg-white rounded-3xl border border-anthracite/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
                >
                    {/* Color bar */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: ruta.colorHex }} />
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: ruta.colorHex + '18' }}>
                                {ruta.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-lg font-bold text-anthracite group-hover:text-gold transition-colors">{ruta.title}</h3>
                                <p className="font-sans text-xs text-anthracite/50 mb-2">{ruta.subtitle}</p>
                                <p className="font-sans text-sm text-anthracite/70 leading-relaxed line-clamp-2">{ruta.description}</p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-anthracite/5">
                            <Stat icon="⏱" label={ruta.duration} />
                            <Stat icon="📍" label={ruta.distance} />
                            <Stat icon="🏃" label={DIFFICULTY_LABEL[ruta.difficulty]} small />
                            <div className="ml-auto">
                                <span className="font-sans text-xs font-bold text-gold">{ruta.localeIds.length} tappe →</span>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

// ─── Detail view ─────────────────────────────────────────────────────────────
function RutaDetail({ ruta, onStartRuta, onClose }: { ruta: Ruta; onStartRuta: (ids: string[]) => void; onClose: () => void }) {
    // Resolve locale objects referenced by this ruta
    const stops: Locale[] = ruta.localeIds
        .map(id => SAMPLE_LOCALES.find(l => l.id === id))
        .filter(Boolean) as Locale[]

    const handleStart = () => {
        onStartRuta(ruta.localeIds)
        onClose()
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            {/* Hero */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ruta.colorHex} 0%, ${ruta.colorHex}99 100%)` }}>
                <div className="text-5xl mb-4">{ruta.emoji}</div>
                <h2 className="font-serif text-3xl font-bold text-white mb-1">{ruta.title}</h2>
                <p className="font-sans text-white/80 text-sm">{ruta.subtitle}</p>

                {/* Stats */}
                <div className="flex gap-4 mt-6 flex-wrap">
                    {[
                        { icon: '⏱', val: ruta.duration, label: 'durata' },
                        { icon: '📍', val: ruta.distance, label: 'distanza' },
                        { icon: '🏃', val: ruta.difficulty, label: 'difficoltà' },
                        { icon: '🏛️', val: `${ruta.localeIds.length} tappe`, label: 'fermate' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
                            <p className="font-sans text-lg leading-none">{s.icon}</p>
                            <p className="font-serif text-sm font-bold text-white mt-1">{s.val}</p>
                            <p className="font-sans text-[10px] text-white/70 uppercase tracking-wider">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="font-serif text-lg font-bold text-anthracite mb-3">Sul percorso</h3>
                <p className="font-sans text-sm text-anthracite/70 leading-relaxed">{ruta.description}</p>
            </div>

            {/* Highlights */}
            <div>
                <h3 className="font-serif text-lg font-bold text-anthracite mb-3">Da non perdere</h3>
                <div className="space-y-3">
                    {ruta.highlights.map((h, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold" style={{ backgroundColor: ruta.colorHex }}>
                                {i + 1}
                            </div>
                            <p className="font-sans text-sm text-anthracite/80 leading-relaxed">{h}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stops */}
            <div>
                <h3 className="font-serif text-lg font-bold text-anthracite mb-3">Le tappe</h3>
                <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px" style={{ backgroundColor: ruta.colorHex + '40' }} />
                    <div className="space-y-4">
                        {stops.map((locale, i) => (
                            <div key={locale.id} className="flex gap-4 items-start">
                                {/* Step number */}
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-[0_0_0_3px_#F5F5DC] text-white text-sm font-bold" style={{ backgroundColor: ruta.colorHex }}>
                                    {i + 1}
                                </div>
                                {/* Info */}
                                <div className="flex-1 bg-white rounded-2xl p-4 border border-anthracite/5 shadow-sm flex gap-3">
                                    <img
                                        src={locale.image_url}
                                        alt={locale.name}
                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                                    />
                                    <div>
                                        <p className="font-serif text-sm font-bold text-anthracite">{locale.name}</p>
                                        <p className="font-sans text-xs text-anthracite/50 mt-0.5">{locale.address}</p>
                                        <p className="font-sans text-xs text-anthracite/70 mt-1 leading-relaxed line-clamp-2">{locale.short_desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tip */}
            {ruta.tip && (
                <div className="flex gap-3 bg-gold/10 rounded-2xl p-4 border border-gold/20">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <div>
                        <p className="font-sans text-xs font-bold text-gold uppercase tracking-wide mb-1">Consiglio</p>
                        <p className="font-sans text-sm text-anthracite/80 leading-relaxed">{ruta.tip}</p>
                    </div>
                </div>
            )}

            {/* CTA */}
            <button
                onClick={handleStart}
                className="w-full py-5 rounded-3xl text-white font-sans font-bold text-base shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                style={{ backgroundColor: ruta.colorHex }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Apri sulla mappa
            </button>

            <div className="pb-8" />
        </div>
    )
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function Stat({ icon, label, small }: { icon: string; label: string; small?: boolean }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={small ? 'text-xs' : 'text-sm'}>{icon}</span>
            <span className={`font-sans font-semibold text-anthracite/70 ${small ? 'text-[11px]' : 'text-xs'}`}>{label}</span>
        </div>
    )
}
