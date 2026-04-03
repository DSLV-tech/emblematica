'use client';

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import type { Locale, Category } from '@/types';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';

/* ── Props ──────────────────────────────────────────────── */
interface DetailViewProps {
  locale:           Locale;
  onClose:          () => void;
  onNavigate:       (locale: Locale) => void;
  onCheckIn:        (locale: Locale) => Promise<void>;
  onToggleFavorite: (localeId: string) => void;
  isFavorite:       boolean;
  isLoggedIn:       boolean;
  hasStamp:         boolean;       // già timbrato oggi
  aiCuriosity?:     string;        // testo da Gemini API
  isLoadingAI:      boolean;
}

/* ── Helpers ─────────────────────────────────────────────── */
const formatYear = (year: number): string => {
  const age = new Date().getFullYear() - year;
  return `Dal ${year} · ${age} anni di storia`;
};

/* ── Sub-components ──────────────────────────────────────── */

/** Pill categoria */
const CategoryPill: React.FC<{ category: Category }> = ({ category }) => (
  <span style={{
    display:       'inline-flex',
    alignItems:    'center',
    gap:           5,
    padding:       '4px 10px',
    borderRadius:  'var(--radius-full, 9999px)',
    border:        `1px solid ${CATEGORY_COLORS[category]}44`,
    background:    `${CATEGORY_COLORS[category]}14`,
    color:         CATEGORY_COLORS[category],
    fontFamily:    'var(--font-body)',
    fontSize:      11,
    fontWeight:    700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }}>
    <span style={{ fontSize: 12 }}>{CATEGORY_ICONS[category]}</span>
    {CATEGORY_LABELS[category]}
  </span>
);

/** Badge "Patrimonio protetto" */
const ProtectedBadge: React.FC = () => (
  <span style={{
    display:       'inline-flex',
    alignItems:    'center',
    gap:           4,
    padding:       '4px 10px',
    borderRadius:  'var(--radius-full, 9999px)',
    border:        '1px solid rgba(201,168,76,0.4)',
    background:    'rgba(201,168,76,0.1)',
    color:         '#C9A84C',
    fontFamily:    'var(--font-body)',
    fontSize:      11,
    fontWeight:    700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }}>
    <span>🏛️</span> Patrimonio
  </span>
);

/** Sezione con titolo ornamentale */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ padding: '0 20px 24px' }}>
    <div style={{
      display:        'flex',
      alignItems:     'center',
      gap:            10,
      marginBottom:   14,
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
    {children}
  </div>
);

/** Gallery strip orizzontale */
const Gallery: React.FC<{ images: string[]; heroImage: string }> = ({ images, heroImage }) => {
  const all = [heroImage, ...images.filter(i => i !== heroImage)];
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Immagine principale */}
      <div style={{
        height:           260,
        background:       `url(${all[active]}) center/cover no-repeat`,
        position:         'relative',
        backgroundColor:  '#2A2A2C',
      }}>
        {/* Gradient bottom */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          height:     120,
          background: 'linear-gradient(to top, #1C1C1E, transparent)',
        }} />
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div style={{
          display:    'flex',
          gap:        6,
          padding:    '10px 20px',
          overflowX:  'auto',
          scrollbarWidth: 'none',
        }}>
          {all.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              style={{
                flexShrink:   0,
                width:        56,
                height:       40,
                borderRadius: 8,
                border:       i === active
                  ? '2px solid #C9A84C'
                  : '2px solid transparent',
                background:   `url(${img}) center/cover no-repeat #2A2A2C`,
                cursor:       'pointer',
                padding:      0,
                opacity:      i === active ? 1 : 0.55,
                transition:   'all 180ms ease',
              }}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Player audio (Web Speech API) */
const AudioPlayer: React.FC<{ text: string; localeName: string }> = ({ text, localeName }) => {
  const [state, setState]     = useState<'idle' | 'playing' | 'paused'>('idle');
  const [progress, setProgress] = useState(0);
  const uttRef                = useRef<SpeechSynthesisUtterance | null>(null);
  const wordCountRef          = useRef(0);
  const currentWordRef        = useRef(0);

  const words = text.split(/\s+/);
  wordCountRef.current = words.length;

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState('idle');
    setProgress(0);
    currentWordRef.current = 0;
  }, []);

  const play = useCallback(() => {
    if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('playing');
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);

    // Voce spagnola per Barcellona
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utt.voice = esVoice;
    utt.lang  = 'es-ES';
    utt.rate  = 0.92;
    utt.pitch = 1;

    utt.onboundary = (e) => {
      if (e.name === 'word') {
        currentWordRef.current++;
        setProgress(Math.round((currentWordRef.current / wordCountRef.current) * 100));
      }
    };
    utt.onend = () => { setState('idle'); setProgress(0); currentWordRef.current = 0; };

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setState('playing');
  }, [state, text]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState('paused');
  }, []);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return (
    <div style={{
      background:   'rgba(201,168,76,0.06)',
      border:       '1px solid rgba(201,168,76,0.2)',
      borderRadius: 14,
      padding:      '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Play / Pause / Stop */}
        <button
          onClick={state === 'playing' ? pause : play}
          aria-label={state === 'playing' ? 'Pausa' : 'Riproduci storia audio'}
          style={{
            width:        44,
            height:       44,
            borderRadius: '50%',
            border:       'none',
            background:   '#C9A84C',
            color:        '#1C1C1E',
            fontSize:     18,
            cursor:       'pointer',
            flexShrink:   0,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            boxShadow:    '0 0 16px rgba(201,168,76,0.3)',
          }}
        >
          {state === 'playing' ? '⏸' : '▶'}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily:  'var(--font-body)',
            fontSize:    13,
            fontWeight:  700,
            color:       '#F7F0E4',
            marginBottom: 6,
          }}>
            Storia audio · {localeName}
          </div>
          {/* Progress bar */}
          <div style={{
            height:       3,
            background:   'rgba(247,240,228,0.1)',
            borderRadius: 999,
            overflow:     'hidden',
          }}>
            <div style={{
              height:       '100%',
              width:        `${progress}%`,
              background:   'linear-gradient(90deg, #C9A84C, #E8C97A)',
              borderRadius: 999,
              transition:   'width 300ms ease',
            }} />
          </div>
        </div>

        {state !== 'idle' && (
          <button
            onClick={stop}
            aria-label="Stop"
            style={{
              width:        32,
              height:       32,
              borderRadius: '50%',
              border:       '1px solid rgba(247,240,228,0.15)',
              background:   'transparent',
              color:        'rgba(247,240,228,0.5)',
              fontSize:     12,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
            }}
          >
            ⏹
          </button>
        )}
      </div>
    </div>
  );
};

/** Card AI curiosità */
const AICuriosity: React.FC<{ text: string; isLoading: boolean }> = ({ text, isLoading }) => (
  <div style={{
    background:   'rgba(74,127,165,0.08)',
    border:       '1px solid rgba(74,127,165,0.25)',
    borderRadius: 14,
    padding:      '14px 16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>✨</span>
      <div>
        <div style={{
          fontFamily:    'var(--font-body)',
          fontSize:      10,
          fontWeight:    700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         'rgba(74,127,165,0.9)',
          marginBottom:  6,
        }}>
          Curiosità storica · AI
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width:            6,
                height:           6,
                borderRadius:     '50%',
                background:       'rgba(74,127,165,0.6)',
                animation:        `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        ) : (
          <p style={{
            fontFamily:  'var(--font-serif)',
            fontStyle:   'italic',
            fontSize:    14,
            fontWeight:  300,
            lineHeight:  1.65,
            color:       'rgba(247,240,228,0.8)',
            margin:      0,
          }}>
            {text}
          </p>
        )}
      </div>
    </div>
  </div>
);

/** Bottone azione principale */
const ActionButton: React.FC<{
  icon:     string;
  label:    string;
  onClick:  () => void;
  variant?: 'gold' | 'ghost' | 'terra';
  disabled?: boolean;
  busy?:    boolean;
}> = ({ icon, label, onClick, variant = 'ghost', disabled, busy }) => {
  const bg = variant === 'gold'
    ? '#C9A84C'
    : variant === 'terra'
      ? '#C0552A'
      : 'rgba(247,240,228,0.06)';
  const color = variant === 'gold' || variant === 'terra'
    ? '#1C1C1E'
    : '#F7F0E4';
  const border = variant === 'ghost' ? '1px solid rgba(247,240,228,0.12)' : 'none';

  return (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            5,
        padding:        '12px 8px',
        borderRadius:   12,
        border,
        background:     disabled ? 'rgba(247,240,228,0.04)' : bg,
        color:          disabled ? 'rgba(247,240,228,0.25)' : color,
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.5 : 1,
        transition:     'all 150ms ease',
        boxShadow:      variant === 'gold' ? '0 0 16px rgba(201,168,76,0.25)' : 'none',
      }}
    >
      <span style={{ fontSize: 20 }}>{busy ? '⏳' : icon}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {busy ? '…' : label}
      </span>
    </button>
  );
};

/* ── Main component ──────────────────────────────────────── */
const DetailView: React.FC<DetailViewProps> = ({
  locale,
  onClose,
  onNavigate,
  onCheckIn,
  onToggleFavorite,
  isFavorite,
  isLoggedIn,
  hasStamp,
  aiCuriosity,
  isLoadingAI,
}) => {
  const [checkInBusy, setCheckInBusy] = useState(false);
  const [checkInDone, setCheckInDone] = useState(hasStamp);
  const scrollRef                     = useRef<HTMLDivElement>(null);

  const handleCheckIn = useCallback(async () => {
    if (!isLoggedIn || checkInDone) return;
    setCheckInBusy(true);
    try {
      await onCheckIn(locale);
      setCheckInDone(true);
    } finally {
      setCheckInBusy(false);
    }
  }, [isLoggedIn, checkInDone, onCheckIn, locale]);

  const handleShare = useCallback(() => {
    const url  = `${window.location.origin}?locale=${locale.id}`;
    const text = `Scopri ${locale.name} su Emblematic ${locale.city}`;
    if (navigator.share) {
      navigator.share({ title: locale.name, text, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }, [locale]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Dettaglio ${locale.name}`}
      style={{
        position:         'fixed',
        inset:            0,
        zIndex:           40,
        background:       '#1C1C1E',
        overflowY:        'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      ref={scrollRef}
    >
      {/* ── Hero gallery ─────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <Gallery images={locale.gallery ?? []} heroImage={locale.image_url} />

        {/* Back button */}
        <button
          onClick={onClose}
          aria-label="Torna alla mappa"
          style={{
            position:       'absolute',
            top:            16,
            left:           16,
            width:          40,
            height:         40,
            borderRadius:   '50%',
            border:         '1px solid rgba(247,240,228,0.2)',
            background:     'rgba(28,28,30,0.72)',
            backdropFilter: 'blur(12px)',
            color:          '#F7F0E4',
            fontSize:       18,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         2,
          }}
        >
          ←
        </button>

        {/* Favorite */}
        <button
          onClick={() => onToggleFavorite(locale.id)}
          aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          style={{
            position:       'absolute',
            top:            16,
            right:          16,
            width:          40,
            height:         40,
            borderRadius:   '50%',
            border:         '1px solid rgba(247,240,228,0.2)',
            background:     'rgba(28,28,30,0.72)',
            backdropFilter: 'blur(12px)',
            color:          isFavorite ? '#C0552A' : '#F7F0E4',
            fontSize:       18,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         2,
            transition:     'color 200ms ease',
          }}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      {/* ── Header info ──────────────────────────────── */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <CategoryPill category={locale.category} />
          {locale.is_protected && <ProtectedBadge />}
        </div>

        <h1 style={{
          fontFamily:    'var(--font-display, "Cinzel", serif)',
          fontSize:      26,
          fontWeight:    500,
          letterSpacing: '-0.01em',
          lineHeight:    1.15,
          color:         '#F7F0E4',
          margin:        '0 0 6px',
        }}>
          {locale.name}
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   13,
          color:      'rgba(247,240,228,0.55)',
          margin:     '0 0 4px',
          display:    'flex',
          alignItems: 'center',
          gap:        6,
        }}>
          <span>📍</span> {locale.address}
        </p>

        <p style={{
          fontFamily:  'var(--font-serif, "Literata", serif)',
          fontStyle:   'italic',
          fontSize:    13,
          color:       'rgba(201,168,76,0.7)',
          margin:      0,
          fontWeight:  300,
        }}>
          {locale.founded_year != null ? formatYear(locale.founded_year) : null}
        </p>
      </div>

      {/* ── Action bar ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px 24px' }}>
        <ActionButton icon="🧭" label="Naviga"    onClick={() => onNavigate(locale)} variant="gold" />
        <ActionButton
          icon={checkInDone ? '✅' : '📒'}
          label={checkInDone ? 'Timbrato' : 'Timbra'}
          onClick={handleCheckIn}
          variant={checkInDone ? 'ghost' : 'terra'}
          disabled={!isLoggedIn || checkInDone}
          busy={checkInBusy}
        />
        <ActionButton icon="↗️" label="Condividi" onClick={handleShare}              variant="ghost" />
      </div>

      {/* ── Descrizione ──────────────────────────────── */}
      <Section title="La storia">
        <p style={{
          fontFamily: 'var(--font-serif, "Literata", serif)',
          fontSize:   15,
          fontWeight: 300,
          lineHeight: 1.75,
          color:      'rgba(247,240,228,0.78)',
          margin:     0,
        }}>
          {locale.full_story}
        </p>
      </Section>

      {/* ── Audio ────────────────────────────────────── */}
      <Section title="Storia audio">
        <AudioPlayer text={locale.full_story} localeName={locale.name} />
      </Section>

      {/* ── AI curiosità ─────────────────────────────── */}
      {(aiCuriosity || isLoadingAI) && (
        <Section title="Curiosità">
          <AICuriosity text={aiCuriosity ?? ''} isLoading={isLoadingAI} />
        </Section>
      )}

      {/* ── Social ───────────────────────────────────── */}
      {locale.social && Object.values(locale.social).some(Boolean) && (
        <Section title="Seguici">
          <div style={{ display: 'flex', gap: 10 }}>
            {locale.social.website && (
              <a href={locale.social.website} target="_blank" rel="noopener noreferrer"
                style={socialLinkStyle}>
                🌐 Sito web
              </a>
            )}
            {locale.social.instagram && (
              <a href={`https://instagram.com/${locale.social.instagram}`} target="_blank" rel="noopener noreferrer"
                style={socialLinkStyle}>
                📸 Instagram
              </a>
            )}
            {locale.social.facebook && (
              <a href={locale.social.facebook} target="_blank" rel="noopener noreferrer"
                style={socialLinkStyle}>
                👍 Facebook
              </a>
            )}
          </div>
        </Section>
      )}

      {/* Padding bottom safe area */}
      <div style={{ height: 40 }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

const socialLinkStyle: React.CSSProperties = {
  display:       'inline-flex',
  alignItems:    'center',
  gap:           6,
  padding:       '8px 14px',
  borderRadius:  999,
  border:        '1px solid rgba(247,240,228,0.12)',
  background:    'rgba(247,240,228,0.04)',
  color:         'rgba(247,240,228,0.7)',
  fontFamily:    'var(--font-body)',
  fontSize:      12,
  fontWeight:    700,
  textDecoration: 'none',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

export default DetailView;
