'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

interface BlogPost {
    id: string
    title: string
    content: string
    image_url?: string
    published: boolean
    createdAt?: any
}

interface BlogViewProps {
    onClose: () => void
}

export default function BlogView({ onClose }: BlogViewProps) {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<BlogPost | null>(null)

    useEffect(() => {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs
                .map(d => ({ id: d.id, ...d.data() } as BlogPost))
                .filter(p => p.published)
            setPosts(data)
            setLoading(false)
        }, () => {
            setLoading(false)
        })
        return unsub
    }, [])

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                {selected ? (
                    <button
                        onClick={() => setSelected(null)}
                        className="w-9 h-9 rounded-full bg-anthracite/5 hover:bg-anthracite/10 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-anthracite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                        <span className="text-xl">📰</span>
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">
                        {selected ? selected.title : 'Blog & News'}
                    </h1>
                    {!selected && <p className="font-sans text-xs text-anthracite/50">Storie, scoperte e notizie da Barcellona</p>}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {selected ? (
                    // ── Article detail ──
                    <article className="max-w-2xl mx-auto px-6 py-8">
                        {selected.image_url && (
                            <img
                                src={selected.image_url}
                                alt={selected.title}
                                className="w-full h-56 object-cover rounded-3xl mb-8 shadow-lg"
                            />
                        )}
                        <div className="prose prose-sm max-w-none">
                            {selected.content.split('\n\n').map((para, i) => (
                                <p key={i} className="font-sans text-base text-anthracite/80 leading-relaxed mb-5">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </article>
                ) : loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    // ── Empty state ──
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                            <span className="text-4xl">✍️</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-anthracite mb-2">Nessun articolo ancora</h2>
                        <p className="font-sans text-sm text-anthracite/50 max-w-xs">
                            Gli amministratori potranno pubblicare articoli dalla Dashboard Admin.
                        </p>
                    </div>
                ) : (
                    // ── Post list ──
                    <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
                        {posts.map(post => (
                            <button
                                key={post.id}
                                onClick={() => setSelected(post)}
                                className="w-full text-left bg-white rounded-3xl shadow-sm border border-anthracite/5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group"
                            >
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="p-5">
                                    <h2 className="font-serif text-lg font-bold text-anthracite mb-1 group-hover:text-gold transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="font-sans text-sm text-anthracite/60 leading-relaxed line-clamp-2">
                                        {post.content.split('\n')[0]}
                                    </p>
                                    <span className="inline-flex items-center gap-1 mt-3 font-sans text-xs font-semibold text-gold">
                                        Leggi tutto
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
