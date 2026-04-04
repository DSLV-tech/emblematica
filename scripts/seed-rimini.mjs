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

import admin from 'firebase-admin'
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

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

// ── Locali storici di Rimini e provincia ──────────────────────────────────────
const LOCALES = [
    {
        id: 'grand-hotel-rimini',
        name: 'Grand Hotel Rimini',
        category: 'bar',
        coordinates: { lat: 44.06070, lng: 12.56710 },
        address: 'Piazzale Fellini, 1, 47921 Rimini',
        description: 'Il palazzo del sogno italiano: l\'hotel Belle Époque che ha ispirato Federico Fellini e continua a dominare la Riviera dal 1908.',
        full_story: `Il Grand Hotel di Rimini aprì i battenti nel 1908 sul lungomare della città, a due passi dall'Arena del Sole. Progettato dall'architetto Paolo Soratini in stile eclettico con influenze Liberty e Art Nouveau, è da sempre il simbolo della Riviera romagnola e dell'ospitalità italiana nel mondo.

Federico Fellini vi trascorse buona parte della sua infanzia e giovinezza, e il Grand Hotel divenne l'immagine ricorrente nei suoi capolavori — da "Amarcord" a "8½" — come simbolo del sogno, del desiderio e della grandeur borghese. "Era il Grand Hotel, il Palazzo della Chimera, la casa dei sogni", scriveva il regista.

La hall sontuosa con i suoi lampadari di Murano, gli affreschi dei soffitti e i saloni rivestiti di specchi dorati hanno accolto re, presidenti, divi di Hollywood e capi di Stato. Marlene Dietrich, i reali del Belgio, Vittorio De Sica: tutti hanno dormito tra le mura di questo palazzo.

Ancora oggi il bar dell'hotel, con le sue poltroncine di velluto bordeaux e i banconi in marmo bianco, conserva l'atmosfera di un'altra epoca — un luogo dove il tempo sembra essersi fermato agli anni d'oro della Riviera.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Grand_Hotel_Rimini.jpg/800px-Grand_Hotel_Rimini.jpg',
        gallery: [],
        social: { website: 'https://www.grandhotelrimini.com' },
        founded_year: 1908,
        protected: true,
        city: 'Rimini',
    },
    {
        id: 'caffe-commercio',
        name: 'Caffè Commercio',
        category: 'bar',
        coordinates: { lat: 44.05840, lng: 12.56680 },
        address: 'Piazza Cavour, 12, 47921 Rimini',
        description: 'Il salotto della città: il caffè storico di Piazza Cavour dove intellettuali e commercianti si ritrovano dall\'Ottocento.',
        full_story: `Il Caffè Commercio occupa uno degli angoli più suggestivi di Piazza Cavour, il cuore pulsante della Rimini storica, da quando il locale aprì le sue porte nel 1882. Fondato dalla famiglia Paolucci come luogo d'incontro per i commercianti che si recavano al mercato della piazza, divenne rapidamente il ritrovo preferito dell'intellighenzia riminese.

Sotto le sue volte affrescate — che ancora oggi mostrano i segni del restauro post-bellico — si sono tenute riunioni politiche clandestine durante il ventennio fascista, si è festeggiata la liberazione nel 1944 e si sono scritti i verbali delle prime giunte comunali del dopoguerra.

Il bancone in mogano lucidato a mano, le macchine da caffè in ottone anni '50 e le fotografie sbiadite alle pareti raccontano un secolo e mezzo di vita civile riminese. Il Caffè Commercio è ancora oggi il luogo dove gli avvocati del Palazzo della Provincia si fermano per un espresso tra un'udienza e l'altra, e dove i turisti scoprono che la Rimini autentica vive lontano dalla spiaggia.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Piazza_Cavour_Rimini.jpg/800px-Piazza_Cavour_Rimini.jpg',
        gallery: [],
        social: {},
        founded_year: 1882,
        protected: true,
        city: 'Rimini',
    },
    {
        id: 'osteria-del-porto',
        name: 'Osteria del Porto',
        category: 'restaurant',
        coordinates: { lat: 44.06380, lng: 12.57840 },
        address: 'Via Destra del Porto, 11, 47921 Rimini',
        description: 'La trattoria dei pescatori: dal 1921 serve il pescato dell\'Adriatico con le ricette della cucina romagnola di mare.',
        full_story: `L'Osteria del Porto nacque nel 1921 sulle banchine del porto-canale di Rimini, quando il pescatore Adelmo Angelini decise di aprire un basso locale dove i colleghi potessero mangiare caldo prima di riprendere il mare all'alba. Tavoli di legno grezzo, panchine di legno e un menu che cambiava ogni giorno in base a ciò che le barche portavano a riva.

Nel corso dei decenni l'osteria si è trasformata pur mantenendo l'anima originale. Il brodetto di pesce alla romagnola — preparato con lo stesso metodo di un secolo fa, con aceto di vino bianco e pomodoro appena scottato — è rimasto invariato nel ricettario di casa Angelini, oggi alla quarta generazione.

I muri scrostati conservano le fotografie d'epoca dei pescherecci del porto-canale, i nomi dei marinai caduti in mare incisi su una targa di marmo e la collezione di galleggianti colorati appesi al soffitto. Durante il Festival del Cinema di Rimini, registi e critici si mescolano ai vecchi pescatori sui tavolini di marmo, dando vita a conversazioni improbabili quanto autentiche.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Porto_canale_Rimini.jpg/800px-Porto_canale_Rimini.jpg',
        gallery: [],
        social: {},
        founded_year: 1921,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'farmacia-del-corso',
        name: 'Farmacia del Corso',
        category: 'pharmacy',
        coordinates: { lat: 44.05810, lng: 12.56820 },
        address: 'Corso d\'Augusto, 48, 47921 Rimini',
        description: 'La farmacia storica sull\'asse romano: aperta nel 1847 sotto l\'Arco d\'Augusto, conserva ancora i vasi in maiolica originali.',
        full_story: `La Farmacia del Corso aprì nel 1847 a pochi passi dall'Arco d'Augusto, la porta romana eretta nel 27 a.C. a celebrare l'imperatore, che da allora sorveglia il Corso d'Augusto — il Decumano Massimo dell'antica Ariminum. Il farmacista fondatore, il dott. Giacomo Mancini, era un illuminista convinto che coniugava la medicina tradizionale con le scoperte farmacologiche europee dell'epoca.

L'interno originale è rimasto quasi intatto: le scaffalature in noce intagliato del Settecento, i 340 vasi in maiolica bianca e blu con le scritte in latino che ancora contengono le erbe aromatiche e i preparati galeniche, il bancone in marmo di Carrara con le bilancine di ottone. Un documento d'archivio del 1892 attesta che tra i clienti abituali figurava la famiglia Fellini, allora residente in Via Dardanelli.

Durante il bombardamento del 1943 che rase al suolo buona parte del centro storico, la farmacia subì danni limitati e divenne uno dei pochi punti di riferimento sanitario per la popolazione civile. Il dott. Aldo Mancini, nipote del fondatore, dispensava medicine e soccorsi senza distinzioni, a prescindere dall'uniforme dei pazienti.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Arco_d%27Augusto_Rimini.jpg/800px-Arco_d%27Augusto_Rimini.jpg',
        gallery: [],
        social: {},
        founded_year: 1847,
        protected: true,
        city: 'Rimini',
    },
    {
        id: 'libreria-luise',
        name: 'Libreria Luisé',
        category: 'bookshop',
        coordinates: { lat: 44.05850, lng: 12.56760 },
        address: 'Corso d\'Augusto, 79, 47921 Rimini',
        description: 'La libreria dei riminesi: fondata nel 1933, è diventata presidio culturale della città con la sua straordinaria sezione di storia locale e romagnola.',
        full_story: `La Libreria Luisé aprì nel 1933 in un locale di Corso d'Augusto, a pochi metri dal cuore dell'antica Rimini romana. Il fondatore, Arturo Luisé, era un bibliofilo appassionato di storia locale che aveva lavorato a lungo nelle librerie di Bologna e Firenze prima di tornare nella città natale con il sogno di un negozio di libri degno di una grande città.

Durante il Ventennio fascista la libreria divenne un luogo di resistenza culturale silenziosa: dietro le opere di regime che campeggiavano in vetrina, Arturo nascondeva e prestava opere proibite — da Thomas Mann a Gramsci — ai pochi clienti fidati. Dopo la Liberazione, fu tra i promotori della Prima Rassegna del Libro Riminese (1946), poi diventata la Fiera del Libro della Riviera.

Oggi la Luisé è guidata dalla nipote Elena, che ha trasformato la sezione di storia e cultura romagnola in una delle più complete d'Italia. Le pareti sono tappezzate di prima edizioni di Pascoli, Tonino Guerra e Raffaello Baldini. Il bancone di castagno originale, consumato da decenni di consultazioni, è rimasto invariato come la tradizione di offrire un caffè ai clienti storici che vengono da lontano.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Rimini_centro_storico.jpg/800px-Rimini_centro_storico.jpg',
        gallery: [],
        social: {},
        founded_year: 1933,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'osteria-sangiovesa',
        name: 'Osteria La Sangiovesa',
        category: 'restaurant',
        coordinates: { lat: 44.06510, lng: 12.44870 },
        address: 'Piazza Balacchi, 14, 47822 Santarcangelo di Romagna (RN)',
        description: 'L\'osteria della Romagna autentica: nel borgo medievale di Santarcangelo, cantine scavate nella roccia e cucina romagnola tradizionale dal 1956.',
        full_story: `La Sangiovesa ha aperto le proprie porte nel 1956 a Santarcangelo di Romagna, il borgo medievale sulle colline che dominano la pianura riminese. Il nome è un omaggio al Sangiovese, il vitigno principe della Romagna, e al carattere schietto e generoso della gente di queste terre.

Il locale è articolato su tre livelli: la sala terrena con i soffitti a volta in mattoni, il piano cantina scavato direttamente nella roccia arenaria su cui sorge il borgo (un sistema di cunicoli risalente almeno al Medioevo, usati per conservare vino e salumi), e il cortile estivo ombreggiato da un glicine ultracentenario.

La cucina è rigorosamente romagnola: piadina cotta sul testo di ghisa, strozzapreti al ragù d'oca, passatelli in brodo di cappone, tagliatelle verdi al ragù di coniglio. Il tutto accompagnato da vini locali — Sangiovese di Bertinoro, Trebbiano, Albana di Romagna — selezionati personalmente dalla famiglia Bollini che gestisce il locale da tre generazioni.

Tra i clienti celebri: Tonino Guerra, il poeta e sceneggiatore di Amarcord, era di casa; Federico Fellini vi portò Marcello Mastroianni durante le riprese di un film; Paolo Villaggio veniva regolarmente durante le estati riminesi.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Santarcangelo_di_Romagna.jpg/800px-Santarcangelo_di_Romagna.jpg',
        gallery: [],
        social: {},
        founded_year: 1956,
        protected: false,
        city: 'Rimini',
    },
    {
        id: 'pasticceria-veneziana',
        name: 'Pasticceria Veneziana',
        category: 'bar',
        coordinates: { lat: 44.05900, lng: 12.56580 },
        address: 'Via IV Novembre, 19, 47921 Rimini',
        description: 'La pasticceria storica del centro: dal 1899 produce i dolci della tradizione romagnola, dalla ciambella alla piadina dolce, con i macchinari dell\'epoca.',
        full_story: `La Pasticceria Veneziana nacque nel 1899 quando il maestro pasticcere veneziano Emilio Zorzi si trasferì a Rimini e aprì un laboratorio in Via IV Novembre, a due passi dalla Piazza Tre Martiri. Zorzi portò con sé le tecniche veneziane della lavorazione dello zucchero e del cioccolato fondente, fondendole con le tradizioni dolciarie romagnole.

Il laboratorio originale occupa ancora il retro del negozio: i forni di ghisa del 1920, i tavoli di marmo Bardiglio su cui si stende ancora la sfoglia a mano, le impastatrici a braccio degli anni '40 che continuano a lavorare impeccabilmente. La quinta generazione della famiglia Zorzi — oggi guidata da Marzia e suo figlio Luca — ha mantenuto inalterata la ricetta della ciambella romagnola con anice e strutto, della piadina dolce con i fichi e del "bracciatello" di Pasqua.

Durante la Seconda Guerra Mondiale il laboratorio continuò a produrre, adattando le ricette alla scarsità di zucchero e burro. I Zorzi distribuivano dolci gratuitamente ai bambini sfollati e alle famiglie colpite dai bombardamenti — una tradizione di generosità che la famiglia racconta ancora con orgoglio.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Piazza_Tre_Martiri_Rimini.jpg/800px-Piazza_Tre_Martiri_Rimini.jpg',
        gallery: [],
        social: {},
        founded_year: 1899,
        protected: true,
        city: 'Rimini',
    },
    {
        id: 'trattoria-del-marino',
        name: 'Trattoria del Marino',
        category: 'restaurant',
        coordinates: { lat: 44.02890, lng: 12.55430 },
        address: 'Via Roma, 23, 47838 Riccione (RN)',
        description: 'La trattoria storica di Riccione: dal 1938 la cucina di mare della Riviera in un ambiente d\'epoca sopravvissuto all\'ondata del turismo di massa.',
        full_story: `La Trattoria del Marino aprì nel 1938 a Riccione, allora ancora un piccolo borgo di pescatori ai margini della Riviera in espansione. Il fondatore, Marino Semprini, aveva lavorato sulle barche da pesca per vent'anni prima di decidere che il suo posto era in cucina, non in mare.

Il locale è sopravvissuto intatto all'urbanizzazione selvaggia degli anni '60 e '70 che ha trasformato Riccione nella capitale del divertimento estivo italiano. Mentre attorno crescevano alberghi a quattro stelle, discoteche e pensioni da mille letti, la Trattoria del Marino è rimasta fedele a se stessa: dodici tavoli, tovaglie a quadretti bianchi e rossi, menu scritto a mano sulla lavagna ogni mattina in base al pescato del giorno.

La ricetta del brodetto all'adriatica — con capesante, vongole, cozze, scampi e pesce di scoglio in un brodo di pomodoro e vino bianco dei Colli Riminesi — è considerata tra le migliori della Riviera. La griglia a legna di gelso, accesa ogni mattina alle sei, è la stessa del 1950. La famiglia Semprini è alla terza generazione, e nessuno ha ancora ceduto alle lusinghe del turismo di massa.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Riccione_spiaggia.jpg/800px-Riccione_spiaggia.jpg',
        gallery: [],
        social: {},
        founded_year: 1938,
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
