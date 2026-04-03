'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Locale } from '../types'

const NEARBY_RADIUS_M = 80       // alert when within 80m of a locale
const COOLDOWN_MS = 5 * 60_000  // don't alert the same locale twice in 5 min

interface NearbyAlert {
    locale: Locale
    distance: number
}

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

export function useGeofencing(
    locales: Locale[],
    /** IDs of locales already stamped in passport — skip those */
    stampedIds: Set<string>,
    enabled: boolean
) {
    const [nearbyAlert, setNearbyAlert] = useState<NearbyAlert | null>(null)
    const [permissionState, setPermissionState] = useState<NotificationPermission>('default')
    const cooldownRef = useRef<Map<string, number>>(new Map())
    const watchIdRef = useRef<number | null>(null)

    // Check / request notification permission
    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
        if (Notification.permission !== 'default') {
            setPermissionState(Notification.permission)
            return Notification.permission
        }
        const result = await Notification.requestPermission()
        setPermissionState(result)
        return result
    }, [])

    const sendNotification = useCallback((locale: Locale, distance: number) => {
        // Show in-app alert regardless of notification permission
        setNearbyAlert({ locale, distance })
        // Auto-dismiss after 8 seconds
        setTimeout(() => setNearbyAlert(null), 8000)

        // Native push notification (only if permission granted)
        if (typeof window !== 'undefined' && Notification.permission === 'granted') {
            new Notification(`📍 Sei vicino a ${locale.name}!`, {
                body: `${Math.round(distance)}m · ${locale.description ?? locale.address}`,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-96.png',
                tag: `locale-${locale.id}`,
            })
        }
    }, [])

    useEffect(() => {
        if (!enabled || typeof navigator === 'undefined' || !navigator.geolocation) return

        const handlePosition = (pos: GeolocationPosition) => {
            const { latitude, longitude } = pos.coords
            const now = Date.now()

            for (const locale of locales) {
                // Skip if already in passport
                if (stampedIds.has(locale.id)) continue

                const dist = haversineMetres(
                    latitude, longitude,
                    locale.coordinates.lat, locale.coordinates.lng
                )

                if (dist <= NEARBY_RADIUS_M) {
                    const lastAlert = cooldownRef.current.get(locale.id) ?? 0
                    if (now - lastAlert > COOLDOWN_MS) {
                        cooldownRef.current.set(locale.id, now)
                        sendNotification(locale, dist)
                        break // one alert at a time
                    }
                }
            }
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            (err) => console.warn('[useGeofencing] GPS error:', err.message),
            { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
        )

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
        }
    }, [enabled, locales, stampedIds, sendNotification])

    const dismissAlert = useCallback(() => setNearbyAlert(null), [])

    return { nearbyAlert, permissionState, requestPermission, dismissAlert }
}
