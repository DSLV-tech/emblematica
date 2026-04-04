'use client'

import type React from 'react'
import { CITIES, type CityConfig } from '../data/cities'
import { useCity } from '../context/CityContext'

// Città "nuove" che mostrano il badge NUOVO
const NEW_CITY_IDS = ['rimini', 'bologna']

interface CitySelectorViewProps {
    onClose: () => void
}

export default function CitySelectorView({ onClose }: CitySelectorViewProps) {
    const { city: activeCity, setCity } = useCity()

    const available  = CITIES.filter(c => c.available)
    const comingSoon = CITIES.filter(c => !c.available)

    const handleSelect = (c: CityConfig) => {
        if (!c.available) return
        setCity(c.id)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[3500] overflow-hidden flex flex-col" style={{ background: '#111214' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '20px 20px 16px',
                paddingTop: 'max(20px, env(safe-area-inset-top))',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(17,18,20,0.95)',
                backdropFilter: 'blur(12px)',
                flexShrink: 0,
            }}>
                <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                }}>🌍</div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: 18, fontWeight: 700, color: '#F7F0E4', margin: 0 }}>
                        Scegli la città
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(247,240,228,0.4)', margin: '2px 0 0' }}>
                        Emblematica è disponibile in queste città
                    </p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        width: 38, height: 38, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(247,240,228,0.6)',
                        fontSize: 20, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                <div style={{ maxWidth: 500, margin: '0 auto', padding: '28px 16px 40px' }}>

                    {/* ── Disponibili ── */}
                    <div style={{ marginBottom: 36 }}>
                        <p style={{
                            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                            color: 'rgba(201,168,76,0.7)', letterSpacing: '0.2em',
                            textTransform: 'uppercase', marginBottom: 14, paddingLeft: 4,
                        }}>Disponibile ora</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {available.map(c => (
                                <CityCard
                                    key={c.id}
                                    city={c}
                                    isActive={c.id === activeCity.id}
                                    isNew={NEW_CITY_IDS.includes(c.id)}
                                    onSelect={() => handleSelect(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── In arrivo ── */}
                    {comingSoon.length > 0 && (
                        <div style={{ marginBottom: 36 }}>
                            <p style={{
                                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                                color: 'rgba(247,240,228,0.3)', letterSpacing: '0.2em',
                                textTransform: 'uppercase', marginBottom: 14, paddingLeft: 4,
                            }}>In arrivo</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {comingSoon.map(c => (
                                    <ComingSoonCard key={c.id} city={c} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── CTA proponi città ── */}
                    <div style={{
                        borderRadius: 20,
                        border: '1.5px dashed rgba(201,168,76,0.25)',
                        padding: '24px 20px',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                            color: '#C9A84C', letterSpacing: '0.2em', textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>Vuoi la tua città?</p>
                        <p style={{
                            fontFamily: '"Literata", serif', fontSize: 13, fontStyle: 'italic',
                            color: 'rgba(247,240,228,0.45)', lineHeight: 1.6,
                            margin: '0 auto 16px', maxWidth: 280,
                        }}>
                            Sei un'associazione culturale o un ente municipale? Possiamo portare Emblematica nella tua città.
                        </p>
                        <a
                            href="mailto:info@emblematica.app?subject=Proposta%20nuova%20citt%C3%A0"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 22px', borderRadius: 999,
                                background: 'rgba(201,168,76,0.12)',
                                border: '1px solid rgba(201,168,76,0.3)',
                                color: '#C9A84C',
                                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
                                letterSpacing: '0.05em', textDecoration: 'none',
                            }}
                        >
                            ✉️ Proponi la tua città
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}

// ── CityCard — città disponibili ─────────────────────────────────────────────
function CityCard({ city, isActive, isNew, onSelect }: {
    city: CityConfig
    isActive: boolean
    isNew: boolean
    onSelect: () => void
}) {
    return (
        <button
            onClick={onSelect}
            style={{
                width: '100%', textAlign: 'left',
                border: isActive ? `2px solid ${city.accentColor}` : '2px solid rgba(255,255,255,0.06)',
                borderRadius: 20, overflow: 'hidden',
                cursor: 'pointer', background: 'none', padding: 0,
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                boxShadow: isActive
                    ? `0 0 0 4px ${city.accentColor}28, 0 4px 20px rgba(0,0,0,0.4)`
                    : '0 2px 12px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
        >
            {/* Background image strip */}
            <div style={{
                position: 'relative', height: 112,
                backgroundImage: `url(${city.backgroundImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center top',
            }}>
                {/* Gradient overlay con accent color */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(105deg, ${city.accentColor}EE 0%, ${city.accentColor}99 45%, rgba(0,0,0,0.25) 100%)`,
                }} />

                {/* Content */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center',
                    padding: '0 20px', gap: 14,
                }}>
                    <span style={{ fontSize: 38, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))', flexShrink: 0 }}>
                        {city.flag}
                    </span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <p style={{
                                fontFamily: '"Cinzel", serif', fontSize: 22, fontWeight: 700,
                                color: '#fff', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                            }}>{city.name}</p>
                            {isNew && (
                                <span style={{
                                    fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 900,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    background: '#fff', color: city.accentColor,
                                    padding: '2px 7px', borderRadius: 999,
                                    flexShrink: 0,
                                }}>NUOVO</span>
                            )}
                        </div>
                        <p style={{
                            fontFamily: '"Literata", serif', fontStyle: 'italic',
                            fontSize: 11, color: 'rgba(255,255,255,0.82)', margin: 0,
                            lineHeight: 1.35, overflow: 'hidden',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        } as React.CSSProperties}>
                            {city.tagline}
                        </p>
                    </div>

                    {/* Stato: active pill o freccia */}
                    <div style={{ flexShrink: 0 }}>
                        {isActive ? (
                            <div style={{
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 999, padding: '5px 11px',
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: '#4ade80', boxShadow: '0 0 8px #4ade80',
                                    display: 'inline-block', flexShrink: 0,
                                }} />
                                <span style={{
                                    fontFamily: 'var(--font-body)', fontSize: 10,
                                    fontWeight: 800, color: '#fff', letterSpacing: '0.06em',
                                }}>ATTIVA</span>
                            </div>
                        ) : (
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, color: '#fff',
                            }}>›</div>
                        )}
                    </div>
                </div>
            </div>
        </button>
    )
}

// ── ComingSoonCard — città in arrivo ──────────────────────────────────────────
function ComingSoonCard({ city }: { city: CityConfig }) {
    return (
        <div style={{
            borderRadius: 16, overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'default',
        }}>
            {/* Mini background desaturato */}
            <div style={{
                height: 80,
                backgroundImage: `url(${city.backgroundImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'saturate(0.3) brightness(0.45)',
            }} />
            {/* Gradient con accent color */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(160deg, ${city.accentColor}55 0%, rgba(17,18,20,0.88) 65%)`,
            }} />
            {/* Content */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'flex-end',
                padding: '10px 12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 16 }}>{city.flag}</span>
                    <p style={{
                        fontFamily: '"Cinzel", serif', fontSize: 13, fontWeight: 700,
                        color: '#F7F0E4', margin: 0,
                    }}>{city.name}</p>
                </div>
                <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: city.accentColorLight,
                    background: `${city.accentColor}33`,
                    border: `1px solid ${city.accentColor}55`,
                    padding: '2px 7px', borderRadius: 999,
                }}>Presto</span>
            </div>
        </div>
    )
}
