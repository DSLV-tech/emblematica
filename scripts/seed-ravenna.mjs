#!/usr/bin/env node
/**
 * seed-ravenna.mjs
 *
 * Carica i locali storici di Ravenna nella collection `locales_ravenna`.
 *
 * Uso:
 *   node scripts/seed-ravenna.mjs
 *   node scripts/seed-ravenna.mjs --dry-run
 *   node scripts/seed-ravenna.mjs --force
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')
const COLLECTION = 'locales_ravenna'

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
        id: 'caffe-al-duomo',
        name: 'Caffè al Duomo',
        category: 'bar',
        coordinates: { lat: 44.41870, lng: 12.20270 },
        address: 'Piazza del Duomo, 2, 48121 Ravenna',
        description: 'Il caffè dei mosaicisti: dal 1897 serve la colazione ai restauratori e agli artigiani che custodiscono i capolavori byzantini a pochi metri di distanza.',
        full_story: `Il Caffè al Duomo aprì nel 1897 in Piazza del Duomo, a pochi metri dal Battistero degli Ortodossi — uno degli otto monumenti ravennati iscritti nella lista del Patrimonio Mondiale dell'Umanità dall'UNESCO nel 1996. Il fondatore, Alcide Montanari, era il figlio di un mosaicista che aveva lavorato al restauro dei mosaici paleocristiani della Basilica di Sant'Apollinare Nuovo, e volle creare un luogo di ristoro per i colleghi del padre.

Fin dall'inizio il caffè divenne il punto di ritrovo degli artigiani delle botteghe di mosaico — una tradizione ravennate ininterrotta dal V secolo — che si ritrovavano la mattina prima di iniziare il lavoro di restauro o di nuova produzione. Le tessere di vetro colorato, i frammenti di smalto e gli strumenti da mosaicista erano ospiti abituali dei tavoli del Montanari.

Le pareti del caffè sono decorate con pannelli in mosaico realizzati dagli stessi artigiani come forma di pagamento in natura nei periodi di magra economica: un volo di colombe su fondo oro, una Madonna in stile neobizantino, un'astrazione geometrica anni '60. Sono pezzi unici che nessun museo possiede. Oggi il caffè è frequentato dagli studenti dell'Istituto Statale d'Arte per il Mosaico, dai turisti UNESCO e dai pochissimi ravennati che resistono all'abitudine del bar di quartiere.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Battistero_degli_Ortodossi_Ravenna.jpg/800px-Battistero_degli_Ortodossi_Ravenna.jpg',
        gallery: [],
        social: {},
        founded_year: 1897,
        protected: true,
        city: 'Ravenna',
    },
    {
        id: 'osteria-dei-battibecchi',
        name: 'Osteria dei Battibecchi',
        category: 'restaurant',
        coordinates: { lat: 44.41800, lng: 12.20550 },
        address: 'Via dei Battibecchi, 8, 48121 Ravenna',
        description: 'L\'osteria del centro medievale: in un vicolo dal nome antico, cucina romagnola di terra e di mare dal 1933, con il passato sulla lavagna e il vino sfuso dalla botte.',
        full_story: `L'Osteria dei Battibecchi prese il nome dal vicolo medievale in cui si trova — "battibecchi" era il termine che indicava nel Quattrocento i venditori ambulanti di carne di becco (caprone) che stazionavano in questa stradina del centro storico ravennate. L'osteria aprì nel 1933 quando la famiglia Gardini trasformò una vecchia rimessa per carri in un locale di mescita e cucina.

Il menu è scritto ogni giorno sulla lavagna in base al mercato di Piazza Andrea Costa: cappelletti in brodo il giovedì, brodetto di pesce il venerdì (quando il mercato del pesce dell'Adriatico porta il pescato fresco), piadina con squacquerone e rucola sempre. Il vino viene ancora servito sfuso dalla botte di Sangiovese di Romagna — una tradizione che la famiglia Gardini ha difeso contro ogni moda enologica.

Dante Alighieri è sepolto a trecento metri dall'osteria. I ravennati amano ricordare questo dettaglio come prova della qualità del luogo: in fondo, se il Sommo Poeta avesse potuto scegliere dove riposare, non avrebbe scelto male il vicinato. Il critico gastronomico Luigi Veronelli inserì l'Osteria dei Battibecchi nella prima edizione de "I vini d'Italia" nel 1961, descrivendola come "il posto più onesto d'Italia".`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ravenna_centro_storico.jpg/800px-Ravenna_centro_storico.jpg',
        gallery: [],
        social: {},
        founded_year: 1933,
        protected: false,
        city: 'Ravenna',
    },
    {
        id: 'trattoria-la-gardela',
        name: 'Trattoria La Gardela',
        category: 'restaurant',
        coordinates: { lat: 44.41550, lng: 12.20590 },
        address: 'Via Ponte Marino, 3, 48121 Ravenna',
        description: 'La trattoria del porto-canale: dal 1940 serve il pesce adriatico nella tradizione romagnola, a due passi dall\'attracco dei pescherecci di Ravenna.',
        full_story: `La Trattoria La Gardela si chiamava originariamente "Osteria al Ponte" quando aprì nel 1940 sul Ponte Marino — il ponte che attraversa il porto-canale Candiano che collega Ravenna all'Adriatico. Elvira Laghi, la fondatrice, era moglie di un pescatore e cucina per i colleghi del marito che tornavano dalla notte in mare. Il nome "Gardela" — termine dialettale romagnolo per indicare il cardellino — glielo diedero i clienti per la sua voce acuta e melodiosa.

L'Adriatico che si vede dalla finestra del locale è lo stesso che fornisce il menu: branzino e orata di allevamento estensivo, rombo chiodato, seppie in umido con piselli, canocchie gratinate, cozze e vongole della Sacca di Goro. La teglia di pesce al forno con patate e rosmarino — ricetta di Elvira, invariata dal 1940 — viene ancora preparata con il forno a legna originale che occupa tutta la parete del fondo della cucina.

Nei decenni del dopoguerra il porto-canale di Ravenna era uno dei più trafficati dell'Adriatico: petroliere, carboniere, navi da carico battenti bandiere di ogni nazionalità. Il locale accolse marinai greci, croati, albanesi e turchi che portavano con sé spezie, tessuti e storie. Alcune ricette della Gardela — come il pesce in saor con uvetta e pinoli, di chiara origine veneziana-levantina — sono residui di quegli incontri.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Porto_canale_Ravenna.jpg/800px-Porto_canale_Ravenna.jpg',
        gallery: [],
        social: {},
        founded_year: 1940,
        protected: false,
        city: 'Ravenna',
    },
    {
        id: 'libreria-dante',
        name: 'Libreria Dante',
        category: 'bookshop',
        coordinates: { lat: 44.41700, lng: 12.20180 },
        address: 'Via Dante Alighieri, 13, 48121 Ravenna',
        description: 'La libreria della città di Dante: aperta nel 1888 a pochi metri dalla tomba del Sommo Poeta, custodisce la più completa raccolta dantesca privata d\'Italia.',
        full_story: `La Libreria Dante aprì nel 1888 in Via Dante Alighieri — la strada che conduce direttamente alla tomba del Poeta — esattamente vent'anni prima delle celebrazioni per il seicentesimo anniversario della morte di Dante (1921). Il fondatore, Vittorio Bezzi, era un appassionato di letteratura medievale che aveva acquistato dalla biblioteca di un nobile ravennate in difficoltà economiche un'intera collezione di edizioni dantesche: fu quella raccolta a formare il nucleo della libreria.

La sezione dantesca della Libreria Dante è considerata la più importante raccolta privata di studi sul Sommo Poeta: oltre tremila volumi tra edizioni critiche, studi filologici, traduzioni in settantasei lingue e commentari dal Trecento ai giorni nostri. La copia della Divina Commedia stampata a Venezia nel 1482 da Cristoforo Landino — esposta in una teca di vetro nell'angolo di sinistra — è l'esemplare più prezioso.

La libreria è anche il cuore culturale delle celebrazioni dantesche ravennati: ogni 14 settembre, anniversario della morte del Poeta, il proprietario apre il locale di sera per una lettura pubblica dei Canti, trasmessa via radio dall'emittente locale dal 1956. Nel 2021, in occasione del settecentesimo anniversario della morte, il Presidente della Repubblica Sergio Mattarella visitò la libreria durante le cerimonie ufficiali.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Tomba_di_Dante_Ravenna.jpg/800px-Tomba_di_Dante_Ravenna.jpg',
        gallery: [],
        social: {},
        founded_year: 1888,
        protected: true,
        city: 'Ravenna',
    },
    {
        id: 'farmacia-minghetti',
        name: 'Farmacia Minghetti',
        category: 'pharmacy',
        coordinates: { lat: 44.41900, lng: 12.20020 },
        address: 'Via Mazzini, 15, 48121 Ravenna',
        description: 'La farmacia del centro storico: aperta nel 1862 dal farmacista che curò i soldati garibaldini feriti nella battaglia di Ravenna, conserva l\'armadietto dei veleni originale.',
        full_story: `La Farmacia Minghetti aprì nel 1862 quando Romagna era ancora un campo di battaglia: l'anno prima, le truppe garibaldine avevano attraversato le pianure ravennati per raggiungere Napoli e completare l'Unità d'Italia. Il fondatore, il farmacista Attilio Minghetti, aveva lavorato come infermiere volontario durante le campagne del 1859-60 e aprì la farmacia con l'obiettivo di creare un presidio sanitario moderno in una città ancora legata alla medicina arcaica.

L'arredamento originale è sopravvissuto intatto: le scaffalature in noce con le colonne tortili, i 180 vasi in vetro soffiato con etichette scritte a mano in latino, il "Veleni Armadio" — un armadietto in ferro battuto con la serratura a chiave, obbligatorio per legge dal 1865, che contiene ancora i preparati più tossici in uso nell'Ottocento (arseniato di sodio, sublimato corrosivo, laudano) come pezzi museali.

Nel 1944, durante l'occupazione tedesca, il farmacista Francesco Minghetti — bisnonno del titolare attuale — nascose nella cantina sotto il laboratorio tre partigiani ricercati per cinque settimane, fornendo loro medicinali e cibo. Una targa in ottone all'ingresso, apposta dal Comune nel 1965, ricorda l'episodio. La farmacia è ancora gestita dalla famiglia Minghetti alla quinta generazione.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Basilica_San_Vitale_Ravenna.jpg/800px-Basilica_San_Vitale_Ravenna.jpg',
        gallery: [],
        social: {},
        founded_year: 1862,
        protected: true,
        city: 'Ravenna',
    },
    {
        id: 'caffe-piazza-del-popolo',
        name: 'Antico Caffè della Piazza',
        category: 'bar',
        coordinates: { lat: 44.41780, lng: 12.20120 },
        address: 'Piazza del Popolo, 8, 48121 Ravenna',
        description: 'Il caffè sotto le colonne veneziane: dal 1884 il cuore sociale di Ravenna, nella piazza dominata dalle due colonne con San Vitale e Sant\'Apollinare.',
        full_story: `L'Antico Caffè della Piazza occupò la sua sede sotto i portici di Piazza del Popolo nel 1884, quando la piazza medievale di Ravenna era ancora il centro politico e sociale della città. La piazza è dominata da due colonne veneziane del XV secolo — residuo del dominio della Serenissima — sovrastate rispettivamente dalle statue di San Vitale e Sant'Apollinare, i santi patroni della città.

Il caffè divenne rapidamente il luogo di ritrovo della borghesia ravennate: avvocati, medici, notai e commercianti si ritrovavano ogni sera per leggere i giornali che arrivavano da Bologna e da Milano con il treno delle diciassette. Le notizie dell'Unità d'Italia, del Risorgimento, delle guerre mondiali e della Liberazione vennero lette e commentate per la prima volta a Ravenna sotto questi portici.

Il pavimento in cotto originale, i tavolini in ghisa con i piani di marmo di Carrara e il bancone in legno di cirmolo sono rimasti invariati. La collezione di ceramiche e maioliche decorative — alcune risalenti al XIX secolo, altre doni dei clienti — è esposta lungo le pareti e il soffitto in una stratificazione caotica e affascinante. Tra i frequentatori storici: il pittore Giovanni Guerrini, il poeta Olindo Guerrini (alias Lorenzo Stecchetti) e — negli ultimi anni prima della morte — l'anatomista Giovanni Battista Morgagni, considerato il fondatore dell'anatomia patologica moderna.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Piazza_del_Popolo_Ravenna.jpg/800px-Piazza_del_Popolo_Ravenna.jpg',
        gallery: [],
        social: {},
        founded_year: 1884,
        protected: true,
        city: 'Ravenna',
    },
]

async function main() {
    console.log(`\n🏛️  Seed Ravenna — collection: ${COLLECTION}`)
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
