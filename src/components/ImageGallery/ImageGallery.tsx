'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface ImageGalleryProps {
  images: {
    url: string
    alt?: string
  }[]
  gridClassName?: string
}

export function ImageGallery({ images, gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-6" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null)
      if (e.key === 'ArrowRight') handlePrev()
      if (e.key === 'ArrowLeft') handleNext()
    }

    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length)
    }
  }

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <>
      <div className={gridClassName}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-video rounded-md overflow-hidden group shadow-lg border border-white/10 cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-60"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex(null)
            }}
          >
            <X size={32} />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div className="hidden md:block">
              <button 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-60 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
              >
                <ChevronLeft size={40} />
              </button>
              <button 
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-60 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
              >
                <ChevronRight size={40} />
              </button>
            </div>
          )}

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-screen-xl px-4 flex flex-col items-center justify-center gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex].url}
              alt=""
              className="max-w-full max-h-[70vh] md:max-h-[92vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
            />
            
            {/* Mobile Navigation Arrows */}
            {images.length > 1 && (
              <div className="flex items-center gap-12 md:hidden">
                <button 
                  className="text-white/70 hover:text-white transition-colors p-3 bg-white/5 rounded-full border border-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                >
                  <ChevronRight size={32} />
                </button>
                <button 
                  className="text-white/70 hover:text-white transition-colors p-3 bg-white/5 rounded-full border border-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                >
                  <ChevronLeft size={32} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
