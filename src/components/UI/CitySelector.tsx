'use client'

import React from 'react'
import { useCity } from '@/context/CityContext'
import type { CityConfig } from '@/data/cities'

/**
 * CitySelector — pill/chip compatto per cambiare città attiva.
 * Mostra solo le città con available: true.
 * Posizionato in alto a destra sulla mappa (z-index sopra la mappa).
 */
export default function CitySelector() {
  const { city, allCities, setCity } = useCity()
  const availableCities = allCities.filter((c: CityConfig) => c.available)

  // Non mostrare se c'è una sola città disponibile
  if (availableCities.length <= 1) return null

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 py-0.5">
      {availableCities.map((c: CityConfig) => {
        const isActive = c.id === city.id
        return (
          <button
            key={c.id}
            onClick={() => setCity(c.id)}
            aria-pressed={isActive}
            title={c.name}
            style={{
              display:        'flex',
              flexShrink:     0,
              alignItems:     'center',
              gap:            5,
              height:         30,
              padding:        '0 12px 0 9px',
              borderRadius:   999,
              border:         isActive
                ? `1px solid ${c.accentColor}`
                : '1px solid rgba(244,237,225,0.09)',
              background:     isActive
                ? `${c.accentColor}26`
                : 'rgba(20,20,22,0.78)',
              backdropFilter: 'blur(14px) saturate(1.4)',
              cursor:         'pointer',
              transition:     'all 180ms ease',
              boxShadow:      'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.22)',
            }}
          >
            <span style={{ fontSize: 14 }}>{c.flag}</span>
            <span style={{
              fontFamily:    'var(--font-body, sans-serif)',
              fontSize:      12,
              fontWeight:    600,
              letterSpacing: '0.02em',
              color:         isActive ? '#F4EDE1' : 'rgba(244,237,225,0.7)',
              whiteSpace:    'nowrap',
            }}>
              {c.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
