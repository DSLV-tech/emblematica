'use client'

import { useState } from 'react'
import type { Locale, AppUser } from '../types'
import { useAiContext } from '../hooks/useAiContext'
import { useLanguage } from '../context/LanguageContext'
import AudioPlayer from '../components/UI/AudioPlayer'
import ClaimModal from '../components/UI/ClaimModal'
import CategoryIcon from '../components/UI/CategoryIcon'
import {
  CaretLeft, CheckCircle, Clock, FacebookLogo, Globe, Heart, HouseLine, InstagramLogo, MapPin, MapTrifold, SealCheck, Sparkle, Stamp, X,
} from '@phosphor-icons/react'

interface DetailViewProps {
  locale: Locale
  isFavorite: boolean
  onBack: () => void
  onToggleFavorite: (id: string) => void
  onNavigate?: (locale: Locale) => void
  onCheckIn?: (locale: Locale) => void
  hasStamp?: boolean
  checkingIn?: boolean
  user?: AppUser | null
}

export default function DetailView({ locale, isFavorite, onBack, onToggleFavorite, onNavigate, onCheckIn, hasStamp, checkingIn, user }: DetailViewProps) {
  const [imgError, setImgError] = useState(false)
  const [showAiFact, setShowAiFact] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const { fetchFact, fact, loading: aiLoading, error: aiError } = useAiContext()
  const { t, lang } = useLanguage()

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
      await fetchFact(locale.full_story, locale.name, lang)
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
    <div className="fixed inset-0 md:inset-8 z-[3000] overflow-y-auto bg-cream animate-fade-in custom-scrollbar md:rounded-3xl md:shadow-2xl">
      {/* Hero Header */}
      <div className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
        <img
          src={imgError ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='1200' height='800' fill='%23333333'/%3E%3Ctext x='600' y='410' font-size='96' text-anchor='middle'%3E%F0%9F%93%8D%3C/text%3E%3C/svg%3E" : locale.image_url}
          alt={locale.name}
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear hover:scale-110"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/20 to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button
            onClick={onBack}
            aria-label={t('generic.back')}
            className="w-11 h-11 rounded-full bg-black/30 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/45 transition-colors"
          >
            <CaretLeft size={22} className="rtl:rotate-180" />
          </button>

          <button
            onClick={() => onToggleFavorite(locale.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? t('locale.remove_favorite') : t('locale.add_favorite')}
            className={`
              w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-md transition-colors
              ${isFavorite ? 'bg-terracotta border-terracotta text-cream' : 'bg-black/30 border-white/20 text-white hover:bg-black/45'}
            `}
          >
            <Heart size={22} weight={isFavorite ? 'fill' : 'light'} />
          </button>
        </div>

        {/* Hero Title Container */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
          <div className="max-w-4xl mx-auto flex flex-col items-start">
            {locale.protected && (
              <span className="eyebrow inline-flex items-center gap-1.5 bg-gold text-ink px-3 py-1.5 rounded-full mb-4">
                <SealCheck size={14} weight="regular" /> {t('detail.protected_heritage')}
              </span>
            )}
            <h1 className="font-display text-4xl sm:text-6xl font-semibold text-cream leading-[1.05] text-balance drop-shadow-xl mb-3">
              {locale.name}
            </h1>
            <div className="flex items-center gap-4 text-cream/80 font-sans text-sm tracking-wide">
              {locale.founded_year && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {t('detail.founded_since')} {locale.founded_year}
                </span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <CategoryIcon category={locale.category} size={16} />
                {t(`cat.${locale.category}`)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 -mt-8 pb-32">
        {/* Info Card Overlapping Hero */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border border-anthracite/5 mb-10 relative z-20">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20 text-gold-dark">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-sans text-xs text-anthracite/50 uppercase tracking-wider font-semibold mb-1">{t('detail.address_label')}</p>
                <p className="font-serif text-anthracite text-lg">{locale.address}</p>
              </div>
            </div>

            {hasSocials && (
              <div className="flex items-center gap-3">
                {locale.social?.website && (
                  <a href={locale.social.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-gold hover:text-white transition-colors">
                    <Globe size={18} />
                  </a>
                )}
                {locale.social?.instagram && (
                  <a href={locale.social.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-pink-600 hover:text-white transition-colors">
                    <InstagramLogo size={18} />
                  </a>
                )}
                {locale.social?.facebook && (
                  <a href={locale.social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/70 hover:bg-blue-600 hover:text-white transition-colors">
                    <FacebookLogo size={18} />
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
            <h2 className="font-serif text-3xl font-semibold text-anthracite">{t('detail.story')}</h2>

            <p className="font-serif text-xl text-anthracite/80 italic leading-relaxed border-s-2 border-gold ps-5">
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
                    <span className="relative z-10">{t('detail.ai_loading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkle size={22} className="text-gold-dark relative z-10" />
                    <span className="relative z-10">{t('detail.ai_fact')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar (Gallery & Meta) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card rounded-3xl p-6 shadow-xl shadow-anthracite/5 border border-anthracite/5">
              <h3 className="font-sans text-sm font-bold text-anthracite uppercase tracking-widest mb-4">{t('detail.gallery')}</h3>
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
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center shadow-lg border-4 border-cream">
              <Sparkle size={22} weight="fill" />
            </div>

            <button
              onClick={() => setShowAiFact(false)}
              aria-label={t('generic.close')}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-anthracite/5 flex items-center justify-center text-anthracite/60 hover:bg-anthracite/10 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center mt-6 mb-6">
              <h4 className="font-serif text-2xl font-semibold text-anthracite mb-2">{t('detail.ai_reveal_title')}</h4>
              <p className="font-sans text-xs text-anthracite/50 uppercase tracking-widest">{t('detail.ai_anecdote_subtitle')}</p>
            </div>

            {aiError ? (
              <p className="font-sans text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl text-center">
                {t(aiError === 'busy' ? 'detail.ai_err_busy' : 'detail.ai_err_unavailable')}
              </p>
            ) : (
              <p className="font-serif text-lg text-anthracite/80 leading-relaxed text-center italic">
                “{fact}”
              </p>
            )}

            <div className="mt-8 pt-6 border-t border-anthracite/10 flex items-center justify-center gap-2">
              <span className="font-sans text-[10px] text-anthracite/40 uppercase tracking-widest font-bold">{t('detail.ai_powered_by')}</span>
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
            <HouseLine size={20} className="text-gold-dark" />
            <span className="font-sans text-sm font-semibold text-gold-dark">{t('detail.claim_venue')}</span>
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
              ? 'bg-ink/90 text-gold border-gold/40 cursor-default'
              : 'bg-gold hover:bg-gold-light text-ink border-gold/30'
              } disabled:opacity-80`}
          >
            {checkingIn ? (
              <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />
            ) : hasStamp ? (
              <CheckCircle size={18} weight="fill" />
            ) : (
              <Stamp size={18} />
            )}
            {checkingIn ? t('detail.checking_gps') : hasStamp ? t('detail.already_stamped') : t('detail.stamp_passport')}
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
              <MapTrifold size={18} />
            </span>
          )}
          {navigating ? t('detail.calculating_route') : onNavigate ? t('detail.navigate') : t('detail.open_maps')}
        </button>
      </div>
    </div>
  )
}
