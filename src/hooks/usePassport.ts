'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { User } from 'firebase/auth'
import type { Locale } from '../types'

export interface Stamp {
    localeId: string
    localeName: string
    localeCategory: string
    localeImage: string
    localeAddress: string
    visitedAt: any // Firestore Timestamp
    coordinates: { lat: number; lng: number }
}

export interface Passport {
    uid: string
    stamps: Stamp[]
    totalVisits: number
    createdAt: any
    lastVisitAt: any
}

const CHECKIN_RADIUS_M = 100 // metres

/** Haversine distance between two lat/lng points in metres */
function haversineMetres(
    lat1: number, lng1: number,
    lat2: number, lng2: number
): number {
    const R = 6_371_000
    const toRad = (d: number) => (d * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function usePassport(user: User | null) {
    const [stamps, setStamps] = useState<Stamp[]>([])
    const [loading, setLoading] = useState(true)
    const [checkingIn, setCheckingIn] = useState(false)
    const [checkInResult, setCheckInResult] = useState<
        'success' | 'too_far' | 'already' | 'error' | null
    >(null)

    // Live subscription to the user's passport doc
    useEffect(() => {
        if (!user) { setStamps([]); setLoading(false); return }

        const passportRef = doc(db, 'passports', user.uid)
        const unsub = onSnapshot(passportRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data() as Passport
                setStamps(data.stamps ?? [])
            } else {
                setStamps([])
            }
            setLoading(false)
        }, () => setLoading(false))

        return unsub
    }, [user])

    /**
     * Try to check into `locale`.
     * 1. Gets current GPS position
     * 2. Checks distance ≤ CHECKIN_RADIUS_M
     * 3. Ensures no duplicate stamp for this locale today
     * 4. Writes stamp to Firestore
     */
    const checkIn = useCallback(async (locale: Locale): Promise<void> => {
        if (!user) return
        setCheckingIn(true)
        setCheckInResult(null)

        try {
            // 1. Get current position
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10_000,
                })
            )

            const { latitude, longitude } = position.coords
            const dist = haversineMetres(
                latitude, longitude,
                locale.coordinates.lat, locale.coordinates.lng
            )

            if (dist > CHECKIN_RADIUS_M) {
                setCheckInResult('too_far')
                setCheckingIn(false)
                setTimeout(() => setCheckInResult(null), 4000)
                return
            }

            // 2. Check for existing stamp at this locale
            const alreadyStamped = stamps.some(s => s.localeId === locale.id)
            if (alreadyStamped) {
                setCheckInResult('already')
                setCheckingIn(false)
                setTimeout(() => setCheckInResult(null), 4000)
                return
            }

            // 3. Add the new stamp
            const newStamp: Stamp = {
                localeId: locale.id,
                localeName: locale.name,
                localeCategory: locale.category,
                localeImage: locale.image_url,
                localeAddress: locale.address,
                visitedAt: serverTimestamp(),
                coordinates: { lat: latitude, lng: longitude },
            }

            const passportRef = doc(db, 'passports', user.uid)
            const snap = await getDoc(passportRef)

            if (snap.exists()) {
                const existing = snap.data() as Passport
                await setDoc(passportRef, {
                    ...existing,
                    stamps: [...(existing.stamps ?? []), newStamp],
                    totalVisits: (existing.totalVisits ?? 0) + 1,
                    lastVisitAt: serverTimestamp(),
                })
            } else {
                await setDoc(passportRef, {
                    uid: user.uid,
                    stamps: [newStamp],
                    totalVisits: 1,
                    createdAt: serverTimestamp(),
                    lastVisitAt: serverTimestamp(),
                })
            }

            setCheckInResult('success')
            setTimeout(() => setCheckInResult(null), 5000)
        } catch (err) {
            console.error('[usePassport] check-in error:', err)
            setCheckInResult('error')
            setTimeout(() => setCheckInResult(null), 4000)
        } finally {
            setCheckingIn(false)
        }
    }, [user, stamps])

    const hasStamp = useCallback(
        (localeId: string) => stamps.some(s => s.localeId === localeId),
        [stamps]
    )

    return { stamps, loading, checkingIn, checkInResult, checkIn, hasStamp }
}
