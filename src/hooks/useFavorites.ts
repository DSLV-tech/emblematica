'use client'

import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const GUEST_FAVORITES_KEY = 'barna_favorites'

function readGuestFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_FAVORITES_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useFavorites(user: User | null) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      // Load from localStorage when not authenticated
      setFavorites(new Set(readGuestFavorites()))
      return
    }

    // I preferiti salvati da ospite passano all'account al primo accesso
    const guestFavorites = readGuestFavorites()
    if (guestFavorites.length > 0) {
      const batch = writeBatch(db)
      guestFavorites.forEach((id) => batch.set(doc(db, 'users', user.uid, 'favorites', id), { addedAt: new Date() }))
      batch.commit()
        .then(() => localStorage.removeItem(GUEST_FAVORITES_KEY))
        .catch((err) => console.warn('[useFavorites] guest favorites not migrated:', err))
    }

    // Listen to Firestore favorites collection for authenticated users
    const favRef = collection(db, 'users', user.uid, 'favorites')
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const ids = new Set(snapshot.docs.map((d) => d.id))
      setFavorites(ids)
    }, (err) => console.warn('[useFavorites] Firestore unavailable:', err.message))
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
      localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify([...next]))
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
