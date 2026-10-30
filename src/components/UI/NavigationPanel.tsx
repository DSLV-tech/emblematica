'use client'

import { useState } from 'react'
import { CaretDown, NavigationArrow, X } from '@phosphor-icons/react'
import type { RouteInfo } from '../../hooks/useRouting'
import { formatDistance, formatTime } from '../../hooks/useRouting'
import { useLanguage } from '../../context/LanguageContext'

interface NavigationPanelProps {
    routeInfo: RouteInfo
    destName: string
    onStop: () => void
}

export default function NavigationPanel({ routeInfo, destName, onStop }: NavigationPanelProps) {
    const [showSteps, setShowSteps] = useState(false)
    const { t } = useLanguage()

    const stats = [
        { label: t('navpanel.distance'), value: formatDistance(routeInfo.totalDistance) },
        { label: t('navpanel.walking'),  value: formatTime(routeInfo.totalTime) },
        { label: t('navpanel.steps'),    value: routeInfo.steps.length },
    ]

    return (
        <div className="absolute top-0 left-0 right-0 z-[2500] animate-slide-up pointer-events-none">
            <div className="pointer-events-auto mx-4 mt-4 rounded-3xl glass text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        <div className="absolute w-full h-full rounded-full bg-gold/20 animate-ping motion-reduce:hidden" />
                        <NavigationArrow size={20} weight="regular" className="relative z-10" aria-hidden />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="eyebrow text-cream/50 mb-0.5">{t('navpanel.active')}</p>
                        <p className="font-display text-base font-semibold text-cream truncate">{destName}</p>
                    </div>

                    <button
                        onClick={onStop}
                        aria-label={t('generic.close')}
                        className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-terracotta/40 flex items-center justify-center transition-colors"
                    >
                        <X size={18} weight="regular" />
                    </button>
                </div>

                {/* Stats row */}
                <div className="flex items-center divide-x divide-white/10 rtl:divide-x-reverse border-t border-white/10">
                    {stats.map(s => (
                        <div key={s.label} className="flex-1 flex flex-col items-center py-3">
                            <span className="eyebrow text-[10px] text-cream/50">{s.label}</span>
                            <span className="font-display text-xl font-semibold text-gold mt-0.5 tabular-nums">{s.value}</span>
                        </div>
                    ))}
                </div>

                {/* Expand steps */}
                <button
                    onClick={() => setShowSteps(!showSteps)}
                    aria-expanded={showSteps}
                    className="w-full flex items-center justify-center gap-2 py-3 border-t border-white/10 font-sans text-xs text-cream/55 hover:text-cream transition-colors"
                >
                    {showSteps ? t('navpanel.hide_steps') : t('navpanel.show_steps')}
                    <CaretDown size={14} className={`transition-transform ${showSteps ? 'rotate-180' : ''}`} aria-hidden />
                </button>

                {/* Step list */}
                {showSteps && (
                    <ol className="max-h-60 overflow-y-auto border-t border-white/10 custom-scrollbar">
                        {routeInfo.steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 px-5 py-3 border-b border-white/5 last:border-0">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="font-sans text-[10px] font-bold text-gold tabular-nums">{i + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-sans text-sm text-cream leading-snug">
                                            {step.road ? t('turn.on_road', { instruction: t(step.maneuver), road: step.road }) : t(step.maneuver)}
                                        </p>
                                        <p className="font-sans text-[11px] text-cream/40 mt-0.5">{formatDistance(step.distance)}</p>
                                    </div>
                                </li>
                            ))}
                    </ol>
                )}
            </div>
        </div>
    )
}
