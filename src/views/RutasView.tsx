'use client'

import { useMemo, useState } from 'react'
import { RUTAS, type Ruta } from '../data/rutas'
import type { Locale } from '../types'
import { useLanguage } from '../context/LanguageContext'
import type { TranslationKey } from '../i18n/translations'
import { ArrowRight, Footprints, Lightbulb, MapPin, MapTrifold, Bank, Timer, type Icon } from '@phosphor-icons/react'
import ViewHeader from '../components/UI/ViewHeader'

interface RutasViewProps {
    cityId?: string
    locales: Locale[]
    onClose: () => void
    /** Called when user taps "Apri sulla mappa" — shows the ruta on the map */
    onStartRuta: (ruta: Ruta, stops: Locale[]) => void
}

/** Tappe in ordine di percorso, solo se esistono tutte nei dati della città */
function resolveStops(ruta: Ruta, locales: Locale[]): Locale[] | null {
    const stops = ruta.localeIds.flatMap(id => locales.filter(l => l.id === id))
    return stops.length === ruta.localeIds.length ? stops : null
}

export default function RutasView({ cityId, locales, onClose, onStartRuta }: RutasViewProps) {
    const [selected, setSelected] = useState<Ruta | null>(null)
    const { t } = useLanguage()
    const rutas = useMemo(
        () => RUTAS.filter(r => r.cityId === cityId && resolveStops(r, locales)),
        [cityId, locales]
    )
    const DIFFICULTY_LABEL = {
        facile: t('rutas.easy'),
        media: t('rutas.medium'),
        impegnativa: t('rutas.hard'),
    }

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] paper overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader
                icon={MapTrifold}
                title={selected ? selected.title : t('rutas.title')}
                subtitle={selected ? selected.subtitle : t('rutas.subtitle')}
                onClose={onClose}
                onBack={selected ? () => setSelected(null) : undefined}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {selected ? (
                    <RutaDetail ruta={selected} stops={resolveStops(selected, locales) ?? []} onStartRuta={onStartRuta} onClose={onClose} difficultyLabel={DIFFICULTY_LABEL} t={t} />
                ) : (
                    <RutaList rutas={rutas} onSelect={setSelected} difficultyLabel={DIFFICULTY_LABEL} t={t} />
                )}
            </div>
        </div>
    )
}

// ─── List view ──────────────────────────────────────────────────────────────
function RutaList({ rutas, onSelect, difficultyLabel, t }: {
    rutas: Ruta[]
    onSelect: (r: Ruta) => void
    difficultyLabel: Record<string, string>
    t: (k: TranslationKey) => string
}) {
    if (rutas.length === 0) {
        return <p className="font-sans text-sm text-anthracite/60 text-center py-20 px-6">{t('rutas.empty')}</p>
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-5">
            {/* Intro */}
            <div
                className="rounded-3xl p-7 relative overflow-hidden mb-2"
                style={{ background: 'linear-gradient(135deg, #26262B 0%, #141416 100%)' }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, #C9A84C 0%, transparent 60%)' }} />
                <p className="eyebrow text-gold/80 mb-2 relative">{t('rutas.curated_label')}</p>
                <h2 className="font-serif text-2xl text-cream font-semibold leading-snug relative">
                    {rutas.length} {t('rutas.intro_title')}
                </h2>
                <p className="font-sans text-sm text-cream/60 mt-3 leading-relaxed relative">
                    {t('rutas.intro_body')}
                </p>
            </div>

            {/* Ruta cards */}
            {rutas.map(ruta => (
                <button
                    key={ruta.id}
                    onClick={() => onSelect(ruta)}
                    className="w-full text-left card-raised rounded-3xl card-raised--press overflow-hidden group"
                >
                    {/* Color bar */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: ruta.colorHex }} />
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ruta.colorHex + '18', color: ruta.colorHex }}>
                                <ruta.icon size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-lg font-semibold text-anthracite group-hover:text-gold-dark transition-colors">{ruta.title}</h3>
                                <p className="font-sans text-xs text-anthracite/50 mb-2">{ruta.subtitle}</p>
                                <p className="font-sans text-sm text-anthracite/70 leading-relaxed line-clamp-2">{ruta.description}</p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-anthracite/5">
                            <Stat icon={Timer} label={ruta.duration} />
                            <Stat icon={MapPin} label={ruta.distance} />
                            <Stat icon={Footprints} label={difficultyLabel[ruta.difficulty] ?? ruta.difficulty} />
                            <div className="ms-auto">
                                <span className="font-sans text-xs font-semibold text-gold-dark inline-flex items-center gap-1">{ruta.localeIds.length} {t('rutas.stops')} <ArrowRight size={14} className="rtl:rotate-180" /></span>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

// ─── Detail view ─────────────────────────────────────────────────────────────
function RutaDetail({ ruta, stops, onStartRuta, onClose, difficultyLabel, t }: {
    ruta: Ruta
    stops: Locale[]
    difficultyLabel: Record<string, string>
    onStartRuta: (ruta: Ruta, stops: Locale[]) => void
    onClose: () => void
    t: (k: TranslationKey) => string
}) {
    const handleStart = () => {
        onStartRuta(ruta, stops)
        onClose()
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            {/* Hero */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ruta.colorHex} 0%, ${ruta.colorHex}99 100%)` }}>
                <ruta.icon size={44} className="text-white mb-4" />
                <h2 className="font-display text-3xl font-semibold text-white mb-1">{ruta.title}</h2>
                <p className="font-sans text-white/80 text-sm">{ruta.subtitle}</p>

                {/* Stats */}
                <div className="flex gap-4 mt-6 flex-wrap">
                    {[
                        { icon: Timer,      val: ruta.duration, label: t('rutas.duration') },
                        { icon: MapPin,     val: ruta.distance, label: t('rutas.distance') },
                        { icon: Footprints, val: difficultyLabel[ruta.difficulty] ?? ruta.difficulty, label: t('rutas.difficulty') },
                        { icon: Bank,       val: `${ruta.localeIds.length} ${t('rutas.stops')}`, label: t('rutas.fermate') },
                    ].map(s => (
                        <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
                            <s.icon size={18} className="text-white mx-auto" />
                            <p className="font-serif text-sm font-semibold text-white mt-1">{s.val}</p>
                            <p className="font-sans text-[10px] text-white/70 uppercase tracking-wider">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="font-serif text-lg font-semibold text-anthracite mb-3">{t('rutas.on_route')}</h3>
                <p className="font-sans text-sm text-anthracite/70 leading-relaxed">{ruta.description}</p>
            </div>

            {/* Highlights */}
            <div>
                <h3 className="font-serif text-lg font-semibold text-anthracite mb-3">{t('rutas.highlights')}</h3>
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
                <h3 className="font-serif text-lg font-semibold text-anthracite mb-3">{t('rutas.stops_label')}</h3>
                <div className="relative">
                    <div className="absolute start-5 top-0 bottom-0 w-px" style={{ backgroundColor: ruta.colorHex + '40' }} />
                    <div className="space-y-4">
                        {stops.map((locale, i) => (
                            <div key={locale.id} className="flex gap-4 items-start">
                                {/* Step number */}
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-[0_0_0_3px_var(--color-cream)] text-white text-sm font-bold" style={{ backgroundColor: ruta.colorHex }}>
                                    {i + 1}
                                </div>
                                {/* Info */}
                                <div className="flex-1 card-raised rounded-2xl p-4 flex gap-3">
                                    <img
                                        src={locale.image_url}
                                        alt={locale.name}
                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                                    />
                                    <div>
                                        <p className="font-serif text-sm font-semibold text-anthracite">{locale.name}</p>
                                        <p className="font-sans text-xs text-anthracite/50 mt-0.5">{locale.address}</p>
                                        <p className="font-sans text-xs text-anthracite/70 mt-1 leading-relaxed line-clamp-2">{locale.description}</p>
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
                    <Lightbulb size={24} className="text-gold-dark flex-shrink-0" />
                    <div>
                        <p className="eyebrow text-gold-dark mb-1">{t('rutas.tip')}</p>
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
                <MapTrifold size={22} />
                {t('rutas.open_map')}
            </button>

            <div className="pb-8" />
        </div>
    )
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function Stat({ icon: Glyph, label }: { icon: Icon; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <Glyph size={16} className="text-gold-dark" />
            <span className="font-sans font-medium text-anthracite/70 text-xs">{label}</span>
        </div>
    )
}
