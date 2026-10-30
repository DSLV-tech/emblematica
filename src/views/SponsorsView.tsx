'use client'

import { ArrowSquareOut, Buildings, Champagne, Envelope, Handshake, Scroll, Storefront, type Icon } from '@phosphor-icons/react'
import ViewHeader from '../components/UI/ViewHeader'
import { useLanguage } from '../context/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

interface Sponsor {
    name: string
    tagline: TranslationKey
    logo: Icon | string     // icona o URL del logo
    category: TranslationKey
    website?: string
    description?: TranslationKey
    featured?: boolean
}

// Placeholder sponsors — replace with Firestore data when real sponsors are onboarded
const PLACEHOLDER_SPONSORS: Sponsor[] = [
    {
        name: 'El Corte Inglés',
        tagline: 'sponsors.s1_tagline',
        logo: Storefront,
        category: 'sponsors.cat_retail',
        website: 'https://www.elcorteingles.es',
        description: 'sponsors.s1_desc',
        featured: true,
    },
    {
        name: 'Turisme de Barcelona',
        tagline: 'sponsors.s2_tagline',
        logo: Buildings,
        category: 'sponsors.cat_institution',
        website: 'https://www.barcelonaturisme.com',
        description: 'sponsors.s2_desc',
        featured: true,
    },
    {
        name: 'Cava Codorníu',
        tagline: 'sponsors.s3_tagline',
        logo: Champagne,
        category: 'sponsors.cat_food',
        website: 'https://www.codorniu.com',
    },
    {
        name: 'Arxiu Nacional de Catalunya',
        tagline: 'sponsors.s4_tagline',
        logo: Scroll,
        category: 'sponsors.cat_culture',
    },
]

interface SponsorsViewProps {
    onClose: () => void
}

export default function SponsorsView({ onClose }: SponsorsViewProps) {
    const { t } = useLanguage()
    const featured = PLACEHOLDER_SPONSORS.filter(s => s.featured)
    const regular = PLACEHOLDER_SPONSORS.filter(s => !s.featured)

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader icon={Handshake} title={t('sponsors.title')} subtitle={t('sponsors.subtitle')} onClose={onClose} />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">

                    {/* Hero strip */}
                    <div
                        className="rounded-3xl p-8 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #26262B 0%, #141416 100%)' }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 60%), radial-gradient(circle at 70% 50%, #C9A84C 0%, transparent 60%)' }}
                        />
                        <p className="eyebrow text-gold/80 mb-3 relative">{t('sponsors.support')}</p>
                        <h2 className="font-serif text-3xl font-semibold text-cream relative">
                            {t('sponsors.hero')}<br />
                            <span className="text-gold italic font-normal text-xl">{t('sponsors.hero_sub')}</span>
                        </h2>
                    </div>

                    {featured.length > 0 && (
                        <section>
                            <h3 className="eyebrow text-anthracite/45 mb-4">{t('sponsors.main')}</h3>
                            <div className="space-y-4">
                                {featured.map(sponsor => (
                                    <SponsorCard key={sponsor.name} sponsor={sponsor} featured />
                                ))}
                            </div>
                        </section>
                    )}

                    {regular.length > 0 && (
                        <section>
                            <h3 className="eyebrow text-anthracite/45 mb-4">{t('sponsors.supporters')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {regular.map(sponsor => (
                                    <SponsorCard key={sponsor.name} sponsor={sponsor} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Become a sponsor CTA */}
                    <section className="rounded-3xl border border-gold/35 p-8 text-center bg-gold/[0.06]">
                        <p className="eyebrow text-gold-dark mb-2">{t('sponsors.become_partner')}</p>
                        <h3 className="font-serif text-2xl font-semibold text-anthracite mb-3">{t('sponsors.cta_title')}</h3>
                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mb-6 max-w-xs mx-auto">
                            {t('sponsors.cta_body')}
                        </p>
                        <a
                            href="mailto:info@barnaemblematica.com"
                            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold hover:bg-gold-light text-ink font-sans font-semibold text-sm transition-colors"
                        >
                            <Envelope size={18} />
                            {t('sponsors.cta_button')}
                        </a>
                    </section>

                </div>
            </div>
        </div>
    )
}

function SponsorCard({ sponsor, featured }: { sponsor: Sponsor; featured?: boolean }) {
    const { t } = useLanguage()
    const Logo = sponsor.logo

    return (
        <div className={`bg-card rounded-3xl border border-anthracite/[0.07] overflow-hidden ${featured ? 'p-6' : 'p-5'}`}>
            <div className="flex items-start gap-4">
                <div className={`${featured ? 'w-14 h-14' : 'w-11 h-11'} rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center flex-shrink-0`}>
                    {typeof Logo === 'string' ? (
                        <img src={Logo} alt={sponsor.name} className="w-full h-full object-contain p-1" />
                    ) : (
                        <Logo size={featured ? 28 : 22} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-serif font-semibold text-anthracite ${featured ? 'text-lg' : 'text-base'}`}>{sponsor.name}</h3>
                        <span className="eyebrow text-[10px] text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full">{t(sponsor.category)}</span>
                    </div>
                    <p className={`font-sans text-anthracite/55 mt-0.5 ${featured ? 'text-sm' : 'text-xs'}`}>{t(sponsor.tagline)}</p>
                    {featured && sponsor.description && (
                        <p className="font-sans text-sm text-anthracite/70 leading-relaxed mt-2">{t(sponsor.description)}</p>
                    )}
                </div>
            </div>
            {sponsor.website && (
                <div className="mt-4 pt-4 border-t border-anthracite/[0.06]">
                    <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-xs font-semibold text-gold-dark hover:underline inline-flex items-center gap-1"
                    >
                        {t('sponsors.visit')}
                        <ArrowSquareOut size={14} />
                    </a>
                </div>
            )}
        </div>
    )
}
