'use client'

import React from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  defaultSnap?: 'peek' | 'half' | 'full'
  previewContent?: React.ReactNode
  showCloseButton?: boolean
  children: React.ReactNode
}

export default function BottomSheet({
  isOpen,
  onClose,
  previewContent,
  showCloseButton,
  children,
}: BottomSheetProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="fixed inset-0 z-[20] bg-black/10 md:hidden"
        onClick={onClose}
      />

      {/* Sheet — bottom sheet on mobile, floating card on desktop */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[25] rounded-t-3xl overflow-hidden animate-slide-up md:bottom-6 md:left-6 md:right-auto md:w-[380px] md:rounded-3xl"
        style={{
          background: 'linear-gradient(180deg, #2A2A2C 0%, #1C1C1E 100%)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Close button — desktop only */}
        {showCloseButton && (
          <div className="hidden md:flex justify-end px-4 pt-3">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-white/20 transition-colors"
              aria-label="Chiudi"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          {previewContent ?? children}
        </div>
      </div>
    </>
  )
}
