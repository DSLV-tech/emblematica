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
import type { User } from 'firebase/auth'
import type { Locale } from '../../types'

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
    user: User
    onClose: () => void
}

const ROLES = ['Proprietario', 'Co-proprietario', 'Direttore', 'Manager', 'Responsabile comunicazione']

export default function ClaimModal({ locale, user, onClose }: ClaimModalProps) {
    const [step, setStep] = useState<'form' | 'success' | 'already'>('form')
    const [checking, setChecking] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        businessName: locale.name,
        role: ROLES[0],
        contactEmail: user.email ?? '',
        contactPhone: '',
        message: '',
    })
    const [errors, setErrors] = useState<Partial<typeof form>>({})

    const validate = () => {
        const e: Partial<typeof form> = {}
        if (!form.businessName.trim()) e.businessName = 'Campo obbligatorio'
        if (!form.contactEmail.includes('@')) e.contactEmail = 'Email non valida'
        if (!form.message.trim() || form.message.length < 20) e.message = 'Descrivi brevemente il tuo ruolo (min 20 caratteri)'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setChecking(true)

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
            setChecking(false)
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
        setSubmitting(false)
        setStep('success')
    }

    return (
        <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4 bg-anthracite/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-anthracite/10">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-xl flex-shrink-0">
                        🏛️
                    </div>
                    <div className="flex-1">
                        <h2 className="font-serif text-lg font-bold text-anthracite">Reclama il tuo locale</h2>
                        <p className="font-sans text-xs text-anthracite/50 truncate">{locale.name}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'success' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto text-4xl">✅</div>
                            <h3 className="font-serif text-xl font-bold text-anthracite">Richiesta inviata!</h3>
                            <p className="font-sans text-sm text-anthracite/60 leading-relaxed max-w-xs mx-auto">
                                Il nostro team verificherà la tua identità entro 3–5 giorni lavorativi e ti contatterà all'indirizzo <strong>{form.contactEmail}</strong>.
                            </p>
                            <button onClick={onClose} className="mt-4 px-6 py-3 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm hover:bg-anthracite/80 transition-colors">
                                Chiudi
                            </button>
                        </div>
                    )}

                    {step === 'already' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto text-4xl">📋</div>
                            <h3 className="font-serif text-xl font-bold text-anthracite">Richiesta già inviata</h3>
                            <p className="font-sans text-sm text-anthracite/60 leading-relaxed max-w-xs mx-auto">
                                Hai già inviato una richiesta per questo locale. Stiamo verificando le informazioni.
                            </p>
                            <button onClick={onClose} className="mt-4 px-6 py-3 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm">
                                OK
                            </button>
                        </div>
                    )}

                    {step === 'form' && (
                        <div className="space-y-5">
                            <div className="bg-gold/8 rounded-2xl p-4 border border-gold/20">
                                <p className="font-sans text-xs text-anthracite/70 leading-relaxed">
                                    🔒 <strong>Come funziona:</strong> Compila il modulo → il nostro team verifica → ricevi badge "Gestore verificato" e puoi aggiornare orari, sito web e foto.
                                </p>
                            </div>

                            {/* Business name */}
                            <Field label="Nome del locale" error={errors.businessName}>
                                <input
                                    type="text"
                                    value={form.businessName}
                                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                                    className="input-base"
                                    placeholder="Nome ufficiale del locale"
                                />
                            </Field>

                            {/* Role */}
                            <div>
                                <label className="font-sans text-xs font-bold text-anthracite/60 uppercase tracking-wider mb-2 block">Il tuo ruolo</label>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setForm(f => ({ ...f, role: r }))}
                                            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all border ${form.role === r
                                                    ? 'bg-anthracite text-cream border-anthracite'
                                                    : 'bg-white text-anthracite/70 border-anthracite/20 hover:border-anthracite/40'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact email */}
                            <Field label="Email di contatto" error={errors.contactEmail}>
                                <input
                                    type="email"
                                    value={form.contactEmail}
                                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                                    className="input-base"
                                    placeholder="nome@locale.com"
                                />
                            </Field>

                            {/* Phone (optional) */}
                            <Field label="Telefono (opzionale)">
                                <input
                                    type="tel"
                                    value={form.contactPhone}
                                    onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                                    className="input-base"
                                    placeholder="+34 / +39…"
                                />
                            </Field>

                            {/* Message */}
                            <Field label="Descrivi il tuo rapporto con il locale" error={errors.message}>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    rows={3}
                                    className="input-base resize-none"
                                    placeholder="Sono il proprietario dal 2010, gestisco la pasticceria insieme a mia sorella…"
                                />
                                <p className="font-sans text-[10px] text-anthracite/40 mt-1 text-right">{form.message.length}/200</p>
                            </Field>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || checking}
                                className="w-full py-4 rounded-2xl bg-anthracite text-cream font-sans font-bold text-sm hover:bg-anthracite/80 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {(submitting || checking) && <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />}
                                {submitting ? 'Invio in corso…' : checking ? 'Verifica…' : 'Invia richiesta'}
                            </button>

                            <p className="font-sans text-[10px] text-anthracite/40 text-center leading-relaxed">
                                Inviando la richiesta dichiari di essere il legittimo proprietario o responsabile del locale.
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
