'use client'

import type { Stamp } from '../types'
import { Bank, CheckCircle, Compass, MagnifyingGlass, MapPin, Scroll, Star, Stamp as StampIcon, Trophy, type Icon } from '@phosphor-icons/react'
import type { TranslationKey } from '../i18n/translations'
import { useLanguage } from '../context/LanguageContext'
import CategoryIcon from '../components/UI/CategoryIcon'
import ViewHeader from '../components/UI/ViewHeader'
import { CITIES } from '../data/cities'

interface PassaportoViewProps {
    stamps: Stamp[]
    loading: boolean
    onClose: () => void
}

// ─── Badge globali (per numero totale di stamp) ──────────────────────────────
const BADGE_THRESHOLDS: { count: number; label: TranslationKey; icon: Icon }[] = [
    { count: 1,  label: 'badge.curious',     icon: MagnifyingGlass },
    { count: 3,  label: 'badge.explorer',    icon: Compass },
    { count: 5,  label: 'badge.connoisseur', icon: Bank },
    { count: 8,  label: 'badge.historian',   icon: Scroll },
    { count: 10, label: 'badge.emblematic',  icon: Star },
]

function getCurrentBadge(count: number) {
    return [...BADGE_THRESHOLDS].reverse().find(b => count >= b.count) ?? null
}
function getNextBadge(count: number) {
    return BADGE_THRESHOLDS.find(b => count < b.count) ?? null
}

// ─── Formattazione data ───────────────────────────────────────────────────────
function formatDate(ts: any, lang: string): string {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString(lang, { day: '2-digit', month: 'short', year: 'numeric' })
}

function toDate(ts: any): Date {
    if (!ts) return new Date(0)
    return ts.toDate ? ts.toDate() : new Date(ts)
}

function monthLabel(ts: any, lang: string): string {
    const d = toDate(ts)
    return d.toLocaleDateString(lang, { month: 'long', year: 'numeric' })
}

// ─── Raggruppa stamp per mese ─────────────────────────────────────────────────
function groupByMonth(stamps: Stamp[], lang: string): Map<string, Stamp[]> {
    const map = new Map<string, Stamp[]>()
    // ordine cronologico inverso
    const sorted = [...stamps].sort((a, b) => toDate(b.visitedAt).getTime() - toDate(a.visitedAt).getTime())
    for (const s of sorted) {
        const key = monthLabel(s.visitedAt, lang)
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
    const { t, lang } = useLanguage()
    const count    = stamps.length
    const badge    = getCurrentBadge(count)
    const nextBadge = getNextBadge(count)
    const remaining = nextBadge ? nextBadge.count - count : 0

    const byCity  = groupByCity(stamps)
    const byMonth = groupByMonth(stamps, lang)

    // Totale locali globali (somma delle città con dati)
    const totalGlobal = CITIES.filter(c => c.available).reduce((acc, c) => acc + c.totalLocales, 0)
    const pct = totalGlobal > 0 ? Math.round((count / totalGlobal) * 100) : 0

    // SVG ring
    const R = 40
    const C = 2 * Math.PI * R
    const strokeDash = totalGlobal > 0 ? (count / totalGlobal) * C : 0

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader icon={StampIcon} title={t('passport.title')} subtitle={t('passport.subtitle')} onClose={onClose} />

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
                            style={{ background: 'linear-gradient(135deg, #26262B 0%, #141416 100%)' }}
                        >
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 20%, #C9A84C 0%, transparent 60%)' }} />

                            <div className="flex items-center gap-6 relative">
                                <div className="relative flex-shrink-0">
                                    <svg width="96" height="96" viewBox="0 0 96 96">
                                        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <circle
                                            cx="48" cy="48" r={R}
                                            fill="none"
                                            stroke="#C9A84C"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${strokeDash} ${C}`}
                                            transform="rotate(-90 48 48)"
                                            style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                        />
                                        <text x="48" y="44" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Fraunces, Georgia, serif">{count}</text>
                                        <text x="48" y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">/ {totalGlobal}</text>
                                    </svg>
                                </div>
                                <div>
                                    <p className="eyebrow text-gold/80 mb-1">{t('passport.visited')}</p>
                                    <p className="font-serif text-3xl font-bold text-cream">{pct}%</p>
                                    <p className="font-sans text-xs text-cream/50 mt-1">{t('passport.worldwide')}</p>
                                    {badge && (
                                        <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-2xl px-3 py-1.5 w-fit">
                                            <badge.icon size={18} className="text-gold" />
                                            <span className="font-sans text-xs font-semibold text-cream">{t(badge.label)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {nextBadge && (
                                <div className="mt-5 pt-4 border-t border-white/10 relative flex items-center justify-between">
                                    <p className="font-sans text-xs text-cream/60">
                                        {t('passport.remaining', { n: remaining, badge: t(nextBadge.label) })}
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold"><nextBadge.icon size={18} /></div>
                                </div>
                            )}
                            {!nextBadge && count > 0 && (
                                <div className="mt-5 pt-4 border-t border-white/10 relative">
                                    <p className="font-sans text-xs text-gold font-semibold flex items-center gap-1.5"><Trophy size={16} /> {t('passport.all_done')}</p>
                                </div>
                            )}
                        </div>

                        {/* ── Badge globali ───────────────────────────────────── */}
                        <div>
                            <h2 className="font-serif text-lg font-semibold text-anthracite mb-4">{t('passport.badges')}</h2>
                            <div className="flex gap-3 flex-wrap">
                                {BADGE_THRESHOLDS.map(b => {
                                    const earned = count >= b.count
                                    return (
                                        <div
                                            key={b.count}
                                            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all ${earned ? 'bg-card border-anthracite/10 shadow-sm' : 'bg-anthracite/5 border-transparent opacity-40'}`}
                                        >
                                            <b.icon size={26} className={earned ? 'text-gold-dark' : 'text-anthracite/60'} />
                                            <span className="font-sans text-[11px] font-semibold text-anthracite/75 text-center">{t(b.label)}</span>
                                            <span className="font-sans text-[10px] text-anthracite/45">{t('passport.steps_unit', { n: b.count })}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ── Badge per città ──────────────────────────────────── */}
                        {byCity.size > 0 && (
                            <div>
                                <h2 className="font-serif text-lg font-semibold text-anthracite mb-4">{t('passport.by_city')}</h2>
                                <div className="space-y-4">
                                    {Array.from(byCity.entries()).map(([cityName, cityStamps]) => {
                                        const cfg   = cityConfig(cityName)
                                        const total = cfg?.totalLocales ?? 0
                                        const n     = cityStamps.length
                                        const done  = total > 0 && n >= total
                                        const pctCity = total > 0 ? Math.round((n / total) * 100) : null
                                        return (
                                            <div key={cityName} className="bg-card rounded-2xl p-4 border border-anthracite/5 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {cfg?.flag ? <span className="text-lg">{cfg.flag}</span> : <MapPin size={18} className="text-gold-dark" />}
                                                        <span className="font-serif text-base font-bold text-anthracite">{cityName}</span>
                                                        {done && (
                                                            <span className="text-xs bg-gold/15 text-gold-dark font-semibold px-2 py-0.5 rounded-full border border-gold/25">
                                                                {t('passport.city_complete')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-sans text-sm font-bold text-anthracite/60">
                                                        {t('passport.stamps_count', { n: total > 0 ? `${n}/${total}` : n })}
                                                    </span>
                                                </div>
                                                {total > 0 && (
                                                    <div className="w-full h-1.5 bg-anthracite/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${Math.min(pctCity ?? 0, 100)}%`,
                                                                backgroundColor: cfg?.accentColor ?? '#C9A84C',
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
                                    <StampIcon size={40} className="text-gold-dark" />
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-anthracite">{t('passport.empty_title')}</h3>
                                <p className="font-sans text-sm text-anthracite/55 max-w-xs mx-auto leading-relaxed">
                                    {t('passport.empty_body')}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="font-serif text-lg font-semibold text-anthracite mb-4">{t('passport.stamps')}</h2>
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
                                                    <div key={`${stamp.localeId}-${i}`} className="flex gap-4 items-center bg-card rounded-2xl p-4 border border-anthracite/5 shadow-sm">
                                                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gold flex items-center justify-center flex-shrink-0 bg-gold/5 text-gold-dark">
                                                            <CategoryIcon category={stamp.localeCategory ?? ''} size={22} />
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
                                                            <p className="font-sans text-[11px] text-gold-dark font-semibold mt-1 flex items-center gap-1"><CheckCircle size={13} weight="fill" /> {formatDate(stamp.visitedAt, lang)}</p>
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
