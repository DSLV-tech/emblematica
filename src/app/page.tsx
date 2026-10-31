'use client'

import { useState } from 'react'
import { useAuth, type UserProfile } from '@/hooks/useAuth'
import { useLocales } from '@/hooks/useLocales'
import { usePassport } from '@/hooks/usePassport'
import { useRouting } from '@/hooks/useRouting'
import { useFavorites } from '@/hooks/useFavorites'
import { useCity } from '@/context/CityContext'
import { CityProvider } from '@/context/CityContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { IconContext } from '@phosphor-icons/react'
import { signOut, type User } from 'firebase/auth'
import { auth } from '@/firebase/config'
import AppShell from '@/AppShell'
import SplashPage from '@/views/SplashPage'
import type { Locale } from '@/types'
import type { Ruta } from '@/types'

function AppContent() {
  const { user, profile, loading: authLoading } = useAuth()
  const [enteredAsGuest, setEnteredAsGuest] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    setEnteredAsGuest(false)
  }

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

  return <AppData user={user} profile={profile} onLogout={handleLogout} />
}

// Montato solo dopo lo splash: chi non entra non consuma letture Firestore e la
// città salvata è già stata ripristinata, quindi non si legge quella di default.
function AppData({ user, profile, onLogout }: { user: User | null; profile: UserProfile | null; onLogout: () => void }) {
  const { city } = useCity()

  const { locales } = useLocales('', 'Tutti', city?.collection)
  const { checkIn, hasStamp, stamps } = usePassport(user)
  const { routeInfo, routeGeoJson, userPosition, isNavigating, startNavigation, stopNavigation } = useRouting()
  const { toggleFavorite, isFavorite } = useFavorites(user)

  const rutas: Ruta[] = []

  const handleStartRoute = async (locale: Locale) => {
    // L'errore resta nello stato di useRouting
    await startNavigation(locale.coordinates.lat, locale.coordinates.lng).catch(() => {})
  }

  const passport = stamps.length > 0
    ? { uid: user?.uid ?? '', stamps, totalVisits: stamps.length, createdAt: null, lastVisitAt: null }
    : null

  return (
    <AppShell
      user={profile}
      locales={locales}
      rutas={rutas}
      city={city?.name}
      cityCenter={city?.center}
      cityZoom={city?.zoom}
      onLogout={onLogout}
      onCheckIn={checkIn}
      onToggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
      hasStamp={hasStamp}
      onStartRoute={handleStartRoute}
      currentRoute={routeInfo}
      isLoadingRoute={isNavigating}
      onStopRoute={stopNavigation}
      passport={passport}
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
        {/* Phosphor Light come peso di default in tutta l'app */}
        <IconContext.Provider value={{ weight: 'light', size: 20 }}>
          <AppContent />
        </IconContext.Provider>
      </LanguageProvider>
    </CityProvider>
  )
}
