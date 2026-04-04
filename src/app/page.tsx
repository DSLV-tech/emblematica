'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocales } from '@/hooks/useLocales'
import { usePassport } from '@/hooks/usePassport'
import { useRouting } from '@/hooks/useRouting'
import { useFavorites } from '@/hooks/useFavorites'
import { useAiContext } from '@/hooks/useAiContext'
import { useCity } from '@/context/CityContext'
import { CityProvider } from '@/context/CityContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import AppShell from '@/AppShell'
import SplashPage from '@/views/SplashPage'
import type { Locale } from '@/types'
import type { Ruta } from '@/types'

function AppContent() {
const { user, profile, loading: authLoading } = useAuth()
  const [enteredAsGuest, setEnteredAsGuest] = useState(false)
  const { city } = useCity()

  const { locales, loading: localesLoading } = useLocales('', 'Tutti', city?.collection)
  const { checkIn, hasStamp, stamps } = usePassport(user)
  const { routeInfo, routeGeoJson, userPosition, isNavigating, startNavigation, stopNavigation } = useRouting()
  const { toggleFavorite, isFavorite } = useFavorites(user)
  const { fact: aiCuriosity, loading: aiLoading } = useAiContext()

  const rutas: Ruta[] = []

  const handleLogout = async () => {
    await signOut(auth)
    setEnteredAsGuest(false)
  }

  const handleStartRoute = async (locale: Locale) => {
    await startNavigation(locale.coordinates.lat, locale.coordinates.lng)
  }

  const passport = stamps.length > 0
    ? { uid: user?.uid ?? '', stamps, totalVisits: stamps.length, createdAt: null, lastVisitAt: null }
    : null

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-anthracite flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user && !enteredAsGuest) {
    return <SplashPage onEnterGuest={() => setEnteredAsGuest(true)} />
  }

  return (
    <AppShell
  user={profile as any}
  locales={locales as any}
  rutas={rutas as any}
  city={city?.name}
  cityCenter={city?.center}
  cityZoom={city?.zoom}
  onLogout={handleLogout}
  onCheckIn={checkIn as any}
  onToggleFavorite={toggleFavorite}
  isFavorite={isFavorite}
  hasStamp={hasStamp}
  onStartRoute={handleStartRoute as any}
  currentRoute={routeInfo as any}
  isLoadingRoute={isNavigating}
  onStopRoute={stopNavigation}
  passport={passport as any}
  aiCuriosity={aiCuriosity ?? undefined}
  isLoadingAI={aiLoading}
  totalLocali={locales.length}
  routeGeoJson={routeGeoJson}
  userPosition={userPosition}
/>
  )
}

export default function Home() {
  return (
    <CityProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </CityProvider>
  )
}
