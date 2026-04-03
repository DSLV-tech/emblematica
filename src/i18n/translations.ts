/**
 * i18n translation dictionary for Emblematica.
 * 6 languages: Italian (it) · English (en) · Spanish (es) · Catalan (ca) · Portuguese (pt) · Arabic (ar)
 *
 * Usage:
 *   const { t } = useLanguage()
 *   t('map.search_placeholder')
 */

export type LangCode = 'it' | 'en' | 'es' | 'ca' | 'pt' | 'ar'

export interface LangMeta {
    code: LangCode
    label: string      // native name
    flag: string
    rtl?: boolean
}

export const LANGUAGES: LangMeta[] = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ca', label: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', rtl: true },
]

export type TranslationKey =
    // App shell / header
    | 'app.tagline'
    | 'app.search_placeholder'
    | 'app.filter_all'
    // Splash / auth
    | 'splash.headline'
    | 'splash.login_google'
    | 'splash.continue_guest'
    | 'splash.guest_note'
    // Navigation / drawer
    | 'nav.rutas'
    | 'nav.passport'
    | 'nav.blog'
    | 'nav.about'
    | 'nav.sponsors'
    | 'nav.share'
    | 'nav.admin'
    | 'nav.logout'
    | 'nav.login'
    | 'nav.city'
    | 'nav.language'
    // Map
    | 'map.locate_me'
    | 'map.loading'
    | 'map.no_results'
    // Detail view
    | 'detail.story'
    | 'detail.audio'
    | 'detail.ai_fact'
    | 'detail.ai_loading'
    | 'detail.navigate'
    | 'detail.open_maps'
    | 'detail.stamp_passport'
    | 'detail.already_stamped'
    | 'detail.checking_gps'
    | 'detail.gallery'
    | 'detail.share'
    | 'detail.favorite'
    | 'detail.unfavorite'
    | 'detail.socials'
    // Passport
    | 'passport.title'
    | 'passport.subtitle'
    | 'passport.empty_title'
    | 'passport.empty_body'
    | 'passport.badges'
    | 'passport.stamps'
    | 'passport.explored'
    // Rutas
    | 'rutas.title'
    | 'rutas.subtitle'
    | 'rutas.stops'
    | 'rutas.open_map'
    | 'rutas.tip'
    | 'rutas.highlights'
    | 'rutas.duration'
    | 'rutas.distance'
    | 'rutas.difficulty'
    | 'rutas.easy'
    | 'rutas.medium'
    | 'rutas.hard'
    // Check-in toasts
    | 'checkin.success'
    | 'checkin.already'
    | 'checkin.too_far'
    | 'checkin.error'
    // Geofencing
    | 'geo.nearby_prefix'
    | 'geo.view_card'
    // City selector
    | 'cities.title'
    | 'cities.subtitle'
    | 'cities.available'
    | 'cities.coming_soon'
    | 'cities.active'
    | 'cities.propose'
    | 'cities.propose_body'
    | 'cities.propose_cta'
    // Blog
    | 'blog.title'
    | 'blog.empty'
    | 'blog.read_more'
    // About
    | 'about.title'
    | 'about.mission'
    // Sponsors
    | 'sponsors.title'
    | 'sponsors.become_partner'
    // Generic
    | 'generic.close'
    | 'generic.back'
    | 'generic.loading'
    | 'generic.error'
    | 'generic.retry'
    | 'generic.offline'
    // Bottom nav
    | 'nav.map'
    | 'nav.routes'
    | 'nav.menu'
    // Menu panel
    | 'menu.language_label'
    | 'menu.city_label'
    | 'menu.links_label'
    | 'menu.about'
    | 'menu.sponsors'
    | 'menu.share_app'
    | 'menu.admin'
    | 'menu.logout'
    | 'menu.login'
    // Splash
    | 'splash.or'
    | 'splash.footer'
    | 'splash.tagline'

type Translations = Record<TranslationKey, string>
type TranslationDictionary = Record<LangCode, Translations>

export const translations: TranslationDictionary = {
    it: {
        'app.tagline': 'Scopri i locali storici della città',
        'app.search_placeholder': 'Cerca un locale…',
        'app.filter_all': 'Tutti',
        'splash.headline': 'Scopri la città autentica',
        'splash.login_google': 'Accedi con Google',
        'splash.continue_guest': 'Continua come ospite',
        'splash.guest_note': 'Funzioni limitate senza account',
        'nav.rutas': 'Rutas Temàtiques',
        'nav.passport': 'Il mio Passaporto',
        'nav.blog': 'Blog & News',
        'nav.about': 'Chi siamo',
        'nav.sponsors': 'Sponsor',
        'nav.share': 'Condividi',
        'nav.admin': 'Dashboard Admin',
        'nav.logout': 'Esci',
        'nav.login': 'Accedi',
        'nav.city': 'Cambia città',
        'nav.language': 'Lingua',
        'map.locate_me': 'Localizzami',
        'map.loading': 'Caricamento mappa…',
        'map.no_results': 'Nessun risultato trovato',
        'detail.story': 'La storia',
        'detail.audio': 'Audio Story',
        'detail.ai_fact': 'Rivela una Curiosità Storica',
        'detail.ai_loading': "L'AI sta cercando…",
        'detail.navigate': "Naviga nell'app",
        'detail.open_maps': 'Apri in Google Maps',
        'detail.stamp_passport': 'Timbra Passaporto',
        'detail.already_stamped': 'Già nel passaporto',
        'detail.checking_gps': 'Verifica posizione GPS…',
        'detail.gallery': 'La Galleria',
        'detail.share': 'Condividi',
        'detail.favorite': 'Aggiungi ai preferiti',
        'detail.unfavorite': 'Rimuovi dai preferiti',
        'detail.socials': 'Seguici',
        'passport.title': 'Passaporto',
        'passport.subtitle': 'I locali che hai visitato di persona',
        'passport.empty_title': 'Nessun timbro ancora',
        'passport.empty_body': 'Visita un locale e premi "Timbra Passaporto" quando sei lì (entro 100m).',
        'passport.badges': 'Badge ottenuti',
        'passport.stamps': 'Timbri raccolti',
        'passport.explored': 'di città esplorata',
        'rutas.title': 'Rutas Temàtiques',
        'rutas.subtitle': 'Percorsi tematici a piedi',
        'rutas.stops': 'tappe',
        'rutas.open_map': 'Apri sulla mappa',
        'rutas.tip': 'Consiglio',
        'rutas.highlights': 'Da non perdere',
        'rutas.duration': 'durata',
        'rutas.distance': 'distanza',
        'rutas.difficulty': 'difficoltà',
        'rutas.easy': '🟢 Facile',
        'rutas.medium': '🟡 Media',
        'rutas.hard': '🔴 Impegnativa',
        'checkin.success': 'Timbro aggiunto al passaporto!',
        'checkin.already': 'Questo locale è già nel tuo passaporto',
        'checkin.too_far': 'Sei troppo lontano — avvicinati entro 100m',
        'checkin.error': 'Errore GPS — riprova',
        'geo.nearby_prefix': 'Sei a',
        'geo.view_card': 'Vedi scheda',
        'cities.title': 'Scegli la città',
        'cities.subtitle': 'Emblematica è disponibile in queste città',
        'cities.available': 'Disponibile ora',
        'cities.coming_soon': 'In arrivo',
        'cities.active': 'Attiva',
        'cities.propose': 'Vuoi la tua città?',
        'cities.propose_body': 'Sei un\'associazione culturale o un ente municipale? Possiamo portare Emblematica nella tua città.',
        'cities.propose_cta': 'Proponi la tua città',
        'blog.title': 'Blog & News',
        'blog.empty': 'Nessun articolo pubblicato',
        'blog.read_more': 'Leggi di più',
        'about.title': 'Chi siamo',
        'about.mission': 'La nostra missione',
        'sponsors.title': 'Sponsor & Partner',
        'sponsors.become_partner': 'Diventa partner',
        'generic.close': 'Chiudi',
        'generic.back': 'Indietro',
        'generic.loading': 'Caricamento…',
        'generic.error': 'Errore',
        'generic.retry': 'Riprova',
        'generic.offline': 'Sei offline',
        'nav.map': 'Mappa',
        'nav.routes': 'Percorsi',
        'nav.menu': 'Menu',
        'menu.language_label': 'Lingua',
        'menu.city_label': 'Città',
        'menu.links_label': 'Menu',
        'menu.about': 'Chi siamo',
        'menu.sponsors': 'Sponsors & Partner',
        'menu.share_app': 'Condividi l\'app',
        'menu.admin': 'Dashboard Admin',
        'menu.logout': 'Esci dall\'account',
        'menu.login': 'Accedi con Google',
        'splash.or': 'oppure',
        'splash.footer': 'Un\'eredità da scoprire',
        'splash.tagline': 'Scopri i locali storici che definiscono l\'anima delle città. Una mappa interattiva per viaggiatori curiosi.',
    },

    en: {
        'app.tagline': 'Discover the city\'s historic venues',
        'app.search_placeholder': 'Search a venue…',
        'app.filter_all': 'All',
        'splash.headline': 'Discover the authentic city',
        'splash.login_google': 'Sign in with Google',
        'splash.continue_guest': 'Continue as guest',
        'splash.guest_note': 'Limited features without account',
        'nav.rutas': 'Thematic Routes',
        'nav.passport': 'My Passport',
        'nav.blog': 'Blog & News',
        'nav.about': 'About',
        'nav.sponsors': 'Sponsors',
        'nav.share': 'Share',
        'nav.admin': 'Admin Dashboard',
        'nav.logout': 'Sign out',
        'nav.login': 'Sign in',
        'nav.city': 'Change city',
        'nav.language': 'Language',
        'map.locate_me': 'Locate me',
        'map.loading': 'Loading map…',
        'map.no_results': 'No results found',
        'detail.story': 'The story',
        'detail.audio': 'Audio Story',
        'detail.ai_fact': 'Reveal a Historical Fact',
        'detail.ai_loading': 'AI is searching…',
        'detail.navigate': 'Navigate in app',
        'detail.open_maps': 'Open in Google Maps',
        'detail.stamp_passport': 'Stamp Passport',
        'detail.already_stamped': 'Already in passport',
        'detail.checking_gps': 'Checking GPS location…',
        'detail.gallery': 'Gallery',
        'detail.share': 'Share',
        'detail.favorite': 'Add to favourites',
        'detail.unfavorite': 'Remove from favourites',
        'detail.socials': 'Follow us',
        'passport.title': 'Passport',
        'passport.subtitle': 'Venues you\'ve visited in person',
        'passport.empty_title': 'No stamps yet',
        'passport.empty_body': 'Visit a venue and tap "Stamp Passport" when you\'re there (within 100m).',
        'passport.badges': 'Earned badges',
        'passport.stamps': 'Collected stamps',
        'passport.explored': 'of the city explored',
        'rutas.title': 'Thematic Routes',
        'rutas.subtitle': 'Curated walking itineraries',
        'rutas.stops': 'stops',
        'rutas.open_map': 'Open on map',
        'rutas.tip': 'Tip',
        'rutas.highlights': 'Must see',
        'rutas.duration': 'duration',
        'rutas.distance': 'distance',
        'rutas.difficulty': 'difficulty',
        'rutas.easy': '🟢 Easy',
        'rutas.medium': '🟡 Moderate',
        'rutas.hard': '🔴 Challenging',
        'checkin.success': 'Stamp added to your passport!',
        'checkin.already': 'This venue is already in your passport',
        'checkin.too_far': 'You\'re too far — get within 100m',
        'checkin.error': 'GPS error — please try again',
        'geo.nearby_prefix': 'You\'re',
        'geo.view_card': 'View venue',
        'cities.title': 'Choose your city',
        'cities.subtitle': 'Emblematica is available in these cities',
        'cities.available': 'Available now',
        'cities.coming_soon': 'Coming soon',
        'cities.active': 'Active',
        'cities.propose': 'Want your city?',
        'cities.propose_body': 'Are you a cultural association or municipal body? We can bring Emblematica to your city.',
        'cities.propose_cta': 'Propose your city',
        'blog.title': 'Blog & News',
        'blog.empty': 'No articles published yet',
        'blog.read_more': 'Read more',
        'about.title': 'About us',
        'about.mission': 'Our mission',
        'sponsors.title': 'Sponsors & Partners',
        'sponsors.become_partner': 'Become a partner',
        'generic.close': 'Close',
        'generic.back': 'Back',
        'generic.loading': 'Loading…',
        'generic.error': 'Error',
        'generic.retry': 'Retry',
        'generic.offline': 'You\'re offline',
        'nav.map': 'Map',
        'nav.routes': 'Routes',
        'nav.menu': 'Menu',
        'menu.language_label': 'Language',
        'menu.city_label': 'City',
        'menu.links_label': 'Menu',
        'menu.about': 'About us',
        'menu.sponsors': 'Sponsors & Partners',
        'menu.share_app': 'Share the app',
        'menu.admin': 'Admin Dashboard',
        'menu.logout': 'Sign out',
        'menu.login': 'Sign in with Google',
        'splash.or': 'or',
        'splash.footer': 'A heritage to discover',
        'splash.tagline': 'Discover the historic venues that define the soul of cities. An interactive map for curious travellers.',
    },

    es: {
        'app.tagline': 'Descubre los locales históricos de la ciudad',
        'app.search_placeholder': 'Busca un local…',
        'app.filter_all': 'Todos',
        'splash.headline': 'Descubre la ciudad auténtica',
        'splash.login_google': 'Acceder con Google',
        'splash.continue_guest': 'Continuar como invitado',
        'splash.guest_note': 'Funciones limitadas sin cuenta',
        'nav.rutas': 'Rutas Temáticas',
        'nav.passport': 'Mi Pasaporte',
        'nav.blog': 'Blog & Noticias',
        'nav.about': 'Quiénes somos',
        'nav.sponsors': 'Patrocinadores',
        'nav.share': 'Compartir',
        'nav.admin': 'Panel Admin',
        'nav.logout': 'Cerrar sesión',
        'nav.login': 'Iniciar sesión',
        'nav.city': 'Cambiar ciudad',
        'nav.language': 'Idioma',
        'map.locate_me': 'Localizarme',
        'map.loading': 'Cargando mapa…',
        'map.no_results': 'Sin resultados',
        'detail.story': 'La historia',
        'detail.audio': 'Historia en audio',
        'detail.ai_fact': 'Revelar una curiosidad histórica',
        'detail.ai_loading': 'La IA está buscando…',
        'detail.navigate': 'Navegar en la app',
        'detail.open_maps': 'Abrir en Google Maps',
        'detail.stamp_passport': 'Sellar Pasaporte',
        'detail.already_stamped': 'Ya en el pasaporte',
        'detail.checking_gps': 'Verificando posición GPS…',
        'detail.gallery': 'Galería',
        'detail.share': 'Compartir',
        'detail.favorite': 'Añadir a favoritos',
        'detail.unfavorite': 'Eliminar de favoritos',
        'detail.socials': 'Síguenos',
        'passport.title': 'Pasaporte',
        'passport.subtitle': 'Locales que has visitado en persona',
        'passport.empty_title': 'Ningún sello todavía',
        'passport.empty_body': 'Visita un local y pulsa "Sellar Pasaporte" cuando estés allí (en menos de 100m).',
        'passport.badges': 'Insignias obtenidas',
        'passport.stamps': 'Sellos recopilados',
        'passport.explored': 'de la ciudad explorada',
        'rutas.title': 'Rutas Temáticas',
        'rutas.subtitle': 'Itinerarios a pie',
        'rutas.stops': 'paradas',
        'rutas.open_map': 'Abrir en el mapa',
        'rutas.tip': 'Consejo',
        'rutas.highlights': 'No te pierdas',
        'rutas.duration': 'duración',
        'rutas.distance': 'distancia',
        'rutas.difficulty': 'dificultad',
        'rutas.easy': '🟢 Fácil',
        'rutas.medium': '🟡 Media',
        'rutas.hard': '🔴 Difícil',
        'checkin.success': '¡Sello añadido al pasaporte!',
        'checkin.already': 'Este local ya está en tu pasaporte',
        'checkin.too_far': 'Estás demasiado lejos — acércate a 100m',
        'checkin.error': 'Error GPS — inténtalo de nuevo',
        'geo.nearby_prefix': 'Estás a',
        'geo.view_card': 'Ver ficha',
        'cities.title': 'Elige ciudad',
        'cities.subtitle': 'Emblematica está disponible en estas ciudades',
        'cities.available': 'Disponible ahora',
        'cities.coming_soon': 'Próximamente',
        'cities.active': 'Activa',
        'cities.propose': '¿Quieres tu ciudad?',
        'cities.propose_body': '¿Eres una asociación cultural o ente municipal? Podemos llevar Emblematica a tu ciudad.',
        'cities.propose_cta': 'Proponer tu ciudad',
        'blog.title': 'Blog & Noticias',
        'blog.empty': 'Ningún artículo publicado',
        'blog.read_more': 'Leer más',
        'about.title': 'Quiénes somos',
        'about.mission': 'Nuestra misión',
        'sponsors.title': 'Patrocinadores y socios',
        'sponsors.become_partner': 'Conviértete en socio',
        'generic.close': 'Cerrar',
        'generic.back': 'Volver',
        'generic.loading': 'Cargando…',
        'generic.error': 'Error',
        'generic.retry': 'Reintentar',
        'generic.offline': 'Sin conexión',
        'nav.map': 'Mapa',
        'nav.routes': 'Rutas',
        'nav.menu': 'Menú',
        'menu.language_label': 'Idioma',
        'menu.city_label': 'Ciudad',
        'menu.links_label': 'Menú',
        'menu.about': 'Quiénes somos',
        'menu.sponsors': 'Patrocinadores y socios',
        'menu.share_app': 'Compartir la app',
        'menu.admin': 'Panel Admin',
        'menu.logout': 'Cerrar sesión',
        'menu.login': 'Acceder con Google',
        'splash.or': 'o',
        'splash.footer': 'Una herencia por descubrir',
        'splash.tagline': 'Descubre los locales históricos que definen el alma de las ciudades. Un mapa interactivo para viajeros curiosos.',
    },

    ca: {
        'app.tagline': 'Descobreix els locals històrics de la ciutat',
        'app.search_placeholder': 'Cerca un local…',
        'app.filter_all': 'Tots',
        'splash.headline': 'Descobreix la ciutat autèntica',
        'splash.login_google': 'Accedeix amb Google',
        'splash.continue_guest': 'Continua com a convidat',
        'splash.guest_note': 'Funcions limitades sense compte',
        'nav.rutas': 'Rutes Temàtiques',
        'nav.passport': 'El meu Passaport',
        'nav.blog': 'Blog & Notícies',
        'nav.about': 'Qui som',
        'nav.sponsors': 'Patrocinadors',
        'nav.share': 'Comparteix',
        'nav.admin': 'Tauler Admin',
        'nav.logout': 'Tanca sessió',
        'nav.login': 'Inicia sessió',
        'nav.city': 'Canvia de ciutat',
        'nav.language': 'Idioma',
        'map.locate_me': 'Localitza\'m',
        'map.loading': 'Carregant mapa…',
        'map.no_results': 'Cap resultat trobat',
        'detail.story': 'La història',
        'detail.audio': 'Història en àudio',
        'detail.ai_fact': 'Revela una curiositat històrica',
        'detail.ai_loading': 'La IA està cercant…',
        'detail.navigate': 'Navega a l\'app',
        'detail.open_maps': 'Obre a Google Maps',
        'detail.stamp_passport': 'Segella el Passaport',
        'detail.already_stamped': 'Ja al passaport',
        'detail.checking_gps': 'Comprovant posició GPS…',
        'detail.gallery': 'La galeria',
        'detail.share': 'Comparteix',
        'detail.favorite': 'Afegeix als favorits',
        'detail.unfavorite': 'Elimina dels favorits',
        'detail.socials': 'Segueix-nos',
        'passport.title': 'Passaport',
        'passport.subtitle': 'Els locals que has visitat en persona',
        'passport.empty_title': 'Cap segell encara',
        'passport.empty_body': 'Visita un local i prem "Segella el Passaport" quan hi siguis (a menys de 100m).',
        'passport.badges': 'Insígnies obtingudes',
        'passport.stamps': 'Segells recollits',
        'passport.explored': 'de la ciutat explorada',
        'rutas.title': 'Rutes Temàtiques',
        'rutas.subtitle': 'Itineraris a peu curats',
        'rutas.stops': 'parades',
        'rutas.open_map': 'Obre al mapa',
        'rutas.tip': 'Consell',
        'rutas.highlights': 'No et perdis',
        'rutas.duration': 'durada',
        'rutas.distance': 'distància',
        'rutas.difficulty': 'dificultat',
        'rutas.easy': '🟢 Fàcil',
        'rutas.medium': '🟡 Mitjana',
        'rutas.hard': '🔴 Exigent',
        'checkin.success': 'Segell afegit al passaport!',
        'checkin.already': 'Aquest local ja és al teu passaport',
        'checkin.too_far': 'Ets massa lluny — apropa\'t a 100m',
        'checkin.error': 'Error GPS — torna-ho a provar',
        'geo.nearby_prefix': 'Ets a',
        'geo.view_card': 'Veure fitxa',
        'cities.title': 'Tria la ciutat',
        'cities.subtitle': 'Emblematica és disponible en aquestes ciutats',
        'cities.available': 'Disponible ara',
        'cities.coming_soon': 'Properament',
        'cities.active': 'Activa',
        'cities.propose': 'Vols la teva ciutat?',
        'cities.propose_body': 'Ets una associació cultural o un ens municipal? Podem portar Emblematica a la teva ciutat.',
        'cities.propose_cta': 'Proposa la teva ciutat',
        'blog.title': 'Blog & Notícies',
        'blog.empty': 'Cap article publicat',
        'blog.read_more': 'Llegeix més',
        'about.title': 'Qui som',
        'about.mission': 'La nostra missió',
        'sponsors.title': 'Patrocinadors i socis',
        'sponsors.become_partner': 'Fes-te soci',
        'generic.close': 'Tanca',
        'generic.back': 'Enrere',
        'generic.loading': 'Carregant…',
        'generic.error': 'Error',
        'generic.retry': 'Torna-ho a provar',
        'generic.offline': 'Sense connexió',
        'nav.map': 'Mapa',
        'nav.routes': 'Rutes',
        'nav.menu': 'Menú',
        'menu.language_label': 'Idioma',
        'menu.city_label': 'Ciutat',
        'menu.links_label': 'Menú',
        'menu.about': 'Qui som',
        'menu.sponsors': 'Patrocinadors i socis',
        'menu.share_app': 'Comparteix l\'app',
        'menu.admin': 'Tauler Admin',
        'menu.logout': 'Tanca sessió',
        'menu.login': 'Accedeix amb Google',
        'splash.or': 'o',
        'splash.footer': 'Una herència per descobrir',
        'splash.tagline': 'Descobreix els locals històrics que defineixen l\'ànima de les ciutats. Un mapa interactiu per a viatgers curiosos.',
    },

    pt: {
        'app.tagline': 'Descobre os locais históricos da cidade',
        'app.search_placeholder': 'Procurar um local…',
        'app.filter_all': 'Todos',
        'splash.headline': 'Descobre a cidade autêntica',
        'splash.login_google': 'Entrar com Google',
        'splash.continue_guest': 'Continuar como convidado',
        'splash.guest_note': 'Funcionalidades limitadas sem conta',
        'nav.rutas': 'Rotas Temáticas',
        'nav.passport': 'O meu Passaporte',
        'nav.blog': 'Blog & Notícias',
        'nav.about': 'Quem somos',
        'nav.sponsors': 'Patrocinadores',
        'nav.share': 'Partilhar',
        'nav.admin': 'Painel Admin',
        'nav.logout': 'Sair',
        'nav.login': 'Entrar',
        'nav.city': 'Mudar cidade',
        'nav.language': 'Idioma',
        'map.locate_me': 'Localizar-me',
        'map.loading': 'A carregar mapa…',
        'map.no_results': 'Sem resultados',
        'detail.story': 'A história',
        'detail.audio': 'História em áudio',
        'detail.ai_fact': 'Revelar uma curiosidade histórica',
        'detail.ai_loading': 'A IA está a pesquisar…',
        'detail.navigate': 'Navegar na app',
        'detail.open_maps': 'Abrir no Google Maps',
        'detail.stamp_passport': 'Carimbar Passaporte',
        'detail.already_stamped': 'Já no passaporte',
        'detail.checking_gps': 'A verificar posição GPS…',
        'detail.gallery': 'Galeria',
        'detail.share': 'Partilhar',
        'detail.favorite': 'Adicionar aos favoritos',
        'detail.unfavorite': 'Remover dos favoritos',
        'detail.socials': 'Segue-nos',
        'passport.title': 'Passaporte',
        'passport.subtitle': 'Locais que visitaste pessoalmente',
        'passport.empty_title': 'Nenhum carimbo ainda',
        'passport.empty_body': 'Visita um local e prime "Carimbar Passaporte" quando lá estiveres (a menos de 100m).',
        'passport.badges': 'Distintivos obtidos',
        'passport.stamps': 'Carimbos recolhidos',
        'passport.explored': 'da cidade explorada',
        'rutas.title': 'Rotas Temáticas',
        'rutas.subtitle': 'Itinerários a pé',
        'rutas.stops': 'paragens',
        'rutas.open_map': 'Abrir no mapa',
        'rutas.tip': 'Dica',
        'rutas.highlights': 'Não percas',
        'rutas.duration': 'duração',
        'rutas.distance': 'distância',
        'rutas.difficulty': 'dificuldade',
        'rutas.easy': '🟢 Fácil',
        'rutas.medium': '🟡 Médio',
        'rutas.hard': '🔴 Difícil',
        'checkin.success': 'Carimbo adicionado ao passaporte!',
        'checkin.already': 'Este local já está no teu passaporte',
        'checkin.too_far': 'Estás demasiado longe — aproxima-te a 100m',
        'checkin.error': 'Erro GPS — tenta de novo',
        'geo.nearby_prefix': 'Estás a',
        'geo.view_card': 'Ver ficha',
        'cities.title': 'Escolher cidade',
        'cities.subtitle': 'Emblematica está disponível nestas cidades',
        'cities.available': 'Disponível agora',
        'cities.coming_soon': 'Em breve',
        'cities.active': 'Ativa',
        'cities.propose': 'Queres a tua cidade?',
        'cities.propose_body': 'És uma associação cultural ou entidade municipal? Podemos levar Emblematica à tua cidade.',
        'cities.propose_cta': 'Propor a tua cidade',
        'blog.title': 'Blog & Notícias',
        'blog.empty': 'Nenhum artigo publicado',
        'blog.read_more': 'Ler mais',
        'about.title': 'Quem somos',
        'about.mission': 'A nossa missão',
        'sponsors.title': 'Patrocinadores e parceiros',
        'sponsors.become_partner': 'Torna-te parceiro',
        'generic.close': 'Fechar',
        'generic.back': 'Voltar',
        'generic.loading': 'A carregar…',
        'generic.error': 'Erro',
        'generic.retry': 'Tentar de novo',
        'generic.offline': 'Sem ligação',
        'nav.map': 'Mapa',
        'nav.routes': 'Rotas',
        'nav.menu': 'Menu',
        'menu.language_label': 'Idioma',
        'menu.city_label': 'Cidade',
        'menu.links_label': 'Menu',
        'menu.about': 'Quem somos',
        'menu.sponsors': 'Patrocinadores e parceiros',
        'menu.share_app': 'Partilhar a app',
        'menu.admin': 'Painel Admin',
        'menu.logout': 'Sair',
        'menu.login': 'Entrar com Google',
        'splash.or': 'ou',
        'splash.footer': 'Uma herança por descobrir',
        'splash.tagline': 'Descobre os locais históricos que definem a alma das cidades. Um mapa interativo para viajantes curiosos.',
    },

    ar: {
        'app.tagline': 'اكتشف الأماكن التاريخية في المدينة',
        'app.search_placeholder': 'ابحث عن مكان…',
        'app.filter_all': 'الكل',
        'splash.headline': 'اكتشف المدينة الأصيلة',
        'splash.login_google': 'تسجيل الدخول بحساب Google',
        'splash.continue_guest': 'استمرار كزائر',
        'splash.guest_note': 'ميزات محدودة بدون حساب',
        'nav.rutas': 'المسارات الموضوعية',
        'nav.passport': 'جواز سفري',
        'nav.blog': 'المدونة والأخبار',
        'nav.about': 'من نحن',
        'nav.sponsors': 'الرعاة',
        'nav.share': 'مشاركة',
        'nav.admin': 'لوحة الإدارة',
        'nav.logout': 'تسجيل الخروج',
        'nav.login': 'تسجيل الدخول',
        'nav.city': 'تغيير المدينة',
        'nav.language': 'اللغة',
        'map.locate_me': 'حدد موقعي',
        'map.loading': 'جارٍ تحميل الخريطة…',
        'map.no_results': 'لا توجد نتائج',
        'detail.story': 'القصة',
        'detail.audio': 'القصة الصوتية',
        'detail.ai_fact': 'اكشف حقيقة تاريخية',
        'detail.ai_loading': 'الذكاء الاصطناعي يبحث…',
        'detail.navigate': 'التنقل في التطبيق',
        'detail.open_maps': 'فتح في خرائط Google',
        'detail.stamp_passport': 'ختم الجواز',
        'detail.already_stamped': 'موجود بالفعل في الجواز',
        'detail.checking_gps': 'جارٍ التحقق من الموقع…',
        'detail.gallery': 'المعرض',
        'detail.share': 'مشاركة',
        'detail.favorite': 'إضافة إلى المفضلة',
        'detail.unfavorite': 'إزالة من المفضلة',
        'detail.socials': 'تابعنا',
        'passport.title': 'الجواز',
        'passport.subtitle': 'الأماكن التي زرتها شخصيًا',
        'passport.empty_title': 'لا توجد أختام بعد',
        'passport.empty_body': 'قم بزيارة مكان واضغط "ختم الجواز" عندما تكون هناك (في حدود 100 متر).',
        'passport.badges': 'الشارات المكتسبة',
        'passport.stamps': 'الأختام المجمعة',
        'passport.explored': 'من المدينة تم استكشافها',
        'rutas.title': 'المسارات الموضوعية',
        'rutas.subtitle': 'مسارات مشي مختارة',
        'rutas.stops': 'محطات',
        'rutas.open_map': 'فتح على الخريطة',
        'rutas.tip': 'نصيحة',
        'rutas.highlights': 'لا تفوّت',
        'rutas.duration': 'المدة',
        'rutas.distance': 'المسافة',
        'rutas.difficulty': 'الصعوبة',
        'rutas.easy': '🟢 سهل',
        'rutas.medium': '🟡 متوسط',
        'rutas.hard': '🔴 صعب',
        'checkin.success': 'تم إضافة الختم إلى الجواز!',
        'checkin.already': 'هذا المكان موجود بالفعل في جوازك',
        'checkin.too_far': 'أنت بعيد جدًا — اقترب إلى 100 متر',
        'checkin.error': 'خطأ GPS — حاول مرة أخرى',
        'geo.nearby_prefix': 'أنت على بُعد',
        'geo.view_card': 'عرض البطاقة',
        'cities.title': 'اختر المدينة',
        'cities.subtitle': 'Emblematica متاح في هذه المدن',
        'cities.available': 'متاح الآن',
        'cities.coming_soon': 'قريبًا',
        'cities.active': 'نشط',
        'cities.propose': 'تريد مدينتك؟',
        'cities.propose_body': 'هل أنت جمعية ثقافية أو هيئة بلدية؟ يمكننا إحضار Emblematica إلى مدينتك.',
        'cities.propose_cta': 'اقترح مدينتك',
        'blog.title': 'المدونة والأخبار',
        'blog.empty': 'لا توجد مقالات منشورة',
        'blog.read_more': 'اقرأ المزيد',
        'about.title': 'من نحن',
        'about.mission': 'مهمتنا',
        'sponsors.title': 'الرعاة والشركاء',
        'sponsors.become_partner': 'كن شريكًا',
        'generic.close': 'إغلاق',
        'generic.back': 'رجوع',
        'generic.loading': 'جارٍ التحميل…',
        'generic.error': 'خطأ',
        'generic.retry': 'إعادة المحاولة',
        'generic.offline': 'غير متصل',
        'nav.map': 'الخريطة',
        'nav.routes': 'المسارات',
        'nav.menu': 'القائمة',
        'menu.language_label': 'اللغة',
        'menu.city_label': 'المدينة',
        'menu.links_label': 'القائمة',
        'menu.about': 'من نحن',
        'menu.sponsors': 'الرعاة والشركاء',
        'menu.share_app': 'مشاركة التطبيق',
        'menu.admin': 'لوحة الإدارة',
        'menu.logout': 'تسجيل الخروج',
        'menu.login': 'تسجيل الدخول بحساب Google',
        'splash.or': 'أو',
        'splash.footer': 'تراث ينتظر الاكتشاف',
        'splash.tagline': 'اكتشف الأماكن التاريخية التي تعرّف روح المدن. خريطة تفاعلية للمسافرين الفضوليين.',
    },
}
