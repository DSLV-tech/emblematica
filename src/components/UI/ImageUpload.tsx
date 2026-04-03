'use client'

import { useRef, useState, useCallback } from 'react'
import { useImageUpload } from '@/hooks/useImageUpload'

interface ImageUploadProps {
  currentUrl?: string
  storagePath: string
  onUploaded: (url: string) => void
  label?: string
  aspectRatio?: 'video' | 'square' | 'wide'
}

const ASPECT: Record<string, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[3/1]',
}

export default function ImageUpload({
  currentUrl,
  storagePath,
  onUploaded,
  label,
  aspectRatio = 'video',
}: ImageUploadProps) {
  const { uploading, progress, error, upload } = useImageUpload()
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = preview || currentUrl

  const handleFile = useCallback(
    async (file: File) => {
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
      try {
        const downloadUrl = await upload(file, `${storagePath}_${Date.now()}`)
        onUploaded(downloadUrl)
      } catch {
        setPreview(null)
      }
    },
    [storagePath, upload, onUploaded]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block font-sans text-xs font-semibold text-anthracite/60 uppercase tracking-widest">
          {label}
        </span>
      )}

      <div
        className={`relative rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${ASPECT[aspectRatio]} ${
          dragging
            ? 'border-gold bg-gold/5'
            : displayUrl
            ? 'border-transparent'
            : 'border-dashed border-anthracite/20 bg-anthracite/3 hover:border-gold/50'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="preview"
              className="w-full h-full object-cover"
              onError={e => {
                const img = e.target as HTMLImageElement
                img.onerror = null
                img.style.display = 'none'
              }}
            />
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Cambia foto
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-anthracite/40">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="font-sans text-sm">Carica immagine</span>
            <span className="font-sans text-xs">JPG, PNG, WebP — max 5MB</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
            <div className="w-2/3 bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-xs font-semibold">{progress}%</span>
          </div>
        )}
      </div>

      {error && (
        <p className="font-sans text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
