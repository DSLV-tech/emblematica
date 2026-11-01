'use client'

import { SquaresFour } from '@phosphor-icons/react'
import type { Category } from '../../types'
import { CATEGORIES } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import CategoryIcon from './CategoryIcon'

interface CategoryFilterProps {
  selected: Category | null  // null = Tutti
  onChange: (cat: Category | null) => void
}

const chipBase = `
  flex-shrink-0 flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full
  font-sans text-[13px] font-medium whitespace-nowrap
  transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]
`
const chipIdle   = 'glass text-cream/85 hover:text-cream hover:border-cream/25'
const chipActive = 'btn-gold'

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { t } = useLanguage()

  const handleClick = (cat: Category) => {
    // Clicking the active category deselects → torna a Tutti
    onChange(selected === cat ? null : cat)
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1"
      style={{
        WebkitOverflowScrolling: 'touch',
        // Sfuma il bordo finale per indicare che ci sono altri chip
        maskImage: 'linear-gradient(to right, #000 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, #000 85%, transparent)',
      }}
    >
      <button
        onClick={() => onChange(null)}
        aria-pressed={selected === null}
        className={`${chipBase} ${selected === null ? chipActive : chipIdle}`}
      >
        <SquaresFour size={16} aria-hidden />
        <span>{t('app.filter_all')}</span>
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = cat === selected
        return (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            aria-pressed={isActive}
            className={`${chipBase} ${isActive ? chipActive : chipIdle}`}
          >
            <CategoryIcon category={cat} size={16} className={isActive ? '' : 'text-gold'} />
            <span>{t(`cat.${cat}`)}</span>
          </button>
        )
      })}
      {/* Spacer per garantire padding destro nello scroll */}
      <div className="flex-shrink-0 w-4" aria-hidden />
    </div>
  )
}
