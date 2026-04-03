'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Locale } from '../types'
import { CATEGORIES, CATEGORY_ICONS } from '../types'
import { useAdminLocales, useAdminBlog } from '../hooks/useAdmin'
import { SAMPLE_LOCALES } from '../data/sampleData'

// ─── Types ────────────────────────────────────────────────────────────────────
export type AdminTab = 'locali' | 'blog'

interface AdminViewProps {
    onClose: () => void
}

// ─── Initial empty locale form ─────────────────────────────────────────────
const EMPTY_LOCALE: Omit<Locale, 'id'> = {
    name: '',
    category: 'bar',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    description: '',
    full_story: '',
    image_url: '',
    address: '',
    founded_year: new Date().getFullYear(),
    gallery: [],
    social: {},
    protected: false,
    city: 'Barcelona',
}

// ─── AdminView ─────────────────────────────────────────────────────────────
export default function AdminView({ onClose }: AdminViewProps) {
    const [tab, setTab] = useState<AdminTab>('locali')
    const [locales, setLocales] = useState<Locale[]>([])
    const [loadingLocales, setLoadingLocales] = useState(true)
    const [editingLocale, setEditingLocale] = useState<Locale | null>(null)
    const [showLocaleForm, setShowLocaleForm] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const { saveLocale, deleteLocale: del, saving, deleting } = useAdminLocales()
    const { savePost, saving: savingPost } = useAdminBlog()

    // Blog form state
    const [blogTitle, setBlogTitle] = useState('')
    const [blogContent, setBlogContent] = useState('')
    const [blogImage, setBlogImage] = useState('')
    const [blogPublished, setBlogPublished] = useState(false)
    const [blogSaved, setBlogSaved] = useState(false)

    // Load all locales for the admin table (unfiltered)
    useEffect(() => {
        const q = query(collection(db, 'locales'), orderBy('name'))
        const unsub = onSnapshot(q, (snap) => {
            if (snap.empty) {
                setLocales(SAMPLE_LOCALES)
            } else {
                setLocales(snap.docs.map(d => ({ id: d.id, ...d.data() } as Locale)))
            }
            setLoadingLocales(false)
        }, () => {
            setLocales(SAMPLE_LOCALES)
            setLoadingLocales(false)
        })
        return unsub
    }, [])

    const handleSaveLocale = async (data: Omit<Locale, 'id'>, id?: string) => {
        await saveLocale(data, id)
        setShowLocaleForm(false)
        setEditingLocale(null)
    }

    const handleDeleteLocale = async (id: string) => {
        await del(id)
        setDeleteConfirm(null)
    }

    const handleSaveBlog = async () => {
        await savePost({ title: blogTitle, content: blogContent, image_url: blogImage, published: blogPublished })
        setBlogSaved(true)
        setBlogTitle(''); setBlogContent(''); setBlogImage(''); setBlogPublished(false)
        setTimeout(() => setBlogSaved(false), 3000)
    }

    return (
        <div className="fixed inset-0 z-[4000] bg-cream overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                </div>
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">Admin Dashboard</h1>
                    <p className="font-sans text-xs text-anthracite/50">Gestione contenuti Emblematica</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors"
                >
                    <svg className="w-5 h-5 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-anthracite/10 bg-white flex-shrink-0">
                {[
                    { key: 'locali', label: 'Locali', icon: '📍' },
                    { key: 'blog', label: 'Blog', icon: '✍️' },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as AdminTab)}
                        className={`flex items-center gap-2 px-6 py-3 font-sans text-sm font-semibold border-b-2 transition-colors ${tab === t.key
                            ? 'border-gold text-gold'
                            : 'border-transparent text-anthracite/50 hover:text-anthracite'
                            }`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {tab === 'locali' && (
                    <LocaliTab
                        locales={locales}
                        loading={loadingLocales}
                        onNew={() => { setEditingLocale(null); setShowLocaleForm(true) }}
                        onEdit={(l) => { setEditingLocale(l); setShowLocaleForm(true) }}
                        onDelete={(id) => setDeleteConfirm(id)}
                    />
                )}
                {tab === 'blog' && (
                    <BlogTab
                        title={blogTitle} setTitle={setBlogTitle}
                        content={blogContent} setContent={setBlogContent}
                        image={blogImage} setImage={setBlogImage}
                        published={blogPublished} setPublished={setBlogPublished}
                        onSave={handleSaveBlog}
                        saving={savingPost}
                        saved={blogSaved}
                    />
                )}
            </div>

            {/* Locale Form Modal */}
            {showLocaleForm && (
                <LocaleFormModal
                    initial={editingLocale ?? undefined}
                    onSave={handleSaveLocale}
                    onClose={() => { setShowLocaleForm(false); setEditingLocale(null) }}
                    saving={saving}
                />
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[4100] flex items-center justify-center bg-anthracite/50 backdrop-blur-sm p-6" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="font-serif text-xl font-bold text-anthracite mb-2">Elimina Locale</h2>
                        <p className="font-sans text-sm text-anthracite/60 mb-6">Questa azione è irreversibile. Sei sicuro?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl border border-anthracite/20 font-sans text-sm font-semibold text-anthracite hover:bg-anthracite/5 transition-colors">Annulla</button>
                            <button onClick={() => handleDeleteLocale(deleteConfirm)} disabled={deleting} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 font-sans text-sm font-semibold text-white transition-colors disabled:opacity-60">
                                {deleting ? 'Eliminazione…' : 'Elimina'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Locali Tab ────────────────────────────────────────────────────────────
function LocaliTab({ locales, loading, onNew, onEdit, onDelete }: {
    locales: Locale[]
    loading: boolean
    onNew: () => void
    onEdit: (l: Locale) => void
    onDelete: (id: string) => void
}) {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-anthracite">Locali sulla mappa</h2>
                    <p className="font-sans text-sm text-anthracite/50 mt-0.5">{locales.length} locali in totale</p>
                </div>
                <button
                    onClick={onNew}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gold text-cream font-sans font-bold text-sm shadow-lg hover:bg-gold-dark transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    Aggiungi Locale
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-anthracite/5 overflow-hidden">
                    {locales.map((locale, i) => (
                        <div key={locale.id} className={`flex items-center gap-4 px-6 py-4 ${i < locales.length - 1 ? 'border-b border-anthracite/5' : ''} hover:bg-anthracite/2 transition-colors group`}>
                            {/* Image */}
                            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-anthracite/5">
                                <img src={locale.image_url} alt={locale.name} className="w-full h-full object-cover" onError={e => ((e.target as HTMLImageElement).style.display = 'none')} />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-sans text-sm">{CATEGORY_ICONS[locale.category] ?? '📍'}</span>
                                    <p className="font-serif text-base font-bold text-anthracite truncate">{locale.name}</p>
                                    {locale.protected && <span className="text-xs bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full font-sans font-semibold hidden sm:inline">Protetto</span>}
                                </div>
                                <p className="font-sans text-xs text-anthracite/50 truncate mt-0.5">{locale.address}</p>
                            </div>
                            {/* Founded year */}
                            {locale.founded_year && (
                                <span className="font-sans text-xs text-anthracite/40 hidden md:block flex-shrink-0">{locale.founded_year}</span>
                            )}
                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => onEdit(locale)} className="w-9 h-9 rounded-xl bg-anthracite/5 hover:bg-gold/10 hover:text-gold flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => onDelete(locale.id)} className="w-9 h-9 rounded-xl bg-anthracite/5 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Blog Tab ──────────────────────────────────────────────────────────────
function BlogTab({ title, setTitle, content, setContent, image, setImage, published, setPublished, onSave, saving, saved }: {
    title: string; setTitle: (v: string) => void
    content: string; setContent: (v: string) => void
    image: string; setImage: (v: string) => void
    published: boolean; setPublished: (v: boolean) => void
    onSave: () => void
    saving: boolean
    saved: boolean
}) {
    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="font-serif text-2xl font-bold text-anthracite">Nuovo Post Blog</h2>
                <p className="font-sans text-sm text-anthracite/50 mt-0.5">Scrivi e pubblica un articolo sulla piattaforma</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-anthracite/5 space-y-5">
                <Field label="Titolo dell'articolo">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Es. La storia segreta delle farmacie catalane"
                        className="w-full px-4 py-3 rounded-xl border border-anthracite/15 font-serif text-lg text-anthracite focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                </Field>

                <Field label="URL immagine di copertina (opzionale)">
                    <input
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-xl border border-anthracite/15 font-sans text-sm text-anthracite focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                    {image && <img src={image} alt="preview" className="mt-2 w-full h-40 object-cover rounded-xl" />}
                </Field>

                <Field label="Contenuto articolo">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={14}
                        placeholder="Scrivi il tuo articolo qui. Usa paragrafi separati da una riga vuota."
                        className="w-full px-4 py-3 rounded-xl border border-anthracite/15 font-sans text-sm text-anthracite leading-relaxed focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                    />
                </Field>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div
                            onClick={() => setPublished(!published)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${published ? 'bg-gold' : 'bg-anthracite/20'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${published ? 'translate-x-7' : 'translate-x-1'}`} />
                        </div>
                        <span className="font-sans text-sm font-semibold text-anthracite">
                            {published ? 'Pubblica subito' : 'Salva come bozza'}
                        </span>
                    </label>

                    {saved && (
                        <span className="font-sans text-sm text-green-600 font-semibold flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Salvato!
                        </span>
                    )}

                    <button
                        onClick={onSave}
                        disabled={saving || !title.trim() || !content.trim()}
                        className="px-6 py-3 rounded-2xl bg-anthracite hover:bg-anthracite-light text-cream font-sans font-bold text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />}
                        {saving ? 'Salvataggio…' : 'Salva Post'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Locale Form Modal ─────────────────────────────────────────────────────
function LocaleFormModal({ initial, onSave, onClose, saving }: {
    initial?: Locale
    onSave: (data: Omit<Locale, 'id'>, id?: string) => Promise<void>
    onClose: () => void
    saving: boolean
}) {
    const [form, setForm] = useState<Omit<Locale, 'id'>>(
        initial ? (({ id: _, ...rest }) => rest)(initial) : EMPTY_LOCALE
    )

    const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
        setForm(prev => ({ ...prev, [key]: val }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSave(form, initial?.id)
    }

    return (
        <div className="fixed inset-0 z-[4100] flex items-center justify-center p-4 bg-anthracite/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-cream rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-cream/95 backdrop-blur-sm flex items-center justify-between px-8 py-5 border-b border-anthracite/10 z-10">
                    <h2 className="font-serif text-xl font-bold text-anthracite">
                        {initial ? `Modifica: ${initial.name}` : 'Nuovo Locale'}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-anthracite/10 hover:bg-anthracite/20 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Nome locale" required>
                            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Es. Bar Marsella" className={inputCx} />
                        </Field>

                        <Field label="Categoria">
                            <select value={form.category} onChange={e => set('category', e.target.value as any)} className={inputCx}>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Indirizzo" required>
                        <input required value={form.address} onChange={e => set('address', e.target.value)} placeholder="Carrer de Sant Pau, 65, 08001 Barcelona" className={inputCx} />
                    </Field>

                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Latitudine">
                            <input type="number" step="any" value={form.coordinates.lat} onChange={e => set('coordinates', { ...form.coordinates, lat: parseFloat(e.target.value) })} className={inputCx} />
                        </Field>
                        <Field label="Longitudine">
                            <input type="number" step="any" value={form.coordinates.lng} onChange={e => set('coordinates', { ...form.coordinates, lng: parseFloat(e.target.value) })} className={inputCx} />
                        </Field>
                    </div>

                    <Field label="Anno di fondazione">
                        <input type="number" value={form.founded_year ?? ''} onChange={e => set('founded_year', e.target.value ? parseInt(e.target.value) : 0)} placeholder="1897" className={inputCx} />
                    </Field>

                    <Field label="URL immagine principale">
                        <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className={inputCx} />
                        {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={e => ((e.target as HTMLImageElement).style.display = 'none')} />}
                    </Field>

                    <Field label="Breve descrizione (max 200 caratteri)" required>
                        <textarea required rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Una frase evocativa che introduce il locale…" className={`${inputCx} resize-none`} />
                    </Field>

                    <Field label="Storia completa" required>
                        <textarea required rows={8} value={form.full_story} onChange={e => set('full_story', e.target.value)} placeholder="Racconta la storia del locale. Usa paragrafi separati da una riga vuota…" className={`${inputCx} resize-none`} />
                    </Field>

                    <Field label="Sito Web (opzionale)">
                        <input value={form.social?.website ?? ''} onChange={e => set('social', { ...form.social, website: e.target.value })} placeholder="https://www.esempio.com" className={inputCx} />
                    </Field>

                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Instagram (opzionale)">
                            <input value={form.social?.instagram ?? ''} onChange={e => set('social', { ...form.social, instagram: e.target.value })} placeholder="https://instagram.com/..." className={inputCx} />
                        </Field>
                        <Field label="Facebook (opzionale)">
                            <input value={form.social?.facebook ?? ''} onChange={e => set('social', { ...form.social, facebook: e.target.value })} placeholder="https://facebook.com/..." className={inputCx} />
                        </Field>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer pt-1">
                        <input
                            type="checkbox"
                            checked={form.protected}
                            onChange={e => set('protected', e.target.checked)}
                            className="w-5 h-5 rounded accent-gold"
                        />
                        <span className="font-sans text-sm font-semibold text-anthracite">Patrimonio Protetto 🏛️</span>
                    </label>

                    <div className="flex gap-3 pt-4 border-t border-anthracite/10">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border border-anthracite/20 font-sans font-semibold text-anthracite hover:bg-anthracite/5 transition-colors text-sm">
                            Annulla
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-4 rounded-2xl bg-gold hover:bg-gold-dark text-cream font-sans font-bold text-sm shadow-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {saving && <div className="w-4 h-4 border-2 border-cream/50 border-t-cream rounded-full animate-spin" />}
                            {saving ? 'Salvataggio…' : initial ? 'Salva Modifiche' : 'Aggiungi Locale'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const inputCx = 'w-full px-4 py-3 rounded-xl border border-anthracite/15 font-sans text-sm text-anthracite bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all'

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-anthracite/60 uppercase tracking-wider">
                {label}{required && <span className="text-gold ml-1">*</span>}
            </label>
            {children}
        </div>
    )
}
