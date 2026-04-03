'use client'

import { useState } from 'react'
import AppShell from '@/AppShell'
import SplashPage from '@/views/SplashPage'
import { useAuth } from '@/hooks/useAuth'
import { CityProvider } from '@/context/CityContext'
import { LanguageProvider } from '@/context/LanguageContext'

export default function Home() {
    const { user, loading } = useAuth()
    const [enteredAsGuest, setEnteredAsGuest] = useState(false)

    if (loading) {
        return (
            <div className="fixed inset-0 bg-anthracite flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <CityProvider>
            <LanguageProvider>
                {user || enteredAsGuest
                    ? <AppShell onResetGuest={() => setEnteredAsGuest(false)} />
                    : <SplashPage onEnterGuest={() => setEnteredAsGuest(true)} />
                }
            </LanguageProvider>
        </CityProvider>
    )
}
