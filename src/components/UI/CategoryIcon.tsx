'use client'

import { renderToStaticMarkup } from 'react-dom/server'
import { BookOpenText, Coffee, ForkKnife, MapPin, Pill, Storefront, type Icon, type IconWeight } from '@phosphor-icons/react'
import type { Category } from '../../types'

const ICONS: Record<Category, Icon> = {
  bar:        Coffee,
  restaurant: ForkKnife,
  bookshop:   BookOpenText,
  pharmacy:   Pill,
  shop:       Storefront,
}

interface CategoryIconProps {
  category: string
  size?: number
  weight?: IconWeight
  className?: string
}

/** Icona Phosphor della categoria, con ripiego su un segnaposto */
export default function CategoryIcon({ category, size = 16, weight, className }: CategoryIconProps) {
  const Glyph = ICONS[category as Category] ?? MapPin
  return <Glyph size={size} weight={weight} className={className} aria-hidden />
}

/** Icona come stringa SVG, per i marker Leaflet (divIcon accetta solo HTML) */
export function iconMarkup(Glyph: Icon, size: number, color: string, weight: IconWeight = 'regular'): string {
  return renderToStaticMarkup(<Glyph size={size} weight={weight} color={color} />)
}

export function categoryIconMarkup(category: string, size: number, color: string): string {
  return iconMarkup(ICONS[category as Category] ?? MapPin, size, color)
}
