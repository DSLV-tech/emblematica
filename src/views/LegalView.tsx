'use client'

import { useState } from 'react'
import { Scales } from '@phosphor-icons/react'
import ViewHeader from '../components/UI/ViewHeader'
import { useLanguage } from '../context/LanguageContext'
import { LEGAL_COPY, LEGAL_DOCS, LEGAL_ENTITY, LEGAL_UPDATED, type LegalDoc } from '../data/legal'

interface LegalViewProps {
    initialDoc?: LegalDoc
    onClose: () => void
}

export default function LegalView({ initialDoc = 'privacy', onClose }: LegalViewProps) {
    const { t, lang } = useLanguage()
    const [doc, setDoc] = useState<LegalDoc>(initialDoc)
    const copy = LEGAL_COPY[lang]

    const updated = new Date(LEGAL_UPDATED).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
    const provider: [string, string | null][] = [
        [copy.provider.name, LEGAL_ENTITY.name],
        [copy.provider.address, LEGAL_ENTITY.address],
        [copy.provider.vat, LEGAL_ENTITY.vat],
    ]

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] paper overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader icon={Scales} title={t('legal.title')} subtitle={t('legal.updated', { date: updated })} onClose={onClose} />

            <div role="tablist" aria-label={t('legal.title')} className="flex-shrink-0 flex flex-wrap gap-1.5 px-5 py-3 border-b border-anthracite/10">
                {LEGAL_DOCS.map(id => (
                    <button
                        key={id}
                        role="tab"
                        aria-selected={doc === id}
                        onClick={() => setDoc(id)}
                        className={`flex-shrink-0 h-9 px-4 rounded-full font-sans text-[13px] font-medium whitespace-nowrap transition-colors ${
                            doc === id ? 'btn-gold' : 'bg-anthracite/5 text-anthracite/70 hover:bg-anthracite/10'
                        }`}
                    >
                        {t(`legal.${id}`)}
                    </button>
                ))}
            </div>

            <div role="tabpanel" className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-8 space-y-8" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

                    {doc === 'notice' && (
                        <dl className="card-raised rounded-3xl divide-y divide-anthracite/[0.06]">
                            {provider.map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-4 px-5 py-3.5">
                                    <dt className="font-sans text-sm text-anthracite/55">{label}</dt>
                                    <dd className={`font-sans text-sm text-end ${value ? 'text-anthracite font-medium' : 'text-terracotta italic'}`}>
                                        {value ?? t('legal.pending')}
                                    </dd>
                                </div>
                            ))}
                            <div className="flex justify-between gap-4 px-5 py-3.5">
                                <dt className="font-sans text-sm text-anthracite/55">{copy.provider.email}</dt>
                                <dd className="font-sans text-sm text-end min-w-0 break-all">
                                    <a href={`mailto:${LEGAL_ENTITY.email}`} className="text-gold-dark font-medium underline underline-offset-2">{LEGAL_ENTITY.email}</a>
                                </dd>
                            </div>
                        </dl>
                    )}

                    {copy[doc].map(section => (
                        <section key={section.h}>
                            <h2 className="font-serif text-lg font-semibold text-anthracite mb-2">{section.h}</h2>
                            <div className="space-y-2.5">
                                {section.p.map(text => (
                                    <p key={text} className="font-sans text-sm text-anthracite/70 leading-relaxed text-pretty">
                                        {text.replaceAll('{email}', LEGAL_ENTITY.email)}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
