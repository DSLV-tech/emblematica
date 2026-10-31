'use client';

import React, { useState, useCallback, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
import type { Locale, AppUser, Category } from '@/types';
import type { Ruta } from '@/types';
import type { Ruta as RutaData } from '@/data/rutas';
import { useCity } from '@/context/CityContext';
import type { RouteInfo, UserPosition } from '@/hooks/useRouting';
import Logo from '@/components/UI/Logo';
import SearchBar from '@/components/UI/SearchBar';
import NavigationPanel from '@/components/UI/NavigationPanel';
import CategoryFilter from '@/components/UI/CategoryFilter';
import BottomSheet from '@/components/UI/BottomSheet';
import CitySelector from '@/components/UI/CitySelector';
import {
  CaretRight, GearSix, Handshake, Info, MapTrifold, Newspaper, Stamp, Translate, User, X, type Icon,
} from '@phosphor-icons/react';

/* Lazy-load MapView — react-leaflet requires browser APIs, no SSR */
const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false });

/* Lazy load views (code splitting) */
const loadDetailView     = () => import('@/views/DetailView');
const loadPassaportoView = () => import('@/views/PassaportoView');
const loadRutasView      = () => import('@/views/RutasView');
const loadBlogView       = () => import('@/views/BlogView');
const loadAboutView      = () => import('@/views/AboutView');
const loadSponsorsView   = () => import('@/views/SponsorsView');

const DetailView    = lazy(loadDetailView);
const PassaportoView = lazy(loadPassaportoView);
const RutasView     = lazy(loadRutasView);
const AdminView     = lazy(() => import('@/views/AdminView'));
const BlogView      = lazy(loadBlogView);
const AboutView     = lazy(loadAboutView);
const SponsorsView  = lazy(loadSponsorsView);

/* A connessione attiva scarica le viste, così il service worker le ha già per l'offline */
const preloadViews = () => {
  [loadDetailView, loadPassaportoView, loadRutasView, loadBlogView, loadAboutView, loadSponsorsView]
    .forEach(load => load().catch(() => {}));
};

/* ── Types ──────────────────────────────────────────────── */
type ActiveView = 'none' | 'detail' | 'passport' | 'rutas' | 'blog' | 'about' | 'sponsors';

interface AppShellProps {
  user:           AppUser | null;
  locales:        Locale[];
  rutas:          Ruta[];
  city?:          string;
  cityCenter?:    { lat: number; lng: number };
  cityZoom?:      number;
  onLogout:       () => void;
  onSignIn:       () => void;
  /* Callbacks per features (implementati nei rispettivi hooks) */
  onCheckIn:      (locale: Locale) => Promise<void>;
  onToggleFavorite: (id: string) => void;
  isFavorite:     (id: string) => boolean;
  hasStamp:       (id: string) => boolean;
  onStartRoute:   (locale: Locale) => void;
  currentRoute:   RouteInfo | null;
  isLoadingRoute: boolean;
  onStopRoute:    () => void;
  passport:       import('@/types').Passport | null;
  totalLocali:    number;
  routeGeoJson?:  any | null;
  userPosition?:  UserPosition | null;
}

/* ── Avatar button ───────────────────────────────────────── */
const Avatar: React.FC<{
  user:    AppUser | null;
  label:   string;
  onClick: () => void;
}> = ({ user, label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="glass w-11 h-11 rounded-full flex items-center justify-center text-gold flex-shrink-0 overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:border-gold/40 transition-colors"
    style={user?.photoURL ? { background: `url(${user.photoURL}) center/cover no-repeat` } : undefined}
  >
    {!user?.photoURL && <User size={20} />}
  </button>
);

/* ── Menu drawer ─────────────────────────────────────────── */
const MenuDrawer: React.FC<{
  user:        AppUser | null;
  isOpen:      boolean;
  onClose:     () => void;
  onNavigate:  (view: ActiveView) => void;
  onShowAdmin: () => void;
  onLogout:    () => void;
  onSignIn:    () => void;
}> = ({ user, isOpen, onClose, onNavigate, onShowAdmin, onLogout, onSignIn }) => {
  const { t, lang, setLang, allLanguages } = useLanguage();
  if (!isOpen) return null;

  const items: { icon: Icon; label: string; view: ActiveView }[] = [
    { icon: Stamp,      label: t('nav.passport'), view: 'passport' },
    { icon: MapTrifold, label: t('nav.rutas'),    view: 'rutas'    },
    { icon: Newspaper,  label: t('nav.blog'),     view: 'blog'     },
    { icon: Info,       label: t('nav.about'),    view: 'about'    },
    { icon: Handshake,  label: t('nav.sponsors'), view: 'sponsors' },
  ];

  const itemCx = 'group w-full flex items-center gap-3.5 px-3 h-12 rounded-2xl text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]';

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 z-[3900] bg-black/50 backdrop-blur-[2px] animate-fade-in" />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label={t('nav.menu')}
        className="fixed top-0 end-0 bottom-0 z-[3901] w-[300px] max-w-[85vw] bg-ink text-cream border-s border-white/[0.08] flex flex-col rtl:[--drawer-from:-100%]"
        style={{ animation: 'slideLeft 320ms cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* User info */}
        <div className="flex items-start gap-3 px-5 pb-5 border-b border-white/[0.07]" style={{ paddingTop: 'max(28px, env(safe-area-inset-top))' }}>
          <div
            className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0"
            style={user?.photoURL ? { background: `url(${user.photoURL}) center/cover no-repeat` } : undefined}
          >
            {!user?.photoURL && <User size={20} />}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            {user ? (
              <>
                {user.displayName && <div className="font-sans text-[15px] font-semibold truncate">{user.displayName}</div>}
                <div className="font-sans text-xs text-cream/45 truncate mt-0.5">{user.email}</div>
                {user.role === 'admin' && (
                  <span className="eyebrow inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] text-terracotta border border-terracotta/40 bg-terracotta/10">
                    {t('locale.admin_badge')}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="font-serif italic text-[15px] text-cream/60">{t('locale.guest_label')}</div>
                <button
                  onClick={onSignIn}
                  className="mt-2.5 h-9 px-4 rounded-full bg-gold text-ink font-sans text-[13px] font-semibold hover:bg-gold-light transition-colors"
                >
                  {t('nav.login_register')}
                </button>
              </>
            )}
          </div>
          <button onClick={onClose} aria-label={t('generic.close')} className="w-9 h-9 -me-1.5 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:bg-white/[0.06] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {items.map(item => (
            <button key={item.view} onClick={() => { onNavigate(item.view); onClose(); }} className={itemCx}>
              <item.icon size={22} className="text-gold/80 group-hover:text-gold transition-colors" />
              <span className="flex-1 font-sans text-[15px] font-medium">{item.label}</span>
              <CaretRight size={16} className="text-cream/25 rtl:rotate-180" />
            </button>
          ))}

          {/* Admin button — solo per admin */}
          {user?.role === 'admin' && (
            <>
              <div className="mx-3 my-2 h-px bg-white/[0.07]" />
              <button onClick={() => { onShowAdmin(); onClose(); }} className={`${itemCx} text-gold`}>
                <GearSix size={22} />
                <span className="flex-1 font-sans text-[15px] font-medium">{t('nav.admin')}</span>
              </button>
            </>
          )}
        </nav>

        {/* Lingua */}
        <div className="px-5 pt-4 pb-3 border-t border-white/[0.07]">
          <p className="eyebrow text-[10px] text-cream/40 mb-2.5 flex items-center gap-1.5">
            <Translate size={14} aria-hidden /> {t('nav.language')}
          </p>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('nav.language')}>
            {allLanguages.map(l => (
              <button
                key={l.code}
                role="radio"
                aria-checked={l.code === lang}
                lang={l.code}
                onClick={() => setLang(l.code)}
                className={`h-8 px-3 rounded-full font-sans text-[13px] transition-colors border ${
                  l.code === lang
                    ? 'bg-gold text-ink border-gold font-semibold'
                    : 'border-white/[0.12] text-cream/70 hover:text-cream hover:border-white/25'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer: logout + logo */}
        <div className="px-5 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          <Logo size="sm" dark={true} variant="symbol" />
          {user && (
            <button
              onClick={onLogout}
              className="eyebrow h-9 px-4 rounded-full border border-white/[0.12] text-cream/55 hover:text-cream hover:border-white/25 transition-colors"
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(var(--drawer-from, 100%)); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

/* ── Main AppShell ───────────────────────────────────────── */
const AppShell: React.FC<AppShellProps> = ({
  user,
  locales,
  rutas,
  city = 'Barcelona',
  cityCenter,
  cityZoom,
  onLogout,
  onSignIn,
  onCheckIn,
  onToggleFavorite,
  isFavorite,
  hasStamp,
  onStartRoute,
  currentRoute,
  isLoadingRoute,
  onStopRoute,
  passport,
  totalLocali,
  routeGeoJson,
  userPosition,
}) => {
  const { t } = useLanguage();
  const [activeView,      setActiveView]      = useState<ActiveView>('none');
  const [selectedLocale,  setSelectedLocale]  = useState<Locale | null>(null);
  const [sheetOpen,       setSheetOpen]       = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [showAdmin,       setShowAdmin]       = useState(false);
  const [activeCategory,  setActiveCategory]  = useState<Category | null>(null); // null = Tutti
  const [navDestination,  setNavDestination]  = useState<Locale | null>(null);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeRuta,      setActiveRuta]      = useState<{ ruta: RutaData; stops: Locale[] } | null>(null);
  const { city: currentCity } = useCity();

  // Un percorso appartiene a una sola città
  useEffect(() => { setActiveRuta(null); }, [currentCity.id]);

  useEffect(() => {
    const timer = setTimeout(preloadViews, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = useCallback((locale: Locale) => {
    setSelectedLocale(locale);
    setSheetOpen(true);
    setActiveView('none');
  }, []);

  const handleOpenDetail = useCallback(() => {
    setSheetOpen(false);
    setActiveView('detail');
  }, []);

  const handleNavigate = useCallback((locale: Locale) => {
    setNavDestination(locale);
    setActiveRuta(null);
    onStartRoute(locale);
    setActiveView('none');
    setSheetOpen(false);
  }, [onStartRoute]);

  const handleCloseView = useCallback(() => {
    setActiveView('none');
    setSelectedLocale(null);
  }, []);

  const handleSearchSelect = useCallback((locale: Locale) => {
    setSelectedLocale(locale);
    setSheetOpen(true);
  }, []);

  const filteredLocales = useMemo(() =>
    activeRuta ? activeRuta.stops : locales.filter(l => {
      const matchesCategory = !activeCategory || l.category === activeCategory;
      const matchesSearch   = !searchQuery.trim() ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [locales, activeCategory, searchQuery, activeRuta]
  );

  const rutaOnMap = useMemo(
    () => activeRuta && { stops: activeRuta.stops, color: activeRuta.ruta.colorHex },
    [activeRuta]
  );

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* ── Map layer ───────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MapView
          key={city}
          locales={filteredLocales}
          selectedLocale={selectedLocale}
          onMarkerClick={handleMarkerClick}
          routeGeoJson={routeGeoJson ?? null}
          userPosition={userPosition ?? null}
          destLat={navDestination?.coordinates.lat}
          destLng={navDestination?.coordinates.lng}
          center={cityCenter}
          zoom={cityZoom}
          ruta={rutaOnMap}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <header
        className="absolute top-0 left-0 right-0 z-30 flex flex-col gap-2.5 px-4 pb-6 pointer-events-none"
        style={{
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          // velo morbido: leggibilità dei controlli senza "tagliare" la mappa
          background: 'linear-gradient(to bottom, rgba(20,20,22,0.55), rgba(20,20,22,0.18) 70%, transparent)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <div className="glass w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_6px_24px_rgba(0,0,0,0.28)]">
            <Logo size="sm" dark={true} variant="symbol" />
          </div>
          <div className="flex-1 min-w-0">
            <SearchBar value={searchQuery} onChange={(q) => setSearchQuery(q)} placeholder={t('app.search_placeholder')} />
          </div>
          <Avatar user={user} label={t('nav.menu_open')} onClick={() => setMenuOpen(true)} />
        </div>

        {/* City selector + category filter */}
        <div className="pointer-events-auto flex flex-col gap-2">
          <CitySelector />
          <CategoryFilter
            selected={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </header>

      {/* ── Navigation panel ────────────────────────────────── */}
      {navDestination && currentRoute && (
        <div style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   25,
        }}>
          <NavigationPanel
            routeInfo={currentRoute}
            destName={navDestination.name}
            onStop={() => { setNavDestination(null); onStopRoute(); }}
          />
        </div>
      )}

      {/* ── Percorso tematico attivo ────────────────────────── */}
      {activeRuta && !selectedLocale && (
        <div
          className="absolute left-4 right-4 z-[25] flex items-center gap-3 bg-card rounded-2xl p-4 shadow-xl"
          style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: activeRuta.ruta.colorHex }} />
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm font-semibold text-anthracite truncate">{activeRuta.ruta.title}</p>
            <p className="font-sans text-xs text-anthracite/60">{activeRuta.stops.length} {t('rutas.stops')} · {activeRuta.ruta.distance}</p>
          </div>
          <button
            onClick={() => setActiveRuta(null)}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-anthracite/5 hover:bg-anthracite/10 font-sans text-xs font-semibold text-anthracite transition-colors"
          >
            {t('rutas.exit')}
          </button>
        </div>
      )}

      {/* ── Bottom Sheet (locale preview) ───────────────────── */}
      <BottomSheet
        locale={selectedLocale && !navDestination ? selectedLocale : null}
        isFavorite={selectedLocale ? isFavorite(selectedLocale.id) : false}
        onClose={() => { setSheetOpen(false); setSelectedLocale(null); }}
        onToggleFavorite={onToggleFavorite}
        onViewDetail={() => handleOpenDetail()}
      />

      {/* ── Views (full-screen overlay) ─────────────────────── */}
      <Suspense fallback={null}>
        {activeView === 'detail' && selectedLocale && (
          <DetailView
            locale={selectedLocale}
            onBack={handleCloseView}
            onNavigate={handleNavigate}
            onCheckIn={onCheckIn}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(selectedLocale.id)}
            hasStamp={hasStamp(selectedLocale.id)}
            user={user}
          />
        )}

        {activeView === 'passport' && (
          <PassaportoView
            stamps={passport?.stamps as any ?? []}
            loading={false}
            onClose={handleCloseView}
          />
        )}

        {activeView === 'rutas' && (
          <RutasView
            cityId={currentCity.id}
            locales={locales}
            onClose={handleCloseView}
            onStartRuta={(ruta, stops) => setActiveRuta({ ruta, stops })}
          />
        )}

        {activeView === 'blog'     && <BlogView     onClose={handleCloseView} />}
        {activeView === 'about'    && <AboutView    onClose={handleCloseView} />}
        {activeView === 'sponsors' && <SponsorsView onClose={handleCloseView} />}
      </Suspense>

      {/* ── Menu drawer ─────────────────────────────────────── */}
      <MenuDrawer
        user={user}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={view => { setActiveView(view); setMenuOpen(false); }}
        onShowAdmin={() => setShowAdmin(true)}
        onLogout={onLogout}
        onSignIn={onSignIn}
      />

      {/* ── Admin view ──────────────────────────────────────── */}
      <Suspense fallback={null}>
        {showAdmin && (
          <AdminView onClose={() => setShowAdmin(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default AppShell;
