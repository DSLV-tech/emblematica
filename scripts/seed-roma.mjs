#!/usr/bin/env node
/**
 * seed-roma.mjs
 *
 * Carica i locali storici di Roma (attivi da 100 anni o più) nella collection `locales_roma`.
 * Coordinate geocodificate con OpenStreetMap/Nominatim; immagini da Wikimedia Commons.
 *
 * Uso:
 *   node scripts/seed-roma.mjs
 *   node scripts/seed-roma.mjs --dry-run
 *   node scripts/seed-roma.mjs --force
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const isDryRun = process.argv.includes('--dry-run')
const force    = process.argv.includes('--force')
const COLLECTION = 'locales_roma'

const LOCALES = [
    {
        id: 'la-campana',
        name: 'La Campana',
        category: 'restaurant',
        coordinates: { lat: 41.90265, lng: 12.47456 },
        address: 'Vicolo della Campana, 18, 00186 Roma',
        description: 'Considerato il ristorante più antico di Roma: le prime notizie risalgono al 1518, quando era una locanda per i viaggiatori.',
        full_story: `La Campana è riconosciuta come il locale di ristoro più antico di Roma. Le prime tracce risalgono al 1518 circa, e il censimento del 1526 registra già un "Pietro della Campana" come oste del vicolo che ancora oggi porta lo stesso nome, a due passi da via della Scrofa.

All'epoca era una locanda di posta: qui si fermavano i viaggiatori che entravano in città dalla via Flaminia e da Porta del Popolo, cercando un letto, una stalla per i cavalli e un piatto caldo prima di raggiungere San Pietro. Per cinque secoli, mentre attorno cambiavano papi, re e repubbliche, il vicolo ha continuato a dare da mangiare a chi arrivava.

Oggi La Campana è una trattoria romana classica, con camerieri in giacca e un menu che non insegue le mode: carciofi, abbacchio, coda alla vaccinara, puntarelle in stagione. È il posto in cui i romani portano i parenti in visita per mostrare come si mangiava "una volta", sapendo che qui "una volta" significa davvero mezzo millennio.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Via_della_Scrofa%3B_Scrofa.jpg/960px-Via_della_Scrofa%3B_Scrofa.jpg',
        gallery: [],
        social: {},
        founded_year: 1518,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'antica-farmacia-pesci',
        name: 'Antica Farmacia Pesci',
        category: 'pharmacy',
        coordinates: { lat: 41.90091, lng: 12.48368 },
        address: 'Piazza di Trevi, 89, 00187 Roma',
        description: 'Dal 1552 accanto alla Fontana di Trevi: una spezieria nata sotto il governo papale, con arredi e mortai tutelati dallo Stato.',
        full_story: `L'Antica Farmacia Pesci apre nel 1552, nella Roma di papa Giulio III, quando una disposizione pontificia stabilì che i medicamenti dovessero essere accessibili anche ai poveri. Si affaccia su piazza di Trevi da quasi due secoli prima che Nicola Salvi costruisse la fontana che oggi le sta davanti.

Nei suoi laboratori venivano preparati i rimedi della farmacopea romana, tra cui il cosiddetto "balsamo innocenziano", un unguento lenitivo a base di sostanze naturali legato alla tradizione dei pontefici. Scaffalature in legno, vasi in maiolica e antichi mortai raccontano un'epoca in cui il farmacista era prima di tutto uno speziale.

Gli arredi storici sono vincolati e tutelati dal Ministero della Cultura. La farmacia è ancora in attività, oggi guidata dalla terza generazione della famiglia Ciotti: chi entra a comprare un'aspirina lo fa sotto gli stessi soffitti che hanno visto passare quasi cinque secoli di malanni romani.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Trevi_Fountain_-_Roma.jpg/960px-Trevi_Fountain_-_Roma.jpg',
        gallery: [],
        social: {},
        founded_year: 1552,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'spezieria-santa-maria-della-scala',
        name: 'Antica Spezieria di Santa Maria della Scala',
        category: 'pharmacy',
        coordinates: { lat: 41.89129, lng: 12.46799 },
        address: 'Piazza della Scala, 23, 00153 Roma',
        description: 'La farmacia dei Carmelitani Scalzi di Trastevere: per tre secoli ha curato papi e popolani con le erbe dell\'orto del convento.',
        full_story: `All'inizio del Seicento i Carmelitani Scalzi si stabilirono nel convento di Santa Maria della Scala, in Trastevere, e cominciarono a coltivare erbe medicinali. Da quell'orto nacque una spezieria che, aperta al pubblico alla fine del secolo, divenne una delle farmacie più celebri della città: ci si rivolgevano tanto la corte pontificia quanto la gente del rione.

I frati distillavano, pestavano e conservavano i propri preparati in vasi di ceramica ancora allineati sugli scaffali originali. Il laboratorio produceva elisir, unguenti e distillati secondo ricette custodite dall'ordine.

I Carmelitani hanno gestito la spezieria fino al 1954. Oggi al piano terra lavora una farmacia moderna, mentre le sale storiche al primo piano sono conservate come un museo visitabile su prenotazione: uno dei rari luoghi di Roma dove si può vedere, intatto, il mondo degli speziali barocchi.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Trastevere_-_santa_maria_della_scala_01586-9.JPG/960px-Trastevere_-_santa_maria_della_scala_01586-9.JPG',
        gallery: [],
        social: {},
        founded_year: 1600,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'antica-erboristeria-romana',
        name: 'Antica Erboristeria Romana',
        category: 'shop',
        coordinates: { lat: 41.89530, lng: 12.47645 },
        address: 'Via di Torre Argentina, 15, 00186 Roma',
        description: 'Dal 1752 erbe, radici e spezie tra cassetti di noce intagliato, a pochi passi dall\'area sacra di Largo Argentina.',
        full_story: `L'Antica Erboristeria Romana è attiva dal 1752 in via di Torre Argentina, la strada che collega il Pantheon all'area sacra dove fu ucciso Giulio Cesare. È una delle botteghe storiche riconosciute dal Comune di Roma.

Entrare qui significa ritrovarsi in una spezieria settecentesca: l'interno è interamente rivestito in noce italiano intagliato, con centinaia di piccoli cassetti etichettati a mano che custodiscono erbe officinali, radici, cortecce e spezie. Sul banco sono rimaste le vecchie bilance con cui le erbe venivano pesate a grammi.

Dal secondo dopoguerra la bottega è gestita dalla stessa famiglia, che ne ha conservato arredi e metodo. Si vende ancora sfuso, al peso, consigliando il cliente come si faceva quando l'erborista era il primo medico del quartiere.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Largo_di_Torre_Argentina_4.jpg/960px-Largo_di_Torre_Argentina_4.jpg',
        gallery: [],
        social: {},
        founded_year: 1752,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'gammarelli',
        name: 'Gammarelli',
        category: 'shop',
        coordinates: { lat: 41.89777, lng: 12.47716 },
        address: 'Via di Santa Chiara, 34, 00186 Roma',
        description: 'Il sarto dei papi dal 1798: sei generazioni di Gammarelli hanno cucito talari, zucchetti e calze rosse per il clero di tutto il mondo.',
        full_story: `Nel 1798, sotto il pontificato di Pio VI, Giovanni Antonio Gammarelli aprì una sartoria per il clero romano. Da allora la bottega è passata di padre in figlio — Filippo, poi Annibale, poi i figli di Annibale, Bonaventura e Giuseppe, che le diedero il nome "Ditta Annibale Gammarelli" — fino alla sesta generazione, che ne ha preso la guida nel 2016.

Nel 1874 Annibale trasferì il negozio nella sede attuale di via di Santa Chiara, dietro il Pantheon, accanto alla Pontificia Accademia Ecclesiastica. In vetrina, da allora, si vedono le stesse cose: talari nere, fasce paonazze per i vescovi, zucchetti rossi per i cardinali e le celebri calze di filo di cotone nei colori della gerarchia ecclesiastica.

Gammarelli è conosciuto nel mondo come il sarto del Papa: da Pio IX in poi quasi ogni pontefice ha indossato abiti usciti da questo laboratorio. Prima di ogni conclave la sartoria prepara tre talari bianche in taglie diverse, perché nessuno sa in anticipo chi uscirà sulla Loggia delle Benedizioni. È riconosciuta come bottega storica di Roma dal 1998.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Gammarelli_%28Roma%29.jpg/960px-Gammarelli_%28Roma%29.jpg',
        gallery: [],
        social: { website: 'https://www.gammarelli.com' },
        founded_year: 1798,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'poggi-belle-arti',
        name: 'Ditta G. Poggi',
        category: 'shop',
        coordinates: { lat: 41.89745, lng: 12.47871 },
        address: 'Via del Gesù, 74, 00186 Roma',
        description: 'Colori, pennelli e tele per gli artisti di Roma dal 1825, tra il Pantheon e la chiesa del Gesù.',
        full_story: `La Ditta G. Poggi rifornisce gli artisti di Roma dal 1825. In origine era una drogheria che vendeva un po' di tutto, ma col tempo si specializzò in ciò che serviva a pittori, decoratori e restauratori: pigmenti, oli, vernici, pennelli e tele.

La sede storica di via del Gesù, a metà strada tra il Pantheon e la chiesa madre dei Gesuiti, si trova nel cuore della città che per secoli è stata la meta obbligata degli artisti europei. Dagli studenti delle accademie ai restauratori dei cantieri vaticani, intere generazioni sono passate dal suo bancone per comprare un tubetto di terra di Siena o una matita di carboncino.

Riconosciuta come bottega storica dal Comune di Roma, la Poggi oggi conta anche punti vendita a Trastevere e in via di Ripetta, ma via del Gesù resta il negozio di riferimento: scaffali fino al soffitto e personale che sa ancora consigliare il pennello giusto per una velatura.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Chiesa_del_Ges%C3%B9_facciata.jpg/960px-Chiesa_del_Ges%C3%B9_facciata.jpg',
        gallery: [],
        social: {},
        founded_year: 1825,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'libreria-tombolini',
        name: 'Libreria Tombolini',
        category: 'bookshop',
        coordinates: { lat: 41.89709, lng: 12.48434 },
        address: 'Via IV Novembre, 146, 00187 Roma',
        description: 'Libreria antiquaria dal 1874: classici, filologia, arte ed esoterismo a pochi passi da Piazza Venezia.',
        full_story: `La Libreria Tombolini è attiva dal 1874, appena quattro anni dopo che Roma era diventata capitale del Regno d'Italia. Mentre la città si riempiva di ministeri, funzionari e nuovi quartieri, nasceva una nuova classe di lettori, e via IV Novembre, a due passi da Piazza Venezia, si trovava proprio al centro della Roma umbertina che si stava costruendo.

Tombolini è una libreria antiquaria e di studio: tra gli scaffali si trovano testi di antichità classica e medievale, filologia classica e romanza, letteratura italiana, filosofia, storia dell'arte, psicologia ed esoterismo. È il tipo di negozio dove si entra cercando un volume preciso e si esce con tre libri che non si sapeva di cercare.

È riconosciuta come bottega storica del Comune di Roma dal 1998. Sopravvissuta a un secolo e mezzo di trasformazioni del commercio librario, resta uno degli ultimi presidi della libreria d'antiquariato nel centro della città.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Roma-Via_4_novembre.jpg/960px-Roma-Via_4_novembre.jpg',
        gallery: [],
        social: {},
        founded_year: 1874,
        protected: true,
        city: 'Roma',
    },
    {
        id: 'palazzo-del-freddo-fassi',
        name: 'Palazzo del Freddo Giovanni Fassi',
        category: 'bar',
        coordinates: { lat: 41.89363, lng: 12.50802 },
        address: 'Via Principe Eugenio, 65, 00185 Roma',
        description: 'La gelateria più antica di Roma: nata nel 1880 vendendo ghiaccio e birra, dal 1928 nel suo "palazzo" all\'Esquilino.',
        full_story: `La storia dei Fassi comincia nel 1880, quando la famiglia vendeva ghiaccio e birra nel centro di Roma, in un'epoca in cui il freddo era un lusso che si comprava a blocchi. Dal ghiaccio al gelato il passo fu breve, e dopo diversi trasferimenti, nel 1928 Giovanni Fassi inaugurò il Palazzo del Freddo in via Principe Eugenio, vicino a piazza Vittorio.

Il nome non è un'esagerazione: l'edificio occupa circa 700 metri quadrati, una parte dei quali dedicata al laboratorio di produzione a vista. Durante la Seconda guerra mondiale, nel 1944, il palazzo fu requisito dalle truppe americane, che lo lasciarono soltanto nel 1946.

Oggi la gelateria è guidata dalla quinta generazione della famiglia. Il Sanpietrino — un cubetto di gelato ricoperto di cioccolato, come i sampietrini delle strade romane — e il Caterinetta, un semifreddo ricoperto, sono rimasti i classici del banco. All'Esquilino, quartiere tra i più multietnici della città, il Palazzo del Freddo è un punto fermo da quasi un secolo.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Palazzo_del_Freddo_Giovanni_Fassi_in_2021.01.jpg/960px-Palazzo_del_Freddo_Giovanni_Fassi_in_2021.01.jpg',
        gallery: [],
        social: {},
        founded_year: 1880,
        protected: false,
        city: 'Roma',
    },
    {
        id: 'checchino-dal-1887',
        name: 'Checchino dal 1887',
        category: 'restaurant',
        coordinates: { lat: 41.87642, lng: 12.47396 },
        address: 'Via di Monte Testaccio, 30, 00153 Roma',
        description: 'Davanti all\'ex Mattatoio di Testaccio dal 1887: la famiglia Mariani custodisce la cucina romana del quinto quarto.',
        full_story: `Checchino apre nel 1887 ai piedi del Monte Testaccio, la collina artificiale formata dai cocci delle anfore dell'antico porto fluviale. Pochi anni dopo, proprio di fronte, sorse il Mattatoio di Roma, e la storia della trattoria si legò per sempre a quella del macello.

Gli operai del Mattatoio — i "vaccinari" — ricevevano parte della paga in natura: le frattaglie, il cosiddetto quinto quarto, cioè ciò che restava dopo la vendita dei quattro quarti nobili della bestia. Coda, trippa, pajata, animelle finivano nelle cucine di Testaccio, e da Checchino diventavano piatti che oggi definiscono la cucina romana. La coda alla vaccinara è il piatto con cui il locale è più spesso identificato.

Da quasi centoquarant'anni il ristorante è gestito dalla famiglia Mariani. Il Mattatoio ha chiuso nel 1975 ed è oggi un polo culturale, ma da Checchino la cucina del quinto quarto è rimasta, insieme a una cantina scavata nel tufo del Monte dei Cocci.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Testaccio_monte_dei_cocci_051204-12-13.JPG/960px-Testaccio_monte_dei_cocci_051204-12-13.JPG',
        gallery: [],
        social: {},
        founded_year: 1887,
        protected: false,
        city: 'Roma',
    },
    {
        id: 'giolitti',
        name: 'Giolitti',
        category: 'bar',
        coordinates: { lat: 41.90106, lng: 12.47725 },
        address: 'Via degli Uffici del Vicario, 40, 00186 Roma',
        description: 'Dal 1890 la famiglia Giolitti fa colazioni, dolci e gelato a due passi da Montecitorio e dal Pantheon.',
        full_story: `Nel 1890 Giuseppe e Bernardina Giolitti aprirono una latteria alla salita del Grillo, vendendo il latte delle proprie mucche che pascolavano nella campagna romana. La qualità del prodotto fu tale che la Real Casa divenne cliente, e nel giro di pochi anni la famiglia aprì altri punti vendita in città.

Fu il figlio Nazzareno a cominciare, attorno al 1900, a produrre gelato accanto ai latticini. La sede di via degli Uffici del Vicario, tra il Pantheon e Montecitorio, divenne il cuore dell'attività: banconi lunghissimi, specchi, vetrine di pasticceria e camerieri in giacca bianca.

Per la vicinanza alla Camera dei Deputati, Giolitti è da sempre frequentato da politici e giornalisti parlamentari, oltre che da file di turisti. È ancora un'azienda di famiglia, con una seconda sede all'EUR, e il gelato si serve ancora con la panna montata sopra, come vuole la tradizione romana.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/GiolittiCafeRoma.jpg/960px-GiolittiCafeRoma.jpg',
        gallery: [],
        social: { website: 'https://giolitti.it' },
        founded_year: 1890,
        protected: false,
        city: 'Roma',
    },
    {
        id: 'babingtons',
        name: 'Babingtons Tea Rooms',
        category: 'bar',
        coordinates: { lat: 41.90606, lng: 12.48232 },
        address: 'Piazza di Spagna, 23, 00187 Roma',
        description: 'Una sala da tè inglese ai piedi di Trinità dei Monti, fondata nel 1893 da due donne con cento sterline.',
        full_story: `Nel dicembre 1893 due giovani donne britanniche, Isabel Cargill e Anna Maria Babington, misero insieme circa cento sterline e aprirono una sala da tè in via Due Macelli. Roma era piena di viaggiatori inglesi del Grand Tour, ma trovare una tazza di tè fatta come si deve era impossibile.

Pochi anni dopo la sala da tè si trasferì al numero 23 di piazza di Spagna, ai piedi della scalinata di Trinità dei Monti, dove si trova ancora oggi. Il nome scelto fu quello di Babington, considerato più facile da pronunciare per i romani. Anna Maria Babington lasciò Roma per motivi di salute e morì in Svizzera nel 1929.

Arredi in legno scuro, scones, porridge e tè in teiere di porcellana sono rimasti quelli di allora. Babingtons è ancora gestito dai discendenti di Isabel Cargill ed è uno dei rari locali di Roma in cui l'Ottocento britannico e la piazza più scenografica della città convivono nella stessa stanza.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Babington%27s_tea_rooms.jpg/960px-Babington%27s_tea_rooms.jpg',
        gallery: [],
        social: { website: 'https://babingtons.com' },
        founded_year: 1893,
        protected: false,
        city: 'Roma',
    },
    {
        id: 'antica-birreria-peroni',
        name: 'Antica Birreria Peroni',
        category: 'restaurant',
        coordinates: { lat: 41.89877, lng: 12.48246 },
        address: 'Via di San Marcello, 19, 00187 Roma',
        description: 'Dal 1906 deposito di ghiaccio e birra Peroni, poi birreria: un angolo di Mitteleuropa a due passi da Fontana di Trevi.',
        full_story: `L'Antica Birreria Peroni nasce nel 1906 come spaccio di birra e ghiaccio della Peroni, che da pochi decenni aveva portato la sua produzione a Roma. Da via di San Marcello partivano i carretti trainati dai cavalli che consegnavano botti e blocchi di ghiaccio alle osterie e alle case del quartiere.

Con il tempo il deposito diventò una birreria vera e propria. Le sale hanno conservato il carattere dei primi del Novecento: volte affrescate con motti e decorazioni liberty, panche di legno, lunghi tavoli comuni. Il menu è quello di una birreria d'altri tempi, con würstel, gulasch e stinco accanto ai fritti e ai primi della cucina romana.

Sempre affollata, chiusa la domenica e senza prenotazioni, l'Antica Birreria Peroni è uno degli ex depositi di ghiaccio e birra ancora attivi in città, e uno dei pochi posti del centro dove romani e turisti si siedono gomito a gomito allo stesso tavolo.`,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/San_Marcello_al_Corso_-_Facade.jpg/960px-San_Marcello_al_Corso_-_Facade.jpg',
        gallery: [],
        social: {},
        founded_year: 1906,
        protected: false,
        city: 'Roma',
    },
]

async function main() {
    console.log(`\n🏛️  Seed Roma — collection: ${COLLECTION}`)
    console.log(`   Modalità: ${isDryRun ? '🔍 DRY RUN' : force ? '⚠️  FORCE' : '🔒 SKIP esistenti'}\n`)

    if (isDryRun) {
        for (const locale of LOCALES) console.log(`  [DRY] ${locale.founded_year}  ${locale.name} (${locale.id})`)
        console.log(`\n📊 Riepilogo: ${LOCALES.length} locali pronti\n`)
        return
    }

    const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
    let serviceAccount
    try {
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    } catch {
        console.error('❌  Could not read service-account.json')
        process.exit(1)
    }

    initializeApp({ credential: cert(serviceAccount) })
    const colRef = getFirestore().collection(COLLECTION)
    let added = 0, skipped = 0, updated = 0

    for (const locale of LOCALES) {
        const { id, ...data } = locale
        const docRef = colRef.doc(id)

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
