'use client';

import React, { useState } from 'react';
import type { Ruta, RutaStop, Locale } from '@/types';

/* ── Props ──────────────────────────────────────────────── */
interface RutasViewProps {
  rutas:        Ruta[];
  locales:      Locale[];          // per risolvere RutaStop → Locale
  onClose:      () => void;
  onStartRuta:  (ruta: Ruta) => void;   // avvia navigazione
  onLocaleOpen: (locale: Locale) => void;
}

/* ── Difficulty badge ────────────────────────────────────── */
const DifficultyBadge: React.FC<{ d: Ruta['difficulty'] }> = ({ d }) => {
  const map = {
    easy:   { label: 'Facile',  color: '#5B8A72', bg: 'rgba(91,138,114,0.12)'  },
    medium: { label: 'Medio',   color: '#C9A84C', bg: 'rgba(201,168,76,0.12)'  },
    hard:   { label: 'Impegn.', color: '#C0552A', bg: 'rgba(192,85,42,0.12)'   },
  };
  const { label, color, bg } = map[d];
  return (
    <span style={{
      padding:       '3px 9px',
      borderRadius:  999,
      border:        `1px solid ${color}44`,
      background:    bg,
      color,
      fontFamily:    'var(--font-body)',
      fontSize:      10,
      fontWeight:    700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
};

/* ── Ruta card (lista) ───────────────────────────────────── */
const RutaCard: React.FC<{
  ruta:     Ruta;
  onSelect: (ruta: Ruta) => void;
}> = ({ ruta, onSelect }) => (
  <button
    onClick={() => onSelect(ruta)}
    style={{
      width:        '100%',
      textAlign:    'left',
      padding:      0,
      border:       '1px solid rgba(247,240,228,0.08)',
      borderRadius: 16,
      background:   'rgba(247,240,228,0.02)',
      cursor:       'pointer',
      overflow:     'hidden',
      transition:   'border-color 180ms ease, transform 180ms ease',
      display:      'block',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${ruta.color}55`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,240,228,0.08)'; }}
    aria-label={`Apri percorso: ${ruta.title}`}
  >
    {/* Cover */}
    <div style={{
      height:          140,
      background:      `url(${ruta.coverImage}) center/cover no-repeat, linear-gradient(135deg, ${ruta.color}40, #1C1C1E)`,
      backgroundColor: '#2A2A2C',
      position:        'relative',
    }}>
      {/* Gradient bottom */}
      <div style={{
        position:   'absolute',
        bottom:     0, left: 0, right: 0,
        height:     80,
        background: 'linear-gradient(to top, rgba(28,28,30,0.9), transparent)',
      }} />
      {/* Meta pills */}
      <div style={{
        position:    'absolute',
        top:         12, left: 12,
        display:     'flex',
        gap:         6,
        flexWrap:    'wrap',
      }}>
        <DifficultyBadge d={ruta.difficulty} />
      </div>
      {/* Tappe count */}
      <div style={{
        position:      'absolute',
        bottom:        12, right: 12,
        fontFamily:    'var(--font-body)',
        fontSize:      11,
        fontWeight:    700,
        color:         'rgba(247,240,228,0.7)',
        background:    'rgba(28,28,30,0.6)',
        backdropFilter: 'blur(8px)',
        padding:       '4px 10px',
        borderRadius:  999,
        letterSpacing: '0.08em',
      }}>
        {ruta.stops.length} tappe
      </div>
    </div>

    {/* Content */}
    <div style={{ padding: '14px 16px 16px' }}>
      <div style={{
        display:     'flex',
        alignItems:  'flex-start',
        gap:         8,
        marginBottom: 6,
      }}>
        {/* Color accent */}
        <div style={{
          width:        3,
          height:       '100%',
          minHeight:    40,
          borderRadius: 999,
          background:   ruta.color,
          flexShrink:   0,
          marginTop:    2,
        }} />
        <div>
          <h3 style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      17,
            fontWeight:    500,
            color:         '#F7F0E4',
            margin:        '0 0 3px',
            letterSpacing: '0.02em',
            lineHeight:    1.2,
          }}>
            {ruta.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   12,
            color:      'rgba(247,240,228,0.5)',
            margin:     0,
          }}>
            {ruta.subtitle}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div style={{
        display:    'flex',
        gap:        16,
        marginTop:  10,
        paddingTop: 10,
        borderTop:  '1px solid rgba(247,240,228,0.06)',
      }}>
        <span style={metaStyle}>⏱ {ruta.duration}</span>
        <span style={metaStyle}>📍 {ruta.distance}</span>
        {ruta.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{
            ...metaStyle,
            color:      ruta.color,
            background: `${ruta.color}12`,
            padding:    '2px 8px',
            borderRadius: 999,
            border:     `1px solid ${ruta.color}30`,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </button>
);

/* ── Ruta detail ─────────────────────────────────────────── */
const RutaDetail: React.FC<{
  ruta:         Ruta;
  locales:      Locale[];
  onBack:       () => void;
  onStart:      () => void;
  onLocaleOpen: (locale: Locale) => void;
}> = ({ ruta, locales, onBack, onStart, onLocaleOpen }) => {
  const resolveLocale = (stop: RutaStop): Locale | undefined =>
    locales.find(l => l.id === stop.localeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        position:       'sticky',
        top:            0,
        zIndex:         1,
        background:     'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom:   '1px solid rgba(247,240,228,0.07)',
        padding:        '14px 20px',
        display:        'flex',
        alignItems:     'center',
        gap:            12,
      }}>
        <button
          onClick={onBack}
          aria-label="Torna ai percorsi"
          style={backBtnStyle}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 500, color: '#F7F0E4', lineHeight: 1.2 }}>
            {ruta.title}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(247,240,228,0.45)', marginTop: 2 }}>
            {ruta.duration} · {ruta.distance}
          </div>
        </div>
        <DifficultyBadge d={ruta.difficulty} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        {/* Cover */}
        <div style={{
          height:          180,
          background:      `url(${ruta.coverImage}) center/cover no-repeat, linear-gradient(135deg, ${ruta.color}40, #1C1C1E)`,
          backgroundColor: '#2A2A2C',
          position:        'relative',
        }}>
          <div style={{
            position:   'absolute',
            bottom:     0, left: 0, right: 0,
            height:     100,
            background: 'linear-gradient(to top, #1C1C1E, transparent)',
          }} />
        </div>

        {/* Description */}
        <div style={{ padding: '20px 20px 0' }}>
          <p style={{
            fontFamily: '"Literata", serif',
            fontStyle:  'italic',
            fontSize:   15,
            fontWeight: 300,
            lineHeight: 1.7,
            color:      'rgba(247,240,228,0.7)',
            margin:     0,
          }}>
            {ruta.description}
          </p>
        </div>

        {/* Stops timeline */}
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontFamily:    'var(--font-body)',
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         '#C9A84C',
            opacity:       0.8,
            marginBottom:  16,
          }}>
            Tappe del percorso
          </div>

          {ruta.stops.map((stop, i) => {
            const locale = resolveLocale(stop);
            const isLast = i === ruta.stops.length - 1;
            return (
              <div key={stop.localeId} style={{ display: 'flex', gap: 14 }}>
                {/* Timeline track */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width:        32,
                    height:       32,
                    borderRadius: '50%',
                    border:       `2px solid ${ruta.color}`,
                    background:   i === 0 ? ruta.color : 'transparent',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    fontFamily:   '"Cinzel", serif',
                    fontSize:     12,
                    fontWeight:   500,
                    color:        i === 0 ? '#1C1C1E' : ruta.color,
                    flexShrink:   0,
                    zIndex:       1,
                    background:   i === 0 ? ruta.color : 'rgba(28,28,30,0.9)',
                  }}>
                    {stop.order}
                  </div>
                  {!isLast && (
                    <div style={{
                      width:      2,
                      flex:       1,
                      minHeight:  32,
                      background: `linear-gradient(to bottom, ${ruta.color}60, ${ruta.color}20)`,
                      margin:     '4px 0',
                    }} />
                  )}
                </div>

                {/* Stop content */}
                <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
                  {locale ? (
                    <button
                      onClick={() => onLocaleOpen(locale)}
                      style={{
                        width:        '100%',
                        textAlign:    'left',
                        padding:      '12px 14px',
                        borderRadius: 12,
                        border:       '1px solid rgba(247,240,228,0.07)',
                        background:   'rgba(247,240,228,0.02)',
                        cursor:       'pointer',
                        transition:   'background 150ms ease',
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   14,
                        fontWeight: 700,
                        color:      '#F7F0E4',
                        marginBottom: 3,
                      }}>
                        {locale.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   11,
                        color:      'rgba(247,240,228,0.45)',
                      }}>
                        {locale.address}
                      </div>
                      {stop.note && (
                        <div style={{
                          fontFamily: '"Literata", serif',
                          fontStyle:  'italic',
                          fontSize:   12,
                          color:      `${ruta.color}cc`,
                          marginTop:  6,
                        }}>
                          {stop.note}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div style={{ padding: '12px 0', color: 'rgba(247,240,228,0.3)', fontSize: 12 }}>
                      Tappa {stop.order}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* CTA fixed bottom */}
      <div style={{
        position:   'sticky',
        bottom:     0,
        padding:    '16px 20px',
        background: 'linear-gradient(to top, #1C1C1E 70%, transparent)',
      }}>
        <button
          onClick={onStart}
          style={{
            width:         '100%',
            padding:       '16px',
            borderRadius:  999,
            border:        'none',
            background:    ruta.color,
            color:         '#1C1C1E',
            fontFamily:    'var(--font-body)',
            fontSize:      13,
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor:        'pointer',
            boxShadow:     `0 0 24px ${ruta.color}40`,
          }}
        >
          🧭 Inizia il percorso
        </button>
      </div>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────── */
const RutasView: React.FC<RutasViewProps> = ({
  rutas,
  locales,
  onClose,
  onStartRuta,
  onLocaleOpen,
}) => {
  const [selected, setSelected] = useState<Ruta | null>(null);

  if (selected) {
    return (
      <div style={viewStyle}>
        <RutaDetail
          ruta={selected}
          locales={locales}
          onBack={() => setSelected(null)}
          onStart={() => onStartRuta(selected)}
          onLocaleOpen={onLocaleOpen}
        />
      </div>
    );
  }

  return (
    <div style={viewStyle}>
      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        padding:        '16px 20px',
        borderBottom:   '1px solid rgba(247,240,228,0.07)',
        position:       'sticky',
        top:            0,
        zIndex:         1,
        background:     'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(12px)',
        gap:            12,
      }}>
        <button onClick={onClose} aria-label="Chiudi percorsi" style={backBtnStyle}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      18,
            fontWeight:    500,
            color:         '#F7F0E4',
            letterSpacing: '0.02em',
          }}>
            Rutas
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize:   11,
            color:      'rgba(247,240,228,0.4)',
            marginTop:  1,
          }}>
            {rutas.length} percorsi tematici
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rutas.map(ruta => (
          <RutaCard key={ruta.id} ruta={ruta} onSelect={setSelected} />
        ))}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

/* ── Shared styles ───────────────────────────────────────── */
const viewStyle: React.CSSProperties = {
  position:              'fixed',
  inset:                 0,
  zIndex:                40,
  background:            '#1C1C1E',
  overflowY:             'auto',
  overscrollBehavior:    'contain',
  WebkitOverflowScrolling: 'touch',
  display:               'flex',
  flexDirection:         'column',
};

const backBtnStyle: React.CSSProperties = {
  width:          36,
  height:         36,
  borderRadius:   '50%',
  border:         '1px solid rgba(247,240,228,0.15)',
  background:     'transparent',
  color:          '#F7F0E4',
  fontSize:       16,
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexShrink:     0,
};

const metaStyle: React.CSSProperties = {
  fontFamily:    'var(--font-body)',
  fontSize:      11,
  color:         'rgba(247,240,228,0.45)',
  display:       'flex',
  alignItems:    'center',
  gap:           3,
};

export default RutasView;
