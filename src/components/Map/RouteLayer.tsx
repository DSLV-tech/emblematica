'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { UserPosition } from '../../hooks/useRouting'

interface RouteLayerProps {
    geoJsonRoute: any | null   // GeoJSON from OSRM
    userPosition: UserPosition | null
    destLat: number
    destLng: number
}

// Shows the polyline route and the user GPS dot on the Leaflet map
export default function RouteLayer({ geoJsonRoute, userPosition, destLat, destLng }: RouteLayerProps) {
    const map = useMap()

    useEffect(() => {
        if (!geoJsonRoute || !userPosition) return

        const layers: L.Layer[] = []

        // Route polyline — animated dashed gold line
        const routeLine = L.geoJSON(geoJsonRoute, {
            style: {
                color: '#B8860B',
                weight: 6,
                opacity: 0.85,
                dashArray: '12 8',
                lineCap: 'round',
                lineJoin: 'round',
            },
        }).addTo(map)
        layers.push(routeLine)

        // User dot
        const userIcon = L.divIcon({
            className: '',
            html: `
        <div style="
          width:20px;height:20px;border-radius:50%;
          background:#4285F4;border:3px solid white;
          box-shadow:0 0 0 6px rgba(66,133,244,0.25);
        "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        })
        const userMarker = L.marker([userPosition.lat, userPosition.lng], { icon: userIcon }).addTo(map)
        layers.push(userMarker)

        // Fit bounds to show the full route
        const bounds = routeLine.getBounds().extend([userPosition.lat, userPosition.lng])
        map.fitBounds(bounds, { padding: [60, 60] })

        return () => {
            layers.forEach(l => map.removeLayer(l))
        }
    }, [geoJsonRoute, userPosition, map, destLat, destLng])

    return null
}
