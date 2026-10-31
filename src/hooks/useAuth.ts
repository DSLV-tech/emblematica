'use client'

import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export type UserRole = 'admin' | 'user' | 'guest'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  createdAt?: any
  lastLoginAt?: any
}

const LAST_LOGIN_WRITE_INTERVAL_MS = 60 * 60 * 1000

// Azioni senza stato: chi deve solo fare login le importa direttamente, senza
// aprire un secondo listener di useAuth (e ripetere le letture del profilo).
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
// The onAuthStateChanged listener in useAuth will automatically
// create or load the Firestore user document after login

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // When auth state changes, load (or create) the Firestore user document
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const userRef = doc(db, 'users', u.uid)
          const snap = await getDoc(userRef)
          if (snap.exists()) {
            // User document exists — load it and update last login
            const data = snap.data() as UserProfile
            setProfile(data)
            // Al massimo una scrittura l'ora; se fallisce il profilo caricato resta valido
            if (Date.now() - (data.lastLoginAt?.toMillis?.() ?? 0) > LAST_LOGIN_WRITE_INTERVAL_MS) {
              setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true })
                .catch((err) => console.warn('[useAuth] lastLoginAt not updated:', err))
            }
          } else {
            // First login — create user document with default 'user' role
            const newProfile: UserProfile = {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              role: 'user',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            }
            await setDoc(userRef, newProfile)
            setProfile(newProfile)
          }
        } catch (err) {
          console.error('[useAuth] Firestore user profile error:', err)
          // Fallback — still allow access even if Firestore is unreachable
          setProfile({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            role: 'user',
          })
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = () => {
    setProfile(null)
    return signOut(auth)
  }

  const isAdmin = profile?.role === 'admin'

  return {
    user,
    profile,
    loading,
    isAdmin,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
  }
}
