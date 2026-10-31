#!/usr/bin/env node
/**
 * seed-bologna.mjs
 *
 * Carica i locali storici di Bologna nella collection `locales_bologna`.
 *
 * Uso:
 *   node scripts/seed-bologna.mjs
 *   node scripts/seed-bologna.mjs --dry-run
 *   node scripts/seed-bologna.mjs --force
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')
const COLLECTION = 'locales_bologna'

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

// Fatti verificati su Bologna Welcome, Gambero Rosso, Il Resto del Carlino, Dissapore;
// coordinate da OpenStreetMap. Dove le fonti non danno un anno, founded_year è omesso.
const LOCALES = [
    {
        id: 'osteria-del-sole',
        name: 'Osteria del Sole',
        category: 'bar',
        coordinates: { lat: 44.49379, lng: 11.34435 },
        address: 'Vicolo Ranocchi, 1/d, 40124 Bologna',
        description: 'Dal 1465 nel Quadrilatero: qui si serve solo vino, e il cibo si porta da fuori. Una regola rimasta intatta per secoli.',
        full_story: `L'Osteria del Sole viene fatta risalire al 1465 ed è considerata una delle osterie più antiche d'Italia. Si nasconde in Vicolo Ranocchi, un passaggio stretto del Quadrilatero, il mercato medievale di Bologna.

Nei secoli ha dato da bere ai pellegrini e ai familiari dei malati ricoverati nei vicini ospedali della Vita e della Morte, due istituzioni che segnavano la vita di questa parte della città.

La regola è la stessa di allora: l'osteria versa soltanto vino, e ognuno porta il proprio cibo. Per questo chi entra passa spesso prima dai banchi di salumi e formaggi delle strade intorno, poi si siede ai tavoli comuni con il suo cartoccio.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Osteria_del_Sole.jpg/960px-Osteria_del_Sole.jpg',
        gallery: [],
        social: {},
        founded_year: 1465,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'majani',
        name: 'Majani',
        category: 'shop',
        coordinates: { lat: 44.49136, lng: 11.34096 },
        address: 'Via de\' Carbonesi, 5, 40123 Bologna',
        description: 'La cioccolateria nata nel 1796 nella Bologna napoleonica, patria della Scorza e del Cremino Fiat.',
        full_story: `La storia di Majani comincia nel 1796, quando Francesco Majani avvia un piccolo laboratorio di cose dolci nel centro di Bologna, vicino alla Basilica di San Petronio, negli anni dell'arrivo delle truppe napoleoniche.

Il negozio di Via de' Carbonesi è legato alla famiglia dall'Ottocento ed è ancora oggi l'indirizzo storico del marchio. Da qui sono passate le due specialità che lo hanno reso noto: la Scorza, cioccolato lavorato in sottili sfoglie, e il Cremino Fiat, a strati.

L'azienda è rimasta nelle mani della stessa famiglia, un caso raro per una cioccolateria con oltre due secoli di attività.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Bologna%2C_Via_de%27_Carbonesi.jpg/960px-Bologna%2C_Via_de%27_Carbonesi.jpg',
        gallery: [],
        social: { website: 'https://www.majani.it' },
        founded_year: 1796,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'ristorante-diana',
        name: 'Ristorante Diana',
        category: 'restaurant',
        coordinates: { lat: 44.49771, lng: 11.34302 },
        address: 'Via dell\'Indipendenza, 24, 40121 Bologna',
        description: 'Dal 1909 un riferimento della cucina bolognese sotto i portici di Via dell\'Indipendenza, celebre per il carrello dei bolliti.',
        full_story: `Il Diana è un punto fermo della cucina bolognese dal 1909. Si trova in Via dell'Indipendenza, la grande strada porticata che collega la stazione al centro della città.

La sua sala è associata alla ristorazione classica, con un servizio in giacca bianca: tortellini in brodo, lasagne e, a pranzo la domenica, il carrello dei bolliti. A renderlo celebre furono il Cavalier Ivo Galletti e il suo socio Eros Palmirani, direttore di sala fino al 2020.

In oltre un secolo ha accolto ospiti molto noti: le cronache ricordano tra gli altri Sandro Pertini, Federico Fellini e Gianni Morandi.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Via_dell%27Indipendenza.jpg/960px-Via_dell%27Indipendenza.jpg',
        gallery: [],
        social: {},
        founded_year: 1909,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'tamburini',
        name: 'Tamburini',
        category: 'shop',
        coordinates: { lat: 44.49381, lng: 11.34531 },
        address: 'Via Caprarie, 1/a, 40124 Bologna',
        description: 'Antica salsamenteria del Quadrilatero: un\'attività già presente nel 1860, rilevata dalla famiglia Tamburini nel 1932.',
        full_story: `In Via Caprarie si vende da mangiare da molto tempo: un'attività era già presente nel 1860 nello stesso punto. Nel 1932 la rileva la famiglia Tamburini, che le dà il nome ancora oggi sull'insegna.

È una salsamenteria classica del Quadrilatero, con salumi tradizionali, tortellini e altre specialità bolognesi, a cui si è aggiunto uno spazio per la degustazione.

All'angolo con Via Drapperie una lapide ricorda Padre Marella, il religioso che in quel punto raccoglieva le offerte per i poveri e che molti bolognesi ricordano ancora.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/20090804_bologna34.jpg/960px-20090804_bologna34.jpg',
        gallery: [],
        social: {},
        founded_year: 1860,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'salumeria-simoni',
        name: 'Salumeria Simoni',
        category: 'shop',
        coordinates: { lat: 44.49346, lng: 11.34509 },
        address: 'Via Drapperie, 5/2a, 40124 Bologna',
        description: 'Dal 1960 tra i banchi del Quadrilatero: una bottega storica di salumi nel cuore del mercato bolognese.',
        full_story: `La Salumeria Simoni apre nel 1960 in Via Drapperie, una delle strade del Quadrilatero, l'area in cui le corporazioni medievali avevano le loro botteghe e dove il mercato continua ancora oggi.

Bologna Welcome la inserisce tra le botteghe storiche della città. È una tappa naturale per chi vuole assaggiare mortadella e altri salumi locali nel luogo in cui si sono sempre comprati.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Bologna_%2841843697930%29.jpg/960px-Bologna_%2841843697930%29.jpg',
        gallery: [],
        social: {},
        founded_year: 1960,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'libreria-nanni',
        name: 'Libreria Nanni',
        category: 'bookshop',
        coordinates: { lat: 44.49304, lng: 11.34412 },
        address: 'Via de\' Musei, 8, 40124 Bologna',
        description: 'Fondata nel 1825 e considerata la più antica libreria di Bologna, con i suoi banchi all\'aperto sotto il Portico della Morte.',
        full_story: `La Libreria Nanni è considerata la più antica di Bologna. La sua fondazione è indicata nel 1825 per opera della famiglia Marchesi, e nel 2025 la libreria ha festeggiato i due secoli di vita; il titolare ne fa risalire le origini ancora più indietro, a una stamperia di fine Settecento.

Nel Novecento l'attività passa alla famiglia Nanni, e negli anni Venti arrivano i banchi di libri in stile parigino che la rendono riconoscibile a colpo d'occhio.

I banchi si allineano sotto il Portico della Morte, in Via de' Musei, a pochi passi dall'Archiginnasio. I portici di Bologna sono patrimonio UNESCO, e questo è uno dei punti in cui si capisce meglio quanto vivano ancora: si passa, ci si ferma, si sfoglia.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Libreria_Nanni%2C_Bologna.jpg/960px-Libreria_Nanni%2C_Bologna.jpg',
        gallery: [],
        social: {},
        founded_year: 1825,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'caffe-zanarini',
        name: 'Caffè Zanarini',
        category: 'bar',
        coordinates: { lat: 44.49145, lng: 11.34326 },
        address: 'Piazza Galvani, 1, 40124 Bologna',
        description: 'Il caffè storico dentro il palazzo dell\'Archiginnasio, antica sede dell\'Università, ritrovo dei bolognesi in Piazza Galvani.',
        full_story: `Il Caffè Zanarini si trova in Piazza Galvani, nel palazzo dell'Archiginnasio. L'edificio fu voluto da papa Pio IV e ospitò l'Università di Bologna dal 1563 al 1803; oggi conserva una delle grandi biblioteche pubbliche della città.

Da sempre punto d'incontro per i bolognesi, il caffè ha avuto una prima sede in Via D'Azeglio prima di legarsi a questa piazza, dove si affaccia a pochi passi dalla statua di Luigi Galvani e dalla Basilica di San Petronio. Nel 2026 la gestione è stata assegnata al marchio La Vecchia Malga.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bologna_-_Piazza_Galvani.jpg/960px-Bologna_-_Piazza_Galvani.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'drogheria-della-rosa',
        name: 'Drogheria della Rosa',
        category: 'restaurant',
        coordinates: { lat: 44.48984, lng: 11.34951 },
        address: 'Via Cartoleria, 10, 40124 Bologna',
        description: 'Una trattoria di cucina bolognese negli spazi di un\'antica farmacia dell\'Ottocento, in Via Cartoleria.',
        full_story: `La Drogheria della Rosa occupa gli spazi di una farmacia dell'Ottocento in Via Cartoleria, a pochi passi da Strada Maggiore. 

Oggi è una trattoria di cucina bolognese, e il fascino di mangiare in un'antica spezieria è parte del suo richiamo.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bologna%2C_Teatro_Duse_%281%29.jpg/960px-Bologna%2C_Teatro_Duse_%281%29.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'farmacia-del-pavaglione',
        name: 'Farmacia del Pavaglione',
        category: 'pharmacy',
        coordinates: { lat: 44.49309, lng: 11.34374 },
        address: 'Via dell\'Archiginnasio, 2/a, 40124 Bologna',
        description: 'Erede dell\'antica Spezieria della Morte, conserva le insegne originali e gli arredi in legno con motivi ripresi da San Petronio.',
        full_story: `All'angolo tra Via de' Musei e Via dell'Archiginnasio c'era la Spezieria della Morte, la farmacia dell'omonimo Ospedale, fondato nel Trecento. È da quella spezieria che discende la Farmacia del Pavaglione.

Entrando si vedono ancora le insegne originali e gli arredi in legno, decorati con motivi ripresi dalla Basilica di San Petronio, che si trova a pochi passi.

Fuori corre il Portico del Pavaglione, una delle passeggiate più eleganti di Bologna.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bologna_%2C_portico_del_Pavaglione.jpg/960px-Bologna_%2C_portico_del_Pavaglione.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'caffe-gamberini',
        name: 'Caffè Pasticceria Gamberini',
        category: 'bar',
        coordinates: { lat: 44.4955, lng: 11.33783 },
        address: 'Via Ugo Bassi, 12, 40121 Bologna',
        description: 'Dal 1907 in Via Ugo Bassi: è considerata la pasticceria più antica di Bologna, con un secondo banco alla stazione centrale.',
        full_story: `La Pasticceria Gamberini nasce nel 1907 in Via Ugo Bassi, una delle grandi strade del centro di Bologna. Le guide la indicano come il caffè e la pasticceria più antichi della città.

Dal 2006 l'insegna è riconosciuta tra i Locali Storici d'Italia. Oltre alla sede storica c'è anche un punto al binario 1 della Stazione Centrale.

Nel maggio 2026 il locale di Via Ugo Bassi ha riaperto dopo una breve chiusura, con la clientela tornata al banco a pochi giorni dalla sospensione.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Bologna%2C_Via_Ugo_Bassi%2C_people.jpg/960px-Bologna%2C_Via_Ugo_Bassi%2C_people.jpg',
        gallery: [],
        social: {},
        founded_year: 1907,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'paolo-atti',
        name: 'Paolo Atti & Figli',
        category: 'shop',
        coordinates: { lat: 44.49363, lng: 11.34526 },
        address: 'Via Drapperie, 6, 40124 Bologna',
        description: 'L\'antico forno di Via Drapperie, con gli arredi del 1907 ancora al loro posto e il Certosino fatto con la stessa ricetta da oltre un secolo.',
        full_story: `In Via Drapperie c'era l'Antico Forno Piemontese, che Paolo Atti (1849-1910), figlio di agricoltori arrivato a Bologna come apprendista panettiere, rilevò in affitto andando a vivere con la famiglia nell'appartamento sopra il negozio. Le fonti datano l'inizio della sua attività tra il 1868 e il 1880.

Nel 1898 si unì a Enrico Zambelli per produrre paste e tortellini, e nel 1903 ne acquisì l'intera proprietà, trasferendo il pastificio in Via Caprarie, in un edificio collegato al forno. Alla sua morte l'attività passò ai figli Armando e Margherita.

Le botteghe conservano gli arredi del 1907: banco, scaffali, vetrine, soffitti affrescati, lampade e pavimenti. Il Certosino di Bologna si prepara qui da oltre un secolo secondo la ricetta originale, e l'impresa è ancora nelle mani dei discendenti.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Bologna_da_mangiare_antico_forno_piemontese_in_via_drapperie.jpg/960px-Bologna_da_mangiare_antico_forno_piemontese_in_via_drapperie.jpg',
        gallery: [],
        social: {},
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'drogheria-gilberto',
        name: 'Drogheria Gilberto',
        category: 'shop',
        coordinates: { lat: 44.49352, lng: 11.34516 },
        address: 'Via Drapperie, 5/A, 40124 Bologna',
        description: 'Una drogheria avviata nel 1905 e passata di generazione in generazione, con un\'enoteca al piano di sotto.',
        full_story: `L'attività comincia nel 1905 con Pietro Montosi, in una prima sede in Via Andrea Costa, e prosegue con i nipoti e i loro figli.

Con l'arrivo dei supermercati la famiglia ha scelto di specializzarsi invece di competere sui grandi numeri. Oggi la drogheria è in Via Drapperie, nel Quadrilatero, con un secondo punto vendita non alimentare all'angolo con Via Pescherie Vecchie.

Al piano inferiore c'è un'enoteca con i vini ordinati per regione.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Bologna_%2843650907961%29.jpg/960px-Bologna_%2843650907961%29.jpg',
        gallery: [],
        social: {},
        founded_year: 1905,
        protected: false,
        city: 'Bologna',
    },
]

async function main() {
    console.log(`\n🏛️  Seed Bologna — collection: ${COLLECTION}`)
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
