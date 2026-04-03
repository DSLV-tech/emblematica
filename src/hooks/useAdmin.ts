'use client'

import { useState } from 'react'
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Locale } from '../types'

export type LocaleFormData = Omit<Locale, 'id'>

export function useAdminLocales() {
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const saveLocale = async (data: LocaleFormData, id?: string): Promise<string> => {
        setSaving(true)
        setError(null)
        try {
            const payload = {
                ...data,
                updatedAt: serverTimestamp(),
            }
            if (id) {
                // Update existing
                await updateDoc(doc(db, 'locales', id), payload)
                setSaving(false)
                return id
            } else {
                // Create new
                const ref = await addDoc(collection(db, 'locales'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                })
                setSaving(false)
                return ref.id
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Errore nel salvataggio.'
            setError(msg)
            setSaving(false)
            throw err
        }
    }

    const deleteLocale = async (id: string): Promise<void> => {
        setDeleting(true)
        setError(null)
        try {
            await deleteDoc(doc(db, 'locales', id))
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Errore nella eliminazione.'
            setError(msg)
            throw err
        } finally {
            setDeleting(false)
        }
    }

    return { saveLocale, deleteLocale, saving, deleting, error }
}

export function useAdminBlog() {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const savePost = async (
        data: { title: string; content: string; published: boolean; image_url?: string },
        id?: string
    ): Promise<string> => {
        setSaving(true)
        setError(null)
        try {
            const payload = { ...data, updatedAt: serverTimestamp() }
            if (id) {
                await updateDoc(doc(db, 'blog', id), payload)
                setSaving(false)
                return id
            } else {
                const ref = await addDoc(collection(db, 'blog'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                })
                setSaving(false)
                return ref.id
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Errore nel salvataggio.'
            setError(msg)
            setSaving(false)
            throw err
        }
    }

    return { savePost, saving, error }
}
