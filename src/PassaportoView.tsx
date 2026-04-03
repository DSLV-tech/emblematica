'use client';

import React, { useMemo } from 'react';
import type { Passport, Stamp, Badge, Category } from '@/types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/types';

/* ── Props ──────────────────────────────────────────────── */
interface PassaportoViewProps {
  passport:   Passport | null;
  badges:     Badge[];
  onClose:    () => void;
  totalLocali: number;   // totale locali nella città
}

/* ── Badge definitions (condivisi) ─────────────────────── */
export const BADGE_DEFINITIONS: Badge[] = [
  {
    id:          'first-step',
    label:       'Primo passo',
    description: 'Primo timbre del passaporto',
    icon:        '👣',
    condition:   s => s.length >= 1,
  },
  {
    id:          'explorer',
    label:       'Esploratore',
    description: '5 locali visitati',
    icon:        '🗺️',
    condition:   s => s.length >= 5,
  },
  {
    id:          'historian',
    label:       'Storico',
    description: '15 locali visitati',
    icon:        '📜',
    condition:   s => s.length >= 15,
  },
  {
    id:          'legend',
    label:       'Leggenda',
    description: '30 locali visitati',
    icon:        '🏆',
    condition:   s => s.length >= 30,
  },
  {
    id:          'bar-hopper',
    label:       'Caffè storico',
    description: '3 bar visitati',
    icon:        '☕',
    condition:   s => s.filter(x => x.category === 'bar').length >= 3,
  },
  {
    id:          'bookworm',
    label:       'Bibliofilo',
    description: 'Tutte le librerie storiche',
    icon:        '📚',
    condition:   s => s.filter(x => x.category === 'bookshop').length >= 3,
  },
  {
    id:          'gourmet',
    label:       'Gourmet',
    description: '5 ristoranti storici',
    icon:        '🍽️',
    condition:   s => s.filter(x => x.category === 'restaurant').length >= 5,
  },
  {
    id:          'completionist',
    label:       'Completista',
    description: 'Tutte le categorie almeno una volta',
    icon:        '🌟',
    condition:   s => {
      const cats = new Set(s.map(x => x.category));
      return (['bar','restaurant','bookshop','pharmacy','shop'] as Category[]).every(c => cats.has(c));
    },
  },
];

/* ── Ring progress SVG ───────────────────────────────────── */
const RingProgress: React.FC<{
  value:   number;   // 0–100
  size:    number;
  stroke?: number;
  color?:  string;
}> = ({ value, size, stroke = 6, color = '#C9A84C' }) => {
  const r          = (size - stroke) / 2;
  const circ       = 2 * Math.PI * r;
  const dashOffset = circ * (1 - value / 100);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(247,240,228,0.08)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
};

/* ── Passport cover ──────────────────────────────────────── */
const PassportCover: React.FC<{
  stamps:      Stamp[];
  totalLocali: number;
  city:        string;
}> = ({ stamps, totalLocali, city }) => {
  const pct = totalLocali > 0
    ? Math.round((stamps.length / totalLocali) * 100)
    : 0;

  return (
    <div style={{
      margin:        '20px 20px 0',
      borderRadius:  20,
      background:    'linear-gradient(135deg, #2A1F0A 0%, #1C1C1E 60%, #0D0D0F 100%)',
      border:        '1px solid rgba(201,168,76,0.25)',
      padding:       '24px',
      position:      'relative',
      overflow:      'hidden',
    }}>
      {/* Ornamental background pattern */}
      <svg
        style={{ position: 'absolute', top: -10, right: -10, opacity: 0.06 }}
        width="120" height="120" viewBox="0 0 72 72" fill="none"
        aria-hidden="true"
      >
        <rect x="10" y="10" width="52" height="52" rx="4" stroke="#C9A84C" strokeWidth="1.2" fill="none" transform="rotate(45 36 36)"/>
        <polygon points="36,18.5 53.5,36 36,36" fill="#C9A84C"/>
        <polygon points="36,36 53.5,36 36,53.5" fill="#C0552A"/>
        <polygon points="18.5,36 36,18.5 36,36" fill="#C0552A"/>
        <polygon points="36,36 36,53.5 18.5,36" fill="#C9A84C" fillOpacity="0.5"/>
        <circle cx="36" cy="36" r="4.5" fill="#C9A84C"/>
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Ring + percentuale */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <RingProgress value={pct} size={80} stroke={5} />
          <div style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: '"Cinzel", serif',
              fontSize:   18,
              fontWeight: 500,
              color:      '#C9A84C',
              lineHeight: 1,
            }}>
              {pct}%
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily:    'var(--font-body)',
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(201,168,76,0.65)',
            marginBottom:  4,
          }}>
            Passaporto Digitale
          </div>
          <div style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      20,
            fontWeight:    500,
            color:         '#F7F0E4',
            letterSpacing: '0.02em',
            lineHeight:    1.2,
          }}>
            {city}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize:   13,
            color:      'rgba(247,240,228,0.45)',
            marginTop:  4,
          }}>
            {stamps.length} di {totalLocali} locali visitati
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display:     'flex',
        gap:         0,
        marginTop:   20,
        borderTop:   '1px solid rgba(201,168,76,0.12)',
        paddingTop:  16,
      }}>
        {(
          [
            { label: 'Timbri', value: stamps.length },
            { label: 'Categorie', value: new Set(stamps.map(s => s.category)).size },
            { label: 'Settimane', value: Math.max(1, Math.ceil(stamps.length / 3)) },
          ] as const
        ).map((stat, i, arr) => (
          <div key={stat.label} style={{
            flex:        1,
            textAlign:   'center',
            borderRight: i < arr.length - 1 ? '1px solid rgba(201,168,76,0.1)' : 'none',
          }}>
            <div style={{ fontFamily: '"Cinzel", serif', fontSize: 22, fontWeight: 500, color: '#C9A84C', lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(247,240,228,0.4)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Badge grid ──────────────────────────────────────────── */
const BadgeGrid: React.FC<{ badges: Badge[]; stamps: Stamp[] }> = ({ badges, stamps }) => {
  const computed = badges.map(b => ({
    ...b,
    unlocked: b.condition(stamps),
  }));

  return (
    <div style={{ padding: '0 20px 24px' }}>
      <div style={{
        display:              'grid',
        gridTemplateColumns:  'repeat(4, 1fr)',
        gap:                  10,
      }}>
        {computed.map(b => (
          <div
            key={b.id}
            title={b.description}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            6,
              padding:        '12px 6px',
              borderRadius:   12,
              border:         b.unlocked
                ? '1px solid rgba(201,168,76,0.35)'
                : '1px solid rgba(247,240,228,0.06)',
              background:     b.unlocked
                ? 'rgba(201,168,76,0.08)'
                : 'rgba(247,240,228,0.02)',
              opacity:        b.unlocked ? 1 : 0.38,
              transition:     'all 300ms ease',
            }}
          >
            <span style={{ fontSize: 24, filter: b.unlocked ? 'none' : 'grayscale(1)' }}>
              {b.icon}
            </span>
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color:         b.unlocked ? '#C9A84C' : 'rgba(247,240,228,0.35)',
              textAlign:     'center',
              lineHeight:    1.3,
            }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Stamp list ──────────────────────────────────────────── */
const StampList: React.FC<{ stamps: Stamp[] }> = ({ stamps }) => {
  if (stamps.length === 0) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
        <p style={{
          fontFamily: '"Literata", serif',
          fontStyle:  'italic',
          fontSize:   15,
          fontWeight: 300,
          color:      'rgba(247,240,228,0.4)',
          margin:     0,
        }}>
          Nessun timbro ancora.<br />Visita il tuo primo locale storico!
        </p>
      </div>
    );
  }

  // Ordina dal più recente
  const sorted = [...stamps].sort(
    (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime(),
  );

  return (
    <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map((stamp, i) => {
        const date = new Date(stamp.visitedAt);
        const dateStr = date.toLocaleDateString('it-IT', {
          day: '2-digit', month: 'short', year: 'numeric',
        });

        return (
          <div
            key={`${stamp.localeId}-${i}`}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              padding:      '12px 14px',
              borderRadius: 12,
              border:       '1px solid rgba(247,240,228,0.07)',
              background:   'rgba(247,240,228,0.02)',
            }}
          >
            {/* Category dot */}
            <div style={{
              width:        40,
              height:       40,
              borderRadius: '50%',
              background:   `${CATEGORY_COLORS[stamp.category]}18`,
              border:       `1.5px solid ${CATEGORY_COLORS[stamp.category]}44`,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              fontSize:     18,
              flexShrink:   0,
            }}>
              {CATEGORY_ICONS[stamp.category]}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily:   'var(--font-body)',
                fontSize:     14,
                fontWeight:   700,
                color:        '#F7F0E4',
                whiteSpace:   'nowrap',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
              }}>
                {stamp.localeName}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize:   11,
                color:      'rgba(247,240,228,0.4)',
                marginTop:  2,
              }}>
                {dateStr}
              </div>
            </div>

            {/* Timbre ornamentale */}
            <div style={{
              width:        32,
              height:       32,
              borderRadius: 6,
              border:       `1.5px solid ${CATEGORY_COLORS[stamp.category]}55`,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              flexShrink:   0,
              position:     'relative',
            }}>
              <div style={{
                position:     'absolute',
                inset:        3,
                borderRadius: 3,
                border:       `1px solid ${CATEGORY_COLORS[stamp.category]}30`,
              }} />
              <span style={{ fontSize: 12 }}>✓</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Section label ───────────────────────────────────────── */
const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    display:     'flex',
    alignItems:  'center',
    gap:         10,
    padding:     '20px 20px 14px',
  }}>
    <div style={{ height: 1, width: 16, background: 'rgba(201,168,76,0.4)' }} />
    <span style={{
      fontFamily:    'var(--font-body)',
      fontSize:      10,
      fontWeight:    700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color:         '#C9A84C',
      opacity:       0.8,
    }}>
      {title}
    </span>
    <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
  </div>
);

/* ── Main component ──────────────────────────────────────── */
const PassaportoView: React.FC<PassaportoViewProps> = ({
  passport,
  badges,
  onClose,
  totalLocali,
}) => {
  const stamps = passport?.stamps ?? [];
  const city   = stamps[0]?.city ?? 'Barcelona';

  const unlockedCount = useMemo(
    () => badges.filter(b => b.condition(stamps)).length,
    [badges, stamps],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Il tuo passaporto Emblematic"
      style={{
        position:     'fixed',
        inset:        0,
        zIndex:       40,
        background:   '#1C1C1E',
        overflowY:    'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Header */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        padding:      '16px 20px',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        position:     'sticky',
        top:          0,
        zIndex:       1,
        background:   'rgba(28,28,30,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <button
          onClick={onClose}
          aria-label="Chiudi passaporto"
          style={{
            width:        36,
            height:       36,
            borderRadius: '50%',
            border:       '1px solid rgba(247,240,228,0.15)',
            background:   'transparent',
            color:        '#F7F0E4',
            fontSize:     16,
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            flexShrink:   0,
          }}
        >
          ←
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontFamily:    '"Cinzel", serif',
            fontSize:      17,
            fontWeight:    500,
            color:         '#F7F0E4',
            letterSpacing: '0.04em',
          }}>
            Il mio passaporto
          </div>
        </div>

        {/* Badge count */}
        <div style={{
          background:    'rgba(201,168,76,0.12)',
          border:        '1px solid rgba(201,168,76,0.25)',
          borderRadius:  999,
          padding:       '4px 10px',
          fontFamily:    'var(--font-body)',
          fontSize:      11,
          fontWeight:    700,
          color:         '#C9A84C',
          flexShrink:    0,
        }}>
          {unlockedCount}/{badges.length} badge
        </div>
      </div>

      {/* Cover + stats */}
      <PassportCover stamps={stamps} totalLocali={totalLocali} city={city} />

      {/* Badges */}
      <SectionLabel title="Badge" />
      <BadgeGrid badges={badges} stamps={stamps} />

      {/* Timbri */}
      <SectionLabel title={`Timbri · ${stamps.length}`} />
      <StampList stamps={stamps} />

      {/* Safe area bottom */}
      <div style={{ height: 40 }} />
    </div>
  );
};

export default PassaportoView;
