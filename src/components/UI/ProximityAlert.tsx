'use client'

import type { Locale } from '../../types'

interface ProximityAlertProps {
    locale: Locale
    distance: number
    onDismiss: () => void
    onViewDetail: (locale: Locale) => void
}

export default function ProximityAlert({ locale, distance, onDismiss, onViewDetail }: ProximityAlertProps) {
    return (
        <div
            className="animate-fade-in"
            style={{
                animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
        >
            <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>

            <div
                className="relative overflow-hidden rounded-3xl shadow-2xl border border-gold/30"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a1a 100%)' }}
            >
                {/* Gold glow accent */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(ellipse at 10% 50%, #B8860B 0%, transparent 60%)' }}
                />

                <div className="relative flex items-start gap-4 p-4">
                    {/* Pulsing location dot */}
                    <div className="relative flex-shrink-0 mt-0.5">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                            <span className="text-xl">📍</span>
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold rounded-full animate-ping" />
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-sans text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
                                Sei a {Math.round(distance)}m
                            </p>
                        </div>
                        <p className="font-serif text-sm font-bold text-cream leading-tight truncate">
                            {locale.name}
                        </p>
                        <p className="font-sans text-xs text-cream/50 truncate">{locale.address}</p>

                        <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={() => { onViewDetail(locale); onDismiss() }}
                                className="flex-1 py-2 rounded-xl bg-gold hover:bg-gold-dark text-cream font-sans font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Vedi scheda
                            </button>
                            <button
                                onClick={onDismiss}
                                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <svg className="w-4 h-4 text-cream/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
