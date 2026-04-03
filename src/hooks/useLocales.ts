'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Locale, Category } from '../types'
import { SAMPLE_LOCALES } from '../data/sampleData'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useLocales(searchQuery: string, selectedCategory: Category | 'Tutti' | 'Tutti', cityCollection = 'locales') {
  const [locales, setLocales] = useState<Locale[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    // Live Firestore listener — falls back to sample data if Firestore is unreachable
    const q = query(collection(db, cityCollection), orderBy('name'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // No data in Firestore yet — use bundled samples
          setLocales(SAMPLE_LOCALES)
        } else {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Locale))
          setLocales(data)
        }
        setLoading(false)
      },
      (err) => {
        console.warn('[useLocales] Firestore unavailable, using sample data:', err.message)
        setLocales(SAMPLE_LOCALES)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [cityCollection])

  const filtered = useMemo(() => {
    let result = locales

    if (selectedCategory !== 'Tutti') {
      result = result.filter((l) => l.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.short_desc.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.full_story.toLowerCase().includes(q)
      )
    }

    return result
  }, [locales, selectedCategory, searchQuery])

  return { locales: filtered, loading, error }
}
