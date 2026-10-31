'use client'

import { useState } from 'react'
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { CheckCircle, ClipboardText, HouseLine, LockSimple, X } from '@phosphor-icons/react'
import { useLanguage } from '../../context/LanguageContext'
import type { TranslationKey } from '../../i18n/translations'
import type { Locale, AppUser } from '../../types'

export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface Claim {
    id?: string
    localeId: string
    localeName: string
    userId: string
    userEmail: string
    userName: string
    businessName: string
    role: string           // e.g. "Proprietario", "Direttore", "Manager"
    contactEmail: string
    contactPhone: string
    message: string
    status: ClaimStatus
    createdAt: any
    reviewedAt?: any
    reviewNote?: string
}

interface ClaimModalProps {
    locale: Locale
    user: AppUser
    onClose: () => void
}

// `id` è il valore salvato su Firestore (invariato), `label` la sua traduzione
const ROLES: { id: string; label: TranslationKey }[] = [
    { id: 'Proprietario',               label: 'claim.role_owner' },
    { id: 'Co-proprietario',            label: 'claim.role_coowner' },
    { id: 'Direttore',                  label: 'claim.role_director' },
    { id: 'Manager',                    label: 'claim.role_manager' },
    { id: 'Responsabile comunicazione', label: 'claim.role_comms' },
]

export default function ClaimModal({ locale, user, onClose }: ClaimModalProps) {
    const { t } = useLanguage()
    const [step, setStep] = useState<'form' | 'success' | 'already'>('form')
    const [checking, setChecking] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        businessName: locale.name,
        role: ROLES[0].id,
        contactEmail: user.email ?? '',
        contactPhone: '',
        message: '',
    })
    const [errors, setErrors] = useState<Partial<typeof form>>({})

    const validate = () => {
        const e: Partial<typeof form> = {}
        if (!form.businessName.trim()) e.businessName = t('claim.err_required')
        if (!form.contactEmail.includes('@')) e.contactEmail = t('claim.err_email')
        if (!form.message.trim() || form.message.length < 20) e.message = t('claim.err_message')
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setChecking(true)

        try {
            // Check if user already claimed this locale
            const existing = await getDocs(
                query(
                    collection(db, 'claims'),
                    where('localeId', '==', locale.id),
                    where('userId', '==', user.uid)
                )
            )

            if (!existing.empty) {
                setStep('already')
                return
            }

            setChecking(false)
            setSubmitting(true)

            const claim: Omit<Claim, 'id'> = {
                localeId: locale.id,
                localeName: locale.name,
                userId: user.uid,
                userEmail: user.email ?? '',
                userName: user.displayName ?? user.email ?? '',
                businessName: form.businessName,
                role: form.role,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone,
                message: form.message,
                status: 'pending',
                createdAt: serverTimestamp(),
            }

            await addDoc(collection(db, 'claims'), claim)
            setStep('success')
        } catch (err) {
            console.error('[ClaimModal] submit error:', err)
            setErrors({ message: t('splash.err_generic') })
        } finally {
            setChecking(false)
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4 bg-anthracite/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-anthracite/10">
                    <div className="w-10 h-10 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center flex-shrink-0">
                        <HouseLine size={22} />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-serif text-lg font-semibold text-anthracite">{t('claim.title')}</h2>
                        <p className="font-sans text-xs text-anthracite/50 truncate">{locale.name}</p>
                    </div>
                    <button onClick={onClose} aria-label={t('generic.close')} className="w-9 h-9 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center text-anthracite transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'success' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center mx-auto"><CheckCircle size={36} /></div>
                            <h3 className="font-serif text-xl font-semibold text-anthracite">{t('claim.sent_title')}</h3>
                            <p className="font-sans text-sm text-anthracite/60 leading-relaxed max-w-xs mx-auto">
                                {t('claim.sent_body', { email: form.contactEmail })}
                            </p>
                            <button onClick={onClose} className="mt-4 px-6 py-3 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm hover:bg-anthracite/80 transition-colors">
                                {t('generic.close')}
                            </button>
                        </div>
                    )}

                    {step === 'already' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center mx-auto"><ClipboardText size={36} /></div>
                            <h3 className="font-serif text-xl font-semibold text-anthracite">{t('claim.already_title')}</h3>
                            <p className="font-sans text-sm text-anthracite/60 leading-relaxed max-w-xs mx-auto">
                                {t('claim.already_body')}
                            </p>
                            <button onClick={onClose} className="mt-4 px-6 py-3 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm">
                                {t('generic.ok')}
                            </button>
                        </div>
                    )}

                    {step === 'form' && (
                        <div className="space-y-5">
                            <div className="bg-gold/8 rounded-2xl p-4 border border-gold/20">
                                <p className="font-sans text-xs text-anthracite/70 leading-relaxed flex gap-2">
                                    <LockSimple size={16} className="text-gold-dark flex-shrink-0" />
                                    <span>{t('claim.how')}</span>
                                </p>
                            </div>

                            {/* Business name */}
                            <Field label={t('claim.name')} error={errors.businessName}>
                                <input
                                    type="text"
                                    value={form.businessName}
                                    maxLength={200}
                                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                                    className="input-base"
                                    placeholder={t('claim.name_ph')}
                                />
                            </Field>

                            {/* Role */}
                            <div>
                                <label className="font-sans text-xs font-bold text-anthracite/60 uppercase tracking-wider mb-2 block">{t('claim.role')}</label>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(r => (
                                        <button
                                            key={r.id}
                                            aria-pressed={form.role === r.id}
                                            onClick={() => setForm(f => ({ ...f, role: r.id }))}
                                            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all border ${form.role === r.id
                                                    ? 'bg-anthracite text-cream border-anthracite'
                                                    : 'bg-card text-anthracite/70 border-anthracite/20 hover:border-anthracite/40'
                                                }`}
                                        >
                                            {t(r.label)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact email */}
                            <Field label={t('claim.email')} error={errors.contactEmail}>
                                <input
                                    type="email"
                                    value={form.contactEmail}
                                    maxLength={254}
                                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                                    className="input-base"
                                    placeholder="nome@locale.com"
                                />
                            </Field>

                            {/* Phone (optional) */}
                            <Field label={t('claim.phone')}>
                                <input
                                    type="tel"
                                    value={form.contactPhone}
                                    maxLength={40}
                                    onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                                    className="input-base"
                                    placeholder="+34 / +39…"
                                />
                            </Field>

                            {/* Message */}
                            <Field label={t('claim.message')} error={errors.message}>
                                <textarea
                                    value={form.message}
                                    maxLength={200}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    rows={3}
                                    className="input-base resize-none"
                                    placeholder={t('claim.message_ph')}
                                />
                                <p className="font-sans text-[10px] text-anthracite/40 mt-1 text-end">{form.message.length}/200</p>
                            </Field>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || checking}
                                className="w-full py-4 rounded-full bg-ink text-cream font-sans font-semibold text-sm hover:bg-anthracite/80 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {(submitting || checking) && <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />}
                                {submitting ? t('claim.submitting') : checking ? t('claim.checking') : t('claim.submit')}
                            </button>

                            <p className="font-sans text-[10px] text-anthracite/40 text-center leading-relaxed">
                                {t('claim.disclaimer')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="font-sans text-xs font-bold text-anthracite/60 uppercase tracking-wider mb-2 block">{label}</label>
            {children}
            {error && <p className="font-sans text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}
