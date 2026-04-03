'use client'

import { useRef } from 'react'
import type { Category } from '../../types'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../../types'

interface CategoryFilterProps {
  selected: Category | null  // null = Tutti
  onChange: (cat: Category | null) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleClick = (cat: Category) => {
    // Clicking the active category deselects → torna a Tutti
    onChange(selected === cat ? null : cat)
  }

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide pl-4 pr-4 py-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Chip "Tutti" */}
      <button
        onClick={() => onChange(null)}
        className={`
          flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
          text-sm font-sans font-medium whitespace-nowrap
          transition-all duration-200 shadow-sm
          ${selected === null
            ? 'bg-gold text-cream border-2 border-gold-dark shadow-md'
            : 'bg-white/90 text-anthracite border-2 border-transparent hover:border-gold hover:bg-cream'
          }
        `}
      >
        <span>🗺️</span>
        <span>Tutti</span>
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = cat === selected
        return (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-sm font-sans font-medium whitespace-nowrap
              transition-all duration-200 shadow-sm
              ${isActive
                ? 'bg-gold text-cream border-2 border-gold-dark shadow-md'
                : 'bg-white/90 text-anthracite border-2 border-transparent hover:border-gold hover:bg-cream'
              }
            `}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{CATEGORY_LABELS[cat]}</span>
          </button>
        )
      })}
      {/* Spacer per garantire padding destro nello scroll */}
      <div className="flex-shrink-0 w-1" aria-hidden />
    </div>
  )
}
