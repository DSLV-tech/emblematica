'use client'

import { useRef } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useLanguage } from '../../context/LanguageContext'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <label
      className="
        glass flex items-center gap-2.5 h-11 rounded-full ps-4 pe-1.5
        shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow] duration-200
        focus-within:border-gold/50 focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.18),0_6px_24px_rgba(0,0,0,0.28)]
      "
    >
      <MagnifyingGlass size={18} className="text-gold flex-shrink-0" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 min-w-0 bg-transparent text-cream text-[15px] font-sans outline-none placeholder:text-cream/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          aria-label={t('generic.clear_search')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/10 transition-colors"
        >
          <X size={16} weight="regular" aria-hidden />
        </button>
      )}
    </label>
  )
}
