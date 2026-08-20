'use client'

import React from 'react'
import { Carousel } from '../Carousel/Carousel'
import type { Brand, Insurance } from '@/payload-types'
import { mediaUrl } from '@/lib/media'

interface LogoCarouselProps {
  title: string
  items: Insurance[]
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({ title, items }) => {

  return (
    <div className="w-full">
      <Carousel
        variant="collection"
        title={title}
        items={items.map(item => ({ ...item, id: item.id }))}
        viewAllLink="/insurances"
        viewAllText="مشاهده همه"
        renderItem={(item: Insurance) => {
          const logo = item.logo as Brand
          const imageUrl = mediaUrl(logo, 'small')

          return (
            <div className="flex flex-col items-center gap-3 w-[160px] md:w-[200px] group">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-6 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 shadow-lg">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>
              
              <div className="text-center">
                <h3 className="text-sm md:text-base font-medium text-white/80 group-hover:text-white transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
