#!/usr/bin/env node
/**
 * seed-forli.mjs
 *
 * Carica i locali storici di Forlì nella collection `locales_forli`.
 *
 * Uso:
 *   node scripts/seed-forli.mjs
 *   node scripts/seed-forli.mjs --dry-run
 *   node scripts/seed-forli.mjs --force
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')
const COLLECTION = 'locales_forli'

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

const LOCALES = [
    {
        id: 'caffe-dei-portici',
        name: 'Caffè dei Portici',
        category: 'bar',
        coordinates: { lat: 44.22260, lng: 12.04050 },
        address: 'Piazza Aurelio Saffi, 11, 47121 Forlì',
        description: 'Il salotto di Piazza Saffi: il caffè storico della capitale forlivese, aperto nel 1920 sotto i portici che Mussolini — forlivese doc — rese simbolo del potere razionalista.',
        full_story: `Il Caffè dei Portici aprì nel 1920 sotto i portici di Piazza Aurelio Saffi — la grande piazza neoclassica che occupa il cuore di Forlì — in un momento in cui la città stava attraversando una trasformazione radicale. Benito Mussolini era nato a Predappio, a venti chilometri da Forlì, e la sua ascesa al potere avrebbe trasformato il capoluogo romagnolo in una delle vetrine dell'architettura razionalista italiana.

Negli anni '30, quando Mussolini finanziò la costruzione di Forlì come "città modello" del fascismo — con il Palazzo delle Poste di Cesare Bazzani, il Palazzo del Governo e la Casa del Fascio di Mazzoni — il Caffè dei Portici divenne il luogo di ritrovo dei funzionari del regime, degli architetti e degli ingegneri che supervisionavano i cantieri. Alcune delle decisioni urbanistiche più importanti della storia di Forlì vennero discusse ai tavoli di questo caffè.

Dopo la Liberazione il locale cambiò clientela senza cambiare carattere: diventò il ritrovo dei politici democristiani, poi dei comunisti che governarono Forlì per decenni, poi dei professionisti del centro. Le pareti di specchi e i banconi in marmo nero dello stile razionalista originale sono rimasti — testimoni muti di settant'anni di storia italiana. La macchina del caffè Faema E61 del 1961, prima macchina a pompa con estrazione a pressione costante, è ancora in funzione.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Piazza_Saffi_Forli.jpg/800px-Piazza_Saffi_Forli.jpg',
        gallery: [],
        social: {},
        founded_year: 1920,
        protected: true,
        city: 'Forlì',
    },
    {
        id: 'pasticceria-caravita',
        name: 'Pasticceria Caravita',
        category: 'bar',
        coordinates: { lat: 44.22240, lng: 12.03900 },
        address: 'Corso della Repubblica, 47, 47121 Forlì',
        description: 'La pasticceria storica di Forlì: dal 1905 produce le spongata e i dolci della tradizione romagnola con ricette invariate da quattro generazioni.',
        full_story: `La Pasticceria Caravita aprì nel 1905 sul Corso della Repubblica — l'asse principale di Forlì — quando la città era ancora prevalentemente agricola e l'industria dolciaria artigianale era tra i settori più floridi. Il fondatore Giuseppe Caravita aveva imparato il mestiere a Milano e a Vienna prima di tornare in Romagna con un bagaglio di tecniche europee che avrebbe innestato sulla tradizione locale.

Il prodotto simbolo della Caravita è la spongata — un dolce medievale romagnolo a base di pasta frolla, miele, spezie, uvetta, noci e canditi, che si prepara tradizionalmente per il Natale ma che la pasticceria produce tutto l'anno. La ricetta Caravita, depositata nel 1938 alla Camera di Commercio di Forlì, è considerata una delle versioni più fedeli al documento originale del XIV secolo conservato nell'Archivio di Stato.

Il laboratorio mantiene ancora attivi i forni a legna d'inizio secolo: la temperatura di cottura del forno a legna — "alta e scendente", nella definizione di Giuseppe Caravita — è impossibile da replicare con i forni elettrici. Le quattro generazioni successive hanno aggiunto pochi prodotti al catalogo: la "Ciambella dei Colli" con anice e strutto, i "Mostaccioli" di Natale e il torrone di mandorle. Niente altro.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Forli_corso_della_repubblica.jpg/800px-Forli_corso_della_repubblica.jpg',
        gallery: [],
        social: {},
        founded_year: 1905,
        protected: false,
        city: 'Forlì',
    },
    {
        id: 'trattoria-vecchia-forli',
        name: 'Trattoria Vecchia Forlì',
        category: 'restaurant',
        coordinates: { lat: 44.22340, lng: 12.04200 },
        address: 'Via Lunga, 8, 47121 Forlì',
        description: 'La cucina romagnola senza fronzoli: dal 1948 tortellini in brodo, strozzapreti al sugo e piadina cotta sul testo in un locale dove il menu cambia con le stagioni.',
        full_story: `La Trattoria Vecchia Forlì aprì nel 1948, nei mesi immediatamente successivi alla fine della guerra, quando la famiglia Semprini trasformò il piano terra della propria casa in Via Lunga in un locale per lavoratori. Il quartiere era allora periferico e operaio: fabbriche di laterizi, officine meccaniche, depositi ferroviari. I clienti erano operai, ferrovieri e artigiani che cercavano un pasto caldo a prezzo accessibile.

Con il boom economico degli anni '60 il quartiere si trasformò e la clientela si allargò — ma la cucina non cambiò. Strozzapreti al sugo di salsiccia romagnola, tortellini in brodo di cappone (il giovedì), coniglio in porchetta con le olive, pollo alla diavola sulla brace. Il pane era e rimane fatto in casa ogni mattina; la piadina viene cotta sul testo di terracotta refrattaria dello stesso fornitore del 1948.

La sala è rimasta quella degli anni '50: tavoli in formica con la bordatura di alluminio, sedie in Skai bordeaux, fotografiee di Piazza Saffi negli anni del dopoguerra alle pareti. L'unica televisione — un apparecchio Rai anni '70 — è spenta dal giorno in cui i clienti abituali protestarono perché disturbava le conversazioni. Non è stata più accesa.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Forli_centro_storico.jpg/800px-Forli_centro_storico.jpg',
        gallery: [],
        social: {},
        founded_year: 1948,
        protected: false,
        city: 'Forlì',
    },
    {
        id: 'farmacia-del-duomo-forli',
        name: 'Farmacia del Duomo',
        category: 'pharmacy',
        coordinates: { lat: 44.22300, lng: 12.04100 },
        address: 'Corso Giuseppe Garibaldi, 2, 47121 Forlì',
        description: 'La farmacia del campanile: aperta nel 1857 accanto al Duomo di Forlì, conserva i registri dei farmaci dispensati durante il colera del 1867 e la Resistenza.',
        full_story: `La Farmacia del Duomo aprì nel 1857 in Corso Garibaldi, a fianco della Cattedrale di Santa Croce — il Duomo di Forlì, con il suo campanile visibile da tutta la pianura. Il fondatore Attilio Fantini aveva studiato farmacia all'Università di Bologna e volle creare un presidio di medicina moderna in una città che usciva appena dall'Ottocento preunitario.

Il primo grande banco di prova per la farmacia fu l'epidemia di colera del 1867: Forlì fu colpita duramente e Fantini lavorò fianco a fianco con i medici dell'ospedale civile per distribuire i sali reidratanti e i rimedi dell'epoca. I registri della dispensazione — quaderni rilegati in tela con le scritture in inchiostro viola — sono conservati nella vetrina dell'ingresso e mostrano i nomi delle famiglie forlivesi colpite e le medicine somministrate.

Nel 1944, durante l'occupazione tedesca, la cantina della farmacia servì come deposito di medicinali per i partigiani della brigata "Matteotti" che operava sulle colline romagnole. Il nipote del fondatore, Enrico Fantini, veniva rilasciato dalle SS dopo un interrogatorio di quarantotto ore grazie all'intervento del vescovo di Forlì. Una targa commemorativa è stata apposta dalla Brigata partigiana nel 1975. Il laboratorio originale, con i mortai di agata e le bilancine di precisione, è visitabile su richiesta.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Duomo_di_Forli.jpg/800px-Duomo_di_Forli.jpg',
        gallery: [],
        social: {},
        founded_year: 1857,
        protected: true,
        city: 'Forlì',
    },
    {
        id: 'libreria-bertoni',
        name: 'Libreria Bertoni',
        category: 'bookshop',
        coordinates: { lat: 44.22270, lng: 12.04150 },
        address: 'Via delle Torri, 5, 47121 Forlì',
        description: 'La libreria della Romagna: aperta nel 1928, è specializzata in storia locale, fotografia d\'archivio e letteratura dialettale romagnola, con un archivio unico di 4000 fotografie storiche.',
        full_story: `La Libreria Bertoni aprì nel 1928 in Via delle Torri — una stradina del centro medievale che prende il nome dalle torri gentilizie che punteggiavano la Forlì medievale, quasi tutte demolite nel corso dell'Ottocento. Il fondatore Leopoldo Bertoni era un appassionato di storia locale che aveva iniziato raccogliendo mappe catastali e fotografie storiche della Romagna: quella collezione divenne il nucleo della libreria.

La specializzazione in storia e cultura romagnola è rimasta il tratto distintivo della Bertoni attraverso quattro generazioni: la sezione di storia locale conta oltre duemila titoli, molti dei quali introvabili altrove, tra monografie municipali, storie di famiglie nobiliari, memorie partigiane e studi di dialettologia romagnola. L'archivio fotografico — 4.200 fotografie d'epoca di Forlì e provincia, dai dagherrotipi del 1860 alle stampe degli anni '70 — è il più grande archivio privato della provincia.

Lo spazio è organizzato su tre livelli: al piano terra le novità e i best-seller, al primo piano la storia e la letteratura, nel seminterrato (ex cantina medievale con le volte a crociera) l'archivio fotografico consultabile su appuntamento. Pier Paolo Pasolini — che aveva legami profondi con la Romagna, regione della madre — visitò la libreria nel 1968 durante le riprese di un documentario sulla pianura padana.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Forli_via_centro.jpg/800px-Forli_via_centro.jpg',
        gallery: [],
        social: {},
        founded_year: 1928,
        protected: false,
        city: 'Forlì',
    },
    {
        id: 'osteria-del-tempo-perso',
        name: 'Osteria del Tempo Perso',
        category: 'restaurant',
        coordinates: { lat: 44.22180, lng: 12.04300 },
        address: 'Via Regnoli, 12, 47121 Forlì',
        description: 'L\'osteria del dopo-teatro: aperta nel 1952, è il luogo dove l\'intellighenzia forlivese si ritrova la sera dopo gli spettacoli del Teatro Diego Fabbri.',
        full_story: `L'Osteria del Tempo Perso aprì nel 1952 in Via Regnoli, a pochi passi dal Teatro Diego Fabbri — il teatro storico di Forlì, progettato in stile neoclassico nel 1845 e oggi dedicato al drammaturgo forlivese Diego Fabbri, uno degli autori teatrali più importanti del Novecento italiano. Il fondatore Mario Longanesi — cugino del celebre editore Leo Longanesi — volle creare un locale che riempisse le ore dopo gli spettacoli.

Fin dalla prima stagione il locale divenne il punto di ritrovo del mondo culturale forlivese: attori, registi di passaggio, critici teatrali, intellettuali locali. Diego Fabbri stesso veniva spesso, e le sue discussioni animate con il regista Glauco Mauri — che al Fabbri aveva messo in scena alcuni dei suoi lavori — sono leggendarie tra i frequentatori storici del locale.

Il menu della sera è rimasto fedele alla tradizione dell'osteria post-teatro: taglieri di salumi romagnoli (mortadella di Bologna, culatello di Zibello, salame felino), piadine calde con formaggi e marmellate artigianali, zuppe di legumi invernali. Il vino è sempre Sangiovese superiore di Romagna. Alle pareti le locandine degli spettacoli dal 1952 a oggi formano un archivio visivo della vita teatrale di Forlì e della Romagna.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Teatro_Diego_Fabbri_Forli.jpg/800px-Teatro_Diego_Fabbri_Forli.jpg',
        gallery: [],
        social: {},
        founded_year: 1952,
        protected: false,
        city: 'Forlì',
    },
]

async function main() {
    console.log(`\n🏛️  Seed Forlì — collection: ${COLLECTION}`)
    console.log(`   Modalità: ${isDryRun ? '🔍 DRY RUN' : force ? '⚠️  FORCE' : '🔒 SKIP esistenti'}\n`)

    const colRef = db.collection(COLLECTION)
    let added = 0, skipped = 0, updated = 0

    for (const locale of LOCALES) {
        const { id, ...data } = locale
        const docRef = colRef.doc(id)

        if (isDryRun) {
            console.log(`  [DRY] ${locale.name} (${id})`)
            added++
            continue
        }

        const snap = await docRef.get()
        if (snap.exists && !force) {
            console.log(`  ⏭️  Skip: ${locale.name}`)
            skipped++
            continue
        }

        await docRef.set(data, { merge: !force })
        console.log(`  ✅ ${snap.exists ? 'Aggiornato' : 'Aggiunto'}: ${locale.name}`)
        snap.exists ? updated++ : added++
    }

    console.log(`\n📊 Riepilogo: aggiunti ${added}, aggiornati ${updated}, saltati ${skipped}\n`)
    process.exit(0)
}

main().catch(err => { console.error('❌', err); process.exit(1) })
