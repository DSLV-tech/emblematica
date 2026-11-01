'use client'

import { notFound, useParams, useRouter } from 'next/navigation'
import { IconContext } from '@phosphor-icons/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { LEGAL_DOCS, type LegalDoc } from '@/data/legal'
import LegalView from '@/views/LegalView'

/* Indirizzo pubblico dei testi legali, leggibile senza entrare nell'app */
export default function LegalPage() {
  const { doc } = useParams<{ doc: string }>()
  const router = useRouter()

  if (!LEGAL_DOCS.includes(doc as LegalDoc)) notFound()

  return (
    <LanguageProvider>
      <IconContext.Provider value={{ weight: 'light', size: 20 }}>
        <LegalView initialDoc={doc as LegalDoc} onClose={() => router.push('/')} />
      </IconContext.Provider>
    </LanguageProvider>
  )
}
