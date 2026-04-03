'use client'

import { useState } from 'react'

export function useAiContext() {
    const [fact, setFact] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchFact = async (story: string, name: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/ai-context', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ story, name }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || `Errore ${response.status}`)
            }

            const data = await response.json()
            setFact(data.fact)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore nella generazione del fatto')
        } finally {
            setLoading(false)
        }
    }

    return { fetchFact, fact, loading, error }
}
