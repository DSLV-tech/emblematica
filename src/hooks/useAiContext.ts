'use client'

import { useState } from 'react'

/** Codice d'errore restituito da /api/ai-context, tradotto dalla UI */
export type AiError = 'busy' | 'unavailable'

export function useAiContext() {
    const [fact, setFact] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AiError | null>(null)

    const fetchFact = async (story: string, name: string, lang: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/ai-context', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ story, name, lang }),
            })

            const data = await response.json()
            if (!response.ok) {
                setError(data.error === 'busy' ? 'busy' : 'unavailable')
                return
            }
            setFact(data.fact)
        } catch {
            setError('unavailable')
        } finally {
            setLoading(false)
        }
    }

    return { fetchFact, fact, loading, error }
}
