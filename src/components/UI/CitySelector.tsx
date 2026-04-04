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
    <div
      style={{
        display:        'flex',
        gap:            6,
        flexWrap:       'wrap',
        justifyContent: 'flex-end',
      }}
    >
      {availableCities.map((c: CityConfig) => {
        const isActive = c.id === city.id
        return (
          <button
            key={c.id}
            onClick={() => setCity(c.id)}
            title={c.name}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            5,
              padding:        '6px 12px',
              borderRadius:   999,
              border:         isActive
                ? `1.5px solid ${c.accentColor}`
                : '1.5px solid rgba(255,255,255,0.18)',
              background:     isActive
                ? `${c.accentColor}22`
                : 'rgba(28,28,30,0.72)',
              backdropFilter: 'blur(8px)',
              cursor:         'pointer',
              transition:     'all 180ms ease',
              boxShadow:      isActive
                ? `0 0 0 2px ${c.accentColor}44`
                : '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontSize: 14 }}>{c.flag}</span>
            <span style={{
              fontFamily:    'var(--font-body, sans-serif)',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.05em',
              color:         isActive ? c.accentColor : 'rgba(247,240,228,0.85)',
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
