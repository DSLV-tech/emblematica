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

import admin from 'firebase-admin'
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

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

const LOCALES = [
    {
        id: 'osteria-del-sole',
        name: 'Osteria del Sole',
        category: 'bar',
        coordinates: { lat: 44.49420, lng: 11.34060 },
        address: 'Vicolo Ranocchi, 1/d, 40124 Bologna',
        description: 'La più antica osteria d\'Italia: dal 1465 si viene qui solo con il proprio cibo — il vino lo porta lei.',
        full_story: `L'Osteria del Sole è sopravvissuta a cinque secoli e mezzo di storia senza cambiare una sola regola: niente cucina, niente menu, niente camerieri. Da quando aprì nel 1465 in un vicolo del Quadrilatero — il mercato medievale di Bologna — il contratto con il cliente è rimasto invariato: tu porti il cibo, noi portiamo il vino. Siediti dove trovi posto.

Il locale è nascosto in un vicolo cieco che il turista distratto non vede mai. Ma i bolognesi lo conoscono tutti: generazioni di macellai, studenti universitari, professori di diritto, partigiani e operai si sono seduti sugli stessi sgabelli di legno davanti agli stessi boccali di Pignoletto dei Colli Bolognesi. Durante la Resistenza il vicolo fu usato come punto di raccolta informazioni: il rumore del mercato copriva le conversazioni.

Le pareti gialle macchiate dal fumo delle candele, le botti di legno che fungono da tavoli e i boccali di terracotta appesi ai chiodi sono gli stessi da generazioni. Non c'è un orologio, non c'è una televisione, non c'è Wi-Fi. C'è solo vino, compagnia e la certezza che Bologna, in fondo, non è mai cambiata davvero.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bologna_-_Piazza_Maggiore.jpg/800px-Bologna_-_Piazza_Maggiore.jpg',
        gallery: [],
        social: {},
        founded_year: 1465,
        protected: true,
        city: 'Bologna',
    },
    {
        id: 'pasticceria-majani',
        name: 'Pasticceria Majani',
        category: 'bar',
        coordinates: { lat: 44.49240, lng: 11.34260 },
        address: 'Via Carbonesi, 5, 40125 Bologna',
        description: 'La fabbrica di cioccolato più antica d\'Italia: dal 1796 produce le Fiat e i cremini che hanno fatto la storia della confetteria italiana.',
        full_story: `Majani aprì la propria bottega a Bologna nel 1796, quando la città era ancora sotto l'influenza napoleonica e il cioccolato era ancora un lusso riservato alle classi agiate. Il fondatore Majani — il cui nome di battesimo è andato perduto nei registri comunali — aveva imparato l'arte della cioccolateria a Torino e decise di portarla nella Bologna dei portici e dei dotti.

La storia della pasticceria si intreccia con quella industriale italiana in un modo inaspettato: nel 1911, la neonata Fabbrica Italiana Automobili Torino commissionò a Majani un cioccolatino celebrativo per il lancio della nuova vettura. Nacque così il "Fiat" — un cremino a strati di pasta gianduia, fondente e cioccolato al latte — che divenne il prodotto simbolo della casa e viene prodotto con la stessa ricetta ancora oggi.

Le vetrine in legno laccato bianco con i bordi dorati, i vassoi d'argento con le praline disposte in geometrie precise e il profumo inconfondibile di cioccolato temperato accolgono ancora oggi chi entra. Il laboratorio sul retro, visibile attraverso un vetro, mostra i macchinari degli anni '30 accanto alle conche di rame originali: la produzione artigianale non è mai stata abbandonata.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bologna_centro_storico_-_Via_Carbonesi.jpg/800px-Bologna_centro_storico_-_Via_Carbonesi.jpg',
        gallery: [],
        social: { website: 'https://www.majani.it' },
        founded_year: 1796,
        protected: true,
        city: 'Bologna',
    },
    {
        id: 'trattoria-anna-maria',
        name: 'Trattoria Anna Maria',
        category: 'restaurant',
        coordinates: { lat: 44.49750, lng: 11.34930 },
        address: 'Via Belle Arti, 17/a, 40126 Bologna',
        description: 'Il tempio della cucina bolognese autentica: Anna Maria Monari fondò questa trattoria nel 1929 e i tortellini sono ancora fatti a mano ogni mattina.',
        full_story: `Anna Maria Monari aprì la sua trattoria nel 1929 in Via Belle Arti, a pochi passi dall'Accademia di Belle Arti e dall'Università. La scelta del luogo non fu casuale: Anna Maria aveva capito che artisti, professori e studenti mangiavano spesso fuori casa e cercavano la cucina della madre — non ristoranti formali.

La trattoria divenne rapidamente il punto di riferimento della zona universitaria per la cucina romagnola e bolognese tradizionale. Tortellini in brodo di cappone, tagliatelle al ragù preparate con la ricetta depositata nel 1972 alla Camera di Commercio di Bologna (la larghezza deve essere 1/12.270 dell'altezza della Torre degli Asinelli), lasagne verdi al forno con besciamella e ragù al vino bianco.

Pasolini, Moravia e Calvino frequentarono la trattoria nei decenni successivi. Nelle fotografie sbiadite alle pareti si riconoscono attori, registi e pittori seduti ai tavoli di legno con le tovaglie bianche. Oggi la gestione è passata alla nipote di Anna Maria, che ogni mattina alle sei inizia a stendere la sfoglia fresca — la stessa regola dalla fondazione: niente pasta secca, niente scorciatoie.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Bologna_-_Via_Belle_Arti.jpg/800px-Bologna_-_Via_Belle_Arti.jpg',
        gallery: [],
        social: {},
        founded_year: 1929,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'ristorante-diana',
        name: 'Ristorante Diana',
        category: 'restaurant',
        coordinates: { lat: 44.49620, lng: 11.34280 },
        address: 'Via dell\'Indipendenza, 24, 40121 Bologna',
        description: 'Il ristorante dell\'alta borghesia bolognese: dal 1909 la cucina emiliana nei suoi massimi splendori, tra lampadari di cristallo e tortellini in brodo dorato.',
        full_story: `Il Ristorante Diana aprì nel 1909 in Via dell'Indipendenza, il boulevard ottocentesco che collega la stazione ferroviaria al cuore medievale di Bologna. Fondato dalla famiglia Acquaroli con l'ambizione dichiarata di creare il primo ristorante di rappresentanza della città, divenne rapidamente il luogo dove si celebravano matrimoni, contratti commerciali e ricevimenti diplomatici.

L'interno è rimasto sostanzialmente invariato: le volte affrescate con motivi floreali Liberty, i lampadari di cristallo boemo, le sedie in stile Biedermeier rivestite di velluto verde e le tovaglie inamidate in lino bianco creano un'atmosfera di sobria eleganza borghese. Il servizio in guanti bianchi — abbandonato quasi ovunque negli anni '70 — è rimasto una prerogativa del Diana fino agli anni '90.

Re Vittorio Emanuele III, i reali di Svezia, Arturo Toscanini, Maria Callas e tre presidenti della Repubblica italiana hanno occupato i tavoli del Diana. Durante le grandi fiere bolognesi — il Salone del Libro, il Motor Show, il Cosmoprofit — il ristorante era prenotato con mesi di anticipo. Il brodo di cappone nel quale galleggiano i tortellini — rigorosamente fatti a mano con ricotta, mortadella, parmigiano e noce moscata — rimane, a giudizio dei critici, il migliore della città.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Via_dell_Indipendenza_Bologna.jpg/800px-Via_dell_Indipendenza_Bologna.jpg',
        gallery: [],
        social: {},
        founded_year: 1909,
        protected: true,
        city: 'Bologna',
    },
    {
        id: 'drogheria-della-rosa',
        name: 'Drogheria della Rosa',
        category: 'restaurant',
        coordinates: { lat: 44.49340, lng: 11.34610 },
        address: 'Via Cartoleria, 10, 40124 Bologna',
        description: 'L\'ex drogheria diventata ristorante: scaffali pieni di spezie, erbe e barattoli d\'epoca fanno da scenografia alla cucina emiliana più autentica.',
        full_story: `La Drogheria della Rosa aprì come autentica drogheria nel 1946 in Via Cartoleria, a due passi dall'Università. Per oltre vent'anni fu il negozio di spezie, erbe aromatiche e prodotti esotici del quartiere universitario: cannella di Ceylon, pepe nero del Kerala, zafferano iraniano, tea cinese e la celebre "mistura per arrosto" della famiglia Assirelli, il cui ricettario segreto si tramandava di padre in figlio.

Negli anni '70 Emilio Assirelli, figlio del fondatore, decise di non rinnovare la licenza commerciale di drogheria e trasformò il locale in ristorante — mantenendo però scaffali, barattoli, bilancine e spezie come arredo immutabile. Le erbe aromatiche sugli scaffali sono ancora quelle originali (mummificate e decorative), ma quelle in cucina vengono selezionate freschissime ogni mattina al mercato di Mezzo.

Il menu è scritto a mano su una lavagna cambiata quotidianamente in base alla disponibilità stagionale: crescione con squacquerone, tagliolini all'uovo con tartufo nero di Savigno, anatra al balsamico di Modena. Tonino Guerra — il poeta e sceneggiatore di Amarcord e di decine di film di Tarkovskij — era di casa, e la sua firma compare ancora su un foglio incorniciato vicino al bancone.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bologna_Quadrilatero.jpg/800px-Bologna_Quadrilatero.jpg',
        gallery: [],
        social: {},
        founded_year: 1946,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'libreria-nanni',
        name: 'Libreria Nanni',
        category: 'bookshop',
        coordinates: { lat: 44.49290, lng: 11.34510 },
        address: 'Piazza Galvani, 1/h, 40124 Bologna',
        description: 'La libreria dello studente bolognese: aperta nel 1932 sotto i portici di Piazza Galvani, a un passo dall\'Archiginnasio e dalla prima università del mondo.',
        full_story: `La Libreria Nanni aprì nel 1932 a Piazza Galvani, nel cuore della Bologna universitaria, a due passi dall'Archiginnasio — la sede storica dell'Università di Bologna, fondata nel 1088 e considerata la più antica del mondo occidentale. Il fondatore Giovanni Nanni aveva lavorato per dieci anni in librerie fiorentine e veneziane prima di tornare a Bologna con il progetto di una libreria universitaria seria, con un catalogo che andasse oltre i manuali di studio.

Fin dall'inizio la Nanni si distinse per la sua sezione di scienze umane — filosofia, storia, filologia — che divenne punto di riferimento per i professori e i dottorandi dell'ateneo. Umberto Eco, che insegnò semiologia a Bologna dal 1971 e vi rimase fino alla morte, era un cliente abituale: si racconta che trascorresse le mattine del sabato a sfogliare le novità sui cavalletti, spesso portando via pacchi di libri sui quali aveva attaccato foglietti con appunti.

Le scaffalature originali in mogano lucidato, alte fino al soffitto e raggiungibili con le scale su rotaie, conservano ancora migliaia di volumi. La sezione di storia bolognese ed emiliana — con prime edizioni, mappe storiche e cataloghi d'archivio — è considerata la più completa della regione. Un libro firmato "U. Eco, 14 marzo 1984" è esposto in una teca vicino alla cassa.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bologna_-_Archiginnasio.jpg/800px-Bologna_-_Archiginnasio.jpg',
        gallery: [],
        social: {},
        founded_year: 1932,
        protected: false,
        city: 'Bologna',
    },
    {
        id: 'farmacia-dell-archiginnasio',
        name: 'Antica Farmacia dell\'Archiginnasio',
        category: 'pharmacy',
        coordinates: { lat: 44.49230, lng: 11.34480 },
        address: 'Via dell\'Archiginnasio, 4, 40124 Bologna',
        description: 'La farmacia dei professori: aperta nel 1841 a servizio dell\'Università, conserva la collezione di vasi galenici ottocenteschi più grande della regione.',
        full_story: `L'Antica Farmacia dell'Archiginnasio aprì nel 1841 su iniziativa del dott. Cesare Brighenti, professore di chimica farmaceutica all'Università di Bologna. L'idea era ambiziosa: creare una farmacia che fosse al tempo stesso un laboratorio di ricerca, una scuola pratica per gli studenti di medicina e un esercizio aperto al pubblico. Per quasi un secolo l'università e la farmacia condivisero ricercatori, strumenti e preparati.

L'interno è rimasto straordinariamente integro: 280 vasi in maiolica bianca decorata con motivi botanici — prodotti dalla manifattura Ginori tra il 1841 e il 1860 — contengono ancora le erbe dei preparati galeniche originali. Le bilancine di precisione in ottone degli anni 1880, il mortaio di marmo bianco e gli alambicchi di vetro soffiato sono esposti come pezzi da museo dietro il bancone in noce intagliato.

La farmacia ha mantenuto fino agli anni '90 la preparazione artigianale di alcuni rimedi — unguenti, tinture e sciroppi — secondo ricette ottocentesche ancora valide. Un pannello in ottone all'ingresso elenca i cinquantasette professori universitari che si sono serviti del laboratorio dal 1841 al 1960, tra i quali Luigi Galvani Figlio — nipote del celebre scopritore dell'elettricità galvanica.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Bologna_Archiginnasio_interno.jpg/800px-Bologna_Archiginnasio_interno.jpg',
        gallery: [],
        social: {},
        founded_year: 1841,
        protected: true,
        city: 'Bologna',
    },
    {
        id: 'bar-zamboni',
        name: 'Bar Zamboni',
        category: 'bar',
        coordinates: { lat: 44.49680, lng: 11.35340 },
        address: 'Via Zamboni, 18/b, 40126 Bologna',
        description: 'Il bar dell\'università: aperto nel 1912 sulla strada degli studenti, ha servito espresso a generazioni di dottorandi, professori e premi Nobel.',
        full_story: `Il Bar Zamboni aprì nel 1912 in Via Zamboni — la strada che conduce dai Due Torri al polo universitario delle facoltà umanistiche — in un momento in cui l'Università di Bologna stava attraversando una stagione di grande fermento intellettuale. Il fondatore, Luigi Cavallini, aveva intuito che studenti e professori avevano bisogno di un luogo neutro dove discutere tra una lezione e l'altra: né l'aula formale, né il ristorante costoso.

Il bancone del 1912, in noce e ottone con le macchine da caffè Pavoni originali, è ancora al suo posto. Le pareti sono tappezzate di fotografie d'epoca: professori in toga e tocco, studenti con il pennacchio delle lauree, comitive del Dopoguerra con le sigarette in mano. Un'intera parete è dedicata alle fotografie degli studenti stranieri — americani, inglesi, tedeschi — che dall'Erasmus in poi hanno reso via Zamboni una delle strade più internazionali d'Italia.

Umberto Eco veniva a colazione ogni mattina quando era in città. Giorgio Morandi — il pittore delle bottiglie, professore all'Accademia di Belle Arti a pochi passi — era cliente fisso del martedì pomeriggio. Il caffè del Bar Zamboni è ancora preparato con la miscela Illycaffè che Cavallini scelse nel 1935 e che non è mai stata cambiata.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Via_Zamboni_Bologna.jpg/800px-Via_Zamboni_Bologna.jpg',
        gallery: [],
        social: {},
        founded_year: 1912,
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
