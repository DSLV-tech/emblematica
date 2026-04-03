// Logo SVG component for Emblematica
// Uses the Gaudí trencadís medallion + typographic wordmark

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'full' | 'symbol' | 'wordmark'
    /** Override the color scheme for dark backgrounds */
    dark?: boolean
}

const SIZES = {
    sm: { symbol: 32, fontSize1: 13, fontSize2: 8 },
    md: { symbol: 48, fontSize1: 18, fontSize2: 11 },
    lg: { symbol: 80, fontSize1: 28, fontSize2: 16 },
    xl: { symbol: 140, fontSize1: 46, fontSize2: 26 },
}

export default function Logo({ size = 'md', variant = 'full', dark = false }: LogoProps) {
    const s = SIZES[size]
    const gold = '#B8860B'
    const terracotta = '#C4722A'
    const anthracite = dark ? '#F5F5DC' : '#333333'
    const goldLight = '#D4AF37'

    // Symbol-only: just the medallion
    if (variant === 'symbol') {
        return (
            <svg
                width={s.symbol}
                height={s.symbol}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Emblematica logo"
            >
                <MedallionPaths gold={gold} terracotta={terracotta} anthracite={anthracite} goldLight={goldLight} />
            </svg>
        )
    }

    // Wordmark only
    if (variant === 'wordmark') {
        return (
            <svg
                width={s.symbol * 3}
                height={s.symbol}
                viewBox="0 0 300 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Emblematica"
            >
                <WordmarkPaths anthracite={anthracite} gold={gold} fontSize1={s.fontSize1} fontSize2={s.fontSize2} cx={150} cy={30} />
            </svg>
        )
    }

    // Full: symbol above wordmark
    const symbolH = s.symbol
    const gap = size === 'xl' ? 16 : size === 'lg' ? 12 : 8
    const wordH = s.fontSize1 * 1.6 + s.fontSize2 * 1.8 + gap
    const totalH = symbolH + gap + wordH
    const totalW = Math.max(s.symbol, s.fontSize1 * 10)

    return (
        <svg
            width={totalW}
            height={totalH}
            viewBox={`0 0 ${totalW} ${totalH}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Emblematica"
        >
            {/* Medallion centered horizontally */}
            <g transform={`translate(${totalW / 2 - symbolH / 2}, 0)`}>
                <svg width={symbolH} height={symbolH} viewBox="0 0 100 100">
                    <MedallionPaths gold={gold} terracotta={terracotta} anthracite={anthracite} goldLight={goldLight} />
                </svg>
            </g>
            {/* Wordmark below */}
            <WordmarkPaths
                anthracite={anthracite}
                gold={gold}
                fontSize1={s.fontSize1}
                fontSize2={s.fontSize2}
                cx={totalW / 2}
                cy={symbolH + gap + s.fontSize1}
            />
        </svg>
    )
}

// ─── Medallion SVG paths ────────────────────────────────────────────────────
function MedallionPaths({ gold, terracotta, anthracite, goldLight }: { gold: string; terracotta: string; anthracite: string; goldLight: string }) {
    return (
        <>
            {/* Outer ring */}
            <circle cx="50" cy="50" r="47" fill={goldLight} opacity="0.15" />
            <circle cx="50" cy="50" r="47" fill="none" stroke={anthracite} strokeWidth="2" />

            {/* Trencadís mosaic segments — 8 sections */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={angle} transform={`rotate(${angle} 50 50)`}>
                    <path
                        d="M50 50 L50 8 A42 42 0 0 1 79 21 Z"
                        fill={i % 2 === 0 ? gold : terracotta}
                        opacity="0.75"
                        stroke={anthracite}
                        strokeWidth="0.8"
                    />
                    {/* Inner mosaic fragment */}
                    <path
                        d="M50 50 L55 20 A42 42 0 0 1 70 28 Z"
                        fill={i % 2 === 0 ? terracotta : gold}
                        opacity="0.5"
                        stroke={anthracite}
                        strokeWidth="0.5"
                    />
                </g>
            ))}

            {/* Star spikes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={`spike-${angle}`} transform={`rotate(${angle} 50 50)`}>
                    <polygon
                        points="50,4 46,18 54,18"
                        fill={anthracite}
                    />
                </g>
            ))}

            {/* Inner circle */}
            <circle cx="50" cy="50" r="22" fill="#FAFAF0" stroke={anthracite} strokeWidth="1.5" />

            {/* Art Nouveau inner ornament */}
            {[0, 90, 180, 270].map((angle) => (
                <g key={`curl-${angle}`} transform={`rotate(${angle} 50 50)`}>
                    <path
                        d="M50 30 C47 36 43 36 42 40 C41 44 44 44 44 48"
                        fill="none"
                        stroke={gold}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M50 30 C53 36 57 36 58 40 C59 44 56 44 56 48"
                        fill="none"
                        stroke={gold}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                </g>
            ))}

            {/* Central B monogram */}
            <circle cx="50" cy="50" r="11" fill={anthracite} />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="bold"
                fontSize="14"
                fill="#F5F5DC"
                letterSpacing="-0.5"
            >
                E
            </text>
        </>
    )
}

// ─── Wordmark SVG text ──────────────────────────────────────────────────────
function WordmarkPaths({ anthracite, gold, fontSize1, fontSize2, cx, cy }: {
    anthracite: string; gold: string
    fontSize1: number; fontSize2: number
    cx: number; cy: number
}) {
    const lineY = cy + fontSize1 * 0.35
    const lineW = fontSize1 * 3.8
    return (
        <>
            {/* BARNA */}
            <text
                x={cx}
                y={cy}
                textAnchor="middle"
                fontFamily="Georgia, 'Playfair Display', serif"
                fontWeight="700"
                fontSize={fontSize1}
                fill={anthracite}
                letterSpacing={fontSize1 * 0.12}
            >
                EMBLEMATICA
            </text>

            {/* Divider line */}
            <line
                x1={cx - lineW / 2}
                y1={lineY}
                x2={cx + lineW / 2}
                y2={lineY}
                stroke={gold}
                strokeWidth={fontSize2 * 0.15}
            />

            {/* Emblemàtica */}
            <text
                x={cx}
                y={lineY + fontSize2 * 1.6}
                textAnchor="middle"
                fontFamily="Georgia, 'Playfair Display', serif"
                fontStyle="italic"
                fontWeight="400"
                fontSize={fontSize2}
                fill={gold}
                letterSpacing={fontSize2 * 0.05}
            >
                Scopri · Preserva · Racconta
            </text>
        </>
    )
}
