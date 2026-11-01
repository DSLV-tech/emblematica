import type { LangCode } from '../i18n/translations'

/**
 * Testi legali. Stanno fuori da translations.ts perché servono solo a LegalView,
 * caricata a richiesta. L'italiano è la versione che fa fede (vedi Termini).
 * Da aggiornare quando cambiano i dati raccolti o i fornitori esterni.
 */

export const LEGAL_DOCS = ['privacy', 'terms', 'cookies', 'notice'] as const
export type LegalDoc = (typeof LEGAL_DOCS)[number]

export const LEGAL_UPDATED = '2026-11-01'

/** Dati del titolare: `null` compare nell'app come "da completare" */
export const LEGAL_ENTITY: { name: string | null; address: string | null; vat: string | null; email: string } = {
  name: null,
  address: null,
  vat: null,
  email: 'info@barnaemblematica.com',
}

export interface LegalSection {
  h: string
  p: string[]
}

export interface LegalCopy {
  provider: { name: string; address: string; vat: string; email: string }
  privacy: LegalSection[]
  terms: LegalSection[]
  cookies: LegalSection[]
  notice: LegalSection[]
}

export const LEGAL_COPY: Record<LangCode, LegalCopy> = {
  it: {
    provider: { name: 'Titolare', address: 'Sede', vat: 'Partita IVA', email: 'Email' },
    privacy: [
      { h: 'Titolare del trattamento', p: ['Il titolare è il soggetto indicato nelle Note legali di questa pagina, contattabile a {email}. Questa informativa è resa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).'] },
      { h: 'Quali dati trattiamo', p: [
        'Account: email, nome e foto del profilo (questi ultimi solo con l\'accesso Google), identificativo utente, date di creazione e ultimo accesso.',
        'Uso dell\'app: locali preferiti e timbri del passaporto, con locale e data della visita.',
        'Posizione: chiesta solo quando timbri il passaporto o avvii una navigazione. Per il timbro resta sul dispositivo: salviamo la posizione del locale, non la tua. Per la navigazione viene inviata al servizio di calcolo del percorso e non viene salvata da noi.',
        'Richieste di rivendicazione di un locale: nome dell\'attività, ruolo, email, telefono facoltativo e messaggio.',
        'Dati tecnici: indirizzo IP e dati di connessione, trattati dai fornitori che erogano il servizio.',
      ] },
      { h: 'Perché e su quale base', p: [
        'Fornire account, preferiti, passaporto e navigazione: esecuzione del contratto (art. 6.1.b).',
        'Gestire le rivendicazioni: misure richieste dall\'interessato (art. 6.1.b).',
        'Sicurezza e funzionamento del servizio: legittimo interesse (art. 6.1.f).',
        'Non usiamo i dati per pubblicità o profilazione e non usiamo strumenti di analisi statistica.',
      ] },
      { h: 'A chi arrivano i dati', p: [
        'Google (Firebase: autenticazione, database, archiviazione file; Google Fonts: caratteri tipografici); Vercel (hosting); OpenFreeMap (mappe); FOSSGIS e.V. tramite routing.openstreetmap.de (percorsi a piedi); Wikimedia Commons (immagini).',
        'Alcuni fornitori possono trattare dati fuori dallo Spazio economico europeo, con le garanzie previste dal GDPR (decisione di adeguatezza o clausole contrattuali standard). I dati non vengono venduti.',
      ] },
      { h: 'Per quanto tempo', p: ['I dati dell\'account, i preferiti e il passaporto restano finché l\'account è attivo. Le rivendicazioni si conservano per 12 mesi dalla loro chiusura. I dati salvati sul dispositivo restano finché non li cancelli dal browser.'] },
      { h: 'I tuoi diritti', p: ['Puoi chiedere accesso, rettifica, cancellazione (compresa quella dell\'account), limitazione, portabilità e opporti al trattamento scrivendo a {email}. Puoi revocare il permesso di posizione dalle impostazioni del dispositivo. Puoi inoltre presentare reclamo al Garante per la protezione dei dati personali o all\'autorità del tuo Paese.'] },
      { h: 'Minori', p: ['La registrazione è riservata a chi ha almeno 14 anni. L\'app si può usare come ospite senza fornire dati personali.'] },
      { h: 'Modifiche', p: ['Eventuali modifiche saranno pubblicate qui, con la data di aggiornamento.'] },
    ],
    terms: [
      { h: 'Il servizio', p: ['Emblematica è una mappa gratuita dei locali storici, con storie, percorsi a piedi e un passaporto digitale. Usandola accetti questi termini. Puoi usarla come ospite; preferiti sincronizzati e timbri richiedono un account.'] },
      { h: 'Account', p: ['Devi avere almeno 14 anni e fornire dati corretti. Sei responsabile delle tue credenziali. Puoi chiedere la chiusura dell\'account in ogni momento; possiamo sospenderlo in caso di abuso o violazione di questi termini.'] },
      { h: 'Uso corretto', p: ['Non è consentito aggirare le misure di sicurezza, estrarre i contenuti in modo automatico, timbrare il passaporto con posizioni falsificate o inviare rivendicazioni per attività che non rappresenti.'] },
      { h: 'Contenuti e affidabilità', p: ['Le informazioni hanno scopo culturale e informativo. Possono essere incomplete o superate: orari, apertura e dati storici vanno verificati. Segnalaci gli errori a {email}.'] },
      { h: 'Navigazione', p: ['I percorsi sono calcolati automaticamente e possono essere imprecisi. Presta attenzione alla strada e rispetta le norme di circolazione.'] },
      { h: 'Proprietà intellettuale', p: ['Testi, marchio e grafica appartengono a Emblematica o ai rispettivi titolari. Immagini e dati cartografici di terzi restano soggetti alle loro licenze.'] },
      { h: 'Responsabilità', p: ['Il servizio è fornito così com\'è, senza garanzia di continuità. Nei limiti di legge non rispondiamo dei danni indiretti derivanti dall\'uso dell\'app. Restano salvi i diritti inderogabili dei consumatori e la responsabilità per dolo o colpa grave.'] },
      { h: 'Legge e modifiche', p: ['Si applica la legge italiana, ferme le tutele inderogabili del tuo Paese di residenza; per i consumatori è competente il foro di residenza. In caso di divergenza tra traduzioni fa fede il testo italiano. Le modifiche sostanziali saranno comunicate nell\'app.'] },
    ],
    cookies: [
      { h: 'In breve', p: ['Non usiamo cookie di profilazione o di analisi, quindi non serve un banner di consenso. Usiamo solo l\'archiviazione tecnica indispensabile al funzionamento.'] },
      { h: 'Cosa salviamo sul dispositivo', p: [
        'emblematica-lang ed emblematica-city: lingua e città scelte.',
        'barna_favorites: preferiti di chi usa l\'app come ospite.',
        'Firebase (IndexedDB): sessione di accesso e copia locale dei dati per l\'uso offline.',
        'Cache del service worker: file dell\'app, mappe e immagini per l\'uso offline.',
      ] },
      { h: 'Terze parti', p: ['L\'accesso con Google apre una finestra di Google, che usa i propri cookie secondo la propria informativa. Puoi cancellare tutti i dati locali dalle impostazioni del browser.'] },
    ],
    notice: [
      { h: 'Avvertenza', p: ['Contenuti storici a scopo informativo e culturale. Emblematica non è affiliata ad alcuna amministrazione comunale né ai locali citati, salvo diversa indicazione.'] },
      { h: 'Crediti', p: ['Dati cartografici © OpenStreetMap (licenza ODbL), tile OpenFreeMap e OpenMapTiles. Percorsi calcolati con OSRM tramite FOSSGIS e.V. Icone Phosphor. Le immagini dei locali provengono in parte da Wikimedia Commons e restano soggette alle licenze dei rispettivi autori.'] },
    ],
  },
  en: {
    provider: { name: 'Provider', address: 'Registered office', vat: 'VAT number', email: 'Email' },
    privacy: [
      { h: 'Data controller', p: ['The controller is the party named in the Legal notice on this page, reachable at {email}. This notice is provided under Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR).'] },
      { h: 'What data we process', p: [
        'Account: email, name and profile photo (the latter two only with Google sign-in), user ID, creation and last sign-in dates.',
        'App use: favourite venues and passport stamps, with venue and visit date.',
        'Location: requested only when you stamp your passport or start navigation. For stamps it stays on your device: we save the venue\'s position, not yours. For navigation it is sent to the routing service and is not saved by us.',
        'Venue claim requests: business name, role, email, optional phone number and message.',
        'Technical data: IP address and connection data, processed by the providers that deliver the service.',
      ] },
      { h: 'Why, and on what legal basis', p: [
        'Providing accounts, favourites, passport and navigation: performance of a contract (Art. 6(1)(b)).',
        'Handling claims: steps taken at your request (Art. 6(1)(b)).',
        'Security and operation of the service: legitimate interest (Art. 6(1)(f)).',
        'We do not use data for advertising or profiling, and we use no analytics tools.',
      ] },
      { h: 'Who receives the data', p: [
        'Google (Firebase: authentication, database, file storage; Google Fonts: typefaces); Vercel (hosting); OpenFreeMap (maps); FOSSGIS e.V. via routing.openstreetmap.de (walking routes); Wikimedia Commons (images).',
        'Some providers may process data outside the European Economic Area under GDPR safeguards (adequacy decision or standard contractual clauses). Data is never sold.',
      ] },
      { h: 'How long we keep it', p: ['Account data, favourites and passport are kept while the account is active. Claims are kept for 12 months after they are closed. Data stored on your device stays until you clear it from your browser.'] },
      { h: 'Your rights', p: ['You can request access, rectification, erasure (including of your account), restriction and portability, and object to processing, by writing to {email}. You can withdraw location permission in your device settings. You may also complain to your national data protection authority.'] },
      { h: 'Minors', p: ['Registration is for people aged 14 or over. The app can be used as a guest without providing personal data.'] },
      { h: 'Changes', p: ['Any changes will be published here, with the date of the update.'] },
    ],
    terms: [
      { h: 'The service', p: ['Emblematica is a free map of historic venues, with stories, walking routes and a digital passport. By using it you accept these terms. You can use it as a guest; synced favourites and stamps require an account.'] },
      { h: 'Accounts', p: ['You must be at least 14 and provide accurate details. You are responsible for your credentials. You can ask to close your account at any time; we may suspend it in case of abuse or breach of these terms.'] },
      { h: 'Fair use', p: ['You may not bypass security measures, scrape content automatically, stamp your passport with spoofed locations, or submit claims for businesses you do not represent.'] },
      { h: 'Content and reliability', p: ['Information is provided for cultural and informational purposes. It may be incomplete or out of date: check opening hours and historical details. Report errors to {email}.'] },
      { h: 'Navigation', p: ['Routes are calculated automatically and may be inaccurate. Pay attention to the road and follow traffic rules.'] },
      { h: 'Intellectual property', p: ['Text, brand and graphics belong to Emblematica or their respective owners. Third-party images and map data remain subject to their licences.'] },
      { h: 'Liability', p: ['The service is provided as is, with no guarantee of continuity. To the extent permitted by law we are not liable for indirect damage arising from use of the app. Mandatory consumer rights and liability for wilful misconduct or gross negligence are unaffected.'] },
      { h: 'Law and changes', p: ['Italian law applies, without prejudice to mandatory protections in your country of residence; consumers may bring claims in the courts of their place of residence. If translations differ, the Italian text prevails. Material changes will be announced in the app.'] },
    ],
    cookies: [
      { h: 'In short', p: ['We use no profiling or analytics cookies, so no consent banner is needed. We only use the technical storage the app needs to work.'] },
      { h: 'What we store on your device', p: [
        'emblematica-lang and emblematica-city: chosen language and city.',
        'barna_favorites: favourites of guest users.',
        'Firebase (IndexedDB): sign-in session and local copy of data for offline use.',
        'Service worker cache: app files, maps and images for offline use.',
      ] },
      { h: 'Third parties', p: ['Google sign-in opens a Google window, which uses its own cookies under its own policy. You can delete all local data from your browser settings.'] },
    ],
    notice: [
      { h: 'Disclaimer', p: ['Historical content for informational and cultural purposes. Emblematica is not affiliated with any city council or with the venues mentioned, unless stated otherwise.'] },
      { h: 'Credits', p: ['Map data © OpenStreetMap (ODbL licence), OpenFreeMap and OpenMapTiles tiles. Routes calculated with OSRM via FOSSGIS e.V. Phosphor icons. Some venue images come from Wikimedia Commons and remain subject to their authors\' licences.'] },
    ],
  },
  es: {
    provider: { name: 'Titular', address: 'Domicilio', vat: 'NIF/IVA', email: 'Correo electrónico' },
    privacy: [
      { h: 'Responsable del tratamiento', p: ['El responsable es quien figura en el Aviso legal de esta página, con contacto en {email}. Esta información se facilita conforme a los artículos 13 y 14 del Reglamento (UE) 2016/679 (RGPD).'] },
      { h: 'Qué datos tratamos', p: [
        'Cuenta: correo electrónico, nombre y foto de perfil (estos dos solo con acceso de Google), identificador de usuario, fechas de creación y último acceso.',
        'Uso de la app: locales favoritos y sellos del pasaporte, con el local y la fecha de la visita.',
        'Ubicación: solo se solicita al sellar el pasaporte o iniciar una navegación. Para el sello permanece en el dispositivo: guardamos la posición del local, no la tuya. Para la navegación se envía al servicio de cálculo de rutas y no la guardamos.',
        'Solicitudes de reclamación de un local: nombre del negocio, cargo, correo, teléfono opcional y mensaje.',
        'Datos técnicos: dirección IP y datos de conexión, tratados por los proveedores que prestan el servicio.',
      ] },
      { h: 'Para qué y con qué base', p: [
        'Ofrecer cuenta, favoritos, pasaporte y navegación: ejecución de un contrato (art. 6.1.b).',
        'Gestionar reclamaciones: medidas solicitadas por el interesado (art. 6.1.b).',
        'Seguridad y funcionamiento del servicio: interés legítimo (art. 6.1.f).',
        'No usamos los datos para publicidad ni para elaborar perfiles, y no usamos herramientas de analítica.',
      ] },
      { h: 'Quién recibe los datos', p: [
        'Google (Firebase: autenticación, base de datos, almacenamiento de archivos; Google Fonts: tipografías); Vercel (alojamiento); OpenFreeMap (mapas); FOSSGIS e.V. mediante routing.openstreetmap.de (rutas a pie); Wikimedia Commons (imágenes).',
        'Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías del RGPD (decisión de adecuación o cláusulas contractuales tipo). Los datos no se venden.',
      ] },
      { h: 'Durante cuánto tiempo', p: ['Los datos de la cuenta, los favoritos y el pasaporte se conservan mientras la cuenta esté activa. Las reclamaciones se conservan 12 meses desde su cierre. Los datos guardados en el dispositivo permanecen hasta que los borres del navegador.'] },
      { h: 'Tus derechos', p: ['Puedes solicitar acceso, rectificación, supresión (incluida la de la cuenta), limitación y portabilidad, y oponerte al tratamiento, escribiendo a {email}. Puedes retirar el permiso de ubicación en los ajustes del dispositivo. También puedes reclamar ante la Agencia Española de Protección de Datos o la autoridad de tu país.'] },
      { h: 'Menores', p: ['El registro está reservado a mayores de 14 años. La app puede usarse como invitado sin facilitar datos personales.'] },
      { h: 'Cambios', p: ['Cualquier cambio se publicará aquí, con la fecha de actualización.'] },
    ],
    terms: [
      { h: 'El servicio', p: ['Emblematica es un mapa gratuito de locales históricos, con historias, rutas a pie y un pasaporte digital. Al usarlo aceptas estas condiciones. Puedes usarlo como invitado; los favoritos sincronizados y los sellos requieren una cuenta.'] },
      { h: 'Cuenta', p: ['Debes tener al menos 14 años y facilitar datos correctos. Eres responsable de tus credenciales. Puedes solicitar el cierre de la cuenta en cualquier momento; podemos suspenderla en caso de abuso o incumplimiento de estas condiciones.'] },
      { h: 'Uso correcto', p: ['No está permitido eludir las medidas de seguridad, extraer contenidos de forma automatizada, sellar el pasaporte con ubicaciones falsificadas ni enviar reclamaciones de negocios que no representas.'] },
      { h: 'Contenidos y fiabilidad', p: ['La información tiene fines culturales e informativos. Puede estar incompleta o desactualizada: comprueba horarios y datos históricos. Comunícanos los errores en {email}.'] },
      { h: 'Navegación', p: ['Las rutas se calculan automáticamente y pueden ser imprecisas. Presta atención a la vía y respeta las normas de circulación.'] },
      { h: 'Propiedad intelectual', p: ['Textos, marca y gráficos pertenecen a Emblematica o a sus respectivos titulares. Las imágenes y los datos cartográficos de terceros siguen sujetos a sus licencias.'] },
      { h: 'Responsabilidad', p: ['El servicio se ofrece tal cual, sin garantía de continuidad. En la medida permitida por la ley no respondemos de daños indirectos derivados del uso de la app. Quedan a salvo los derechos imperativos de los consumidores y la responsabilidad por dolo o culpa grave.'] },
      { h: 'Ley y cambios', p: ['Se aplica la ley italiana, sin perjuicio de las protecciones imperativas de tu país de residencia; los consumidores pueden acudir a los tribunales de su domicilio. Si las traducciones difieren, prevalece el texto italiano. Los cambios sustanciales se comunicarán en la app.'] },
    ],
    cookies: [
      { h: 'En resumen', p: ['No usamos cookies de perfilado ni de analítica, por lo que no hace falta un banner de consentimiento. Solo usamos el almacenamiento técnico imprescindible.'] },
      { h: 'Qué guardamos en el dispositivo', p: [
        'emblematica-lang y emblematica-city: idioma y ciudad elegidos.',
        'barna_favorites: favoritos de quienes usan la app como invitados.',
        'Firebase (IndexedDB): sesión de acceso y copia local de datos para el uso sin conexión.',
        'Caché del service worker: archivos de la app, mapas e imágenes para el uso sin conexión.',
      ] },
      { h: 'Terceros', p: ['El acceso con Google abre una ventana de Google, que usa sus propias cookies según su política. Puedes borrar todos los datos locales desde los ajustes del navegador.'] },
    ],
    notice: [
      { h: 'Advertencia', p: ['Contenidos históricos con fines informativos y culturales. Emblematica no está afiliada a ningún ayuntamiento ni a los locales citados, salvo indicación contraria.'] },
      { h: 'Créditos', p: ['Datos cartográficos © OpenStreetMap (licencia ODbL), teselas OpenFreeMap y OpenMapTiles. Rutas calculadas con OSRM mediante FOSSGIS e.V. Iconos Phosphor. Parte de las imágenes de los locales procede de Wikimedia Commons y sigue sujeta a las licencias de sus autores.'] },
    ],
  },
  ca: {
    provider: { name: 'Titular', address: 'Domicili', vat: 'NIF/IVA', email: 'Correu electrònic' },
    privacy: [
      { h: 'Responsable del tractament', p: ['El responsable és qui figura a l\'Avís legal d\'aquesta pàgina, amb contacte a {email}. Aquesta informació es facilita d\'acord amb els articles 13 i 14 del Reglament (UE) 2016/679 (RGPD).'] },
      { h: 'Quines dades tractem', p: [
        'Compte: correu electrònic, nom i foto de perfil (aquests dos només amb l\'accés de Google), identificador d\'usuari, dates de creació i darrer accés.',
        'Ús de l\'app: locals preferits i segells del passaport, amb el local i la data de la visita.',
        'Ubicació: només es demana en segellar el passaport o iniciar una navegació. Per al segell es queda al dispositiu: desem la posició del local, no la teva. Per a la navegació s\'envia al servei de càlcul de rutes i no la desem.',
        'Sol·licituds de reclamació d\'un local: nom del negoci, càrrec, correu, telèfon opcional i missatge.',
        'Dades tècniques: adreça IP i dades de connexió, tractades pels proveïdors que presten el servei.',
      ] },
      { h: 'Per a què i amb quina base', p: [
        'Oferir compte, preferits, passaport i navegació: execució d\'un contracte (art. 6.1.b).',
        'Gestionar reclamacions: mesures sol·licitades per l\'interessat (art. 6.1.b).',
        'Seguretat i funcionament del servei: interès legítim (art. 6.1.f).',
        'No fem servir les dades per a publicitat ni per elaborar perfils, i no fem servir eines d\'analítica.',
      ] },
      { h: 'Qui rep les dades', p: [
        'Google (Firebase: autenticació, base de dades, emmagatzematge de fitxers; Google Fonts: tipografies); Vercel (allotjament); OpenFreeMap (mapes); FOSSGIS e.V. mitjançant routing.openstreetmap.de (rutes a peu); Wikimedia Commons (imatges).',
        'Alguns proveïdors poden tractar dades fora de l\'Espai Econòmic Europeu amb les garanties de l\'RGPD (decisió d\'adequació o clàusules contractuals tipus). Les dades no es venen.',
      ] },
      { h: 'Durant quant de temps', p: ['Les dades del compte, els preferits i el passaport es conserven mentre el compte estigui actiu. Les reclamacions es conserven 12 mesos des del seu tancament. Les dades desades al dispositiu hi romanen fins que les esborris del navegador.'] },
      { h: 'Els teus drets', p: ['Pots sol·licitar accés, rectificació, supressió (inclosa la del compte), limitació i portabilitat, i oposar-te al tractament, escrivint a {email}. Pots retirar el permís d\'ubicació a la configuració del dispositiu. També pots reclamar davant l\'Autoritat Catalana de Protecció de Dades o l\'autoritat del teu país.'] },
      { h: 'Menors', p: ['El registre està reservat a majors de 14 anys. L\'app es pot fer servir com a convidat sense facilitar dades personals.'] },
      { h: 'Canvis', p: ['Qualsevol canvi es publicarà aquí, amb la data d\'actualització.'] },
    ],
    terms: [
      { h: 'El servei', p: ['Emblematica és un mapa gratuït de locals històrics, amb històries, rutes a peu i un passaport digital. En fer-lo servir acceptes aquestes condicions. Pots fer-lo servir com a convidat; els preferits sincronitzats i els segells requereixen un compte.'] },
      { h: 'Compte', p: ['Has de tenir almenys 14 anys i facilitar dades correctes. Ets responsable de les teves credencials. Pots sol·licitar el tancament del compte en qualsevol moment; podem suspendre\'l en cas d\'abús o incompliment d\'aquestes condicions.'] },
      { h: 'Ús correcte', p: ['No es permet eludir les mesures de seguretat, extreure continguts de manera automatitzada, segellar el passaport amb ubicacions falsificades ni enviar reclamacions de negocis que no representes.'] },
      { h: 'Continguts i fiabilitat', p: ['La informació té finalitat cultural i informativa. Pot ser incompleta o estar desactualitzada: comprova horaris i dades històriques. Comunica\'ns els errors a {email}.'] },
      { h: 'Navegació', p: ['Les rutes es calculen automàticament i poden ser imprecises. Para atenció a la via i respecta les normes de circulació.'] },
      { h: 'Propietat intel·lectual', p: ['Textos, marca i gràfics pertanyen a Emblematica o als seus respectius titulars. Les imatges i les dades cartogràfiques de tercers continuen subjectes a les seves llicències.'] },
      { h: 'Responsabilitat', p: ['El servei s\'ofereix tal com és, sense garantia de continuïtat. En la mesura permesa per la llei no responem dels danys indirectes derivats de l\'ús de l\'app. Queden a salvo els drets imperatius dels consumidors i la responsabilitat per dol o culpa greu.'] },
      { h: 'Llei i canvis', p: ['S\'aplica la llei italiana, sense perjudici de les proteccions imperatives del teu país de residència; els consumidors poden acudir als tribunals del seu domicili. Si les traduccions difereixen, prevaldrà el text italià. Els canvis substancials es comunicaran a l\'app.'] },
    ],
    cookies: [
      { h: 'En resum', p: ['No fem servir galetes de perfilatge ni d\'analítica, de manera que no cal un bàner de consentiment. Només fem servir l\'emmagatzematge tècnic imprescindible.'] },
      { h: 'Què desem al dispositiu', p: [
        'emblematica-lang i emblematica-city: idioma i ciutat triats.',
        'barna_favorites: preferits de qui fa servir l\'app com a convidat.',
        'Firebase (IndexedDB): sessió d\'accés i còpia local de dades per a l\'ús sense connexió.',
        'Memòria cau del service worker: fitxers de l\'app, mapes i imatges per a l\'ús sense connexió.',
      ] },
      { h: 'Tercers', p: ['L\'accés amb Google obre una finestra de Google, que fa servir les seves pròpies galetes segons la seva política. Pots esborrar totes les dades locals des de la configuració del navegador.'] },
    ],
    notice: [
      { h: 'Advertiment', p: ['Continguts històrics amb finalitat informativa i cultural. Emblematica no està afiliada a cap ajuntament ni als locals citats, llevat que s\'indiqui el contrari.'] },
      { h: 'Crèdits', p: ['Dades cartogràfiques © OpenStreetMap (llicència ODbL), tessel·les OpenFreeMap i OpenMapTiles. Rutes calculades amb OSRM mitjançant FOSSGIS e.V. Icones Phosphor. Part de les imatges dels locals prové de Wikimedia Commons i continua subjecta a les llicències dels seus autors.'] },
    ],
  },
  pt: {
    provider: { name: 'Titular', address: 'Sede', vat: 'NIF/IVA', email: 'Email' },
    privacy: [
      { h: 'Responsável pelo tratamento', p: ['O responsável é quem consta no Aviso legal desta página, com contacto em {email}. Esta informação é prestada nos termos dos artigos 13.º e 14.º do Regulamento (UE) 2016/679 (RGPD).'] },
      { h: 'Que dados tratamos', p: [
        'Conta: email, nome e foto de perfil (estes dois apenas com o acesso Google), identificador de utilizador, datas de criação e último acesso.',
        'Utilização da app: locais favoritos e carimbos do passaporte, com o local e a data da visita.',
        'Localização: pedida apenas ao carimbar o passaporte ou iniciar uma navegação. Para o carimbo fica no dispositivo: guardamos a posição do local, não a tua. Para a navegação é enviada ao serviço de cálculo de percursos e não é guardada por nós.',
        'Pedidos de reivindicação de um local: nome do negócio, função, email, telefone opcional e mensagem.',
        'Dados técnicos: endereço IP e dados de ligação, tratados pelos fornecedores que prestam o serviço.',
      ] },
      { h: 'Para quê e com que fundamento', p: [
        'Disponibilizar conta, favoritos, passaporte e navegação: execução de um contrato (art. 6.º, n.º 1, al. b).',
        'Gerir reivindicações: diligências a pedido do titular (art. 6.º, n.º 1, al. b).',
        'Segurança e funcionamento do serviço: interesse legítimo (art. 6.º, n.º 1, al. f).',
        'Não usamos os dados para publicidade ou definição de perfis, e não usamos ferramentas de análise.',
      ] },
      { h: 'Quem recebe os dados', p: [
        'Google (Firebase: autenticação, base de dados, armazenamento de ficheiros; Google Fonts: tipos de letra); Vercel (alojamento); OpenFreeMap (mapas); FOSSGIS e.V. através de routing.openstreetmap.de (percursos a pé); Wikimedia Commons (imagens).',
        'Alguns fornecedores podem tratar dados fora do Espaço Económico Europeu com as garantias do RGPD (decisão de adequação ou cláusulas contratuais-tipo). Os dados não são vendidos.',
      ] },
      { h: 'Durante quanto tempo', p: ['Os dados da conta, os favoritos e o passaporte são conservados enquanto a conta estiver ativa. As reivindicações são conservadas durante 12 meses após o seu encerramento. Os dados guardados no dispositivo permanecem até os apagares no navegador.'] },
      { h: 'Os teus direitos', p: ['Podes pedir acesso, retificação, apagamento (incluindo o da conta), limitação e portabilidade, e opor-te ao tratamento, escrevendo para {email}. Podes retirar a permissão de localização nas definições do dispositivo. Podes ainda apresentar reclamação à CNPD ou à autoridade do teu país.'] },
      { h: 'Menores', p: ['O registo é reservado a quem tem pelo menos 14 anos. A app pode ser usada como convidado sem fornecer dados pessoais.'] },
      { h: 'Alterações', p: ['Eventuais alterações serão publicadas aqui, com a data de atualização.'] },
    ],
    terms: [
      { h: 'O serviço', p: ['A Emblematica é um mapa gratuito de locais históricos, com histórias, percursos a pé e um passaporte digital. Ao usá-la aceitas estes termos. Podes usá-la como convidado; os favoritos sincronizados e os carimbos exigem uma conta.'] },
      { h: 'Conta', p: ['Deves ter pelo menos 14 anos e fornecer dados corretos. És responsável pelas tuas credenciais. Podes pedir o encerramento da conta a qualquer momento; podemos suspendê-la em caso de abuso ou violação destes termos.'] },
      { h: 'Utilização correta', p: ['Não é permitido contornar as medidas de segurança, extrair conteúdos de forma automática, carimbar o passaporte com localizações falsificadas nem enviar reivindicações de negócios que não representas.'] },
      { h: 'Conteúdos e fiabilidade', p: ['As informações têm fins culturais e informativos. Podem estar incompletas ou desatualizadas: confirma horários e dados históricos. Comunica-nos os erros para {email}.'] },
      { h: 'Navegação', p: ['Os percursos são calculados automaticamente e podem ser imprecisos. Presta atenção à via e respeita as regras de trânsito.'] },
      { h: 'Propriedade intelectual', p: ['Textos, marca e grafismo pertencem à Emblematica ou aos respetivos titulares. As imagens e os dados cartográficos de terceiros continuam sujeitos às suas licenças.'] },
      { h: 'Responsabilidade', p: ['O serviço é prestado tal como está, sem garantia de continuidade. Na medida permitida por lei não respondemos por danos indiretos decorrentes da utilização da app. Ficam ressalvados os direitos imperativos dos consumidores e a responsabilidade por dolo ou culpa grave.'] },
      { h: 'Lei e alterações', p: ['Aplica-se a lei italiana, sem prejuízo das proteções imperativas do teu país de residência; os consumidores podem recorrer aos tribunais do seu domicílio. Se as traduções divergirem, prevalece o texto italiano. As alterações substanciais serão comunicadas na app.'] },
    ],
    cookies: [
      { h: 'Em resumo', p: ['Não usamos cookies de definição de perfis nem de análise, pelo que não é necessário um aviso de consentimento. Usamos apenas o armazenamento técnico indispensável.'] },
      { h: 'O que guardamos no dispositivo', p: [
        'emblematica-lang e emblematica-city: idioma e cidade escolhidos.',
        'barna_favorites: favoritos de quem usa a app como convidado.',
        'Firebase (IndexedDB): sessão de acesso e cópia local de dados para utilização offline.',
        'Cache do service worker: ficheiros da app, mapas e imagens para utilização offline.',
      ] },
      { h: 'Terceiros', p: ['O acesso com Google abre uma janela da Google, que usa os seus próprios cookies segundo a sua política. Podes apagar todos os dados locais nas definições do navegador.'] },
    ],
    notice: [
      { h: 'Advertência', p: ['Conteúdos históricos para fins informativos e culturais. A Emblematica não está afiliada a qualquer câmara municipal nem aos locais mencionados, salvo indicação em contrário.'] },
      { h: 'Créditos', p: ['Dados cartográficos © OpenStreetMap (licença ODbL), mosaicos OpenFreeMap e OpenMapTiles. Percursos calculados com OSRM através da FOSSGIS e.V. Ícones Phosphor. Parte das imagens dos locais provém da Wikimedia Commons e continua sujeita às licenças dos respetivos autores.'] },
    ],
  },
  ar: {
    provider: { name: 'الجهة المسؤولة', address: 'المقر', vat: 'الرقم الضريبي', email: 'البريد الإلكتروني' },
    privacy: [
      { h: 'المسؤول عن معالجة البيانات', p: ['المسؤول هو الجهة المذكورة في الإشعار القانوني في هذه الصفحة، ويمكن التواصل معها عبر {email}. يُقدَّم هذا الإشعار بموجب المادتين 13 و14 من اللائحة الأوروبية 2016/679 (GDPR).'] },
      { h: 'البيانات التي نعالجها', p: [
        'الحساب: البريد الإلكتروني والاسم وصورة الملف الشخصي (الأخيران عند الدخول عبر Google فقط) ومعرّف المستخدم وتاريخا الإنشاء وآخر دخول.',
        'استخدام التطبيق: الأماكن المفضلة وأختام جواز السفر، مع المكان وتاريخ الزيارة.',
        'الموقع: يُطلب فقط عند ختم الجواز أو بدء التنقل. عند الختم يبقى على جهازك، فنحفظ موقع المكان لا موقعك. وعند التنقل يُرسل إلى خدمة حساب المسار ولا نحفظه.',
        'طلبات المطالبة بمكان: اسم النشاط والدور والبريد الإلكتروني والهاتف الاختياري والرسالة.',
        'البيانات التقنية: عنوان IP وبيانات الاتصال، ويعالجها مزودو الخدمة.',
      ] },
      { h: 'الغرض والأساس القانوني', p: [
        'توفير الحساب والمفضلة والجواز والتنقل: تنفيذ عقد (المادة 6.1.b).',
        'إدارة طلبات المطالبة: إجراءات بناءً على طلبك (المادة 6.1.b).',
        'أمن الخدمة وتشغيلها: مصلحة مشروعة (المادة 6.1.f).',
        'لا نستخدم البيانات للإعلانات أو التنميط، ولا نستخدم أدوات تحليل.',
      ] },
      { h: 'من يتلقى البيانات', p: [
        'Google (Firebase: المصادقة وقاعدة البيانات وتخزين الملفات؛ Google Fonts: الخطوط)؛ Vercel (الاستضافة)؛ OpenFreeMap (الخرائط)؛ FOSSGIS e.V. عبر routing.openstreetmap.de (مسارات المشي)؛ Wikimedia Commons (الصور).',
        'قد يعالج بعض المزودين البيانات خارج المنطقة الاقتصادية الأوروبية وفق ضمانات اللائحة (قرار كفاية أو بنود تعاقدية نموذجية). لا تُباع البيانات.',
      ] },
      { h: 'مدة الاحتفاظ', p: ['تُحفظ بيانات الحساب والمفضلة والجواز ما دام الحساب نشطًا. وتُحفظ طلبات المطالبة 12 شهرًا بعد إغلاقها. وتبقى البيانات المخزنة على جهازك حتى تحذفها من المتصفح.'] },
      { h: 'حقوقك', p: ['يمكنك طلب الوصول والتصحيح والحذف (بما في ذلك الحساب) والتقييد ونقل البيانات، والاعتراض على المعالجة، بالكتابة إلى {email}. ويمكنك سحب إذن الموقع من إعدادات الجهاز. كما يمكنك تقديم شكوى إلى هيئة حماية البيانات في بلدك.'] },
      { h: 'القاصرون', p: ['التسجيل مخصص لمن بلغوا 14 عامًا. ويمكن استخدام التطبيق كضيف دون تقديم بيانات شخصية.'] },
      { h: 'التعديلات', p: ['ستُنشر أي تعديلات هنا مع تاريخ التحديث.'] },
    ],
    terms: [
      { h: 'الخدمة', p: ['Emblematica خريطة مجانية للأماكن التاريخية، مع قصص ومسارات مشي وجواز سفر رقمي. باستخدامها فإنك توافق على هذه الشروط. يمكنك استخدامها كضيف؛ وتتطلب المفضلة المتزامنة والأختام حسابًا.'] },
      { h: 'الحساب', p: ['يجب ألا يقل عمرك عن 14 عامًا وأن تقدم بيانات صحيحة. وأنت مسؤول عن بيانات دخولك. يمكنك طلب إغلاق الحساب في أي وقت، ويمكننا تعليقه عند إساءة الاستخدام أو مخالفة هذه الشروط.'] },
      { h: 'الاستخدام السليم', p: ['لا يجوز تجاوز إجراءات الأمان أو استخراج المحتوى آليًا أو ختم الجواز بمواقع مزيفة أو إرسال طلبات مطالبة بأنشطة لا تمثلها.'] },
      { h: 'المحتوى والموثوقية', p: ['المعلومات لأغراض ثقافية وإعلامية، وقد تكون ناقصة أو قديمة، لذا تحقق من المواعيد والبيانات التاريخية. أبلغنا بالأخطاء عبر {email}.'] },
      { h: 'التنقل', p: ['تُحسب المسارات آليًا وقد تكون غير دقيقة. انتبه إلى الطريق والتزم بقواعد المرور.'] },
      { h: 'الملكية الفكرية', p: ['النصوص والعلامة والرسومات مملوكة لـ Emblematica أو لأصحابها. وتظل صور الغير وبيانات الخرائط خاضعة لتراخيصها.'] },
      { h: 'المسؤولية', p: ['تُقدَّم الخدمة كما هي دون ضمان استمراريتها. وفي حدود القانون لا نتحمل مسؤولية الأضرار غير المباشرة الناتجة عن استخدام التطبيق. ولا يمس ذلك حقوق المستهلكين الإلزامية ولا المسؤولية عن العمد أو الإهمال الجسيم.'] },
      { h: 'القانون والتعديلات', p: ['يسري القانون الإيطالي مع عدم الإخلال بالحمايات الإلزامية في بلد إقامتك، ويمكن للمستهلكين اللجوء إلى محاكم محل إقامتهم. وعند اختلاف الترجمات يُعتد بالنص الإيطالي. وسيُعلن عن التعديلات الجوهرية في التطبيق.'] },
    ],
    cookies: [
      { h: 'باختصار', p: ['لا نستخدم ملفات تعريف الارتباط للتنميط أو التحليل، لذا لا حاجة إلى لافتة موافقة. نستخدم فقط التخزين التقني الضروري.'] },
      { h: 'ما نحفظه على جهازك', p: [
        'emblematica-lang وemblematica-city: اللغة والمدينة المختارتان.',
        'barna_favorites: مفضلة مستخدمي التطبيق كضيوف.',
        'Firebase (IndexedDB): جلسة الدخول ونسخة محلية من البيانات للاستخدام دون اتصال.',
        'ذاكرة service worker: ملفات التطبيق والخرائط والصور للاستخدام دون اتصال.',
      ] },
      { h: 'الأطراف الثالثة', p: ['يفتح الدخول عبر Google نافذة من Google تستخدم ملفاتها الخاصة وفق سياستها. ويمكنك حذف جميع البيانات المحلية من إعدادات المتصفح.'] },
    ],
    notice: [
      { h: 'تنبيه', p: ['محتوى تاريخي لأغراض إعلامية وثقافية. Emblematica غير تابعة لأي بلدية أو للأماكن المذكورة، ما لم يُذكر خلاف ذلك.'] },
      { h: 'الاعتمادات', p: ['بيانات الخرائط © OpenStreetMap (ترخيص ODbL)، وطبقات OpenFreeMap وOpenMapTiles. تُحسب المسارات باستخدام OSRM عبر FOSSGIS e.V. أيقونات Phosphor. يأتي بعض صور الأماكن من Wikimedia Commons ويظل خاضعًا لتراخيص مؤلفيها.'] },
    ],
  },
  zh: {
    provider: { name: '运营方', address: '注册地址', vat: '税号', email: '电子邮箱' },
    privacy: [
      { h: '数据控制者', p: ['数据控制者为本页“法律声明”中列明的主体，联系方式：{email}。本说明依据欧盟《通用数据保护条例》（GDPR）第13、14条提供。'] },
      { h: '我们处理哪些数据', p: [
        '账户：电子邮箱、姓名和头像（后两项仅限 Google 登录）、用户标识、创建和最后登录日期。',
        '应用使用：收藏的场所和护照印章，包括场所和到访日期。',
        '位置：仅在盖章或开始导航时请求。盖章时位置保留在你的设备上：我们保存的是场所的位置，而不是你的位置。导航时位置会发送给路线计算服务，我们不予保存。',
        '场所认领申请：商户名称、职务、电子邮箱、选填电话和留言。',
        '技术数据：IP 地址和连接数据，由提供服务的供应商处理。',
      ] },
      { h: '目的与法律依据', p: [
        '提供账户、收藏、护照和导航：履行合同（第6条第1款b项）。',
        '处理认领申请：应你的要求采取的措施（第6条第1款b项）。',
        '服务的安全与运行：合法利益（第6条第1款f项）。',
        '我们不将数据用于广告或用户画像，也不使用统计分析工具。',
      ] },
      { h: '谁会接收数据', p: [
        'Google（Firebase：身份验证、数据库、文件存储；Google Fonts：字体）；Vercel（托管）；OpenFreeMap（地图）；通过 routing.openstreetmap.de 的 FOSSGIS e.V.（步行路线）；Wikimedia Commons（图片）。',
        '部分供应商可能在欧洲经济区以外处理数据，并采用 GDPR 规定的保障措施（充分性决定或标准合同条款）。我们不会出售数据。',
      ] },
      { h: '保存期限', p: ['账户数据、收藏和护照在账户有效期间保存。认领申请在关闭后保存12个月。保存在设备上的数据会一直保留，直至你在浏览器中清除。'] },
      { h: '你的权利', p: ['你可以发送邮件至 {email}，要求访问、更正、删除（包括删除账户）、限制处理和数据可携，并可反对处理。你可以在设备设置中撤回位置权限，也可以向所在国的数据保护机构投诉。'] },
      { h: '未成年人', p: ['年满14周岁方可注册。无需提供个人数据即可以访客身份使用本应用。'] },
      { h: '变更', p: ['任何变更都将在此发布，并注明更新日期。'] },
    ],
    terms: [
      { h: '服务', p: ['Emblematica 是一款免费的历史场所地图，提供故事、步行路线和数字护照。使用本应用即表示你接受这些条款。你可以以访客身份使用；同步收藏和印章需要账户。'] },
      { h: '账户', p: ['你须年满14周岁并提供准确信息，并对自己的登录凭据负责。你可以随时要求关闭账户；如有滥用或违反本条款的情况，我们可以暂停账户。'] },
      { h: '正当使用', p: ['不得规避安全措施、自动抓取内容、使用伪造位置盖章，或为你不代表的商户提交认领申请。'] },
      { h: '内容与可靠性', p: ['信息仅供文化和参考用途，可能不完整或已过时，请自行核实营业时间和历史信息。如发现错误，请发送至 {email}。'] },
      { h: '导航', p: ['路线由系统自动计算，可能不准确。请注意道路状况并遵守交通规则。'] },
      { h: '知识产权', p: ['文字、品牌和图形归 Emblematica 或相应权利人所有。第三方图片和地图数据仍受其许可约束。'] },
      { h: '责任', p: ['本服务按现状提供，不保证持续可用。在法律允许的范围内，我们不对使用本应用造成的间接损失负责。消费者的强制性权利以及对故意或重大过失的责任不受影响。'] },
      { h: '法律与变更', p: ['本条款适用意大利法律，但不影响你居住国的强制性保护；消费者可向其居住地法院提起诉讼。译文不一致时，以意大利文本为准。重大变更将在应用内通知。'] },
    ],
    cookies: [
      { h: '简而言之', p: ['我们不使用用户画像或统计分析 Cookie，因此无需同意横幅。我们只使用运行所必需的技术存储。'] },
      { h: '我们在设备上保存什么', p: [
        'emblematica-lang 和 emblematica-city：所选语言和城市。',
        'barna_favorites：访客用户的收藏。',
        'Firebase（IndexedDB）：登录会话和供离线使用的本地数据副本。',
        'Service worker 缓存：供离线使用的应用文件、地图和图片。',
      ] },
      { h: '第三方', p: ['使用 Google 登录时会打开 Google 窗口，该窗口依其政策使用自己的 Cookie。你可以在浏览器设置中删除所有本地数据。'] },
    ],
    notice: [
      { h: '声明', p: ['历史内容仅供参考和文化用途。除非另有说明，Emblematica 与任何市政机构或所提及的场所均无关联。'] },
      { h: '致谢', p: ['地图数据 © OpenStreetMap（ODbL 许可），图块来自 OpenFreeMap 和 OpenMapTiles。路线由 OSRM 通过 FOSSGIS e.V. 计算。图标来自 Phosphor。部分场所图片来自 Wikimedia Commons，仍受其作者的许可约束。'] },
    ],
  },
}
