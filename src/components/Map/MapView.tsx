'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Locale } from '../../types'
import { CATEGORY_ICONS } from '../../types'
import type { UserPosition } from '../../hooks/useRouting'
import RouteLayer from './RouteLayer'

// Fix default Leaflet icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createCustomIcon(category: string, isSelected: boolean, isProtected: boolean) {
  const emoji = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '📍'
  const size = isSelected ? 54 : 44

  const ringColor = isProtected ? '#B8860B' : '#8B6508'
  const ringWidth = isProtected ? (isSelected ? 4 : 3) : (isSelected ? 3 : 2)
  const bg = isSelected ? '#FFF8E7' : '#FFFFFF'
  const shadow = isSelected
    ? '0 6px 20px rgba(184,134,11,0.55)'
    : isProtected
      ? '0 3px 12px rgba(184,134,11,0.35)'
      : '0 2px 8px rgba(0,0,0,0.22)'

  const crownHtml = isProtected
    ? `<div style="
        position:absolute;top:-8px;left:50%;transform:translateX(-50%);
        font-size:${isSelected ? 13 : 11}px;line-height:1;
        filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3));
      ">👑</div>`
    : ''

  return L.divIcon({
    className: '',
    html: `
      <div style="
        position:relative;
        width:${size}px;height:${size}px;
      ">
        ${crownHtml}
        <div style="
          width:${size}px;height:${size}px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${bg};
          border:${ringWidth}px solid ${ringColor};
          box-shadow:${shadow};
          display:flex;align-items:center;justify-content:center;
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          ${isSelected ? 'transform:rotate(-45deg) scale(1.05);' : ''}
        ">
          <span style="transform:rotate(45deg);font-size:${isSelected ? 22 : 18}px;line-height:1;">
            ${emoji}
          </span>
        </div>
      </div>`,
    iconSize: [size, size + (isProtected ? 10 : 0)],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

function MapFlyTo({ locale }: { locale: Locale | null }) {
  const map = useMap()
  const prevId = useRef<string | null>(null)

  useEffect(() => {
    if (locale && locale.id !== prevId.current) {
      prevId.current = locale.id
      map.flyTo([locale.coordinates.lat, locale.coordinates.lng], 17, { duration: 0.8 })
    }
  }, [locale, map])

  return null
}

interface MapViewProps {
  locales: Locale[]
  selectedLocale: Locale | null
  onMarkerClick: (locale: Locale) => void
  routeGeoJson?: any | null
  userPosition?: UserPosition | null
  destLat?: number
  destLng?: number
}

export default function MapView({ locales, selectedLocale, onMarkerClick, routeGeoJson, userPosition, destLat, destLng }: MapViewProps) {
  return (
    <MapContainer
      center={[41.3851, 2.1734]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      <MapFlyTo locale={selectedLocale} />

      {routeGeoJson && userPosition && destLat !== undefined && destLng !== undefined && (
        <RouteLayer
          geoJsonRoute={routeGeoJson}
          userPosition={userPosition}
          destLat={destLat}
          destLng={destLng}
        />
      )}

      {locales.map((locale) => (
        <Marker
          key={locale.id}
          position={[locale.coordinates.lat, locale.coordinates.lng]}
          icon={createCustomIcon(locale.category, selectedLocale?.id === locale.id, locale.is_protected)}
          eventHandlers={{ click: () => onMarkerClick(locale) }}
        >
          <Popup>
            <div style={{ fontFamily: '"PT Sans", sans-serif' }}>
              <div style={{ fontWeight: 700, color: '#333333', marginBottom: 2 }}>{locale.name}</div>
              {locale.is_protected && (
                <div style={{ fontSize: 11, color: '#B8860B' }}>🏛️ Patrimonio Protetto</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
