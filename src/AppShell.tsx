'use client';

import React, { useState, useCallback, Suspense, lazy } from 'react';
import type { Locale, Category, AppUser } from '@/types';
import Logo from '@/components/UI/Logo';
import SearchBar from '@/components/UI/SearchBar';
import NavigationPanel from '@/components/UI/NavigationPanel';
import CategoryFilter from '@/components/UI/CategoryFilter';
import BottomSheet from '@/components/UI/BottomSheet';
import { useAuth } from '@/hooks/useAuth';
import { useLocales } from '@/hooks/useLocales';
import { usePassport } from '@/hooks/usePassport';
import { useRouting } from '@/hooks/useRouting';
import { useFavorites } from '@/hooks/useFavorites';

/* Lazy load views (code splitting) */
const DetailView     = lazy(() => import('@/views/DetailView'));
const PassaportoView = lazy(() => import('@/views/PassaportoView'));
const RutasView      = lazy(() => import('@/views/RutasView'));

/* ── Types ──────────────────────────────────────────────── */
type ActiveView = 'none' | 'detail' | 'passport' | 'rutas' | 'blog' | 'about' | 'sponsors';

interface AppShellProps {
  onResetGuest: () => void;
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
    {!user?.photoURL && '👤'}
  </button>
);

/* ── Menu drawer ─────────────────────────────────────────── */
const MenuDrawer: React.FC<{
  user:       AppUser | null;
  isOpen:     boolean;
  onClose:    () => void;
  onNavigate: (view: ActiveView) => void;
  onLogout:   () => void;
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
        position:      'fixed',
        top:           0,
        right:         0,
        bottom:        0,
        width:         280,
        zIndex:        36,
        background:    'linear-gradient(180deg, #2A2A2C 0%, #1C1C1E 100%)',
        borderLeft:    '1px solid rgba(201,168,76,0.15)',
        display:       'flex',
        flexDirection: 'column',
        animation:     'slideLeft 250ms cubic-bezier(0.16,1,0.3,1) forwards',
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
                width:      '100%',
                textAlign:  'left',
                padding:    '14px 24px',
                border:     'none',
                background: 'transparent',
                cursor:     'pointer',
                display:    'flex',
                alignItems: 'center',
                gap:        14,
                color:      '#F7F0E4',
                transition: 'background 120ms ease',
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
          <Logo size="sm" dark />
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

/* ── Main AppShell ───────────────────────────────────────── */
const AppShell: React.FC<AppShellProps> = ({ onResetGuest }) => {
  const { user, profile, logout }                   = useAuth();
  const [searchQuery,    setSearchQuery]             = useState('');
  const [activeCategory, setActiveCategory]          = useState<Category>('Tutti');
  const { locales }                                  = useLocales(searchQuery, activeCategory);
  const { stamps, loading: passportLoading, checkIn, checkingIn, hasStamp } = usePassport(user);
  const { routeInfo, startNavigation, stopNavigation } = useRouting();
  const { toggleFavorite, isFavorite }               = useFavorites(user);

  const [activeView,     setActiveView]     = useState<ActiveView>('none');
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [navDestination, setNavDestination] = useState<Locale | null>(null);

  const handleOpenDetail = useCallback((locale: Locale) => {
    setSelectedLocale(locale);
    setActiveView('detail');
  }, []);

  const handleNavigate = useCallback(async (locale: Locale) => {
    setNavDestination(locale);
    setActiveView('none');
    await startNavigation(locale.coordinates.lat, locale.coordinates.lng);
  }, [startNavigation]);

  const handleStopNav = useCallback(() => {
    setNavDestination(null);
    stopNavigation();
  }, [stopNavigation]);

  const handleCloseView = useCallback(() => {
    setActiveView('none');
    setSelectedLocale(null);
  }, []);

  const handleStartRuta = useCallback((localeIds: string[]) => {
    const first = locales.find(l => localeIds.includes(l.id));
    if (first) handleNavigate(first);
    handleCloseView();
  }, [locales, handleNavigate, handleCloseView]);

  // BottomSheet shows locale preview when no full-screen view is open
  const sheetLocale = activeView === 'none' ? selectedLocale : null;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* ── Map layer ──────────────────────────────────────────── */}
      <div
        id="map-container"
        style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#1C1C1E' }}
        aria-label="Mappa interattiva"
      />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        position:      'absolute',
        top:           0,
        left:          0,
        right:         0,
        zIndex:        30,
        padding:       '16px 16px 0',
        paddingTop:    'max(16px, env(safe-area-inset-top))',
        display:       'flex',
        flexDirection: 'column',
        gap:           10,
        pointerEvents: 'none',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <Logo size="sm" dark />
          <div style={{ flex: 1 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <Avatar user={profile} onClick={() => setMenuOpen(true)} />
        </div>

        {/* Category filter */}
        <div style={{ pointerEvents: 'auto' }}>
          <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />
        </div>
      </div>

      {/* ── Navigation panel ─────────────────────────────────────── */}
      {navDestination && routeInfo && (
        <div style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   25,
        }}>
          <NavigationPanel
            routeInfo={routeInfo}
            destName={navDestination.name}
            onStop={handleStopNav}
          />
        </div>
      )}

      {/* ── Bottom Sheet (locale preview) ────────────────────────── */}
      <BottomSheet
        locale={sheetLocale}
        isFavorite={sheetLocale ? isFavorite(sheetLocale.id) : false}
        onClose={() => setSelectedLocale(null)}
        onToggleFavorite={toggleFavorite}
        onViewDetail={handleOpenDetail}
      />

      {/* ── Views (full-screen overlay) ──────────────────────────── */}
      <Suspense fallback={null}>
        {activeView === 'detail' && selectedLocale && (
          <DetailView
            locale={selectedLocale}
            isFavorite={isFavorite(selectedLocale.id)}
            onBack={handleCloseView}
            onToggleFavorite={toggleFavorite}
            onNavigate={handleNavigate}
            onCheckIn={checkIn}
            hasStamp={hasStamp(selectedLocale.id)}
            checkingIn={checkingIn}
            user={user}
          />
        )}

        {activeView === 'passport' && (
          <PassaportoView
            stamps={stamps}
            loading={passportLoading}
            onClose={handleCloseView}
          />
        )}

        {activeView === 'rutas' && (
          <RutasView
            onClose={handleCloseView}
            onStartRuta={handleStartRuta}
          />
        )}
      </Suspense>

      {/* ── Menu drawer ──────────────────────────────────────────── */}
      <MenuDrawer
        user={profile}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={view => { setActiveView(view); setMenuOpen(false); }}
        onLogout={() => { logout(); onResetGuest(); }}
      />
    </div>
  );
};

export default AppShell;
