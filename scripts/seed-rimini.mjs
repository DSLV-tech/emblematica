#!/usr/bin/env node
/**
 * seed-rimini.mjs
 *
 * Carica i locali storici di Rimini e provincia nella collection
 * `locales_rimini` di Firestore.
 *
 * Uso:
 *   node scripts/seed-rimini.mjs
 *   node scripts/seed-rimini.mjs --dry-run
 *   node scripts/seed-rimini.mjs --force      # sovrascrive documenti esistenti
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')
const COLLECTION = 'locales_rimini'

// ── Load service account ──────────────────────────────────────────────────────
const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
let serviceAccount
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
} catch {
    console.error('❌  Could not read service-account.json')
    process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ── Locali storici di Rimini e provincia ──────────────────────────────────────
// Fatti verificati su La Piazza Rimini (Albo delle Botteghe Storiche), italia.it, Il Giornale;
// coordinate da OpenStreetMap. Dove le fonti non danno un anno, founded_year è omesso.
const LOCALES = [
    {
        id: 'grand-hotel-rimini',
        name: 'Grand Hotel Rimini',
        category: 'bar',
        coordinates: { lat: 44.07273, lng: 12.57661 },
        address: 'Parco Federico Fellini, 47921 Rimini',
        description: 'Inaugurato nel 1908 e monumento nazionale: l\'albergo liberty che Fellini ha trasformato in un mito con Amarcord.',
        full_story: `Il Grand Hotel di Rimini viene inaugurato il 1° luglio 1908 sul lungomare, su progetto dell'architetto Paolo Somazzi. È il simbolo della stagione in cui la Riviera diventa una meta dell'alta società.

Federico Fellini, nato a Rimini, lo ha fatto entrare nell'immaginario di tutti: in Amarcord il Grand Hotel è il palazzo inaccessibile dei sogni di provincia. Dal 1994 l'albergo è riconosciuto monumento nazionale.

Nel 1963 l'hotel fu acquistato da Pietro Arpesella, e dal 2007 è della famiglia Batani. Oggi ospita anche l'Albergo dei Sogni, un percorso legato al Museo Fellini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Grand_Hotel_Rimini.jpg/960px-Grand_Hotel_Rimini.jpg',
        gallery: [],
        social: { website: 'https://www.grandhotelrimini.com' },
        founded_year: 1908,
        protected: true,
        city: 'Rimini',
    },
    {
        id: 'osteria-de-borg',
        name: 'Osteria de Borg',
        category: 'restaurant',
        coordinates: { lat: 44.06485, lng: 12.56344 },
        address: 'Via Forzieri, 12, 47921 Rimini',
        description: 'Nel Borgo San Giuliano, un\'osteria aperta nel 1989 in quella che negli anni Cinquanta era la casa del popolo del quartiere.',
        full_story: `La storia di Via Forzieri 12 comincia prima dell'osteria. Negli anni Cinquanta qui c'era il Circolo Primo Maggio, un ritrovo popolare dagli arredi spartani. Nel 1956 parte una raccolta fondi per una nuova casa del popolo, e nel dicembre 1957 nasce in questa sede la cooperativa ricreativa del Borgo San Giuliano.

L'edificio resta un luogo di incontro del quartiere fino agli anni Ottanta, poi viene venduto e trasformato. L'Osteria de Borg apre la vigilia di Natale del 1989.

Dal 2007 è guidata da Mirko Monari, Giuliano Canzian ed Enrica Mancini, e nel 2023 è entrata nell'Albo delle Botteghe Storiche di Rimini. Intorno c'è il Borgo San Giuliano, con le sue case colorate e i murales dedicati ai film di Fellini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Rimini_Borgo_San_Giuliano_1.jpg/960px-Rimini_Borgo_San_Giuliano_1.jpg',
        gallery: [],
        social: {},
        founded_year: 1989,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'panificio-cupioli',
        name: 'Panificio Cupioli',
        category: 'shop',
        coordinates: { lat: 44.05921, lng: 12.5719 },
        address: 'Via Michele Rosa, 25-27, 47921 Rimini',
        description: 'Davanti al mercato coperto dal dopoguerra: il forno aperto nel 1948 dai fratelli Arsildo e Giorgio Cupioli.',
        full_story: `Nel 1948 i fratelli Arsildo e Giorgio Cupioli, dopo tre anni passati a bottega per imparare il mestiere, prendono in affitto un panificio nel centro di Rimini. Arsildo è reduce dalla guerra, e i mulini forniscono la farina sulla fiducia. La farina costa 95 lire al chilo, il pane 105.

In quegli anni il forno cuoce anche il pane preparato in casa dalle famiglie. Quando Rimini comincia a scoprirsi turistica, il panificio inizia a rifornire alberghi e pubblici esercizi. Nei ricordi di famiglia resta la Mille Miglia, che attraversava il Borgo Sant'Andrea alle quattro del mattino.

Oggi il forno è portato avanti da Davide, figlio di Giorgio, e da Liana, figlia di Arsildo. Nel 2021 è diventato la 55ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Piazza_Cavour_%28Rimini%29.jpg/960px-Piazza_Cavour_%28Rimini%29.jpg',
        gallery: [],
        social: {},
        founded_year: 1948,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'ferramenta-dardari',
        name: 'Ferramenta Dardari',
        category: 'shop',
        coordinates: { lat: 44.05788, lng: 12.56603 },
        address: 'Via Giuseppe Garibaldi, 111, 47921 Rimini',
        description: 'Una ferramenta con una storia centenaria, le porte in ferro del dopoguerra e una bilancia del 1940 ancora in uso.',
        full_story: `Prima della Seconda guerra mondiale Gualfardo Dardari lavora in Vicolo Amaduzzi. Dopo la guerra la bottega si sposta in Via Garibaldi e il figlio Arturo la amplia, specializzandosi nella duplicazione delle chiavi.

Dentro si è conservato quasi tutto: le porte costruite con ferro di recupero del dopoguerra, cassetti e scaffali originali e una bilancia Pastore modello B2 del 1940, con cui si vende ancora la ferramenta a peso.

Dal 1994 la conduce Alfonso Montanari, genero di Arturo. Nel 2022 è diventata la 68ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Piazza_Cavour_%28Rimini%29_lato_nord-ovest.jpg/960px-Piazza_Cavour_%28Rimini%29_lato_nord-ovest.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'casina-del-bosco',
        name: 'La Casina del Bosco',
        category: 'bar',
        coordinates: { lat: 44.07057, lng: 12.57694 },
        address: 'Viale Antonio Beccadelli, 15, 47921 Rimini',
        description: 'Alla fine degli anni Quaranta qui si ballava il liscio. Oggi è una piadineria di Marina Centro, sotto la stessa insegna.',
        full_story: `Alla fine degli anni Quaranta La Casina del Bosco era una sala da ballo, dove si danzava il liscio sotto la stessa insegna che si vede ancora oggi.

In seguito è diventata un bar, ha continuato a servire la piadina romagnola ed è ormai una piadineria molto conosciuta di Marina Centro, citata da riviste italiane e straniere e nel libro "Mi manca la tua voce".

Dal 1995 la gestisce Barbara Casali con il marito Aris, la madre Adele e i figli. Nel 2024 è diventata la 92ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Federico_Fellini_parco_Rimini.jpg/960px-Federico_Fellini_parco_Rimini.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'osteria-grotta-rossa',
        name: 'Osteria Grotta Rossa',
        category: 'restaurant',
        coordinates: { lat: 44.03766, lng: 12.55409 },
        address: 'Via della Grotta Rossa, 13, 47923 Rimini',
        description: 'Già nel 1897 serviva vino e salumi sulla strada per San Marino. Qui Fellini e Giulietta Masina mangiavano la pasta e fagioli.',
        full_story: `Una trattoria con questo nome esisteva già nel 1897, e offriva vino, salumi e formaggi a chi viaggiava tra Rimini e San Marino. Il nome viene da due grotte vicine, verso il colle di Covignano, da cui usciva l'acqua piovana arrossata dalla terra. Durante la guerra furono usate come rifugio.

All'inizio degli anni Novanta, quando Federico Fellini e Giulietta Masina arrivavano al Grand Hotel, Pietro Arpesella telefonava qui per ordinare la pasta e fagioli.

Oggi l'osteria è portata avanti da Simone e Cristian, figli del titolare Tarcisio, con la pasta fresca fatta in casa ogni giorno. Nel 2024 è diventata la 91ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Santuario_di_Santa_Maria_delle_Grazie%2C_facciata%2C_dettaglio_%28Covignano%2C_Rimini%29_01.jpg/960px-Santuario_di_Santa_Maria_delle_Grazie%2C_facciata%2C_dettaglio_%28Covignano%2C_Rimini%29_01.jpg',
        gallery: [],
        social: {},
        founded_year: 1897,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'trattoria-al-coniglio',
        name: 'Trattoria Al Coniglio',
        category: 'restaurant',
        coordinates: { lat: 43.99879, lng: 12.54183 },
        address: 'Via Consolare Rimini-San Marino, 162, 47923 Rimini',
        description: 'Nata negli anni Cinquanta per sfamare gli operai della superstrada per San Marino, con il coniglio di nonna Fina.',
        full_story: `Negli anni Cinquanta Giuseppina Mattei, per tutti Fina, cucinava il coniglio per gli operai che costruivano la superstrada tra Rimini e San Marino. Quella ricetta è rimasta la stessa ed è diventata il nome del locale.

All'epoca era una sosta obbligata per chi viaggiava: c'erano un distributore di carburante, oggi scomparso, e la vendita di sali, tabacchi e drogheria. Una fotografia del 1958 ritrae nonna Fina con la famiglia davanti alla porta.

L'attività è passata ai figli Ettore, Walter ed Enzo, e oggi la portano avanti i nipoti Raffaello e Annalisa con la madre Brunella. Nel 2024 è diventata la 93ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Piazza_Cavour_Rimini_notte.jpg/960px-Piazza_Cavour_Rimini_notte.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'farmacia-cantelli',
        name: 'Farmacia Cantelli',
        category: 'pharmacy',
        coordinates: { lat: 44.05911, lng: 12.56841 },
        address: 'Piazza Tre Martiri, 11, 47921 Rimini',
        description: 'Le sue origini risalgono almeno al 1835: un\'antica farmacia di Piazza Tre Martiri sopravvissuta ai bombardamenti della guerra.',
        full_story: `La farmacia è documentata almeno dal 1835, quando viene citata in una causa del Tribunale della Sacra Consulta. Sulle vecchie etichette di laboratorio si legge ancora "Antica Farmacia Sensoli del Dott. Cantelli".

Una fotografia del 1943 la mostra in un palazzo di Piazza Tre Martiri, uno degli edifici sopravvissuti ai bombardamenti. La famiglia Cantelli entra nell'attività con Pilade Cantelli, e nel 1953, completato il palazzo progettato da Giuseppe Maioli, la farmacia si trasferisce al civico 11, dove si trova ancora.

Oggi la guida Ruggero Cantelli con il figlio Riccardo, ed è iscritta all'Albo delle Botteghe Storiche di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Piazza_Tre_Martiri_Rimini.jpg/960px-Piazza_Tre_Martiri_Rimini.jpg',
        gallery: [],
        social: {},
        founded_year: 1835,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'merceria-cheri',
        name: 'Merceria Cheri',
        category: 'shop',
        coordinates: { lat: 44.05856, lng: 12.56724 },
        address: 'Via Giuseppe Garibaldi, 43, 47921 Rimini',
        description: 'Dal 1957 bottoni, nastri e passamanerie in un palazzo ottocentesco: nata per sarte e ricamatrici, è passata di madre in figlia.',
        full_story: `La Merceria Cheri apre nel 1957 per iniziativa di Liliana Urbinati, in un elegante palazzo ottocentesco di Via Garibaldi. All'inizio è il punto di riferimento di sarti e di chi cuce o ricama in casa.

L'attività è poi proseguita con le figlie Nadia e Maria Gabriella. Oggi vende bottoni, perline, passamanerie, nastri e fodere, insieme a borse, guanti, scialli e cappelli.

È iscritta all'Albo delle Botteghe Storiche di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Italia-Rimini-Piazza_tre_martiri-Kiosik.jpg/960px-Italia-Rimini-Piazza_tre_martiri-Kiosik.jpg',
        gallery: [],
        social: {},
        founded_year: 1957,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'le-cornici-piazza-mazzini',
        name: 'Le Cornici di Piazza Mazzini',
        category: 'shop',
        coordinates: { lat: 44.0568, lng: 12.56455 },
        address: 'Piazza Mazzini, 1, 47923 Rimini',
        description: 'Laboratorio attivo dal 1967 nel Borgo Sant\'Andrea: dal suo banco sono passati i bozzetti di Fellini e opere di Guttuso.',
        full_story: `La prima traccia ufficiale è una visura del febbraio 1967, che autorizza la lavorazione di cornici sotto il nome di "Cornici d'arte". A fondare il laboratorio è Guido Lazzarini, che lo lascia poi al figlio Giuseppe.

Dal 1990 lo conduce per 33 anni Roberto Visanti, e dal 2023 Andrea Mazzotti, che ha imparato il mestiere da lui.

In oltre mezzo secolo nella stessa piazza sono passati dal banco bozzetti di Fellini oggi esposti al Museo Fellini, stampe del Settecento e opere di pittori del Novecento come Renato Guttuso. Nel 2023 è diventato la 76ª Bottega Storica di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Piazza_Tre_Martiri%2C_Rimini._Particolare_della_pavimentazione.jpg/960px-Piazza_Tre_Martiri%2C_Rimini._Particolare_della_pavimentazione.jpg',
        gallery: [],
        social: {},
        founded_year: 1967,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'osteria-da-biagio',
        name: 'Osteria Da Biagio',
        category: 'restaurant',
        coordinates: { lat: 44.05348, lng: 12.57217 },
        address: 'Via Circonvallazione Meridionale, 28, 47923 Rimini',
        description: 'Fondata nel 1968 da Domenico e Bertina: mattoni a vista, utensili d\'epoca e ricette di famiglia appena fuori dal centro.',
        full_story: `L'osteria nasce nel 1968 per iniziativa di Domenico e Bertina, a pochi passi dal centro, vicino al Borgo San Giovanni. La cucina si basa sulle ricette di famiglia, aggiornate senza perdere il carattere della cucina di casa.

La ristrutturazione ha lasciato a vista i mattoni e gli utensili originali, dal passino al mestolo, mentre alle pareti compaiono i modi di dire romagnoli.

È iscritta all'Albo delle Botteghe Storiche di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Rimini_Cavour_Square.jpg/960px-Rimini_Cavour_Square.jpg',
        gallery: [],
        social: {},
        founded_year: 1968,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'trattoria-la-marianna',
        name: 'Trattoria La Marianna',
        category: 'restaurant',
        coordinates: { lat: 44.06444, lng: 12.56329 },
        address: 'Viale Tiberio, 19, 47921 Rimini',
        description: 'Una trattoria di pesce nel vecchio quartiere dei pescatori, subito dopo il Ponte di Tiberio, in un\'ex locanda.',
        full_story: `La Marianna si trova in Viale Tiberio, nel Borgo San Giuliano, l'antico quartiere dei pescatori, appena oltre il Ponte di Tiberio. Le guide la descrivono come un'ex locanda che accoglie viaggiatori da oltre un secolo, anche se altre fonti datano la trattoria agli anni Sessanta.

È un ristorante di pesce, legato alla figura di Enrica Mancini, storica azdora del locale, ed è entrato nella Guida Michelin.

È iscritta all'Albo delle Botteghe Storiche di Rimini.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ponte_di_Tiberio_Rimini_2.jpg/960px-Ponte_di_Tiberio_Rimini_2.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Rimini',
    },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n🏛️  Seed Rimini — collection: ${COLLECTION}`)
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
            console.log(`  ⏭️  Skip (già presente): ${locale.name}`)
            skipped++
            continue
        }

        await docRef.set(data, { merge: !force })
        console.log(`  ✅ ${snap.exists ? 'Aggiornato' : 'Aggiunto'}: ${locale.name}`)
        snap.exists ? updated++ : added++
    }

    console.log(`\n📊 Riepilogo:`)
    if (!isDryRun) {
        console.log(`   Aggiunti:    ${added}`)
        console.log(`   Aggiornati:  ${updated}`)
        console.log(`   Saltati:     ${skipped}`)
    } else {
        console.log(`   Da inserire: ${added}`)
    }
    console.log()
    process.exit(0)
}

main().catch(err => {
    console.error('❌ Errore:', err)
    process.exit(1)
})
