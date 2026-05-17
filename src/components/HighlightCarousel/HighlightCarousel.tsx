'use client'

import React from 'react'
import Link from 'next/link'
import { Carousel } from '../Carousel/Carousel'
import type { Media } from '@/payload-types'
import { RichText } from '@/components/RichText/RichText'
import { ArrowLeft } from 'lucide-react'

interface HighlightCarouselProps {
  title: string
  items: any[]
  linkPrefix: string
  viewAllLink?: string
}

export const HighlightCarousel: React.FC<HighlightCarouselProps> = ({ 
  title, 
  items, 
  linkPrefix,
  viewAllLink 
}) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <div className="w-full">
      <Carousel
        variant="highlight"
        title={title}
        items={items}
        viewAllLink={viewAllLink || `/${linkPrefix}`}
        viewAllText="بیشتر"
        renderItem={(item: any) => {
          const image = item.thumbnail as Media
          const imageUrl = image?.url
            ? image.url.startsWith('http')
              ? image.url
              : `${serverUrl}${image.url}`
            : null

          const themeColor = item.themeColor || '#E91E63'

          return (
            <div
              className="group relative w-[280px] md:w-[450px] lg:w-[540px] aspect-[16/10] rounded-xl overflow-hidden bg-[#1E2135] border border-white/5 transition-all duration-300 hover:border-white/20 shadow-xl"
              style={
                {
                  '--theme-color': themeColor,
                } as React.CSSProperties
              }
            >
              {/* Image with Dark Overlay */}
              <div className="absolute inset-0 z-0">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent opacity-90" />

                {/* Decorative background patterns (inspired by the design) */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 transition-opacity duration-500 group-hover:opacity-40">
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div
                    className="absolute bottom-10 left-10 w-32 h-32 rounded-full blur-3xl opacity-50"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8">
                {/* Bottom Section: Title, Description, and Button */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <h3 className="text-lg md:text-2xl max-w-fit lg:text-3xl font-bold text-white line-clamp-2 transition-colors group-hover:[text-shadow:0_0_15px_var(--theme-color)] bg-dark/20 backdrop-blur-[3px] bg-dark/20 rounded-lg px-2 -mx-2">
                      {item.title}
                    </h3>
                    {/* Meta Info: Date, Source, Author */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {item.createdAt && (
                        <p className="inline-flex items-center justify-center bg-black/20 backdrop-blur-md px-3 pt-[6px] rounded-full text-[10px] md:text-xs text-white border border-white/10 transition-colors hover:bg-white/20 leading-none">
                          {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      )}
                      {item.source && (
                        <p className="inline-flex items-center justify-center bg-black/20 backdrop-blur-md px-3 pt-[6px] rounded-full text-[10px] md:text-xs text-white border border-white/10 transition-colors hover:bg-white/20 leading-none">
                          {item.source}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <div className="text-white/80 text-xs md:text-sm line-clamp-2 mt-2 bg-dark/20 backdrop-blur-[2px] rounded-lg px-2 -mx-2 py-1">
                        <RichText content={item.description} className="!p-0 !m-0 !text-inherit" />
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/${linkPrefix}/${item.slug || item.id}`}
                    className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg bg-[color:var(--theme-color)] hover:brightness-110 active:scale-95 text-white text-[10px] md:text-sm font-bold w-fit mt-1 md:mt-2 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_var(--theme-color)]"
                  >
                    <span>مشاهده جزئیات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
