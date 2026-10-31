'use client'

import { useState, useCallback, useRef } from 'react'
import type { TranslationKey } from '../i18n/translations'

const ROUTE_TIMEOUT_MS = 10_000

export interface RouteInfo {
    totalDistance: number // metres
    totalTime: number     // seconds
    steps: RouteStep[]
}

export interface RouteStep {
    /** Manovra come chiave i18n: il testo si compone in UI, nella lingua attiva */
    maneuver: TranslationKey
    road?: string
    distance: number
    time: number
    type: number
}

export interface UserPosition {
    lat: number
    lng: number
}

export function useRouting() {
    const [userPosition, setUserPosition] = useState<UserPosition | null>(null)
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
    const [routeGeoJson, setRouteGeoJson] = useState<any | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)
    const [locatingUser, setLocatingUser] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const requestRef = useRef<AbortController | null>(null)

    const locateUser = useCallback((): Promise<UserPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalizzazione non supportata da questo browser.'))
                return
            }
            setLocatingUser(true)
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const position: UserPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    setUserPosition(position)
                    setLocatingUser(false)
                    resolve(position)
                },
                (err) => {
                    setLocatingUser(false)
                    reject(new Error('Impossibile ottenere la tua posizione. Verifica i permessi di localizzazione.'))
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
            )
        })
    }, [])

    const startNavigation = useCallback(async (destLat: number, destLng: number) => {
        setError(null)
        // Una nuova richiesta sostituisce quella ancora in corso
        requestRef.current?.abort()
        const request = new AbortController()
        requestRef.current = request
        try {
            // Sempre una posizione fresca: chi cammina si sposta (la cache del browser dura 30s)
            const pos = await locateUser()
            setIsNavigating(true)
            // OSRM FOSSGIS con profilo pedonale (il server demo di OSRM calcola solo percorsi in auto)
            const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${pos.lng},${pos.lat};${destLng},${destLat}?steps=true&geometries=geojson&overview=full`
            const res = await fetch(url, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(ROUTE_TIMEOUT_MS)]) })
            if (!res.ok) throw new Error('Nessun percorso trovato.')
            const data = await res.json()
            if (data.code !== 'Ok' || !data.routes?.length) {
                throw new Error('Nessun percorso trovato.')
            }
            const route = data.routes[0]
            const steps: RouteStep[] = route.legs.flatMap((leg: any) =>
                leg.steps.map((step: any) => ({
                    maneuver: maneuverKey(step.maneuver.type, step.maneuver.modifier),
                    road: step.name || undefined,
                    distance: step.distance,
                    time: step.duration,
                    type: step.maneuver.type,
                }))
            )
            setRouteInfo({ totalDistance: route.distance, totalTime: route.duration, steps })
            setRouteGeoJson(route.geometry)
            return { route, userPosition: pos }
        } catch (err) {
            if (request.signal.aborted) return
            const msg = err instanceof Error ? err.message : 'Errore nel calcolo del percorso.'
            setError(msg)
            setIsNavigating(false)
            throw err
        }
    }, [locateUser])

    const stopNavigation = useCallback(() => {
        requestRef.current?.abort()
        setIsNavigating(false)
        setRouteInfo(null)
        setRouteGeoJson(null)
        setError(null)
    }, [])

    return { userPosition, routeInfo, routeGeoJson, isNavigating, locatingUser, error, startNavigation, stopNavigation, locateUser }
}

// OSRM maneuver type/modifier → chiave i18n `turn.*`
const MANEUVERS: Record<string, TranslationKey> = {
    'turn left': 'turn.turn_left',
    'turn right': 'turn.turn_right',
    'turn slight left': 'turn.slight_left',
    'turn slight right': 'turn.slight_right',
    'turn sharp left': 'turn.sharp_left',
    'turn sharp right': 'turn.sharp_right',
    'turn uturn': 'turn.uturn',
    'arrive': 'turn.arrive',
    'depart': 'turn.depart',
    'continue straight': 'turn.straight',
    'continue': 'turn.continue',
    'roundabout': 'turn.roundabout',
    'rotary': 'turn.roundabout',
    'merge': 'turn.merge',
    'fork left': 'turn.fork_left',
    'fork slight left': 'turn.fork_left',
    'fork right': 'turn.fork_right',
    'fork slight right': 'turn.fork_right',
    'end of road left': 'turn.end_left',
    'end of road right': 'turn.end_right',
}

function maneuverKey(type: string, modifier?: string): TranslationKey {
    return (modifier && MANEUVERS[`${type} ${modifier}`]) || MANEUVERS[type] || 'turn.continue'
}

export function formatDistance(metres: number): string {
    if (metres < 1000) return `${Math.round(metres)} m`
    return `${(metres / 1000).toFixed(1)} km`
}

export function formatTime(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)} sec`
    const mins = Math.round(seconds / 60)
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}min`
}
