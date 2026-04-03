'use client'

import { useLanguage } from '../../context/LanguageContext'
import { useCity } from '../../context/CityContext'
import type { User } from 'firebase/auth'

interface MenuPanelProps {
    user: User | null
    isAdmin?: boolean
    onClose: () => void
    onShowAbout: () => void
    onShowSponsors: () => void
    onShowAdmin: () => void
    onShowCitySelector: () => void
    onShare: () => void
    onLogout: () => void
    onLogin: () => void
}

export default function MenuPanel({
    user, isAdmin, onClose, onShowAbout, onShowSponsors, onShowAdmin,
    onShowCitySelector, onShare, onLogout, onLogin,
}: MenuPanelProps) {
    const { lang, allLanguages, setLang, t } = useLanguage()
    const { city } = useCity()

    return (
        <div className="fixed inset-0 z-[3500] animate-fade-in">
            <div className="absolute inset-0 bg-anthracite/40 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute bottom-0 inset-x-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl overflow-y-auto custom-scrollbar animate-slide-up">
                <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-white rounded-t-3xl z-10">
                    <div className="w-10 h-1 rounded-full bg-anthracite/15" />
                </div>

                <div className="px-6 pb-8 space-y-6">

                    {/* User info */}
                    {user && (
                        <div className="flex items-center gap-3 pb-4 border-b border-anthracite/5">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-gold-light p-0.5 flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl">👤</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-sans text-sm font-bold text-anthracite truncate">{user.displayName ?? 'Utente'}</p>
                                <p className="font-sans text-xs text-anthracite/50 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* 🌐 Language Selector */}
                    <section>
                        <h3 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-wider mb-3">🌐 {t('menu.language_label')}</h3>
                        <div className="flex gap-2 flex-wrap">
                            {allLanguages.map(l => (
                                <button
                                    key={l.code}
                                    onClick={() => setLang(l.code)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-sm font-semibold transition-all border-2 ${lang === l.code
                                            ? 'border-gold bg-gold/10 text-anthracite scale-105'
                                            : 'border-anthracite/10 text-anthracite/60 hover:border-anthracite/20'
                                        }`}
                                >
                                    <span className="text-lg">{l.flag}</span>
                                    <span className="text-xs">{l.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 🏙️ City */}
                    <section>
                        <h3 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-wider mb-3">🏙️ {t('menu.city_label')}</h3>
                        <button
                            onClick={() => { onShowCitySelector(); onClose() }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-cream border border-anthracite/10 hover:border-gold/30 transition-colors"
                        >
                            <span className="text-2xl">{city.flag}</span>
                            <div className="flex-1 text-left">
                                <p className="font-sans text-sm font-bold text-anthracite">{city.name}</p>
                                <p className="font-sans text-[10px] text-anthracite/50">{city.tagline}</p>
                            </div>
                            <span className="text-anthracite/30">›</span>
                        </button>
                    </section>

                    {/* Quick links */}
                    <section>
                        <h3 className="font-sans text-xs font-bold text-anthracite/40 uppercase tracking-wider mb-3">{t('menu.links_label')}</h3>
                        <div className="space-y-1">
                            <MenuButton icon="ℹ️" label={t('menu.about')} onClick={() => { onShowAbout(); onClose() }} />
                            <MenuButton icon="🤝" label={t('menu.sponsors')} onClick={() => { onShowSponsors(); onClose() }} />
                            <MenuButton icon="↗️" label={t('menu.share_app')} onClick={() => { onShare(); onClose() }} />
                            {isAdmin && (
                                <MenuButton icon="⚙️" label={t('menu.admin')} onClick={() => { onShowAdmin(); onClose() }} gold />
                            )}
                        </div>
                    </section>

                    {/* Auth action */}
                    <section className="pt-2 border-t border-anthracite/5">
                        {user ? (
                            <button
                                onClick={() => { onLogout(); onClose() }}
                                className="w-full py-3 rounded-2xl font-sans text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                {t('menu.logout')}
                            </button>
                        ) : (
                            <button
                                onClick={() => { onLogin(); onClose() }}
                                className="w-full py-3 rounded-2xl bg-anthracite text-cream font-sans text-sm font-bold hover:bg-anthracite/80 transition-colors"
                            >
                                {t('menu.login')}
                            </button>
                        )}
                    </section>

                </div>
            </div>
        </div>
    )
}

function MenuButton({ icon, label, onClick, gold }: { icon: string; label: string; onClick: () => void; gold?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-colors ${gold
                    ? 'text-gold font-bold hover:bg-gold/10'
                    : 'text-anthracite hover:bg-anthracite/5'
                }`}
        >
            <span className="text-lg w-6 text-center">{icon}</span>
            <span>{label}</span>
        </button>
    )
}
