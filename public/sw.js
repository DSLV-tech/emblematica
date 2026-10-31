// Service worker dell'app: nessuna dipendenza e nessun passo di build.
// Ogni host contattato con fetch da qui deve comparire in connect-src (next.config.ts).

const VERSION = 'v1'
const SHELL_CACHE = `shell-${VERSION}`
const STATIC_CACHE = `static-${VERSION}`
const FONTS_CACHE = `fonts-${VERSION}`
const TILES_CACHE = `tiles-${VERSION}`
const IMAGES_CACHE = `images-${VERSION}`
const ALL_CACHES = [SHELL_CACHE, STATIC_CACHE, FONTS_CACHE, TILES_CACHE, IMAGES_CACHE]

const MAX_TILES = 800
const MAX_IMAGES = 150

const SHELL_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
]

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']
const IMAGE_HOSTS = ['upload.wikimedia.org', 'images.unsplash.com']

const isStaticAsset = (url) => url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')
const isShellAsset = (url) => url.origin === self.location.origin && SHELL_URLS.includes(url.pathname) && url.pathname !== '/'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => !ALL_CACHES.includes(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  )
})

// Le immagini e i CSS arrivano in no-cors: la risposta opaca occuperebbe molta quota, quindi si richiede in CORS
const fetchCors = (request) => fetch(request.url, { mode: 'cors', credentials: 'omit' })

async function cacheFirst(request, cacheName, load = fetch) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request.url)
  if (cached) return cached
  const response = await load(request)
  if (response.ok) await cache.put(request.url, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName, load = fetch) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request.url)
  const refresh = load(request).then(async (response) => {
    if (response.ok) await cache.put(request.url, response.clone())
    return response
  })
  if (!cached) return refresh
  refresh.catch(() => {})
  return cached
}

// Una mappa fa decine di richieste al secondo: basta controllare i limiti ogni tanto
const TRIM_INTERVAL_MS = 60_000
const lastTrim = new Map()

async function trimCache(cacheName, max, canDelete = () => true) {
  if (Date.now() - (lastTrim.get(cacheName) ?? 0) < TRIM_INTERVAL_MS) return
  lastTrim.set(cacheName, Date.now())
  const cache = await caches.open(cacheName)
  const keys = (await cache.keys()).filter((key) => canDelete(key.url))
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)))
}

// Sempre la pagina più recente; senza rete l'ultima salvata, e solo in ultimo la pagina offline
async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put('/', response.clone())
    return response
  } catch {
    return (await cache.match('/')) ?? (await cache.match('/offline.html')) ?? Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(handleNavigation(request))
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isShellAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, SHELL_CACHE))
  } else if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request, FONTS_CACHE, fetchCors))
  } else if (url.hostname === 'tiles.openfreemap.org') {
    event.respondWith(staleWhileRevalidate(request, TILES_CACHE))
    // Solo i tile: stile, glifi e sprite servono a qualsiasi mappa
    event.waitUntil(trimCache(TILES_CACHE, MAX_TILES, (key) => key.endsWith('.pbf')))
  } else if (IMAGE_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, fetchCors))
    event.waitUntil(trimCache(IMAGES_CACHE, MAX_IMAGES))
  }
  // Firestore, Auth e il calcolo dei percorsi restano fuori: hanno bisogno della rete o di cache proprie
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS' || !Array.isArray(event.data.urls)) return

  const pending = []
  for (const value of event.data.urls) {
    const url = new URL(value, self.location.origin)
    if (isStaticAsset(url)) pending.push(cacheFirst(new Request(url), STATIC_CACHE))
    else if (FONT_HOSTS.includes(url.hostname)) pending.push(cacheFirst(new Request(url), FONTS_CACHE, fetchCors))
  }
  event.waitUntil(Promise.allSettled(pending))
})
