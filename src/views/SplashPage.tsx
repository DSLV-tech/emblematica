'use client'

import { Suspense, lazy, useState } from 'react'
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../hooks/useAuth'
import { useLanguage } from '../context/LanguageContext'
import Logo from '../components/UI/Logo'
import type { LegalDoc } from '../data/legal'

const LegalView = lazy(() => import('./LegalView'))

interface SplashPageProps {
    onEnterGuest: () => void
}

export default function SplashPage({ onEnterGuest }: SplashPageProps) {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showEmailForm, setShowEmailForm] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null)

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            await loginWithGoogle()
        } catch (err: any) {
            console.error(err)
            if (err.message?.includes('API key') || err.message?.includes('authDomain') || err.code === 'auth/invalid-api-key') {
                setError(t('splash.err_config'))
            } else {
                setError(t('splash.err_google'))
            }
            setLoading(false)
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await (isRegistering ? registerWithEmail : loginWithEmail)(email, password)
        } catch (err: any) {
            const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
                ? t('splash.err_credentials')
                : err.code === 'auth/too-many-requests'
                ? t('splash.err_too_many')
                : err.code === 'auth/email-already-in-use'
                ? t('splash.err_email_in_use')
                : err.code === 'auth/weak-password'
                ? t('splash.err_weak_password')
                : err.code === 'auth/invalid-email'
                ? t('splash.err_invalid_email')
                : isRegistering
                ? t('splash.err_register')
                : t('splash.err_generic')
            setError(msg)
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink">
            <div className="splash-backdrop fixed inset-0 pointer-events-none" aria-hidden />

            {/* Nel flusso e scorrevole: su schermi bassi o col form aperto nulla si sovrappone */}
            <div
                className="relative min-h-full flex flex-col items-center px-6 text-center animate-fade-in"
                style={{
                    paddingTop: 'max(24px, env(safe-area-inset-top))',
                    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                }}
            >
                <div className="flex-1 w-full flex flex-col items-center justify-center">
                {/* Logo & Intro */}
                <div className="mb-7">
                    <div className="flex justify-center mb-5 [&_svg]:w-auto [&_svg]:max-h-[28svh] drop-shadow-[0_6px_32px_rgba(201,168,76,0.35)]">
                        <Logo variant="full" size="xl" dark />
                    </div>
                    <p className="font-serif italic text-[17px] md:text-xl text-cream/75 max-w-xs md:max-w-md mx-auto leading-relaxed text-center text-balance">
                        {t('splash.tagline')}
                    </p>
                </div>

                {/* Actions */}
                <div className="w-full max-w-sm space-y-4">
                    {error && (
                        <div className="bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/50 backdrop-blur-md text-left">
                            <p className="font-sans text-sm text-red-200 leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 rounded-full bg-cream text-ink font-sans font-semibold text-base flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] disabled:opacity-70 active:scale-95 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-anthracite border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {t('splash.login_google')}
                    </button>

                    {/* Email/password form */}
                    {showEmailForm ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-3 animate-fade-in">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('splash.email')}
                                aria-label={t('splash.email')}
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3.5 rounded-full bg-white/10 border border-cream/20 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all backdrop-blur-md"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder={t('splash.password')}
                                aria-label={t('splash.password')}
                                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                                minLength={isRegistering ? 6 : undefined}
                                required
                                className="w-full px-4 py-3.5 rounded-full bg-white/10 border border-cream/20 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all backdrop-blur-md"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gold w-full py-4 rounded-full font-sans font-semibold text-base disabled:opacity-70"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-cream/50 border-t-cream rounded-full animate-spin mx-auto" /> : t(isRegistering ? 'splash.register_submit' : 'splash.submit')}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(!isRegistering); setError('') }}
                                className="w-full text-center font-sans text-sm text-gold hover:text-gold-light transition-colors py-1"
                            >
                                {t(isRegistering ? 'splash.to_login' : 'splash.to_register')}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowEmailForm(false); setError('') }}
                                className="w-full text-center font-sans text-xs text-cream/40 hover:text-cream/70 transition-colors py-1"
                            >
                                {t('splash.back_google')}
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => { setShowEmailForm(true); setError('') }}
                            disabled={loading}
                            className="w-full py-3 rounded-full border border-cream/15 bg-transparent text-cream/60 font-sans text-sm hover:text-cream/90 hover:border-cream/30 transition-all disabled:opacity-50"
                        >
                            {t('splash.login_email')}
                        </button>
                    )}

                    <div className="flex items-center gap-4 py-1 opacity-80">
                        <div className="flex-1 h-px bg-cream/20" />
                        <span className="font-sans text-xs text-cream/50 uppercase tracking-widest font-semibold">{t('splash.or')}</span>
                        <div className="flex-1 h-px bg-cream/20" />
                    </div>

                    <button
                        onClick={onEnterGuest}
                        disabled={loading}
                        className="w-full py-4 rounded-full border border-cream/20 bg-ink/40 text-cream font-sans font-semibold text-base hover:bg-anthracite/50 hover:border-cream/40 backdrop-blur-md transition-all disabled:opacity-50 active:scale-95 shadow-lg"
                    >
                        {t('splash.continue_guest')}
                    </button>

                    <LegalNotice onOpen={setLegalDoc} />
                </div>
                </div>

                <div className="pt-6 font-sans text-[10px] text-cream/40 tracking-[0.2em] uppercase font-semibold">
                    {t('splash.footer')} • Emblematica
                </div>
            </div>

            <Suspense fallback={null}>
                {legalDoc && <LegalView initialDoc={legalDoc} onClose={() => setLegalDoc(null)} />}
            </Suspense>
        </div>
    )
}

function LegalNotice({ onOpen }: { onOpen: (doc: LegalDoc) => void }) {
    const { t } = useLanguage()
    const links = { '{terms}': 'terms', '{privacy}': 'privacy' } as const

    return (
        <p className="font-sans text-[11px] text-cream/50 leading-relaxed max-w-xs mx-auto text-balance">
            {t('splash.legal_notice').split(/(\{terms\}|\{privacy\})/).map(part => {
                const doc = links[part as keyof typeof links]
                return doc
                    ? <button key={part} onClick={() => onOpen(doc)} className="underline underline-offset-2 text-cream/75 hover:text-cream">{t(`legal.${doc}`)}</button>
                    : part
            })}
        </p>
    )
}
