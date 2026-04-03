'use client';

import React, { useState, useCallback, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import type { Locale, Route, AppUser, Category } from '@/types';
import type { Ruta } from '@/types';
import type { UserPosition } from '@/hooks/useRouting';
import Logo from '@/components/UI/Logo';
import SearchBar from '@/components/UI/SearchBar';
import NavigationPanel from '@/components/UI/NavigationPanel';
import CategoryFilter from '@/components/UI/CategoryFilter';
import BottomSheet from '@/components/UI/BottomSheet';

/* Lazy-load MapView — react-leaflet requires browser APIs, no SSR */
const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false });

/* Lazy load views (code splitting) */
const DetailView    = lazy(() => import('@/views/DetailView'));
const PassaportoView = lazy(() => import('@/views/PassaportoView'));
const RutasView     = lazy(() => import('@/views/RutasView'));

/* ── Types ──────────────────────────────────────────────── */
type ActiveView = 'none' | 'detail' | 'passport' | 'rutas' | 'blog' | 'about' | 'sponsors';

interface AppShellProps {
  user:           AppUser | null;
  locales:        Locale[];
  rutas:          Ruta[];
  city?:          string;
  onLogout:       () => void;
  /* Callbacks per features (implementati nei rispettivi hooks) */
  onCheckIn:      (locale: Locale) => Promise<void>;
  onToggleFavorite: (id: string) => void;
  isFavorite:     (id: string) => boolean;
  hasStamp:       (id: string) => boolean;
  onStartRoute:   (locale: Locale) => void;
  currentRoute:   Route | null;
  isLoadingRoute: boolean;
  onStopRoute:    () => void;
  passport:       import('@/types').Passport | null;
  aiCuriosity?:   string;
  isLoadingAI:    boolean;
  totalLocali:    number;
  routeGeoJson?:  any | null;
  userPosition?:  UserPosition | null;
}

/* ── Avatar button ───────────────────────────────────────── */
const Avatar: React.FC<{
  user:    AppUser | null;
  onClick: () => void;
}> = ({ user, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Menu utente"
    style={{
      width:          40,
      height:         40,
      borderRadius:   '50%',
      border:         '1.5px solid rgba(201,168,76,0.35)',
      background:     user?.photoURL
        ? `url(${user.photoURL}) center/cover no-repeat`
        : 'rgba(201,168,76,0.1)',
      cursor:         'pointer',
      padding:        0,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       16,
      color:          '#C9A84C',
      flexShrink:     0,
      transition:     'border-color 180ms ease',
    }}
  >
    {!user?.photoURL && (user ? '👤' : '👤')}
  </button>
);

/* ── Menu drawer ─────────────────────────────────────────── */
const MenuDrawer: React.FC<{
  user:        AppUser | null;
  isOpen:      boolean;
  onClose:     () => void;
  onNavigate:  (view: ActiveView) => void;
  onLogout:    () => void;
}> = ({ user, isOpen, onClose, onNavigate, onLogout }) => {
  if (!isOpen) return null;

  const items: { icon: string; label: string; view: ActiveView }[] = [
    { icon: '📒', label: 'Passaporto',  view: 'passport'  },
    { icon: '🧭', label: 'Rutas',       view: 'rutas'     },
    { icon: '📰', label: 'Blog & News', view: 'blog'      },
    { icon: 'ℹ️', label: 'Chi siamo',   view: 'about'     },
    { icon: '🤝', label: 'Sponsors',    view: 'sponsors'  },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     35,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
        }}
      />
      {/* Drawer */}
      <div style={{
        position:       'fixed',
        top:            0,
        right:          0,
        bottom:         0,
        width:          280,
        zIndex:         36,
        background:     'linear-gradient(180deg, #2A2A2C 0%, #1C1C1E 100%)',
        borderLeft:     '1px solid rgba(201,168,76,0.15)',
        display:        'flex',
        flexDirection:  'column',
        animation:      'slideLeft 250ms cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* User info */}
        <div style={{
          padding:      '48px 24px 20px',
          borderBottom: '1px solid rgba(247,240,228,0.07)',
        }}>
          {user ? (
            <>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: '#F7F0E4' }}>
                {user.displayName}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(247,240,228,0.4)', marginTop: 2 }}>
                {user.email}
              </div>
              {user.role === 'admin' && (
                <span style={{
                  display:       'inline-block',
                  marginTop:     6,
                  padding:       '2px 8px',
                  borderRadius:  999,
                  background:    'rgba(192,85,42,0.15)',
                  border:        '1px solid rgba(192,85,42,0.4)',
                  color:         '#C0552A',
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  Admin
                </span>
              )}
            </>
          ) : (
            <div style={{ fontFamily: '"Cinzel", serif', fontSize: 14, color: 'rgba(247,240,228,0.5)' }}>
              Ospite
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {items.map(item => (
            <button
              key={item.view}
              onClick={() => { onNavigate(item.view); onClose(); }}
              style={{
                width:       '100%',
                textAlign:   'left',
                padding:     '14px 24px',
                border:      'none',
                background:  'transparent',
                cursor:      'pointer',
                display:     'flex',
                alignItems:  'center',
                gap:         14,
                color:       '#F7F0E4',
                transition:  'background 120ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700 }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        {user && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(247,240,228,0.07)' }}>
            <button
              onClick={onLogout}
              style={{
                width:         '100%',
                padding:       '12px',
                borderRadius:  999,
                border:        '1px solid rgba(247,240,228,0.12)',
                background:    'transparent',
                color:         'rgba(247,240,228,0.5)',
                fontFamily:    'var(--font-body)',
                fontSize:      12,
                fontWeight:    700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor:        'pointer',
              }}
            >
              Esci
            </button>
          </div>
        )}

        {/* Logo bottom */}
        <div style={{ padding: '16px 24px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          <Logo size="sm" dark={true} />
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

/* ── Locale preview (BottomSheet peek content) ───────────── */
const LocalePreview: React.FC<{
  locale:   Locale;
  onOpen:   () => void;
  onNav:    () => void;
}> = ({ locale, onOpen, onNav }) => (
  <div style={{ padding: '0 20px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <div style={{
      width:        64,
      height:       64,
      borderRadius: 12,
      background:   `url(${locale.image_url}) center/cover no-repeat #2A2A2C`,
      flexShrink:   0,
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <span style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 500, color: '#F7F0E4', lineHeight: 1.2 }}>
          {locale.name}
        </span>
        <span style={{
          background:    'rgba(201,168,76,0.12)',
          border:        '1px solid rgba(201,168,76,0.25)',
          borderRadius:  999,
          padding:       '2px 7px',
          fontFamily:    'var(--font-body)',
          fontSize:      9,
          fontWeight:    700,
          color:         '#C9A84C',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace:    'nowrap',
        }}>
          Dal {locale.founded_year}
        </span>
      </div>
      <div style={{ fontFamily: '"Literata", serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(247,240,228,0.5)', marginBottom: 10 }}>
        {locale.address}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onOpen} style={previewBtnPrimary}>Vedi dettagli</button>
        <button onClick={onNav}  style={previewBtnIcon}>🧭</button>
      </div>
    </div>
  </div>
);

const previewBtnPrimary: React.CSSProperties = {
  flex:          1,
  padding:       '9px 0',
  borderRadius:  999,
  border:        'none',
  background:    '#C9A84C',
  color:         '#1C1C1E',
  fontFamily:    'var(--font-body)',
  fontSize:      11,
  fontWeight:    700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor:        'pointer',
  boxShadow:     '0 0 12px rgba(201,168,76,0.25)',
};

const previewBtnIcon: React.CSSProperties = {
  width:          38,
  height:         38,
  borderRadius:   '50%',
  border:         '1px solid rgba(247,240,228,0.12)',
  background:     'rgba(247,240,228,0.05)',
  fontSize:       16,
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
};

/* ── Main AppShell ───────────────────────────────────────── */
const AppShell: React.FC<AppShellProps> = ({
  user,
  locales,
  rutas,
  city = 'Barcelona',
  onLogout,
  onCheckIn,
  onToggleFavorite,
  isFavorite,
  hasStamp,
  onStartRoute,
  currentRoute,
  isLoadingRoute,
  onStopRoute,
  passport,
  aiCuriosity,
  isLoadingAI,
  totalLocali,
  routeGeoJson,
  userPosition,
}) => {
  const [activeView,      setActiveView]      = useState<ActiveView>('none');
  const [selectedLocale,  setSelectedLocale]  = useState<Locale | null>(null);
  const [sheetOpen,       setSheetOpen]       = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [activeCategory,  setActiveCategory]  = useState<Category>('bar');
  const [navDestination,  setNavDestination]  = useState<Locale | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* ── Map layer ───────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MapView
          locales={locales}
          selectedLocale={selectedLocale}
          onMarkerClick={handleMarkerClick}
          routeGeoJson={routeGeoJson ?? null}
          userPosition={userPosition ?? null}
          destLat={navDestination?.coordinates.lat}
          destLng={navDestination?.coordinates.lng}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        position:       'absolute',
        top:            0,
        left:           0,
        right:          0,
        zIndex:         30,
        padding:        '16px 16px 0',
        paddingTop:     'max(16px, env(safe-area-inset-top))',
        display:        'flex',
        flexDirection:  'column',
        gap:            10,
        pointerEvents:  'none',  // click-through sulla mappa
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <Logo size="sm" dark={true} />
          <div style={{ flex: 1 }}>
            <SearchBar value={searchQuery} onChange={(q) => setSearchQuery(q)} />
          </div>
          <Avatar user={user} onClick={() => setMenuOpen(true)} />
        </div>

        {/* Category filter */}
        <div style={{ pointerEvents: 'auto' }}>
          <CategoryFilter
            selected={activeCategory}
onChange={setActiveCategory}
          />
        </div>
      </div>

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
            routeInfo={{
              totalDistance: currentRoute.distance,
              totalTime:     currentRoute.duration,
              steps:         currentRoute.steps as any,
            }}
            destName={navDestination.name}
            onStop={() => { setNavDestination(null); onStopRoute(); }}
          />
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
            user={user as any}
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
            onClose={handleCloseView}
            onStartRuta={localeIds => {
              onStartRoute(locales.find(l => localeIds.includes(l.id)) ?? locales[0]);
              handleCloseView();
            }}
          />
        )}
      </Suspense>

      {/* ── Menu drawer ─────────────────────────────────────── */}
      <MenuDrawer
        user={user}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={view => { setActiveView(view); setMenuOpen(false); }}
        onLogout={onLogout}
      />
    </div>
  );
};

export default AppShell;
