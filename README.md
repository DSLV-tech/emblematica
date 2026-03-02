# Emblematica

> Scopri, preserva e racconta i locali storici delle città europee.

**Emblematica** è una Progressive Web App (PWA) che mappa, documenta e racconta la storia dei locali storici — bar centenari, librerie d'epoca, farmacie storiche, botteghe artigianali — trasformando ogni visita in un'esperienza culturale.

---

## ✨ Funzionalità

| Funzione | Descrizione |
|---|---|
| 🗺️ **Mappa interattiva** | Esplora i locali storici su mappa con filtri per categoria e ricerca |
| 📖 **Storie narrate** | Ogni locale ha scheda dettagliata, galleria fotografica e audio story con evidenziazione parola per parola |
| ✨ **Curiosità AI** | Aneddoti storici generati da Google Gemini |
| 📒 **Passaporto Digitale** | Visita i locali e timbra il passaporto via GPS (entro 100m). Colleziona badge |
| 🧭 **Percorsi tematici** | 5 itinerari a piedi curati con tappe, distanze e consigli |
| 📡 **Notifiche di prossimità** | Avvisi automatici quando passi vicino a un locale non ancora visitato |
| 🌍 **Multi-città** | Architettura white-label: Barcellona attiva, Napoli/Lisbona/Bologna/Porto/Palermo in arrivo |
| 🌐 **6 lingue** | 🇮🇹 IT · 🇬🇧 EN · 🇪🇸 ES · 🏴󠁥󠁳󠁣󠁴󠁿 CA · 🇵🇹 PT · 🇸🇦 AR (con supporto RTL) |
| 🏛️ **Reclama il locale** | I gestori possono reclamare la propria scheda |
| 📱 **PWA installabile** | Funziona come app nativa, disponibile anche offline |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Backend:** Firebase (Firestore, Auth, Security Rules)
- **Mappa:** Leaflet.js
- **AI:** Google Gemini API
- **Audio:** Web Speech API
- **PWA:** Service Worker manuale + Web App Manifest

---

## 🚀 Installazione

### Prerequisiti

- **Node.js** ≥ 18
- **npm** ≥ 9
- Un progetto **Firebase** con Firestore e Authentication (Google provider) abilitati
- Una **Google Gemini API key** (opzionale, per le curiosità AI)

### 1. Clona il repository

```bash
git clone https://github.com/tuouser/emblematica.git
cd emblematica
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Copia il file di esempio e inserisci le tue chiavi:

```bash
cp .env.example .env.local
```

Modifica `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=la-tua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=il-tuo-progetto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=il-tuo-progetto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=il-tuo-progetto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
GEMINI_API_KEY=la-tua-gemini-api-key
```

### 4. Avvia in sviluppo

```bash
npm run dev
```

L'app sarà disponibile su **http://localhost:5174**

### 5. Build di produzione

```bash
npm run build
npm start
```

---

## 📂 Struttura del progetto

```
src/
├── app/                    # Next.js App Router (layout, page, API routes)
├── components/
│   ├── Map/                # MapView con Leaflet
│   └── UI/                 # BottomNav, Logo, ClaimModal, MenuPanel
├── context/                # CityContext, LanguageContext
├── data/                   # cities.ts (registry multi-città)
├── firebase/               # Configurazione Firebase
├── hooks/                  # useAuth, useLocales, usePassport, useRouting, useFavorites, useGeofencing
├── i18n/                   # translations.ts (6 lingue, 100+ chiavi)
├── views/                  # SplashPage, DetailView, RutasView, PassaportoView, AdminView, ...
└── AppShell.tsx             # Shell principale dell'applicazione
```

---

## 🌍 Aggiungere una nuova città

1. Apri `src/data/cities.ts`
2. Aggiungi una nuova entry nell'array `CITIES`:

```ts
{
    id: 'napoli',
    name: 'Napoli',
    fullName: 'Emblematica Napoli',
    tagline: 'Scopri i tesori nascosti di Napoli',
    flag: '🇮🇹',
    country: 'Italia',
    collection: 'locales_napoli',    // collezione Firestore
    center: { lat: 40.8518, lng: 14.2681 },
    zoom: 14,
    available: true,
}
```

3. Crea la collezione `locales_napoli` su Firestore con i documenti dei locali
4. Aggiungi le regole di sicurezza in `firestore.rules`

---

## 🌐 Aggiungere una nuova lingua

1. Apri `src/i18n/translations.ts`
2. Aggiungi il codice lingua a `LangCode`
3. Aggiungi l'entry nella array `LANGUAGES` (con `rtl: true` se necessario)
4. Aggiungi il blocco di traduzioni per tutte le chiavi
5. L'app rileverà automaticamente la nuova lingua

---

## 🔒 Firestore Security Rules

Le regole sono nel file `firestore.rules`. Struttura delle collezioni:

| Collezione | Accesso |
|---|---|
| `locales` | Lettura pubblica, scrittura solo admin |
| `locales_{city}` | Lettura pubblica, scrittura solo admin |
| `passports` | Solo il proprietario (read/write) |
| `claims` | Creazione autenticata, gestione admin |
| `users` | Solo il proprietario |

Deploy delle regole:

```bash
npx firebase deploy --only firestore:rules
```

---

## 📱 PWA

L'app è installabile come PWA. Il service worker (`public/sw.js`) gestisce:

- Cache delle risorse statiche
- Pagina offline di fallback (`public/offline.html`)
- Strategia network-first con fallback cache

Per testare la PWA in locale, usa il build di produzione (`npm run build && npm start`).

---

## 📄 Licenza

MIT © Emblematica
