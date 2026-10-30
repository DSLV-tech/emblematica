'use server'

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Lingua in cui Gemini deve rispondere, per codice UI
const LANGUAGE_NAMES: Record<string, string> = {
    it: 'italiano', en: 'English', es: 'español', ca: 'català', pt: 'português', ar: 'العربية', zh: '简体中文',
}

export async function POST(request: NextRequest) {
    try {
        const { story, name, lang } = await request.json()
        const language = LANGUAGE_NAMES[lang] ?? LANGUAGE_NAMES.it

        if (!story || !name) {
            return NextResponse.json({ error: 'Missing story or name' }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 503 }
            )
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

        const prompt = `Sei una guida esperta di storia culturale catalana e barcellonese. 
Basandoti sulla seguente storia del luogo storico "${name}", genera UN SINGOLO fatto curioso, 
sorprendente o poco conosciuto (max 3 frasi). Deve essere coinvolgente, specifico e autentico.
Rispondi SOLO con il fatto, senza introduzioni o titoli. Scrivi in questa lingua: ${language}.

Storia:
${story}`

        const result = await model.generateContent(prompt)
        const fact = result.response.text().trim()

        return NextResponse.json({ fact })
    } catch (error: any) {
        console.error('AI context error:', error)
        const raw = error?.message ?? ''
        // Codice d'errore: il client lo traduce nella lingua dell'utente
        const busy = raw.includes('429') || raw.includes('quota') || raw.includes('Too Many Requests')
        return NextResponse.json({ error: busy ? 'busy' : 'unavailable' }, { status: busy ? 429 : 500 })
    }
}
