#!/usr/bin/env node
/**
 * patch-images.mjs
 *
 * Aggiorna solo il campo image_url sui documenti locales esistenti in Firestore.
 * Utile quando i documenti sono stati creati senza immagini.
 *
 * Uso:
 *   node scripts/patch-images.mjs
 *   node scripts/patch-images.mjs --dry-run
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')

const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
let serviceAccount
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
} catch {
    console.error('❌  Could not read service-account.json')
    process.exit(1)
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

// Mappa id → image_url
const IMAGE_PATCHES = {
    'els-quatre-gats':    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Els_Quatre_Gats_%28Barcelona%29.jpg/800px-Els_Quatre_Gats_%28Barcelona%29.jpg',
    'bar-marsella':       'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bar_Marsella_Barcelona.jpg/800px-Bar_Marsella_Barcelona.jpg',
    'escriba-pastisseria':'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pastisseria_Escriba_Barcelona.jpg/800px-Pastisseria_Escriba_Barcelona.jpg',
    'farmacia-bolos':     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Farmacia_Antiga_de_la_Boqueria.jpg/800px-Farmacia_Antiga_de_la_Boqueria.jpg',
    'mercat-boqueria':    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/La_Boqueria_in_Barcelona.jpg/800px-La_Boqueria_in_Barcelona.jpg',
    'gran-cafe':          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Cafe_de_la_Academia_Barcelona.jpg/800px-Cafe_de_la_Academia_Barcelona.jpg',
    'llibreria-farre':    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Carrer_de_la_Palla_Barcelona.jpg/800px-Carrer_de_la_Palla_Barcelona.jpg',
    'gran-teatre-liceu':  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Gran_Teatre_del_Liceu_Barcelona.jpg/800px-Gran_Teatre_del_Liceu_Barcelona.jpg',
    'can-sole':           'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Barceloneta_beach_Barcelona.jpg/800px-Barceloneta_beach_Barcelona.jpg',
}

async function patch() {
    console.log(`\n🖼️  Emblematica — Patch immagini`)
    console.log(`   Documenti da aggiornare: ${Object.keys(IMAGE_PATCHES).length}`)
    if (isDryRun) console.log('   Mode: DRY RUN\n')
    else console.log('   Aggiornamento image_url in corso...\n')

    const colRef = db.collection('locales')
    let updated = 0, skipped = 0, errors = 0

    for (const [id, imageUrl] of Object.entries(IMAGE_PATCHES)) {
        try {
            if (isDryRun) {
                console.log(`  [dry] ${id}`)
                updated++
                continue
            }

            const docRef = colRef.doc(id)
            const snap = await docRef.get()

            if (!snap.exists) {
                console.log(`  ⚠️  not found  ${id} (documento non esiste, esegui seed-locales prima)`)
                skipped++
                continue
            }

            const current = snap.data()?.image_url
            if (current && current.startsWith('http')) {
                // ha già un'immagine valida → salta
                console.log(`  ⏭️  skip  ${id} (image_url già presente)`)
                skipped++
                continue
            }

            await docRef.update({ image_url: imageUrl })
            console.log(`  ✅  ok    ${id}`)
            updated++
        } catch (err) {
            console.error(`  ❌  err   ${id} — ${err.message}`)
            errors++
        }
    }

    console.log(`\n📊  Riepilogo: ${updated} aggiornati, ${skipped} saltati, ${errors} errori`)
    if (!isDryRun && updated > 0) {
        console.log('🎉  Fatto! Le immagini appariranno nell\'app al prossimo caricamento.')
    }
    process.exit(errors > 0 ? 1 : 0)
}

patch().catch(err => {
    console.error('❌  Errore inaspettato:', err)
    process.exit(1)
})
