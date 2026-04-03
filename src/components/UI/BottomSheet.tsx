'use client'

import { useEffect } from 'react'
import type { Locale } from '../../types'

interface BottomSheetProps {
  locale: Locale | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (id: string) => void
  onViewDetail: () => void
}

export default function BottomSheet({
  locale,
  isFavorite,
  onClose,
  onToggleFavorite,
  onViewDetail,
}: BottomSheetProps) {
  useEffect(() => {
    if (!locale) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [locale, onClose])

  if (!locale) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2000] bg-black/20 animate-fade-in md:hidden"
        onClick={onClose}
      />

      {/* Sheet — bottom sheet on mobile, floating card on desktop */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-[2001] rounded-t-3xl overflow-hidden animate-slide-up
          md:bottom-6 md:left-6 md:right-auto md:w-[380px] md:rounded-3xl
        "
        style={{
          background: 'linear-gradient(to bottom, #FAFAF0, #F5F5DC)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          maxHeight: '75vh',
        }}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-anthracite/20" />
        </div>

        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={locale.image_url}
            alt={locale.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/800x400/F5F5DC/B8860B?text=📍'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-gold text-cream text-xs font-sans font-semibold px-2.5 py-1 rounded-full shadow">
              {locale.category}
            </span>
            {locale.protected && (
              <span className="bg-anthracite/80 text-cream text-xs font-sans px-2.5 py-1 rounded-full shadow">
                🏛️ Patrimonio
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Name on image */}
          <div className="absolute bottom-3 left-4 right-14">
            <h2 className="font-serif text-xl font-bold text-white leading-tight drop-shadow-lg">
              {locale.name}
            </h2>
            {locale.founded_year && (
              <p className="font-sans text-xs text-white/80 mt-0.5">
                Est. {locale.founded_year}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-6">
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="font-sans text-xs text-anthracite/60 leading-relaxed">{locale.address}</p>
          </div>

          <p className="font-sans text-sm text-anthracite/80 leading-relaxed mb-5">
            {locale.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onViewDetail}
              className="flex-1 bg-gold hover:bg-gold-dark text-cream font-sans font-semibold text-sm py-3 rounded-xl shadow transition-all duration-200 active:scale-95"
            >
              Scopri la Storia
            </button>
            <button
              onClick={() => onToggleFavorite(locale.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center shadow transition-all duration-200 active:scale-95
                ${isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-anthracite hover:bg-red-50 hover:text-red-400'
                }
              `}
              aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
