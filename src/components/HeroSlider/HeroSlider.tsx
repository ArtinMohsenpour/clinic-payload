'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { News, Media } from '@/payload-types'
import { RichText } from '../RichText/RichText'

interface HeroSliderProps {
  news: News[]
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ news }) => {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      prev()
    } else if (isRightSwipe) {
      next()
    }
  }

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % news.length)
  }, [news.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + news.length) % news.length)
  }, [news.length])

  useEffect(() => {
    if (isPaused || news.length <= 1) return
    const timer = setInterval(next, 10000)
    return () => clearInterval(timer)
  }, [next, isPaused, news.length])

  if (!news || news.length === 0) return null

  return (
    <section 
      className="relative w-full h-auto md:h-[600px] overflow-hidden rounded-md bg-card border border-border group transition-all duration-700 ease-in-out"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      dir="rtl"
      style={
        news[current]?.themeColor 
          ? { boxShadow: `-5px 30px 60px -35px ${news[current].themeColor}50` }
          : {}
      }
    >
      {/* Slides */}
      <div className="relative w-full h-full min-h-[500px] md:min-h-0">
        {news.map((item, index) => {
          const thumbnail = item.thumbnail as Media
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
          const imageUrl = thumbnail?.url 
            ? (thumbnail.url.startsWith('http') ? thumbnail.url : `${serverUrl}${thumbnail.url}`)
            : null

          return (
            <div
              key={item.id}
              className={`flex flex-col md:block absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                index === current ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-10 pointer-events-none absolute'
              }`}
            >
              {/* Image Container */}
              {imageUrl && (
                <div className="relative md:absolute md:inset-0 z-0 w-full aspect-video md:aspect-auto md:h-full">
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradient - Hidden on mobile, visible on desktop */}
                  <div className="hidden md:block absolute inset-0 bg-linear-to-l from-black/80 via-black/20 to-transparent"></div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-right p-6 md:pr-32 md:pl-12 md:w-1/2 md:h-full">
                <h2 className="text-xl md:text-3xl font-bold mb-4 text-white leading-tight px-4 md:px-0">
                  {item.title}
                </h2>
                
                <div className="text-white/90 text-sm mb-6 line-clamp-4 leading-relaxed px-4 md:px-0">
                  <RichText content={item.text} />
                </div>

                <Link
                  href={`/news/${item.slug || item.id}`}
                  className="px-6 py-1.5  mb-4 rounded-xl font-bold transition-all duration-300 w-fit border-2 hover:scale-105 hover:shadow-lg active:scale-95 bg-[color-mix(in_srgb,var(--theme-color),transparent_80%)] hover:bg-[var(--theme-color)]"
                  style={{
                    '--theme-color': item.themeColor || 'white',
                    borderColor: item.themeColor || 'white',
                    color: 'white',
                  } as React.CSSProperties}
                >
                  مشاهده خبر
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {news.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-4 top-1/2 md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-text hover:bg-background/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute left-4 top-1/2 md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-text hover:bg-background/40 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {news.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                index === current ? 'bg-text w-6 md:w-8' : 'bg-text/30 hover:bg-text/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
