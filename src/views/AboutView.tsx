'use client'

import Logo from '../components/UI/Logo'

interface AboutViewProps {
    onClose: () => void
}

const TIMELINE = [
    { year: '1997', event: 'Els Quatre Gats', desc: 'Il leggendario café modernista che ha ispirato questo progetto — luogo di incontro degli artisti catalani.' },
    { year: '2003', event: 'Prima catalogazione', desc: 'Il Comune di Barcellona avvia il censimento dei Locals Emblemàtics per tutelarne la memoria storica.' },
    { year: '2015', event: 'Rischio di scomparsa', desc: 'La pressione del turismo di massa e l\'aumento degli affitti minacciano decine di locali storici.' },
    { year: '2024', event: 'Nasce Emblematica', desc: 'Un progetto digitale per rendere accessibile il patrimonio commerciale e culturale di Barcellona a tutti.' },
]

const VALUES = [
    { icon: '🏛️', title: 'Memoria', desc: 'Ogni locale è un frammento di storia viva. Documentarla è un atto di rispetto verso chi ha costruito Barcellona.' },
    { icon: '🗺️', title: 'Accessibilità', desc: 'Il patrimonio culturale appartiene a tutti. La tecnologia può avvicinare le persone alla storia del territorio.' },
    { icon: '🤝', title: 'Comunità', desc: 'Residenti, turisti consapevoli e appassionati di cultura collaborano per mantenere viva la città autentica.' },
    { icon: '🌱', title: 'Sostenibilità', desc: 'Favorire il turismo culturale e di qualità rispetto al turismo di massa che erode l\'identità dei quartieri.' },
]

export default function AboutView({ onClose }: AboutViewProps) {
    return (
        <div className="fixed inset-0 z-[3500] bg-cream overflow-hidden flex flex-col animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-anthracite/10 bg-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="text-xl">ℹ️</span>
                </div>
                <div className="flex-1">
                    <h1 className="font-serif text-xl font-bold text-anthracite">Chi siamo</h1>
                    <p className="font-sans text-xs text-anthracite/50">Il progetto Emblematica</p>
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

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-6 py-10 space-y-14">

                    {/* Hero */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <Logo variant="full" size="lg" />
                        </div>
                        <p className="font-sans text-base text-anthracite/70 leading-relaxed max-w-md mx-auto">
                            Una mappa interattiva per scoprire, esplorare e preservare il patrimonio storico e commerciale di Barcellona — un locale alla volta.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-px bg-gold" />
                            <span className="font-sans text-xs text-gold font-bold tracking-[0.2em] uppercase">Barcellona</span>
                            <div className="w-12 h-px bg-gold" />
                        </div>
                    </div>

                    {/* Mission */}
                    <div
                        className="rounded-3xl p-8 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #B8860B 0%, transparent 60%)' }}
                        />
                        <p className="font-sans text-xs font-bold text-gold/70 uppercase tracking-[0.3em] mb-3 relative">La nostra missione</p>
                        <blockquote className="font-serif text-2xl text-cream leading-relaxed relative">
                            "Ogni bottega storica è un museo a cielo aperto. Vogliamo assicurarci che nessuno passi davanti senza accorgersene."
                        </blockquote>
                        <p className="font-sans text-sm text-cream/50 mt-4 relative">— Emblematica</p>
                    </div>

                    {/* Values */}
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-anthracite mb-6">I nostri valori</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {VALUES.map(v => (
                                <div key={v.title} className="bg-white rounded-3xl p-6 border border-anthracite/5 shadow-sm">
                                    <div className="text-3xl mb-3">{v.icon}</div>
                                    <h3 className="font-serif text-lg font-bold text-anthracite mb-1">{v.title}</h3>
                                    <p className="font-sans text-sm text-anthracite/60 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-anthracite mb-8">La nostra storia</h2>
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gold/20" />
                            <div className="space-y-8">
                                {TIMELINE.map((item, i) => (
                                    <div key={i} className="flex gap-6 pl-2">
                                        {/* Dot */}
                                        <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gold flex items-center justify-center z-10 shadow-[0_0_0_4px_#F5F5DC]">
                                            <span className="font-sans text-[9px] font-bold text-cream leading-none text-center">{item.year}</span>
                                        </div>
                                        {/* Content */}
                                        <div className="pt-1.5 pb-4">
                                            <h3 className="font-serif text-base font-bold text-anthracite">{item.event}</h3>
                                            <p className="font-sans text-sm text-anthracite/60 leading-relaxed mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* What we offer */}
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-anthracite mb-6">Cosa offriamo</h2>
                        <div className="bg-white rounded-3xl border border-anthracite/5 shadow-sm divide-y divide-anthracite/5">
                            {[
                                { icon: '🗺️', title: 'Mappa interattiva', desc: 'Esplora Barcellona con marker personalizzati per ogni categoria di locale storico.' },
                                { icon: '📖', title: 'Storie complete', desc: 'Per ogni locale, una narrazione dettagliata con contesto storico e curiosità.' },
                                { icon: '🧭', title: 'Navigazione in-app', desc: 'Indicazioni stradali a piedi direttamente nella app, senza uscire.' },
                                { icon: '⭐', title: 'Preferiti', desc: 'Salva i luoghi che ti hanno colpito di più per ritrovarli facilmente.' },
                                { icon: '🤖', title: 'AI Storica', desc: 'Curiosità generate da intelligenza artificiale su ogni locale.' },
                            ].map(f => (
                                <div key={f.title} className="flex items-start gap-4 px-6 py-5">
                                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                                    <div>
                                        <p className="font-serif text-sm font-bold text-anthracite">{f.title}</p>
                                        <p className="font-sans text-xs text-anthracite/55 mt-0.5 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="rounded-3xl border-2 border-gold/30 p-8 text-center bg-gold/5">
                        <h2 className="font-serif text-2xl font-bold text-anthracite mb-2">Collabora con noi</h2>
                        <p className="font-sans text-sm text-anthracite/60 leading-relaxed mb-6 max-w-xs mx-auto">
                            Hai informazioni su un locale storico? Vuoi segnalarci un errore o suggerire un posto? Scrivici.
                        </p>
                        <a
                            href="mailto:info@barnaemblematica.com"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-anthracite hover:bg-anthracite/80 text-cream font-sans font-bold text-sm transition-colors shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            info@barnaemblematica.com
                        </a>
                    </div>

                    {/* Legal footnote */}
                    <p className="text-center font-sans text-[11px] text-anthracite/30 leading-relaxed pb-4">
                        © {new Date().getFullYear()} Emblematica. Tutti i diritti riservati.<br />
                        Contenuti storici a scopo informativo e culturale. Non affiliato al Comune di Barcellona.
                    </p>

                </div>
            </div>
        </div>
    )
}
