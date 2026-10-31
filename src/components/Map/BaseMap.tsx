'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import '@maplibre/maplibre-gl-leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl, type Map as LibreMap } from 'maplibre-gl'

// maplibre 6 distribuisce il worker come file separato: va indicato al bundler
setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString())

// OpenFreeMap: tile vettoriali gratuiti, senza API key né limiti di utilizzo.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
const ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'

/* Palette "carta": sostituisce i grigi di Positron con i toni dell'app */
const PAPER: Record<string, [string, string]> = {
  background:             ['background-color', '#EFE7D8'],
  park:                   ['fill-color', '#E2E0CB'],
  landcover_wood:         ['fill-color', '#DCDBC4'],
  landuse_residential:    ['fill-color', '#EBE3D3'],
  building:               ['fill-color', '#E3D9C7'],
  water:                  ['fill-color', '#C5D2CF'],
  waterway:               ['line-color', '#C5D2CF'],
  road_area_pier:         ['fill-color', '#EFE7D8'],
  road_pier:              ['line-color', '#EFE7D8'],
  highway_path:           ['line-color', '#E6DCCB'],
  highway_minor:          ['line-color', '#F8F3EA'],
  highway_major_casing:   ['line-color', '#DCD0BC'],
  highway_major_inner:    ['line-color', '#FBF8F2'],
  highway_motorway_casing:['line-color', '#DCD0BC'],
  highway_motorway_inner: ['line-color', '#FBF8F2'],
  railway:                ['line-color', '#D6CCBA'],
  railway_transit:        ['line-color', '#D6CCBA'],
}

function applyPaper(map: LibreMap, lang: string) {
  for (const [id, [prop, value]] of Object.entries(PAPER)) {
    if (map.getLayer(id)) map.setPaintProperty(id, prop as never, value as never)
  }
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol') continue
    map.setPaintProperty(layer.id, 'text-color', '#6E6457')
    map.setPaintProperty(layer.id, 'text-halo-color', '#F4EDE1')
    // Etichette nella lingua dell'utente, con ripiego sul nome locale
    if (map.getLayoutProperty(layer.id, 'text-field') !== undefined && !layer.id.includes('shield')) {
      map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', `name:${lang}`], ['get', 'name:latin'], ['get', 'name']])
    }
  }
}

export default function BaseMap({ lang }: { lang: string }) {
  const map = useMap()

  useEffect(() => {
    const layer = L.maplibreGL({ style: STYLE_URL, attribution: ATTRIBUTION } as L.LeafletMaplibreGLOptions)
    layer.addTo(map)
    const gl = layer.getMaplibreMap()
    const onLoad = () => applyPaper(gl, lang)
    if (gl.isStyleLoaded()) onLoad()
    else gl.once('load', onLoad)
    return () => { layer.remove() }
  }, [map, lang])

  return null
}
