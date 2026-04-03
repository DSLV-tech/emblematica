'use client'

import { useState } from 'react'
import type { Locale } from '../types'
import type { User } from 'firebase/auth'
import { useAiContext } from '../hooks/useAiContext'
import AudioPlayer from '../components/UI/AudioPlayer'
import ClaimModal from '../components/UI/ClaimModal'

interface DetailViewProps {
  locale: Locale
  isFavorite: boolean
  onBack: () => void
  onToggleFavorite: (id: string) => void
  onNavigate?: (locale: Locale) => void
  onCheckIn?: (locale: Locale) => void
  hasStamp?: boolean
  checkingIn?: boolean
  user?: User | null
}

export default function DetailView({ locale, isFavorite, onBack, onToggleFavorite, onNavigate, onCheckIn, hasStamp, checkingIn, user }: DetailViewProps) {
  const [imgError, setImgError] = useState(false)
  const [showAiFact, setShowAiFact] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const { fetchFact, fact, loading: aiLoading, error: aiError } = useAiContext()

  const openMaps = () => {
    const { lat, lng } = locale.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(locale.name)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleNavigate = async () => {
    if (onNavigate) {
      setNavigating(true)
      await onNavigate(locale)
      setNavigating(false)
    } else {
      openMaps()
    }
  }

  const handleAiClick = async () => {
    if (!fact) {
      await fetchFact(locale.full_story, locale.name)
    }
    setShowAiFact(true)
  }

  const paragraphs = locale.full_story.split('\n\n').filter(Boolean)

  // Mock a gallery if none exists for UI demo purposes
  const mockGallery = locale.gallery || [
    locale.image_url,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80'
  ]

  const hasSocials = !!locale.social?.website || !!locale.social?.instagram || !!locale.social?.facebook

  return (
    <div className="fixed inset-0 z-[3000] overflow-y-auto bg-cream animate-fade-in custom-scrollbar">
      {/* Hero Header */}
      <div className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
        <img
          src={imgError ? 'https://via.placeholder.com/1200x800/333333/B8860B?text=📍' : locale.image_url}
          alt={locale.name}
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear hover:scale-110"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/20 to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => onToggleFavorite(locale.id)}
            className={`
              w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-all hover:scale-105
              ${isFavorite ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
            `}
          >
            <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Hero Title Container */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
          <div className="max-w-4xl mx-auto flex flex-col items-start">
            {locale.protected && (
              <span className="inline-flex items-center gap-1.5 bg-gold/90 backdrop-blur-sm text-anthracite text-xs font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 shadow-lg">
                <span className="text-sm">🏛️</span> Patrimonio Protetto
              </span>
            )}
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream leading-tight drop-shadow-xl mb-3">
              {locale.name}
            </h1>
            <div className="flex items-center gap-4 text-cream/80 font-sans text-sm tracking-wide">
              {locale.founded_year && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Dal {locale.founded_year}
                </span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <span className="flex items-center gap-1.5 text-gold font-medium">
                {locale.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 -mt-8 pb-32">
        {/* Info Card Overlapping Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border border-anthracite/5 mb-10 relative z-20">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-sans text-xs text-anthracite/50 uppercase tracking-wider font-semibold mb-1">Indirizzo</p>
                <p className="font-serif text-anthracite text-lg">{locale.address}</p>
              </div>
            </div>

            {hasSocials && (
              <div className="flex items-center gap-3">
                {locale.social?.website && (
                  <a href={locale.social.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-gold hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </a>
                )}
                {locale.social?.instagram && (
                  <a href={locale.social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-pink-600 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.375a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" /></svg>
                  </a>
                )}
                {locale.social?.facebook && (
                  <a href={locale.social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (Story) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-serif text-3xl font-bold text-anthracite">La Storia</h2>

            <p className="font-serif text-xl text-gold-dark italic leading-relaxed border-l-4 border-gold pl-6">
              {locale.description}
            </p>

            <div className="space-y-6">
              {paragraphs.map((para, i) => (
                <p key={i} className="font-sans text-base text-anthracite/80 leading-loose">
                  {para}
                </p>
              ))}
            </div>

            {/* Audio Story Player */}
            <div className="pt-6 border-t border-anthracite/10">
              <AudioPlayer text={locale.full_story} localeName={locale.name} />
            </div>

            {/* AI Curiosità Button */}
            <div className="pt-6 border-t border-anthracite/10">
              <button
                onClick={handleAiClick}
                disabled={aiLoading}
                className="w-full py-5 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 via-white to-gold/5 text-anthracite font-sans font-semibold text-base flex items-center justify-center gap-3 hover:border-gold hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-60 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                {aiLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin relative z-10" />
                    <span className="relative z-10">L'Intelligenza Artificiale sta cercando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl relative z-10">✨</span>
                    <span className="relative z-10">Rivela una Curiosità Storica</span>
                    <span className="text-xs font-normal text-anthracite/50 ml-2 relative z-10 hidden sm:inline">powered by Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar (Gallery & Meta) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-anthracite/5 border border-anthracite/5">
              <h3 className="font-sans text-sm font-bold text-anthracite uppercase tracking-widest mb-4">La Galleria</h3>
              <div className="space-y-4">
                {mockGallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-md">
                    <img src={img} alt={`${locale.name} gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-anthracite/0 group-hover:bg-anthracite/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Fact Overlay Modal */}
      {showAiFact && (
        <div
          className="fixed inset-0 z-[3100] flex items-center justify-center p-6"
          style={{ background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowAiFact(false)}
        >
          <div
            className="w-full max-w-lg bg-cream rounded-3xl p-8 shadow-2xl relative animate-fade-in border border-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-gold-light flex items-center justify-center shadow-lg border-4 border-cream">
              <span className="text-xl">✨</span>
            </div>

            <button
              onClick={() => setShowAiFact(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/50 hover:bg-anthracite/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="text-center mt-6 mb-6">
              <h4 className="font-serif text-2xl font-bold text-anthracite mb-2">Lo Sapevi?</h4>
              <p className="font-sans text-xs text-anthracite/50 uppercase tracking-widest">Un aneddoto dimenticato</p>
            </div>

            {aiError ? (
              <p className="font-sans text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl text-center">
                {aiError}
              </p>
            ) : (
              <p className="font-serif text-lg text-anthracite/80 leading-relaxed text-center italic">
                "{fact}"
              </p>
            )}

            <div className="mt-8 pt-6 border-t border-anthracite/10 flex items-center justify-center gap-2">
              <span className="font-sans text-[10px] text-anthracite/40 uppercase tracking-widest font-bold">Generato da Google Gemini</span>
            </div>
          </div>
        </div>
      )}

      {/* Claim this venue section */}
      {user && (
        <div className="px-6 pt-4 pb-2">
          <button
            onClick={() => setShowClaim(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 hover:bg-gold/10 transition-colors"
          >
            <span className="text-lg">🏠</span>
            <span className="font-sans text-sm font-semibold text-gold">Sei il gestore? Reclama questo locale</span>
          </button>
        </div>
      )}

      {/* Claim Modal */}
      {showClaim && user && (
        <ClaimModal locale={locale} user={user} onClose={() => setShowClaim(false)} />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[3050] animate-fade-in pointer-events-none w-full px-6 max-w-md space-y-3">
        {/* Check-in stamp button */}
        {onCheckIn && (
          <button
            onClick={() => onCheckIn(locale)}
            disabled={hasStamp || checkingIn}
            className={`w-full py-3 rounded-full font-sans font-bold text-sm flex items-center justify-center gap-3 shadow-lg backdrop-blur-md transition-all active:scale-95 pointer-events-auto border ${hasStamp
              ? 'bg-green-600/90 text-white border-green-500/30 cursor-default'
              : 'bg-gold/90 hover:bg-gold text-cream border-gold/30'
              } disabled:opacity-80`}
          >
            {checkingIn ? (
              <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />
            ) : hasStamp ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <span>📒</span>
            )}
            {checkingIn ? 'Verifica posizione GPS…' : hasStamp ? 'Già nel passaporto' : 'Timbra Passaporto'}
          </button>
        )}

        {/* Navigation button */}
        <button
          onClick={handleNavigate}
          disabled={navigating}
          className="w-full py-4 rounded-full bg-anthracite/90 hover:bg-anthracite text-cream font-sans font-bold tracking-wide text-base flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all active:scale-95 pointer-events-auto border border-white/10 group disabled:opacity-70"
        >
          {navigating ? (
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </span>
          )}
          {navigating ? 'Calcolo percorso…' : onNavigate ? "Naviga nell'app" : 'Apri in Google Maps'}
        </button>
      </div>
    </div>
  )
}
