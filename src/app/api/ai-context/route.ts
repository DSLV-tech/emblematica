'use server'

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
    try {
        const { story, name } = await request.json()

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
Rispondi SOLO con il fatto, senza introduzioni o titoli. Scrivi in italiano.

Storia:
${story}`

        const result = await model.generateContent(prompt)
        const fact = result.response.text().trim()

        return NextResponse.json({ fact })
    } catch (error: any) {
        console.error('AI context error:', error)
        const raw = error?.message ?? ''
        // Messaggio user-friendly in base al tipo di errore
        let userMessage = 'Curiosità AI momentaneamente non disponibile.'
        if (raw.includes('429') || raw.includes('quota') || raw.includes('Too Many Requests')) {
            userMessage = 'Troppe richieste AI: riprova tra qualche secondo.'
        } else if (raw.includes('API key') || raw.includes('invalid') || raw.includes('401')) {
            userMessage = 'Chiave API non valida. Verifica la configurazione.'
        } else if (raw.includes('not found') || raw.includes('404')) {
            userMessage = 'Modello AI non disponibile. Riprova più tardi.'
        }
        return NextResponse.json({ error: userMessage }, { status: 500 })
    }
}
