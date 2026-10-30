'use client'

import { useEffect } from 'react'
import type { Locale } from '../../types'
import { Heart, MapPin, SealCheck, X } from '@phosphor-icons/react'
import { useLanguage } from '../../context/LanguageContext'
import CategoryIcon from './CategoryIcon'

interface BottomSheetProps {
  locale: Locale | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (id: string) => void
  onViewDetail: () => void
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%2326262B'/%3E%3C/svg%3E"

export default function BottomSheet({
  locale,
  isFavorite,
  onClose,
  onToggleFavorite,
  onViewDetail,
}: BottomSheetProps) {
  const { t } = useLanguage()

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
        className="fixed inset-0 z-[2000] bg-black/25 animate-fade-in md:hidden"
        onClick={onClose}
      />

      {/* Sheet — bottom sheet on mobile, floating card on desktop */}
      <div
        role="dialog"
        aria-label={locale.name}
        className="
          fixed bottom-0 left-0 right-0 z-[2001] rounded-t-[28px] overflow-hidden animate-slide-up
          bg-ink text-cream border-t border-white/10
          md:bottom-6 md:left-6 md:right-auto md:w-[380px] md:rounded-[28px] md:border
        "
        style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.35)', maxHeight: '78vh' }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={locale.image_url}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.onerror = null // blocca il loop infinito
              img.src = FALLBACK_IMG
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-black/20" />

          {/* Drag handle — mobile only */}
          <div className="absolute top-2.5 inset-x-0 flex justify-center md:hidden">
            <div className="w-9 h-1 rounded-full bg-white/50" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={t('generic.close')}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/55 transition-colors"
          >
            <X size={18} weight="regular" />
          </button>

          {/* Title block on image */}
          <div className="absolute bottom-0 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="eyebrow inline-flex items-center gap-1.5 text-cream/80">
                <CategoryIcon category={locale.category} size={14} weight="regular" className="text-gold" />
                {t(`cat.${locale.category}`)}
              </span>
              {locale.founded_year && (
                <span className="eyebrow text-gold">· {t('locale.since', { year: locale.founded_year })}</span>
              )}
            </div>
            <h2 className="font-display text-[22px] font-semibold leading-tight text-cream text-balance">
              {locale.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-3" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          <p className="font-serif italic text-[13px] text-cream/55 mb-3 flex items-start gap-1.5">
            <MapPin size={15} className="text-gold flex-shrink-0 mt-[2px]" aria-hidden />
            {locale.address}
          </p>

          {locale.protected && (
            <p className="eyebrow inline-flex items-center gap-1.5 text-gold border border-gold/30 bg-gold/10 rounded-full px-2.5 py-1 mb-3">
              <SealCheck size={14} weight="regular" aria-hidden /> {t('locale.protected')}
            </p>
          )}

          <p className="font-sans text-[14px] text-cream/75 leading-relaxed mb-5 line-clamp-3">
            {locale.description}
          </p>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={onViewDetail}
              className="flex-1 h-12 rounded-full bg-gold hover:bg-gold-light text-ink font-sans font-semibold text-[15px] transition-[background-color,transform] duration-200 active:scale-[0.98] shadow-[0_6px_20px_rgba(201,168,76,0.3)]"
            >
              {t('locale.discover_story')}
            </button>
            <button
              onClick={() => onToggleFavorite(locale.id)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center border transition-[background-color,border-color,color,transform] duration-200 active:scale-95
                ${isFavorite
                  ? 'bg-terracotta border-terracotta text-cream'
                  : 'bg-white/5 border-white/12 text-cream/80 hover:text-cream hover:border-white/25'
                }
              `}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? t('locale.remove_favorite') : t('locale.add_favorite')}
            >
              <Heart size={22} weight={isFavorite ? 'fill' : 'light'} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
