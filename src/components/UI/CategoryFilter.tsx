'use client'

import { useRef } from 'react'
import type { Category } from '../../types'
import { CATEGORIES, CATEGORY_ICONS } from '../../types'

interface CategoryFilterProps {
  selected: Category
  onChange: (cat: Category) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === selected
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-sm font-sans font-medium whitespace-nowrap
              transition-all duration-200 shadow-sm
              ${isActive
                ? 'bg-gold text-cream border-2 border-gold-dark shadow-md scale-105'
                : 'bg-white/90 text-anthracite border-2 border-transparent hover:border-gold hover:bg-cream'
              }
            `}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{cat}</span>
          </button>
        )
      })}
    </div>
  )
}
