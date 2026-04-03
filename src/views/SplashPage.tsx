'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../context/LanguageContext'
import Logo from '../components/UI/Logo'

interface SplashPageProps {
    onEnterGuest: () => void
}

export default function SplashPage({ onEnterGuest }: SplashPageProps) {
    const { loginWithGoogle, loginWithEmail } = useAuth()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showEmailForm, setShowEmailForm] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            await loginWithGoogle()
        } catch (err: any) {
            console.error(err)
            if (err.message?.includes('API key') || err.message?.includes('authDomain') || err.code === 'auth/invalid-api-key') {
                setError('⚠️ Configurazione Firebase mancante. Assicurati di aver configurato il file .env.local con le tue chiavi Firebase come descritto in .env.example')
            } else {
                setError(err instanceof Error ? err.message : 'Errore con Google Login')
            }
            setLoading(false)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await loginWithEmail(email, password)
        } catch (err: any) {
            const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
                ? 'Email o password non corretti.'
                : err.code === 'auth/too-many-requests'
                ? 'Troppi tentativi. Riprova tra qualche minuto.'
                : err instanceof Error ? err.message : 'Errore di accesso.'
            setError(msg)
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-anthracite">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1583422409516-15951797f0a9?q=80&w=2600&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-anthracite/30 via-anthracite/70 to-anthracite pointer-events-none" />
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center animate-fade-in">
                {/* Logo & Intro */}
                <div className="mb-12">
                    <div className="flex justify-center mb-8 drop-shadow-[0_4px_24px_rgba(184,134,11,0.4)]">
                        <Logo variant="full" size="xl" dark />
                    </div>
                    <p className="font-sans text-lg md:text-xl text-cream/90 max-w-md mx-auto leading-relaxed border-l-4 border-gold pl-4 text-left shadow-sm">
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
                        className="w-full py-4 rounded-2xl bg-white/95 text-anthracite font-sans font-bold text-base flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] disabled:opacity-70 active:scale-95 group"
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
                        <form onSubmit={handleEmailLogin} className="space-y-3 animate-fade-in">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-cream/20 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all backdrop-blur-md"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-cream/20 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all backdrop-blur-md"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gold text-cream font-sans font-bold text-base hover:bg-gold-dark transition-all shadow-lg disabled:opacity-70 active:scale-95"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-cream/50 border-t-cream rounded-full animate-spin mx-auto" /> : 'Accedi'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowEmailForm(false); setError('') }}
                                className="w-full text-center font-sans text-xs text-cream/40 hover:text-cream/70 transition-colors py-1"
                            >
                                ← Torna al login con Google
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => { setShowEmailForm(true); setError('') }}
                            disabled={loading}
                            className="w-full py-3 rounded-2xl border border-cream/15 bg-transparent text-cream/60 font-sans text-sm hover:text-cream/90 hover:border-cream/30 transition-all disabled:opacity-50"
                        >
                            Accedi con email e password
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
                        className="w-full py-4 rounded-2xl border border-cream/20 bg-anthracite/30 text-cream font-sans font-semibold text-base hover:bg-anthracite/50 hover:border-cream/40 backdrop-blur-md transition-all disabled:opacity-50 active:scale-95 shadow-lg"
                    >
                        {t('splash.continue_guest')}
                    </button>
                </div>

                {/* Decorative Footer */}
                <div className="absolute bottom-8 font-sans text-[10px] text-cream/40 tracking-[0.2em] uppercase font-semibold">
                    {t('splash.footer')} • Emblematica
                </div>
            </div>
        </div>
    )
}
