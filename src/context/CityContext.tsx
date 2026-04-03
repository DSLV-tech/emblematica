'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { CITIES, DEFAULT_CITY, getCityById, type CityConfig } from '../data/cities'

const STORAGE_KEY = 'emblematica-city'

interface CityContextValue {
    city: CityConfig
    allCities: CityConfig[]
    setCity: (id: string) => void
}

const CityContext = createContext<CityContextValue>({
    city: DEFAULT_CITY,
    allCities: CITIES,
    setCity: () => { },
})

export function CityProvider({ children }: { children: ReactNode }) {
    const [city, setCityState] = useState<CityConfig>(DEFAULT_CITY)

    // Restore last selected city from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            const found = getCityById(saved)
            if (found.available) setCityState(found)
        }
    }, [])

    const setCity = (id: string) => {
        const found = getCityById(id)
        if (!found.available) return  // don't switch to unavailable cities
        setCityState(found)
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, id)
        }
    }

    return (
        <CityContext.Provider value={{ city, allCities: CITIES, setCity }}>
            {children}
        </CityContext.Provider>
    )
}

export function useCity() {
    return useContext(CityContext)
}
