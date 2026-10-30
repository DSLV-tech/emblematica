'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { translations, LANGUAGES, type LangCode, type TranslationKey, type LangMeta } from '../i18n/translations'

const STORAGE_KEY = 'emblematica-lang'

interface LanguageContextValue {
    lang: LangCode
    langMeta: LangMeta
    allLanguages: LangMeta[]
    isRtl: boolean
    setLang: (code: LangCode) => void
    /** Traduce una chiave; `vars` sostituisce i segnaposto `{nome}` */
    t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
    lang: 'it',
    langMeta: LANGUAGES[0],
    allLanguages: LANGUAGES,
    isRtl: false,
    setLang: () => { },
    t: (key) => key,
})

function detectBrowserLang(): LangCode {
    if (typeof navigator === 'undefined') return 'it'
    const nav = navigator.language.toLowerCase()
    if (nav.startsWith('ca')) return 'ca'
    if (nav.startsWith('es')) return 'es'
    if (nav.startsWith('pt')) return 'pt'
    if (nav.startsWith('en')) return 'en'
    if (nav.startsWith('ar')) return 'ar'
    if (nav.startsWith('zh')) return 'zh'
    return 'it'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<LangCode>('it')

    // Restore from localStorage or browser preference
    useEffect(() => {
        if (typeof window === 'undefined') return
        const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null
        if (saved && LANGUAGES.find(l => l.code === saved)) {
            setLangState(saved)
        } else {
            setLangState(detectBrowserLang())
        }
    }, [])

    const setLang = useCallback((code: LangCode) => {
        setLangState(code)
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, code)
    }, [])

    // Allinea <html lang/dir> anche alla lingua ripristinata all'avvio, non solo al cambio manuale
    useEffect(() => {
        const meta = LANGUAGES.find(l => l.code === lang)
        document.documentElement.lang = lang
        document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr'
    }, [lang])

    const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
        const text = translations[lang]?.[key] ?? translations['it'][key] ?? key
        return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m)) : text
    }, [lang])

    const langMeta = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]
    const isRtl = langMeta.rtl === true

    return (
        <LanguageContext.Provider value={{ lang, langMeta, allLanguages: LANGUAGES, isRtl, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}
