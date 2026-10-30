'use client'

import { CaretLeft, X, type Icon } from '@phosphor-icons/react'
import { useLanguage } from '../../context/LanguageContext'

interface ViewHeaderProps {
  icon: Icon
  title: string
  subtitle?: string
  onClose: () => void
  /** Se presente, al posto dell'icona compare il pulsante "indietro" */
  onBack?: () => void
}

/** Intestazione condivisa delle viste a tutto schermo su carta */
export default function ViewHeader({ icon: Glyph, title, subtitle, onClose, onBack }: ViewHeaderProps) {
  const { t } = useLanguage()
  const roundBtn = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors'

  return (
    <div
      className="flex items-center gap-3.5 px-5 pb-4 border-b border-anthracite/10 bg-cream/90 backdrop-blur-md flex-shrink-0"
      style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
    >
      {onBack ? (
        <button onClick={onBack} aria-label={t('generic.back')} className={`${roundBtn} bg-anthracite/5 hover:bg-anthracite/10 text-anthracite`}>
          <CaretLeft size={20} className="rtl:rotate-180" />
        </button>
      ) : (
        <div className={`${roundBtn} bg-gold/15 text-gold-dark`} aria-hidden>
          <Glyph size={22} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-xl font-semibold text-anthracite leading-tight truncate">{title}</h1>
        {subtitle && <p className="font-sans text-xs text-anthracite/55 truncate mt-0.5">{subtitle}</p>}
      </div>
      <button onClick={onClose} aria-label={t('generic.close')} className={`${roundBtn} bg-anthracite/5 hover:bg-anthracite/10 text-anthracite`}>
        <X size={20} />
      </button>
    </div>
  )
}
