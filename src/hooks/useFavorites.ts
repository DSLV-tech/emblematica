'use client'

import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export function useFavorites(user: User | null) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      // Load from localStorage when not authenticated
      const stored = localStorage.getItem('barna_favorites')
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
      return
    }

    // Listen to Firestore favorites collection for authenticated users
    const favRef = collection(db, 'users', user.uid, 'favorites')
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const ids = new Set(snapshot.docs.map((d) => d.id))
      setFavorites(ids)
    })
    return unsubscribe
  }, [user])

  const toggleFavorite = async (localeId: string) => {
    const isFav = favorites.has(localeId)

    if (!user) {
      // Persist in localStorage
      const next = new Set(favorites)
      if (isFav) next.delete(localeId)
      else next.add(localeId)
      setFavorites(next)
      localStorage.setItem('barna_favorites', JSON.stringify([...next]))
      return
    }

    const favRef = doc(db, 'users', user.uid, 'favorites', localeId)
    if (isFav) {
      await deleteDoc(favRef)
    } else {
      await setDoc(favRef, { addedAt: new Date() })
    }
  }

  const isFavorite = (localeId: string) => favorites.has(localeId)

  return { favorites, toggleFavorite, isFavorite }
}
