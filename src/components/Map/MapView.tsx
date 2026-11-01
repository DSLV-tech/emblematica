'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Locale } from '../../types'
import { CornersOut, SealCheck } from '@phosphor-icons/react'
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
    ? '0 0 0 4px rgba(201,168,76,0.3), 0 10px 24px rgba(20,20,22,0.5), inset 0 1px 1px rgba(255,255,255,0.25)'
    : '0 3px 6px rgba(20,20,22,0.3), 0 8px 18px rgba(20,20,22,0.28), inset 0 1px 1px rgba(255,255,255,0.2)'

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
      <div class="map-pin${isSelected ? ' map-pin--selected' : ''}" style="position:relative;width:${size}px;height:${size}px;">
        <div class="map-pin__ground"></div>
        ${crownHtml}
        <div style="
          width:${size}px;height:${size}px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg)${isSelected ? ' scale(1.05)' : ''};
          background:linear-gradient(145deg,#2E2E34,#141416);
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
  })
}

const SELECTED_ZOOM = 16
const MAX_FRAME_ZOOM = 16
const SIDE_MARGIN = 48
const PIN_HEIGHT = 54
const DESKTOP_MIN_WIDTH = 768
const FRAME_DELAY_MS = 120 // raggruppa i cambi ravvicinati, come la digitazione nella ricerca

const motion = () => ({
  animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  duration: 0.8,
})

const headerHeight = () => document.querySelector('header')?.offsetHeight ?? 0

/** Inquadra tutti i locali, lasciando libera la parte coperta dall'header */
function frameLocales(map: L.Map, locales: Locale[]) {
  if (locales.length === 0) return
  const bounds = L.latLngBounds(locales.map(l => [l.coordinates.lat, l.coordinates.lng]))
  map.flyToBounds(bounds, {
    paddingTopLeft: [SIDE_MARGIN, headerHeight() + PIN_HEIGHT],
    paddingBottomRight: [SIDE_MARGIN, 96],
    maxZoom: MAX_FRAME_ZOOM,
    ...motion(),
  })
}

/** Porta il locale nella zona visibile: sopra il foglio su mobile, accanto alla scheda su desktop */
function focusLocale(map: L.Map, locale: Locale) {
  const zoom = Math.max(map.getZoom(), SELECTED_ZOOM)
  const { x: width, y: height } = map.getSize()
  const sheet = document.querySelector<HTMLElement>('[data-map-sheet]')
  const sheetRect = sheet?.getBoundingClientRect()

  let shift = L.point(0, 0)
  if (width >= DESKTOP_MIN_WIDTH) {
    shift = L.point(-((sheetRect?.width ?? 0) + 24) / 2, 0)
  } else {
    const visibleCenter = (headerHeight() + height - (sheet?.offsetHeight ?? 0)) / 2
    // Il pin cresce verso l'alto dal punto: non deve finire sotto il foglio
    shift = L.point(0, height / 2 - (visibleCenter + PIN_HEIGHT / 2))
  }

  const point = map.project([locale.coordinates.lat, locale.coordinates.lng], zoom).add(shift)
  map.flyTo(map.unproject(point, zoom), zoom, motion())
}

/**
 * Unico responsabile dell'inquadratura: con un locale selezionato segue quello,
 * altrimenti inquadra i risultati del filtro. Il percorso di navigazione ha
 * un'inquadratura propria (RouteLayer) e sospende quella dei risultati.
 */
function MapCamera({ locales, selected, routeActive }: { locales: Locale[]; selected: Locale | null; routeActive: boolean }) {
  const map = useMap()
  const latest = useRef({ locales, selected })
  latest.current = { locales, selected }

  const target = selected ? `locale:${selected.id}` : `list:${locales.map(l => l.id).join()}`

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = latest.current
      if (current.selected) focusLocale(map, current.selected)
      else if (!routeActive) frameLocales(map, current.locales)
    }, FRAME_DELAY_MS)
    return () => clearTimeout(timer)
  }, [map, target, routeActive])

  return null
}

const LocaleMarker = memo(function LocaleMarker({ locale, selected, onClick }: { locale: Locale; selected: boolean; onClick: (locale: Locale) => void }) {
  // Icona stabile: Leaflet ricrea il DOM a ogni setIcon, e l'ingresso del pin ripartirebbe
  const icon = useMemo(
    () => createCustomIcon(locale.category, selected, locale.protected, locale.image_url || undefined),
    [locale.category, selected, locale.protected, locale.image_url]
  )
  const eventHandlers = useMemo(() => ({ click: () => onClick(locale) }), [locale, onClick])

  return (
    <Marker
      position={[locale.coordinates.lat, locale.coordinates.lng]}
      icon={icon}
      title={locale.name}
      alt={locale.name}
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={eventHandlers}
    />
  )
})

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
  const [map, setMap] = useState<L.Map | null>(null)
  const routeActive = Boolean(routeGeoJson)
  const frameAll = useCallback(() => { if (map) frameLocales(map, locales) }, [map, locales])

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={setMap}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <BaseMap lang={lang} />

        <MapCamera locales={locales} selected={selectedLocale} routeActive={routeActive} />

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
          <LocaleMarker
            key={locale.id}
            locale={locale}
            selected={selectedLocale?.id === locale.id}
            onClick={onMarkerClick}
          />
        ))}
      </MapContainer>

      <div className="map-vignette" aria-hidden />

      {!selectedLocale && !routeActive && !ruta && locales.length > 0 && (
        <button
          onClick={frameAll}
          className="glass absolute end-4 z-10 flex items-center gap-2 h-11 ps-3 pe-4 rounded-full font-sans text-[13px] font-medium text-cream active:scale-[0.97] transition-transform animate-fade-in"
          style={{ bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 16px)' }}
        >
          <CornersOut size={18} className="text-gold" aria-hidden />
          {t('map.show_all')}
          <span className="text-cream/50 tabular-nums">{locales.length}</span>
        </button>
      )}
    </div>
  )
}
