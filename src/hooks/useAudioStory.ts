'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'unsupported'

export interface UseAudioStoryReturn {
    state: AudioState
    progress: number        // 0–1
    currentWord: number     // index of highlighted word
    words: string[]         // script split into words
    play: () => void
    pause: () => void
    stop: () => void
    toggle: () => void
}

const PREFERRED_LANG = 'es-ES'  // Spanish narrator matches Barcelona feel
const FALLBACK_LANG = 'it-IT'

/**
 * Narrates `text` using the browser Web Speech API.
 * No network calls, no API keys.
 */
export function useAudioStory(text: string | null): UseAudioStoryReturn {
    const [state, setState] = useState<AudioState>(
        typeof window !== 'undefined' && 'speechSynthesis' in window ? 'idle' : 'unsupported'
    )
    const [progress, setProgress] = useState(0)
    const [currentWord, setCurrentWord] = useState(-1)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const wordsRef = useRef<string[]>([])

    const words = text ? text.trim().split(/\s+/) : []

    // Choose the best available voice
    const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return null
        const voices = window.speechSynthesis.getVoices()
        // 1. Prefer Spanish voices (authentic Barcelona feel)
        const es = voices.find(v => v.lang.startsWith('es') && !v.localService === false)
            ?? voices.find(v => v.lang.startsWith('es'))
        if (es) return es
        // 2. Fall back to Italian (closest to Catalan rhythm)
        const it = voices.find(v => v.lang.startsWith('it'))
        if (it) return it
        // 3. Any voice
        return voices[0] ?? null
    }, [])

    // Build a fresh utterance for the current text
    const buildUtterance = useCallback((scriptText: string): SpeechSynthesisUtterance => {
        const u = new SpeechSynthesisUtterance(scriptText)
        const words = scriptText.trim().split(/\s+/)
        wordsRef.current = words

        u.rate = 0.92
        u.pitch = 1.0
        u.volume = 1.0

        const voice = pickVoice()
        if (voice) u.voice = voice

        let wordIndex = 0
        u.onboundary = (e) => {
            if (e.name === 'word') {
                setCurrentWord(wordIndex)
                setProgress(wordIndex / Math.max(words.length - 1, 1))
                wordIndex++
            }
        }

        u.onstart = () => setState('playing')
        u.onpause = () => setState('paused')
        u.onresume = () => setState('playing')
        u.onend = () => {
            setState('ended')
            setProgress(1)
            setCurrentWord(-1)
        }
        u.onerror = (e) => {
            if (e.error !== 'interrupted') {
                console.warn('[useAudioStory] error:', e.error)
                setState('idle')
            }
        }

        return u
    }, [pickVoice])

    // Cancel any ongoing speech when text changes
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel()
            }
            setState('idle')
            setProgress(0)
            setCurrentWord(-1)
        }
    }, [text])

    const play = useCallback(() => {
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return

        if (state === 'paused' && utteranceRef.current) {
            window.speechSynthesis.resume()
            return
        }

        // Fresh start
        window.speechSynthesis.cancel()
        setState('loading')
        setProgress(0)
        setCurrentWord(-1)

        const u = buildUtterance(text)
        utteranceRef.current = u

        // Chrome bug: voices may load async
        const doSpeak = () => {
            if (window.speechSynthesis.getVoices().length === 0) {
                setTimeout(doSpeak, 100)
                return
            }
            u.voice = pickVoice()
            window.speechSynthesis.speak(u)
        }
        doSpeak()
    }, [text, state, buildUtterance, pickVoice])

    const pause = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.pause()
        }
    }, [])

    const stop = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel()
        }
        setState('idle')
        setProgress(0)
        setCurrentWord(-1)
    }, [])

    const toggle = useCallback(() => {
        if (state === 'playing') pause()
        else if (state === 'paused') play()
        else play()
    }, [state, play, pause])

    return { state, progress, currentWord, words, play, pause, stop, toggle }
}
