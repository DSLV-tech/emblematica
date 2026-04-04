#!/usr/bin/env node
/**
 * enrich-images.mjs
 *
 * Per ogni locale nelle collezioni Firestore attive, se image_url è mancante
 * o vuoto, tenta di recuperare un'immagine dalla Wikipedia API.
 * Fallback: URL Unsplash generico per categoria.
 *
 * Uso:
 *   node scripts/enrich-images.mjs
 *   node scripts/enrich-images.mjs --dry-run    # mostra cosa farebbe senza scrivere
 *   node scripts/enrich-images.mjs --collection locales_rimini  # solo una collezione
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun   = process.argv.includes('--dry-run')
const colArg     = process.argv.indexOf('--collection')
const onlyCol    = colArg !== -1 ? process.argv[colArg + 1] : null

// Collezioni attive (available: true in cities.ts)
const ACTIVE_COLLECTIONS = ['locales', 'locales_rimini']

// Fallback Unsplash per categoria
const UNSPLASH_FALLBACK = {
  bar:        'https://source.unsplash.com/400x300/?historic,cafe,bar',
  restaurant: 'https://source.unsplash.com/400x300/?historic,restaurant,trattoria',
  bookshop:   'https://source.unsplash.com/400x300/?bookshop,library,historic',
  pharmacy:   'https://source.unsplash.com/400x300/?pharmacy,historic,apothecary',
  shop:       'https://source.unsplash.com/400x300/?historic,shop,boutique',
}

// ── Load service account ──────────────────────────────────────────────────────
const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
} catch {
  console.error('❌  Could not read service-account.json — provide the file first.')
  process.exit(1)
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

// ── Wikipedia image lookup ────────────────────────────────────────────────────
async function fetchWikipediaImage(name) {
  const encoded = encodeURIComponent(name)
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=400&redirects=1`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    const pages = data?.query?.pages ?? {}
    const page  = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

// ── Italian Wikipedia fallback ────────────────────────────────────────────────
async function fetchWikipediaImageIT(name) {
  const encoded = encodeURIComponent(name)
  const url = `https://it.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=400&redirects=1`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    const pages = data?.query?.pages ?? {}
    const page  = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const collections = onlyCol ? [onlyCol] : ACTIVE_COLLECTIONS

  let totalAlreadyPresent = 0
  let totalWikipedia      = 0
  let totalFallback       = 0
  let totalErrors         = 0

  for (const col of collections) {
    console.log(`\n📦  Collezione: ${col}`)
    const snap = await db.collection(col).get()

    if (snap.empty) {
      console.log(`   ⚠️  Vuota o inesistente — salto.`)
      continue
    }

    for (const docSnap of snap.docs) {
      const data = docSnap.data()
      const name = data.name ?? docSnap.id

      // Skip if already has a valid image_url
      if (data.image_url && data.image_url.startsWith('http')) {
        process.stdout.write(`   ✓  [già presente] ${name}\n`)
        totalAlreadyPresent++
        continue
      }

      process.stdout.write(`   🔍 ${name} ... `)

      // 1. Try English Wikipedia
      let imageUrl = await fetchWikipediaImage(name)
      let source   = 'wikipedia-en'

      // 2. Try Italian Wikipedia
      if (!imageUrl) {
        imageUrl = await fetchWikipediaImageIT(name)
        source   = 'wikipedia-it'
      }

      // 3. Fallback Unsplash per categoria
      if (!imageUrl) {
        const cat = data.category ?? 'bar'
        imageUrl  = UNSPLASH_FALLBACK[cat] ?? UNSPLASH_FALLBACK['bar']
        source    = 'unsplash-fallback'
      }

      console.log(`→ ${source}`)

      if (!isDryRun) {
        try {
          await db.collection(col).doc(docSnap.id).update({ image_url: imageUrl })
        } catch (err) {
          console.error(`   ❌  Errore scrittura Firestore per ${name}: ${err.message}`)
          totalErrors++
          continue
        }
      } else {
        console.log(`   [DRY-RUN] Avrei scritto: ${imageUrl.substring(0, 80)}...`)
      }

      if (source.startsWith('wikipedia')) totalWikipedia++
      else totalFallback++

      // Small delay to avoid hammering Wikipedia API
      await new Promise(r => setTimeout(r, 300))
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log('📊  Report finale:')
  console.log(`   ✅  Già presenti:       ${totalAlreadyPresent}`)
  console.log(`   🌐  Risolti Wikipedia:  ${totalWikipedia}`)
  console.log(`   🖼️   Fallback Unsplash:  ${totalFallback}`)
  if (totalErrors > 0)
    console.log(`   ❌  Errori Firestore:   ${totalErrors}`)
  if (isDryRun)
    console.log('\n   ℹ️  Modalità DRY-RUN — nessuna scrittura effettuata.')
  console.log('─'.repeat(50))
}

run().then(() => process.exit(0)).catch(err => {
  console.error('❌ Errore fatale:', err)
  process.exit(1)
})
