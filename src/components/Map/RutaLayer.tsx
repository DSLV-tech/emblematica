'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Locale } from '../../types'

const ROUTE_TIMEOUT_MS = 10_000

interface RutaLayerProps {
    stops: Locale[]
    color: string
}

// Disegna un percorso tematico: linea a piedi tra le tappe e numeri d'ordine
export default function RutaLayer({ stops, color }: RutaLayerProps) {
    const map = useMap()

    useEffect(() => {
        const points = stops.map(s => [s.coordinates.lat, s.coordinates.lng] as [number, number])
        const style = { color, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' } as const

        // Subito la linea retta, sostituita dal tracciato stradale appena arriva:
        // il percorso resta leggibile anche se il servizio di routing non risponde
        let line: L.Layer = L.polyline(points, { ...style, dashArray: '2 10' }).addTo(map)
        const numbers = stops.map((s, i) =>
            L.marker([s.coordinates.lat, s.coordinates.lng], {
                interactive: false,
                zIndexOffset: 1000,
                icon: L.divIcon({
                    className: '',
                    html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};color:#fff;border:2px solid #fff;font:700 11px/18px var(--font-sans);text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.35);">${i + 1}</div>`,
                    iconSize: [22, 22],
                    iconAnchor: [11, 58],
                }),
            }).addTo(map)
        )

        const request = new AbortController()
        const coords = stops.map(s => `${s.coordinates.lng},${s.coordinates.lat}`).join(';')
        fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coords}?geometries=geojson&overview=full`, {
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(ROUTE_TIMEOUT_MS)]),
        })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                const geometry = data?.routes?.[0]?.geometry
                if (!geometry || request.signal.aborted) return
                map.removeLayer(line)
                line = L.geoJSON(geometry, { style }).addTo(map)
            })
            .catch(() => {})

        return () => {
            request.abort()
            map.removeLayer(line)
            numbers.forEach(n => map.removeLayer(n))
        }
    }, [stops, color, map])

    return null
}
