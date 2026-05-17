'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  title?: string
  viewAllLink?: string
  viewAllText?: string
  variant?: 'collection' | 'highlight'
}

export function Carousel<T extends { id: string | number }>({
  items,
  renderItem,
  title,
  viewAllLink,
  viewAllText = 'همه موارد',
  variant = 'highlight',
}: CarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      // In RTL, scrollLeft is 0 when scrolled to the far right (start)
      // and negative when scrolled to the left.
      const isRTL = getComputedStyle(scrollRef.current).direction === 'rtl'

      if (isRTL) {
        setShowRightArrow(scrollLeft < 0)
        setShowLeftArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 1)
      } else {
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className="w-full py-6 md:px-0" dir="rtl">
      {title && (
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-xs md:text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
              >
                {viewAllText}
                <ChevronLeft className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden md:overflow-visible">
        {/* Navigation Arrows */}
        {showRightArrow && (
          <div
            className={`absolute right-4 xl:-right-14 ${variant === 'collection' ? '-top-11' : 'top-0'} bottom-0 flex items-center z-10 pointer-events-none`}
          >
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {showLeftArrow && (
          <div
            className={`absolute left-4  xl:-left-14 ${variant === 'collection' ? '-top-11' : 'top-0'} bottom-0 flex items-center z-10 pointer-events-none`}
          >
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 lg:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start flex-shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
