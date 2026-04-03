'use client'

import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import type { TranslationKey } from '../../i18n/translations'

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
    hasStamps?: boolean
    isAdmin?: boolean
}

const TABS: { id: string; labelKey: TranslationKey; icon: (p: { active: boolean }) => React.JSX.Element }[] = [
    { id: 'map', labelKey: 'nav.map', icon: MapIcon },
    { id: 'rutas', labelKey: 'nav.routes', icon: RouteIcon },
    { id: 'passport', labelKey: 'nav.passport', icon: PassportIcon },
    { id: 'blog', labelKey: 'nav.blog', icon: BlogIcon },
    { id: 'menu', labelKey: 'nav.menu', icon: MenuIcon },
]

export default function BottomNav({ activeTab, onTabChange, hasStamps }: BottomNavProps) {
    const { t } = useLanguage()

    return (
        <nav className="fixed bottom-0 inset-x-0 z-[3000] pointer-events-auto">
            <div
                className="mx-auto max-w-lg border-t border-white/20"
                style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}
            >
                <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 min-w-[56px] transition-all duration-200 relative group ${isActive ? '' : 'opacity-50 hover:opacity-80'
                                    }`}
                                aria-label={t(tab.labelKey)}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {isActive && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-gold animate-fade-in" />
                                )}

                                <tab.icon active={isActive} />

                                <span className={`font-sans text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-gold' : 'text-anthracite/60'
                                    }`}>
                                    {t(tab.labelKey)}
                                </span>

                                {tab.id === 'passport' && hasStamps && !isActive && (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold animate-pulse" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

/* ─── Inline SVG icons ─────────────────────────────────────────────────── */

function MapIcon({ active }: { active: boolean }) {
    return (
        <svg className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-anthracite/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    )
}

function RouteIcon({ active }: { active: boolean }) {
    return (
        <svg className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-anthracite/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    )
}

function PassportIcon({ active }: { active: boolean }) {
    return (
        <svg className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-anthracite/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    )
}

function BlogIcon({ active }: { active: boolean }) {
    return (
        <svg className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-anthracite/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    )
}

function MenuIcon({ active }: { active: boolean }) {
    return (
        <svg className={`w-5 h-5 transition-colors ${active ? 'text-gold' : 'text-anthracite/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}
