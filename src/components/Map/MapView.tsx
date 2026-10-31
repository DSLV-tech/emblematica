'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Locale } from '../../types'
import { SealCheck } from '@phosphor-icons/react'
import { categoryIconMarkup, iconMarkup } from '../UI/CategoryIcon'
import type { UserPosition } from '../../hooks/useRouting'
import RouteLayer from './RouteLayer'
import RutaLayer from './RutaLayer'
import BaseMap from './BaseMap'
import { useLanguage } from '../../context/LanguageContext'

// Fix default Leaflet icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CATEGORY_COLORS: Record<string, string> = {
  bar:        '#C9A84C',
  restaurant: '#C0552A',
  bookshop:   '#5B8A72',
  pharmacy:   '#4A7FA5',
  shop:       '#8B6B9A',
}

function createCustomIcon(category: string, isSelected: boolean, isProtected: boolean, imageUrl?: string) {
  const size = isSelected ? 54 : 44
  const ringColor = isSelected || isProtected ? '#C9A84C' : (CATEGORY_COLORS[category] ?? '#85651C')
  const ringWidth = isSelected ? 3 : 2.5
  const shadow = isSelected
    ? '0 0 0 4px rgba(201,168,76,0.28), 0 8px 22px rgba(20,20,22,0.45)'
    : '0 4px 12px rgba(20,20,22,0.35)'

  // Patrimonio protetto: piccolo sigillo dorato in alto a destra
  const crownHtml = isProtected
    ? `<div style="
        position:absolute;top:-3px;right:-3px;z-index:1;
        width:${isSelected ? 18 : 16}px;height:${isSelected ? 18 : 16}px;border-radius:50%;
        background:#C9A84C;color:#141416;border:2px solid #141416;
        display:flex;align-items:center;justify-content:center;
      ">${iconMarkup(SealCheck, isSelected ? 12 : 11, '#141416', 'bold')}</div>`
    : ''

  const imgSize = Math.round(size * 0.78)

  // Inner content: real image if available, otherwise category icon
  const glyphSize = isSelected ? 24 : 20
  const glyph = `<span style="display:flex;transform:rotate(45deg);">${categoryIconMarkup(category, glyphSize, '#C9A84C')}</span>`
  const innerHtml = imageUrl
    ? `<img
        src="${imageUrl}"
        width="${imgSize}" height="${imgSize}"
        alt=""
        style="
          width:${imgSize}px;height:${imgSize}px;
          border-radius:50%;
          object-fit:cover;
          transform:rotate(45deg);
          display:block;
        "
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
      /><span style="display:none;">${glyph}</span>`
    : glyph

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${crownHtml}
        <div style="
          width:${size}px;height:${size}px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg)${isSelected ? ' scale(1.05)' : ''};
          background:#141416;
          border:${ringWidth}px solid ${ringColor};
          box-shadow:${shadow};
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        ">
          ${innerHtml}
        </div>
      </div>`,
    iconSize: [size, size],
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
  center?: { lat: number; lng: number }
  zoom?: number
  ruta?: { stops: Locale[]; color: string } | null
}

export default function MapView({ locales, selectedLocale, onMarkerClick, routeGeoJson, userPosition, destLat, destLng, center, zoom, ruta }: MapViewProps) {
  const mapCenter: [number, number] = center ? [center.lat, center.lng] : [41.3851, 2.1734]
  const mapZoom = zoom ?? 14
  const { lang, t } = useLanguage()

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <BaseMap lang={lang} />

      <MapFlyTo locale={selectedLocale} />

      {routeGeoJson && userPosition && destLat !== undefined && destLng !== undefined && (
        <RouteLayer
          geoJsonRoute={routeGeoJson}
          userPosition={userPosition}
          destLat={destLat}
          destLng={destLng}
        />
      )}

      {ruta && <RutaLayer stops={ruta.stops} color={ruta.color} />}

      {locales.map((locale) => (
        <Marker
          key={locale.id}
          position={[locale.coordinates.lat, locale.coordinates.lng]}
          icon={createCustomIcon(locale.category, selectedLocale?.id === locale.id, locale.protected, locale.image_url || undefined)}
          eventHandlers={{ click: () => onMarkerClick(locale) }}
        >
          <Popup>
            <div style={{ fontFamily: 'var(--font-sans)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#F4EDE1', marginBottom: 2 }}>{locale.name}</div>
              {locale.protected && (
                <div style={{ fontSize: 11, color: '#C9A84C' }}>{t('locale.protected')}</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
