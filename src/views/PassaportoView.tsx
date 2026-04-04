'use client'

import type { Stamp } from '../types'
import { CATEGORY_ICONS } from '../types'
import { CITIES } from '../data/cities'

interface PassaportoViewProps {
    stamps: Stamp[]
    loading: boolean
    onClose: () => void
}

// ─── Badge globali (per numero totale di stamp) ──────────────────────────────
const BADGE_THRESHOLDS = [
    { count: 1,  label: 'Curioso',         emoji: '🔍', color: '#6B7280' },
    { count: 3,  label: 'Esploratore',     emoji: '🧭', color: '#B8860B' },
    { count: 5,  label: 'Conoscitore',     emoji: '🏛️', color: '#C4722A' },
    { count: 8,  label: 'Storico',         emoji: '📜', color: '#7C3AED' },
    { count: 10, label: 'Emblematicista',  emoji: '⭐', color: '#DC2626' },
]

function getCurrentBadge(count: number) {
    return [...BADGE_THRESHOLDS].reverse().find(b => count >= b.count) ?? null
}
function getNextBadge(count: number) {
    return BADGE_THRESHOLDS.find(b => count < b.count) ?? null
}

// ─── Formattazione data ───────────────────────────────────────────────────────
function formatDate(ts: any): string {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toDate(ts: any): Date {
    if (!ts) return new Date(0)
    return ts.toDate ? ts.toDate() : new Date(ts)
}

function monthLabel(ts: any): string {
    const d = toDate(ts)
    return d.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
}

// ─── Raggruppa stamp per mese ─────────────────────────────────────────────────
function groupByMonth(stamps: Stamp[]): Map<string, Stamp[]> {
    const map = new Map<string, Stamp[]>()
    // ordine cronologico inverso
    const sorted = [...stamps].sort((a, b) => toDate(b.visitedAt).getTime() - toDate(a.visitedAt).getTime())
    for (const s of sorted) {
        const key = monthLabel(s.visitedAt)
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(s)
    }
    return map
}

// ─── Raggruppa stamp per città ────────────────────────────────────────────────
function groupByCity(stamps: Stamp[]): Map<string, Stamp[]> {
    const map = new Map<string, Stamp[]>()
    for (const s of stamps) {
        // localeCity è opzionale — fallback "Sconosciuta"
        const city = s.localeCity ?? 'Barcellona'
        if (!map.has(city)) map.set(city, [])
        map.get(city)!.push(s)
    }
    return map
}

// ─── Lookup config città dal nome display ─────────────────────────────────────
function cityConfig(cityName: string) {
    return CITIES.find(c => c.name === cityName) ?? null
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PassaportoView({ stamps, loading, onClose }: PassaportoViewProps) {
    const count    = stamps.length
    const badge    = getCurrentBadge(count)
    const nextBadge = getNextBadge(count)
    const remaining = nextBadge ? nextBadge.count - count : 0

    const byCity  = groupByCity(stamps)
    const byMonth = groupByMonth(stamps)

    // Totale locali globali (somma delle città con dati)
    const totalGlobal = CITIES.filter(c => c.available).reduce((acc, c) => acc + c.totalLocales, 0)
    const pct = totalGlobal > 0 ? Math.round((count / totalGlobal) * 100) : 0

    // SVG ring
    const R = 40
    const C = 2 * Math.PI * R
    const strokeDash = totalGlobal > 0 ? (count / totalGlobal) * C : 0

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="text-xl">📒</span>
                </div>
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">Passaporto</h1>
                    <p className="font-sans text-xs text-anthracite/50">I locali che hai visitato di persona</p>
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
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto px-6 py-8 space-y-8">

                        {/* ── Progress card ──────────────────────────────────── */}
                        <div
                            className="rounded-3xl p-7 relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' }}
                        >
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 20%, #B8860B 0%, transparent 60%)' }} />

                            <div className="flex items-center gap-6 relative">
                                <div className="relative flex-shrink-0">
                                    <svg width="96" height="96" viewBox="0 0 96 96">
                                        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <circle
                                            cx="48" cy="48" r={R}
                                            fill="none"
                                            stroke="#B8860B"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${strokeDash} ${C}`}
                                            transform="rotate(-90 48 48)"
                                            style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                        />
                                        <text x="48" y="44" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Georgia, serif">{count}</text>
                                        <text x="48" y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">/ {totalGlobal}</text>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-sans text-xs font-bold text-gold/70 uppercase tracking-[0.2em] mb-1">Locali visitati</p>
                                    <p className="font-serif text-3xl font-bold text-cream">{pct}%</p>
                                    <p className="font-sans text-xs text-cream/50 mt-1">del mondo Emblematica</p>
                                    {badge && (
                                        <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-2xl px-3 py-1.5 w-fit">
                                            <span className="text-lg">{badge.emoji}</span>
                                            <span className="font-sans text-xs font-bold text-cream">{badge.label}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {nextBadge && (
                                <div className="mt-5 pt-4 border-t border-white/10 relative flex items-center justify-between">
                                    <p className="font-sans text-xs text-cream/50">
                                        <span className="text-cream font-semibold">{remaining} locale{remaining !== 1 ? 'i' : ''} ancora</span> per diventare <span className="text-gold font-semibold">{nextBadge.emoji} {nextBadge.label}</span>
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-base">{nextBadge.emoji}</div>
                                </div>
                            )}
                            {!nextBadge && count > 0 && (
                                <div className="mt-5 pt-4 border-t border-white/10 relative">
                                    <p className="font-sans text-xs text-gold font-bold">🏆 Hai visitato tutti i locali! Il mondo è tuo.</p>
                                </div>
                            )}
                        </div>

                        {/* ── Badge globali ───────────────────────────────────── */}
                        <div>
                            <h2 className="font-serif text-lg font-bold text-anthracite mb-4">Badge ottenuti</h2>
                            <div className="flex gap-3 flex-wrap">
                                {BADGE_THRESHOLDS.map(b => {
                                    const earned = count >= b.count
                                    return (
                                        <div
                                            key={b.label}
                                            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all ${earned ? 'bg-white border-anthracite/10 shadow-sm' : 'bg-anthracite/5 border-transparent opacity-40'}`}
                                        >
                                            <span className="text-2xl">{b.emoji}</span>
                                            <span className="font-sans text-[10px] font-bold text-anthracite/70 text-center">{b.label}</span>
                                            <span className="font-sans text-[9px] text-anthracite/40">{b.count} tappe</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ── Badge per città ──────────────────────────────────── */}
                        {byCity.size > 0 && (
                            <div>
                                <h2 className="font-serif text-lg font-bold text-anthracite mb-4">Per città</h2>
                                <div className="space-y-4">
                                    {Array.from(byCity.entries()).map(([cityName, cityStamps]) => {
                                        const cfg   = cityConfig(cityName)
                                        const total = cfg?.totalLocales ?? 0
                                        const n     = cityStamps.length
                                        const done  = total > 0 && n >= total
                                        const pctCity = total > 0 ? Math.round((n / total) * 100) : null
                                        return (
                                            <div key={cityName} className="bg-white rounded-2xl p-4 border border-anthracite/5 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{cfg?.flag ?? '🏙️'}</span>
                                                        <span className="font-serif text-base font-bold text-anthracite">{cityName}</span>
                                                        {done && (
                                                            <span className="text-xs bg-gold/15 text-gold font-bold px-2 py-0.5 rounded-full border border-gold/25">
                                                                🏆 Completa!
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-sans text-sm font-bold text-anthracite/60">
                                                        {n}{total > 0 ? `/${total}` : ''} timbri
                                                    </span>
                                                </div>
                                                {total > 0 && (
                                                    <div className="w-full h-1.5 bg-anthracite/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${Math.min(pctCity ?? 0, 100)}%`,
                                                                backgroundColor: cfg?.accentColor ?? '#B8860B',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Timeline stamp ───────────────────────────────────── */}
                        {count === 0 ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                                    <span className="text-4xl">📍</span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-anthracite">Nessun timbro ancora</h3>
                                <p className="font-sans text-sm text-anthracite/50 max-w-xs mx-auto leading-relaxed">
                                    Visita un locale di persona e premi <strong>"Timbra Passaporto"</strong> nella sua scheda quando sei lì (entro 100m).
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="font-serif text-lg font-bold text-anthracite mb-4">Timbri raccolti</h2>
                                <div className="space-y-6">
                                    {Array.from(byMonth.entries()).map(([month, monthStamps]) => (
                                        <div key={month}>
                                            {/* Month header */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-px flex-1 bg-anthracite/10" />
                                                <span className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-widest capitalize">
                                                    {month}
                                                </span>
                                                <div className="h-px flex-1 bg-anthracite/10" />
                                            </div>

                                            <div className="space-y-3">
                                                {monthStamps.map((stamp, i) => (
                                                    <div key={`${stamp.localeId}-${i}`} className="flex gap-4 items-center bg-white rounded-2xl p-4 border border-anthracite/5 shadow-sm">
                                                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gold flex items-center justify-center flex-shrink-0 bg-gold/5 text-xl">
                                                            {CATEGORY_ICONS[stamp.localeCategory as keyof typeof CATEGORY_ICONS] ?? '📍'}
                                                        </div>
                                                        {stamp.localeImage && (
                                                            <img
                                                                src={stamp.localeImage}
                                                                alt={stamp.localeName}
                                                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                                                onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-serif text-sm font-bold text-anthracite truncate">{stamp.localeName}</p>
                                                            <p className="font-sans text-xs text-anthracite/50 truncate">{stamp.localeAddress}</p>
                                                            {stamp.localeCity && (
                                                                <p className="font-sans text-[10px] text-anthracite/40 mt-0.5">{stamp.localeCity}</p>
                                                            )}
                                                            <p className="font-sans text-[10px] text-gold font-semibold mt-1">✓ {formatDate(stamp.visitedAt)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pb-6" />
                    </div>
                )}
            </div>
        </div>
    )
}
