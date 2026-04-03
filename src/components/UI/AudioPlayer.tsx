'use client'

import { useAudioStory } from '../../hooks/useAudioStory'

interface AudioPlayerProps {
    text: string
    localeName: string
}

export default function AudioPlayer({ text, localeName }: AudioPlayerProps) {
    const { state, progress, currentWord, words, toggle, stop } = useAudioStory(text)

    if (state === 'unsupported') {
        return (
            <div className="flex items-center gap-3 bg-anthracite/5 rounded-2xl px-4 py-3 text-anthracite/40">
                <span className="text-lg">🔇</span>
                <p className="font-sans text-xs">Audio non supportato su questo browser</p>
            </div>
        )
    }

    const isActive = state === 'playing' || state === 'paused'

    return (
        <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isActive
                ? 'bg-anthracite border-anthracite/20 shadow-xl'
                : 'bg-white border-anthracite/10 shadow-sm hover:shadow-md'
            }`}>
            {/* Top bar */}
            <div className="flex items-center gap-4 px-5 py-4">
                {/* Play/Pause button */}
                <button
                    onClick={toggle}
                    disabled={state === 'loading'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${isActive
                            ? 'bg-gold shadow-[0_0_20px_rgba(184,134,11,0.5)]'
                            : 'bg-gold/90 hover:bg-gold'
                        } disabled:opacity-60`}
                >
                    {state === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />
                    ) : state === 'playing' ? (
                        // Pause icon
                        <svg className="w-5 h-5 text-cream" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        // Play icon
                        <svg className="w-5 h-5 text-cream ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Info + waveform */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <p className={`font-sans text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-gold/70' : 'text-gold/60'}`}>
                                🎙 Audio Story
                            </p>
                            <p className={`font-serif text-sm font-bold truncate ${isActive ? 'text-cream' : 'text-anthracite'}`}>
                                {localeName}
                            </p>
                        </div>

                        {/* Animated waveform when playing */}
                        {state === 'playing' && (
                            <div className="flex items-end gap-0.5 h-6">
                                {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-gold rounded-full animate-pulse"
                                        style={{
                                            height: `${h * 100}%`,
                                            animationDelay: `${i * 0.1}s`,
                                            animationDuration: `${0.5 + i * 0.07}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className={`h-1 rounded-full overflow-hidden ${isActive ? 'bg-white/10' : 'bg-anthracite/10'}`}>
                        <div
                            className="h-full bg-gold rounded-full transition-all duration-300"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>

                {/* Stop button — only when active */}
                {isActive && (
                    <button
                        onClick={stop}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4 text-cream" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 6h12v12H6z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Scrolling transcript — shown while playing or paused */}
            {isActive && words.length > 0 && (
                <div className="px-5 pb-5">
                    <div className="bg-white/5 rounded-2xl p-4 max-h-32 overflow-y-auto custom-scrollbar">
                        <p className="font-sans text-sm leading-relaxed text-cream/70 select-none">
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className={`transition-all duration-100 ${i === currentWord
                                            ? 'text-gold font-semibold'
                                            : i < currentWord
                                                ? 'text-cream/40'
                                                : 'text-cream/70'
                                        }`}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            )}

            {/* Ended state */}
            {state === 'ended' && (
                <div className="px-5 pb-4">
                    <p className="font-sans text-xs text-anthracite/50 text-center">
                        ✓ Storia completata · Premi ▶ per riascoltare
                    </p>
                </div>
            )}
        </div>
    )
}
