'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { Locale, Route } from '@/types';

/* ════════════════════════════════════════════════════════
   SearchBar
   ════════════════════════════════════════════════════════ */

interface SearchBarProps {
  locales:        Locale[];
  onResultSelect: (locale: Locale) => void;
  placeholder?:   string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  locales,
  onResultSelect,
  placeholder = 'Cerca un locale storico…',
}) => {
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState<Locale[]>([]);
  const [focused,   setFocused]   = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);

  /* Ricerca fuzzy client-side */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { setResults([]); return; }

    const matched = locales.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    ).slice(0, 6);

    setResults(matched);
  }, [query, locales]);

  const handleSelect = useCallback((locale: Locale) => {
    onResultSelect(locale);
    setQuery('');
    setResults([]);
    setFocused(false);
    inputRef.current?.blur();
  }, [onResultSelect]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }, []);

  const showDropdown = focused && (results.length > 0 || query.length >= 2);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Input container */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        padding:      '10px 14px',
        borderRadius: 999,
        border:       focused
          ? '1.5px solid rgba(201,168,76,0.6)'
          : '1px solid rgba(247,240,228,0.12)',
        background:   'rgba(28,28,30,0.85)',
        backdropFilter: 'blur(16px)',
        boxShadow:    focused
          ? '0 0 0 3px rgba(201,168,76,0.1)'
          : '0 2px 12px rgba(0,0,0,0.3)',
        transition:   'all 180ms ease',
      }}>
        {/* Search icon */}
        <span style={{
          fontSize:   16,
          opacity:    focused ? 0.9 : 0.45,
          flexShrink: 0,
          transition: 'opacity 180ms ease',
        }}>
          🔍
        </span>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          aria-label="Cerca locali storici"
          autoComplete="off"
          style={{
            flex:        1,
            background:  'none',
            border:      'none',
            outline:     'none',
            fontFamily:  'var(--font-body)',
            fontSize:    14,
            color:       '#F7F0E4',
            caretColor:  '#C9A84C',
          }}
        />

        {/* Clear button */}
        {query.length > 0 && (
          <button
            onClick={handleClear}
            aria-label="Cancella ricerca"
            style={{
              width:          24,
              height:         24,
              borderRadius:   '50%',
              border:         'none',
              background:     'rgba(247,240,228,0.1)',
              color:          'rgba(247,240,228,0.6)',
              fontSize:       12,
              cursor:         'pointer',
              flexShrink:     0,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div
          role="listbox"
          aria-label="Risultati ricerca"
          style={{
            position:       'absolute',
            top:            'calc(100% + 8px)',
            left:           0,
            right:          0,
            background:     'rgba(28,28,30,0.96)',
            backdropFilter: 'blur(20px)',
            border:         '1px solid rgba(201,168,76,0.2)',
            borderRadius:   16,
            boxShadow:      '0 16px 48px rgba(0,0,0,0.5)',
            overflow:       'hidden',
            zIndex:         50,
            animation:      'slideDown 150ms ease forwards',
          }}
        >
          {results.length === 0 ? (
            <div style={{
              padding:    '16px 16px',
              fontFamily: '"Literata", serif',
              fontStyle:  'italic',
              fontSize:   13,
              color:      'rgba(247,240,228,0.4)',
              textAlign:  'center',
            }}>
              Nessun risultato per "{query}"
            </div>
          ) : (
            results.map((locale, i) => (
              <button
                key={locale.id}
                role="option"
                onClick={() => handleSelect(locale)}
                style={{
                  width:        '100%',
                  textAlign:    'left',
                  padding:      '12px 16px',
                  border:       'none',
                  borderTop:    i > 0 ? '1px solid rgba(247,240,228,0.05)' : 'none',
                  background:   'transparent',
                  cursor:       'pointer',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  transition:   'background 120ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {/* Category dot */}
                <div style={{
                  width:          36,
                  height:         36,
                  borderRadius:   10,
                  background:     `url(${locale.image_url}) center/cover no-repeat, rgba(247,240,228,0.05)`,
                  flexShrink:     0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily:   'var(--font-body)',
                    fontSize:     13,
                    fontWeight:   700,
                    color:        '#F7F0E4',
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {locale.name}
                  </div>
                  <div style={{
                    fontFamily:   'var(--font-body)',
                    fontSize:     11,
                    color:        'rgba(247,240,228,0.4)',
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {locale.address}
                  </div>
                </div>
                <span style={{ fontSize: 14, opacity: 0.5 }}>→</span>
              </button>
            ))
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: rgba(247,240,228,0.3); }
      `}</style>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   NavigationPanel
   ════════════════════════════════════════════════════════ */

interface NavigationPanelProps {
  destination: Locale;
  route:       Route | null;
  isLoading:   boolean;
  onClose:     () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  destination,
  route,
  isLoading,
  onClose,
}) => {
  const formatDistance = (m: number): string =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

  const formatDuration = (s: number): string => {
    const min = Math.round(s / 60);
    return min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;
  };

  return (
    <div style={{
      background:     'rgba(28,28,30,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop:      '1px solid rgba(201,168,76,0.2)',
      borderRadius:   '20px 20px 0 0',
      overflow:       'hidden',
    }}>
      {/* Handle */}
      <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 4, borderRadius: 999, background: 'rgba(247,240,228,0.15)' }} />
      </div>

      {/* Header */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        padding:    '12px 20px',
        gap:        12,
      }}>
        {/* Nav icon */}
        <div style={{
          width:          44,
          height:         44,
          borderRadius:   '50%',
          background:     'rgba(201,168,76,0.12)',
          border:         '1px solid rgba(201,168,76,0.3)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       20,
          flexShrink:     0,
        }}>
          🧭
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily:    'var(--font-body)',
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            opacity:       0.8,
          }}>
            Navigazione a piedi
          </div>
          <div style={{
            fontFamily:   'var(--font-body)',
            fontSize:     14,
            fontWeight:   700,
            color:        '#F7F0E4',
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            marginTop:    2,
          }}>
            {destination.name}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Chiudi navigazione"
          style={{
            width:          32,
            height:         32,
            borderRadius:   '50%',
            border:         '1px solid rgba(247,240,228,0.15)',
            background:     'transparent',
            color:          'rgba(247,240,228,0.6)',
            fontSize:       14,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Route info */}
      {isLoading ? (
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width:       20,
            height:      20,
            border:      '2px solid rgba(201,168,76,0.2)',
            borderTopColor: '#C9A84C',
            borderRadius: '50%',
            animation:   'spin 0.7s linear infinite',
            flexShrink:  0,
          }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(247,240,228,0.5)' }}>
            Calcolo percorso…
          </span>
        </div>
      ) : route ? (
        <>
          {/* Distance / time */}
          <div style={{
            display:     'flex',
            gap:         0,
            padding:     '0 20px 16px',
            borderBottom: '1px solid rgba(247,240,228,0.06)',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 500, color: '#C9A84C', lineHeight: 1 }}>
                {formatDistance(route.distance)}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(247,240,228,0.4)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Distanza
              </div>
            </div>
            <div style={{ width: 1, background: 'rgba(247,240,228,0.08)', margin: '4px 0' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 500, color: '#F7F0E4', lineHeight: 1 }}>
                {formatDuration(route.duration)}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(247,240,228,0.4)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                A piedi
              </div>
            </div>
          </div>

          {/* Steps — prime 4 */}
          {route.steps.length > 0 && (
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {route.steps.slice(0, 4).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width:          28,
                    height:         28,
                    borderRadius:   '50%',
                    background:     i === 0 ? '#C9A84C' : 'rgba(247,240,228,0.06)',
                    border:         i === 0 ? 'none' : '1px solid rgba(247,240,228,0.1)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                    fontFamily:     '"Cinzel", serif',
                    fontSize:       11,
                    fontWeight:     500,
                    color:          i === 0 ? '#1C1C1E' : 'rgba(247,240,228,0.4)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: i === 0 ? '#F7F0E4' : 'rgba(247,240,228,0.6)', lineHeight: 1.4 }}>
                      {step.instruction}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(247,240,228,0.3)', marginTop: 2 }}>
                      {formatDistance(step.distance)}
                    </div>
                  </div>
                </div>
              ))}
              {route.steps.length > 4 && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(247,240,228,0.3)', textAlign: 'center', marginTop: 2 }}>
                  + altri {route.steps.length - 4} passi
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '16px 20px 20px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(247,240,228,0.35)' }}>
          Impossibile calcolare il percorso. Riprova.
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export { SearchBar, NavigationPanel };
export type { SearchBarProps, NavigationPanelProps };
