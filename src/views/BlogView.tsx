'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ArrowRight, Newspaper, PencilSimpleLine } from '@phosphor-icons/react'
import ViewHeader from '../components/UI/ViewHeader'
import { useLanguage } from '../context/LanguageContext'

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
    const { t } = useLanguage()

    useEffect(() => {
        // Le regole Firestore rifiutano una lista senza il filtro su `published`
        const q = query(collection(db, 'blog'), where('published', '==', true), orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)))
            setLoading(false)
        }, () => {
            setLoading(false)
        })
        return unsub
    }, [])

    return (
        <div className="fixed inset-0 md:inset-8 z-[3500] paper overflow-hidden flex flex-col animate-fade-in md:rounded-3xl md:shadow-2xl">
            <ViewHeader
                icon={Newspaper}
                title={selected ? selected.title : t('blog.title')}
                subtitle={selected ? undefined : t('blog.subtitle')}
                onClose={onClose}
                onBack={selected ? () => setSelected(null) : undefined}
            />

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
                            <PencilSimpleLine size={36} className="text-gold-dark" />
                        </div>
                        <h2 className="font-serif text-2xl font-semibold text-anthracite mb-2">{t('blog.empty')}</h2>
                        <p className="font-sans text-sm text-anthracite/55 max-w-xs">
                            {t('blog.empty_body')}
                        </p>
                    </div>
                ) : (
                    // ── Post list ──
                    <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
                        {posts.map(post => (
                            <button
                                key={post.id}
                                onClick={() => setSelected(post)}
                                className="w-full text-left card-raised rounded-3xl overflow-hidden card-raised--press group"
                            >
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="p-5">
                                    <h2 className="font-serif text-lg font-semibold text-anthracite mb-1 group-hover:text-gold-dark transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="font-sans text-sm text-anthracite/60 leading-relaxed line-clamp-2">
                                        {post.content.split('\n')[0]}
                                    </p>
                                    <span className="inline-flex items-center gap-1 mt-3 font-sans text-xs font-semibold text-gold-dark">
                                        {t('blog.read_more')}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
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
