'use client'

import {
    Bank, BookOpenText, Envelope, Heart, Info, Leaf, MapTrifold, NavigationArrow, Sparkle, UsersThree, type Icon,
} from '@phosphor-icons/react'
import Logo from '../components/UI/Logo'
import ViewHeader from '../components/UI/ViewHeader'
import { useLanguage } from '../context/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

interface AboutViewProps {
    onClose: () => void
}

type Item = { icon: Icon; title: TranslationKey; desc: TranslationKey }

const TIMELINE: { year: string; event: TranslationKey | null; desc: TranslationKey }[] = [
    { year: '1997', event: null,        desc: 'about.t1_desc' },   // Els Quatre Gats: nome proprio, non si traduce
    { year: '2003', event: 'about.t2',  desc: 'about.t2_desc' },
    { year: '2015', event: 'about.t3',  desc: 'about.t3_desc' },
    { year: '2024', event: 'about.t4',  desc: 'about.t4_desc' },
]

const VALUES: Item[] = [
    { icon: Bank,       title: 'about.v_memory',    desc: 'about.v_memory_desc' },
    { icon: MapTrifold, title: 'about.v_access',    desc: 'about.v_access_desc' },
    { icon: UsersThree, title: 'about.v_community', desc: 'about.v_community_desc' },
    { icon: Leaf,       title: 'about.v_sustain',   desc: 'about.v_sustain_desc' },
]

const FEATURES: Item[] = [
    { icon: MapTrifold,      title: 'about.f_map',     desc: 'about.f_map_desc' },
    { icon: BookOpenText,    title: 'about.f_stories', desc: 'about.f_stories_desc' },
    { icon: NavigationArrow, title: 'about.f_nav',     desc: 'about.f_nav_desc' },
    { icon: Heart,           title: 'about.f_fav',     desc: 'about.f_fav_desc' },
    { icon: Sparkle,         title: 'about.f_ai',      desc: 'about.f_ai_desc' },
]

export default function AboutView({ onClose }: AboutViewProps) {
    const { t } = useLanguage()

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader icon={Info} title={t('about.title')} subtitle={t('about.subtitle')} onClose={onClose} />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-10 space-y-14">

                    {/* Hero */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <Logo variant="full" size="lg" />
                        </div>
                        <p className="font-sans text-base text-anthracite/70 leading-relaxed max-w-md mx-auto text-pretty">
                            {t('about.intro')}
                        </p>
                    </div>

                    {/* Mission */}
                    <div
                        className="rounded-3xl p-8 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #26262B 0%, #141416 100%)' }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #C9A84C 0%, transparent 60%)' }}
                        />
                        <p className="eyebrow text-gold/80 mb-3 relative">{t('about.mission')}</p>
                        <blockquote className="font-serif italic text-2xl text-cream leading-snug relative text-pretty">
                            “{t('about.quote')}”
                        </blockquote>
                        <p className="font-sans text-sm text-cream/50 mt-4 relative">— Emblematica</p>
                    </div>

                    {/* Values */}
                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-anthracite mb-6">{t('about.values')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {VALUES.map(v => (
                                <div key={v.title} className="bg-card rounded-3xl p-6 border border-anthracite/[0.07]">
                                    <v.icon size={28} className="text-gold-dark mb-3" />
                                    <h3 className="font-serif text-lg font-semibold text-anthracite mb-1">{t(v.title)}</h3>
                                    <p className="font-sans text-sm text-anthracite/60 leading-relaxed">{t(v.desc)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Timeline */}
                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-anthracite mb-8">{t('about.history')}</h2>
                        <ol className="relative space-y-8">
                            <div className="absolute start-6 top-0 bottom-0 w-px bg-gold/25" aria-hidden />
                            {TIMELINE.map(item => (
                                <li key={item.year} className="flex gap-6 ps-2">
                                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gold flex items-center justify-center z-10 shadow-[0_0_0_4px_var(--color-cream)]">
                                        <span className="font-sans text-[10px] font-bold text-ink leading-none tabular-nums">{item.year}</span>
                                    </div>
                                    <div className="pt-1.5 pb-4">
                                        <h3 className="font-serif text-base font-semibold text-anthracite">
                                            {item.event ? t(item.event) : 'Els Quatre Gats'}
                                        </h3>
                                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mt-1">{t(item.desc)}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* What we offer */}
                    <section>
                        <h2 className="font-serif text-2xl font-semibold text-anthracite mb-6">{t('about.offer')}</h2>
                        <div className="bg-card rounded-3xl border border-anthracite/[0.07] divide-y divide-anthracite/[0.06]">
                            {FEATURES.map(f => (
                                <div key={f.title} className="flex items-start gap-4 px-6 py-5">
                                    <f.icon size={24} className="text-gold-dark flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-sans text-sm font-semibold text-anthracite">{t(f.title)}</p>
                                        <p className="font-sans text-sm text-anthracite/55 mt-0.5 leading-relaxed">{t(f.desc)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="rounded-3xl border border-gold/35 p-8 text-center bg-gold/[0.06]">
                        <h2 className="font-serif text-2xl font-semibold text-anthracite mb-2">{t('about.contact_title')}</h2>
                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mb-6 max-w-xs mx-auto">
                            {t('about.contact_body')}
                        </p>
                        <a
                            href="mailto:info@barnaemblematica.com"
                            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-ink hover:bg-ink-3 text-cream font-sans font-semibold text-sm transition-colors"
                        >
                            <Envelope size={18} />
                            info@barnaemblematica.com
                        </a>
                    </section>

                    {/* Legal footnote */}
                    <p className="text-center font-sans text-[11px] text-anthracite/40 leading-relaxed pb-4">
                        © {new Date().getFullYear()} Emblematica. {t('about.rights')}<br />
                        {t('about.disclaimer')}
                    </p>

                </div>
            </div>
        </div>
    )
}
