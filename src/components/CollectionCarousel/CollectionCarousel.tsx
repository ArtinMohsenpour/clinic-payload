'use client'

import React from 'react'
import Link from 'next/link'
import { Carousel } from '../Carousel/Carousel'
import type { Service, Media } from '@/payload-types'
import { CARD_VARIANTS, mediaSrcSet, mediaUrl } from '@/lib/media'
import { RichText } from '@/components/RichText/RichText'

interface CollectionCarouselProps {
  title: string
  items: any[]
  linkPrefix: string
}

export const CollectionCarousel: React.FC<CollectionCarouselProps> = ({ title, items, linkPrefix }) => {

  return (
    <div className="w-full ">
      <Carousel
        variant="collection"
        title={title}
        items={items}
        viewAllLink={`/${linkPrefix}`}
        viewAllText="مشاهده همه"
        renderItem={(item: any) => {
          const image = (item.image || item.thumbnail) as Media
          const imageUrl = mediaUrl(image, 'card')
          const imageSrcSet = mediaSrcSet(image, CARD_VARIANTS)

          return (
            <Link
              href={`/${linkPrefix}/${item.slug || item.id}`}
              className="block w-[280px] md:w-[300px] lg:w-[320px] group transition-all duration-300"
              style={
                {
                  '--theme-color': item.themeColor || '#2563eb',
                } as React.CSSProperties
              }
            >
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#1e232e] transition-all duration-300 group-hover:border-white/20">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    srcSet={imageSrcSet}
                    sizes="(max-width: 768px) 280px, 320px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Default Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300"></div>

                {/* Content Overlay (Date/Location placeholder as in image) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10">
                  <div 
                    className="text-white font-bold text-lg md:text-xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{ color: 'inherit' }}
                  >
                    <span className="group-hover:[color:var(--theme-color)] group-hover:[text-shadow:0_0_10px_var(--theme-color)] transition-all duration-300">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
              {/* Text Content Below */}
              <div className="mt-4 px-1 text-right">
                <div className="text-white/50 text-xs md:text-sm mt-2 line-clamp-2 transition-colors duration-300 group-hover:[color:var(--theme-color)]">
                  <RichText content={item.description || item.text} disableLinks={true} />
                </div>
              </div>
            </Link>
          )
        }}
      />
    </div>
  )
}
