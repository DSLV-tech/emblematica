---
name: Emblematica Project Overview
description: Core architecture and tech stack of the Emblematica Next.js app
type: project
---

Next.js 15 app — digital passport + heritage discovery platform for Barcelona. Users visit historic "locales", collect stamps via GPS check-in, earn badges, and explore curated walking routes (Rutas).

**Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS, Firebase (Auth + Firestore), OSRM routing API, Google Gemini AI.

**Key directories:**
- `src/types/index.ts` — canonical type file (Locale, Category, AppUser, Stamp, Passport, Badge, Ruta, RutaStop, Route, CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS)
- `src/AppShell.tsx` — main shell; uses hooks internally (useAuth, useLocales, usePassport, useRouting, useFavorites)
- `src/views/` — active view components (DetailView, PassaportoView, RutasView, SplashPage, etc.)
- `src/hooks/` — useAuth, useLocales, usePassport, useRouting, useFavorites, useAiContext
- `src/components/UI/` — SearchBar (default, controlled value/onChange), NavigationPanel (routeInfo/destName/onStop), CategoryFilter (selected/onChange, uses Category type), BottomSheet (locale/isFavorite/onClose/onToggleFavorite/onViewDetail), Logo (size/variant/dark)
- `src/data/rutas.ts` — RUTAS array; Ruta uses `localeIds: string[]` and `difficulty: 'facile'|'media'|'impegnativa'` (different from types/index Ruta)
- `src/data/sampleData.ts` — SAMPLE_LOCALES fallback data

**Root src/ files (src/DetailView.tsx, src/PassaportoView.tsx, src/RutasView.tsx, src/SearchBar_NavigationPanel.tsx):** old pre-migration files, not imported by AppShell, but compiled by TS. Keep them compiling but don't use them.

**Why:** Migrated from Vite; many old files survived at root of src/ alongside new versions in src/views/. Old files reference types that needed to be added to types/index.ts.
