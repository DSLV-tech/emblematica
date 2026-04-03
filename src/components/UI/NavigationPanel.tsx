'use client'

import { useState } from 'react'
import type { RouteInfo } from '../../hooks/useRouting'
import { formatDistance, formatTime } from '../../hooks/useRouting'

interface NavigationPanelProps {
    routeInfo: RouteInfo
    destName: string
    onStop: () => void
}

export default function NavigationPanel({ routeInfo, destName, onStop }: NavigationPanelProps) {
    const [showSteps, setShowSteps] = useState(false)

    return (
        <div className="absolute top-0 left-0 right-0 z-[2500] animate-slide-up pointer-events-none">
            {/* Compact summary strip */}
            <div className="pointer-events-auto mx-4 mt-4 rounded-2xl bg-anthracite/95 text-cream shadow-2xl border border-white/10" style={{ backdropFilter: 'blur(16px)' }}>
                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                    {/* Pulse dot */}
                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <div className="absolute w-full h-full rounded-full bg-gold/20 animate-ping" />
                        <svg className="w-5 h-5 text-gold relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs text-cream/50 uppercase tracking-wider font-bold mb-0.5">Navigazione attiva</p>
                        <p className="font-serif text-base font-bold text-cream truncate">{destName}</p>
                    </div>

                    <button
                        onClick={onStop}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Stats row */}
                <div className="flex items-center divide-x divide-white/10 border-t border-white/10">
                    <div className="flex-1 flex flex-col items-center py-3">
                        <span className="font-sans text-xs text-cream/50 uppercase tracking-wider font-semibold">Distanza</span>
                        <span className="font-serif text-xl font-bold text-gold mt-0.5">{formatDistance(routeInfo.totalDistance)}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center py-3">
                        <span className="font-sans text-xs text-cream/50 uppercase tracking-wider font-semibold">A piedi</span>
                        <span className="font-serif text-xl font-bold text-gold mt-0.5">{formatTime(routeInfo.totalTime)}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center py-3">
                        <span className="font-sans text-xs text-cream/50 uppercase tracking-wider font-semibold">Passi</span>
                        <span className="font-serif text-xl font-bold text-gold mt-0.5">{routeInfo.steps.length}</span>
                    </div>
                </div>

                {/* Expand steps */}
                <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-t border-white/10 font-sans text-xs text-cream/50 hover:text-cream transition-colors"
                >
                    {showSteps ? 'Nascondi istruzioni' : 'Mostra istruzioni passo a passo'}
                    <svg
                        className={`w-4 h-4 transition-transform ${showSteps ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Step list */}
                {showSteps && (
                    <div className="max-h-60 overflow-y-auto border-t border-white/10 custom-scrollbar">
                        {routeInfo.steps
                            .filter(s => s.instruction)
                            .map((step, i) => (
                                <div key={i} className="flex items-start gap-3 px-5 py-3 border-b border-white/5 last:border-0">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="font-sans text-[10px] font-bold text-gold">{i + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-sans text-sm text-cream leading-snug">{step.instruction}</p>
                                        <p className="font-sans text-[11px] text-cream/40 mt-0.5">{formatDistance(step.distance)}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
