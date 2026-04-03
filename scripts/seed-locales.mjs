#!/usr/bin/env node
/**
 * seed-locales.mjs
 *
 * Carica i locali di Barcellona nella collection `locales` di Firestore.
 * Eseguilo una volta dopo aver deployato le Firestore rules.
 *
 * Setup:
 *   1. Firebase Console → Project Settings → Service Accounts
 *      → "Generate new private key" → salva come `service-account.json` nella root del progetto
 *      (NON committare service-account.json su git!)
 *   2. npm install firebase-admin  (già in devDependencies se presente)
 *
 * Uso:
 *   node scripts/seed-locales.mjs
 *
 * Opzioni:
 *   --dry-run     Mostra cosa verrebbe scritto senza toccare Firestore
 *   --force       Sovrascrive documenti esistenti (default: salta se già presenti)
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')

// ── Load service account ─────────────────────────────────────────────────────
const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
let serviceAccount
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
} catch {
    console.error('❌  Could not read service-account.json')
    console.error('    Firebase Console → Project Settings → Service Accounts → Generate new private key')
    process.exit(1)
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

// ── Locali di Barcellona ──────────────────────────────────────────────────────
const LOCALES = [
    {
        id: 'els-quatre-gats',
        name: 'Els Quatre Gats',
        category: 'bar',
        coordinates: { lat: 41.38417, lng: 2.17097 },
        description: "Il leggendario café modernista dove si riuniva l'élite artistica catalana.",
        full_story: `Els Quatre Gats aprì le sue porte nel 1897 al Carrer de Montsió 3, nel cuore del Barri Gòtic. Fondato da Pere Romeu, Manuel Pallarès, Santiago Rusiñol e Miquel Utrillo, divenne immediatamente il punto di incontro dell'avanguardia artistica catalana.

L'edificio, progettato dall'architetto Josep Puig i Cadafalch in puro stile gotico catalano, ospitò la prima mostra del giovane Pablo Picasso nel 1900. Tra quelle mura si respira ancora l'eco delle conversazioni tra Picasso, Gaudí, Utrillo e Rusiñol, che qui tracciarono le linee del Modernisme catalano.

Il nome "Quattro Gatti" è un'espressione catalana che significa "quattro persone in tutto" – un'ironica allusione alla cerchia ristretta ma influente dei suoi frequentatori. Chiuso nel 1903, riaperto nel 1978, oggi il locale conserva arredi d'epoca e una collezione di stampe originali che raccontano la sua storia gloriosa.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Els_Quatre_Gats_%28Barcelona%29.jpg/800px-Els_Quatre_Gats_%28Barcelona%29.jpg',
        gallery: [],
        social: {},
        address: 'Carrer de Montsió, 3 bis, 08002 Barcelona',
        protected: true,
        founded_year: 1897,
        city: 'Barcelona',
    },
    {
        id: 'bar-marsella',
        name: 'Bar Marsella',
        category: 'bar',
        coordinates: { lat: 41.38073, lng: 2.17311 },
        description: 'Il bar più antico di Barcellona, aperto ininterrottamente dal 1820.',
        full_story: `Bar Marsella è il locale più antico di Barcellona ancora operativo. Aperto nel 1820 da un emigrato marsigliese nel cuore del Raval, ha attraversato quasi due secoli di storia catalana senza mai chiudere i battenti.

Le bottiglie impolverate sugli scaffali – alcune risalenti al XIX secolo – e i vecchi specchi ossidati raccontano storie di marinai, artisti e rivoluzionari. Ernest Hemingway, Pablo Picasso e Joan Miró frequentarono questo locale, attirati dalla sua celebre assenzio e dall'atmosfera senza tempo.

La famiglia Lamiel gestisce il bar da generazioni, custodendo gelosamente l'autenticità di uno spazio che sembra fermo nel tempo. Le pareti ingiallite, i lampadari di cristallo e l'aroma acre dell'assenzio creano un'atmosfera unica e irripetibile nel panorama dei locali barcellonesi.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bar_Marsella_Barcelona.jpg/800px-Bar_Marsella_Barcelona.jpg',
        gallery: [],
        social: {},
        address: 'Carrer de Sant Pau, 65, 08001 Barcelona',
        protected: true,
        founded_year: 1820,
        city: 'Barcelona',
    },
    {
        id: 'escriba-pastisseria',
        name: 'Escribà Pastisseria',
        category: 'shop',
        coordinates: { lat: 41.38224, lng: 2.17189 },
        description: 'Pasticceria modernista su La Rambla, un gioiello Art Nouveau dal 1906.',
        full_story: `La Pastisseria Escribà occupa uno degli edifici più belli della Rambla: la Casa Figueres, costruita nel 1902 con una facciata in ceramica policroma firmata dall'architetto Antoni Ros i Güell. Dal 1906 la famiglia Escribà trasforma questo spazio in un tempio del dolce artigianale.

Antoni Escribà, "il mago del cioccolato", portò la pasticceria catalana alla ribalta internazionale. Le sue sculture in cioccolato – automobiliste, animali, cattedrali – sono diventate opere d'arte. La boutique conserva le vetrine originali in legno intagliato, i mosaici floreali e gli stucchi dorati che la rendono uno dei negozi storici più belli d'Europa.

Oggi Christian Escribà, quarta generazione, continua la tradizione con creazioni d'avanguardia che rispettano le ricette originali tramandate in famiglia.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pastisseria_Escriba_Barcelona.jpg/800px-Pastisseria_Escriba_Barcelona.jpg',
        gallery: [],
        social: { website: 'https://www.escriba.es' },
        address: 'La Rambla, 83, 08002 Barcelona',
        protected: true,
        founded_year: 1906,
        city: 'Barcelona',
    },
    {
        id: 'farmacia-bolos',
        name: 'Farmàcia Bolós',
        category: 'pharmacy',
        coordinates: { lat: 41.38561, lng: 2.16802 },
        description: 'Farmacia modernista con interni originali del 1896, patrimonio della città.',
        full_story: `La Farmàcia Bolós al Carrer de Canuda conserva uno degli interni farmaceutici più intatti di tutta la Catalogna. Aperta nel 1880 e riallestita nel 1896 in stile modernista, mantiene i mobili in legno di noce originali, gli scaffali con i barattoli in ceramica bianca e i cassettieri in mogano con le etichette scritte a mano in latino.

La farmacia è rimasta nella stessa famiglia per quattro generazioni. Il fondatore Miquel Bolós, appassionato di botanica, creò una serie di preparazioni erboristiche che ancora oggi vengono vendute con le ricette originali.

Nel 2003 il Comune di Barcellona ha dichiarato la farmacia "Element d'Interès Local", riconoscendo il suo valore storico e architettonico.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Farmacia_Antiga_de_la_Boqueria.jpg/800px-Farmacia_Antiga_de_la_Boqueria.jpg',
        gallery: [],
        social: {},
        address: 'Carrer de Canuda, 6, 08002 Barcelona',
        protected: true,
        founded_year: 1880,
        city: 'Barcelona',
    },
    {
        id: 'mercat-boqueria',
        name: 'Mercat de la Boqueria',
        category: 'shop',
        coordinates: { lat: 41.38174, lng: 2.17171 },
        description: 'Il mercato coperto più famoso di Barcellona, aperto dal 1840 sulla Rambla.',
        full_story: `Il Mercat de Sant Josep de la Boqueria è uno dei mercati coperti più famosi del mondo. Sorge sul sito di un antico convento carmelitano demolito durante i tumulti del 1835. La struttura attuale, con la spettacolare entrata neogotica su La Rambla e il tetto in ferro e vetro, fu completata nel 1840.

Per barcellonesi e catalani, la Boqueria non è solo un mercato ma un'istituzione culturale. Le bancarelle di frutta tropicale con i loro mosaici di colori, i banconi di pesce fresco, i salumieri con le salsicce appese al soffitto: ogni angolo racconta secoli di tradizione gastronomica catalana.

Oggi, nonostante la pressione del turismo, i vecchi bancarellai resistono accanto alle nuove attività, mantenendo vivo il DNA originale del mercato.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/La_Boqueria_in_Barcelona.jpg/800px-La_Boqueria_in_Barcelona.jpg',
        gallery: [],
        social: { website: 'https://www.boqueria.barcelona' },
        address: 'La Rambla, 91, 08001 Barcelona',
        protected: true,
        founded_year: 1840,
        city: 'Barcelona',
    },
    {
        id: 'gran-cafe',
        name: 'Gran Café',
        category: 'bar',
        coordinates: { lat: 41.38326, lng: 2.17468 },
        description: 'Storico caffè neoclassico nel Barri Gòtic, ritrovo della borghesia barcellonese.',
        full_story: `Il Gran Café al Carrer dels Escudellers è un'istituzione del Barri Gòtic. Aperto nella seconda metà dell'Ottocento in un palazzo neoclassico, ha visto passare generazioni di barcellonesi: dalla borghesia dell'epoca coloniale agli intellettuali del Novecento.

L'interno conserva il bancone in marmo originale, le specchiere che moltiplicano lo spazio, i lampadari di cristallo e i tavolini in ghisa. Il soffitto affrescato con scene mitologiche fu restaurato negli anni '90 riportando alla luce colori vivaci coperti da decenni di fumo e polvere.

Il caffè è famoso per il suo cortado servito nel bicchierino di vetro secondo la tradizione catalana, e per le terrazze che si affacciano sull'animata piazza.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Cafe_de_la_Academia_Barcelona.jpg/800px-Cafe_de_la_Academia_Barcelona.jpg',
        gallery: [],
        social: {},
        address: "Carrer dels Escudellers, 5, 08002 Barcelona",
        protected: false,
        founded_year: 1870,
        city: 'Barcelona',
    },
    {
        id: 'llibreria-farre',
        name: 'Llibreria Antiquaria Farré',
        category: 'bookshop',
        coordinates: { lat: 41.38692, lng: 2.17234 },
        description: 'Libreria antiquaria fondata nel 1917 nel cuore del Barri Gòtic.',
        full_story: `La Llibreria Antiquaria Farré è una delle librerie antiquarie più antiche di Barcellona. Fondata nel 1917 da Pere Farré al Carrer de la Palla – la strada delle librerie per eccellenza – è rimasta nella stessa famiglia per tre generazioni e mantiene intatti i suoi scaffali in legno originali carichi di volumi rari.

La specialità del negozio sono i libri catalani delle prime edizioni del Novecento, le cartoline d'epoca di Barcellona e le stampe della Renaixença. Il catalogo manoscritto, tenuto aggiornato dal fondatore e poi dai suoi eredi, è considerato un documento storico in sé.

Josep Farré, nipote del fondatore, racconta di aver visto passare tra quelle pareti personalità come Jorge Luis Borges e quasi tutti i grandi narratori catalani del Novecento.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Carrer_de_la_Palla_Barcelona.jpg/800px-Carrer_de_la_Palla_Barcelona.jpg',
        gallery: [],
        social: {},
        address: 'Carrer de la Palla, 23, 08002 Barcelona',
        protected: false,
        founded_year: 1917,
        city: 'Barcelona',
    },
    {
        id: 'gran-teatre-liceu',
        name: 'Gran Teatre del Liceu',
        category: 'shop',
        coordinates: { lat: 41.38087, lng: 2.17383 },
        description: "Il teatro dell'opera più famoso della Catalogna, ricostruito dopo l'incendio del 1994.",
        full_story: `Il Gran Teatre del Liceu è uno dei teatri d'opera più importanti d'Europa e il cuore della vita culturale barcellonese. Inaugurato nel 1847 su La Rambla, è stato da sempre il tempio della borghesia catalana e il palcoscenico dove si sono esibiti i più grandi cantanti del mondo: Caruso, Callas, Pavarotti, Caballé.

La storia del Liceu è segnata da due tragedie: nel 1861 fu devastato da un incendio e ricostruito in appena un anno; nel 1994 un altro incendio distrusse la sala principale. La ricostruzione, completata nel 1999, è stata una prova di identità per la Catalogna: il teatro rinato è ancora più bello dell'originale, con la sala da 2.292 posti rifatta in seta dorata.

La Fundació del Gran Teatre del Liceu gestisce oggi il teatro con una programmazione di livello mondiale.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Gran_Teatre_del_Liceu_Barcelona.jpg/800px-Gran_Teatre_del_Liceu_Barcelona.jpg',
        gallery: [],
        social: { website: 'https://www.liceubarcelona.cat' },
        address: 'La Rambla, 51-59, 08002 Barcelona',
        protected: true,
        founded_year: 1847,
        city: 'Barcelona',
    },
    {
        id: 'can-sole',
        name: 'Can Solé',
        category: 'restaurant',
        coordinates: { lat: 41.37899, lng: 2.18563 },
        description: 'Ristorante di cucina marinara aperto nel 1903 alla Barceloneta.',
        full_story: `Can Solé è una delle istituzioni gastronomiche di Barcellona. Aperto nel 1903 alla Barceloneta da Ramon Solé, un pescatore con la passione per la cucina, il ristorante ha attraversato oltre un secolo di storia barcellonese mantenendo intatta la sua anima marinara.

Le pareti tappezzate di fotografie d'epoca, le botti di vino in legno, i tavoli ricoperti di carta bianca: Can Solé è rimasto fedele a se stesso mentre il quartiere cambiava intorno a lui. La zarzuela de mariscos, la paella con aragosta e il bacallà al pil-pil sono preparati con le ricette originali del fondatore, tramandate di padre in figlio.

Il ristorante è stato frequentato da Miró, Dalí, Hemingway e da tutti i presidenti della Generalitat di Catalogna.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Barceloneta_beach_Barcelona.jpg/800px-Barceloneta_beach_Barcelona.jpg',
        gallery: [],
        social: {},
        address: 'Carrer de Sant Carles, 4, 08003 Barcelona',
        protected: false,
        founded_year: 1903,
        city: 'Barcelona',
    },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
    console.log(`\n🌱  Emblematica — Seed script`)
    console.log(`    Collection: locales (Barcellona)`)
    console.log(`    Documenti: ${LOCALES.length}`)
    if (isDryRun) console.log('    Mode: DRY RUN (nessuna scrittura su Firestore)\n')
    else if (force) console.log('    Mode: FORCE (sovrascrive documenti esistenti)\n')
    else console.log('    Mode: SAFE (salta documenti già presenti)\n')

    const colRef = db.collection('locales')
    let written = 0, skipped = 0, errors = 0

    for (const locale of LOCALES) {
        const { id, ...data } = locale
        try {
            if (isDryRun) {
                console.log(`  [dry] ${id} — ${locale.name}`)
                written++
                continue
            }

            const docRef = colRef.doc(id)
            if (!force) {
                const snap = await docRef.get()
                if (snap.exists) {
                    console.log(`  ⏭️  skip  ${id} (già presente)`)
                    skipped++
                    continue
                }
            }

            await docRef.set(data)
            console.log(`  ✅  ok    ${id} — ${locale.name}`)
            written++
        } catch (err) {
            console.error(`  ❌  err   ${id} — ${err.message}`)
            errors++
        }
    }

    console.log(`\n📊  Riepilogo: ${written} scritti, ${skipped} saltati, ${errors} errori`)

    if (!isDryRun && written > 0) {
        console.log('\n🎉  Fatto! Ricarica l\'app — i locali appariranno sulla mappa.')
    }
    process.exit(errors > 0 ? 1 : 0)
}

seed().catch((err) => {
    console.error('❌  Errore inaspettato:', err)
    process.exit(1)
})
