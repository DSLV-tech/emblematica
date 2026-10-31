'use client'

import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    // In dev la cache nasconderebbe le modifiche: il worker gira solo in produzione
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('[useServiceWorker] registration failed:', err))
    // Le risorse della prima visita partono prima che il worker sia attivo: gliele segnala
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: 'CACHE_URLS',
        urls: performance.getEntriesByType('resource').map((entry) => entry.name),
      })
    })
  }, [])
}
