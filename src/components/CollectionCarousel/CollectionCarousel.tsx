'use client'

import React from 'react'
import Link from 'next/link'
import { Carousel } from '../Carousel/Carousel'
import type { Service, Media } from '@/payload-types'
import { CARD_VARIANTS, mediaAlt, mediaSrcSet, mediaUrl } from '@/lib/media'
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
                    alt={mediaAlt(image, item.title)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/*
                  Scrim behind the title. Photographs vary wildly in brightness,
                  so the title cannot rely on the image alone for contrast; the
                  scrim deepens on hover so the zooming image never creeps up
                  behind the text.
                */}
                <div className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/65"></div>

                {/* Service name, centred over the image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 z-10">
                  {/*
                    The title stays white in every state. Tinting it with the
                    theme colour on hover dropped it to roughly 3:1 against the
                    darkened image — the accent is carried by a glow behind the
                    glyphs instead, which costs no legibility.
                  */}
                  <h3 className="text-white font-bold text-lg md:text-xl [text-shadow:0_2px_6px_rgba(0,0,0,0.95)] transition-[text-shadow] duration-300 group-hover:[text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_0_18px_var(--theme-color)]">
                    {item.title}
                  </h3>
                </div>
              </div>
              {/* Text Content Below */}
              <div className="mt-4 px-1 text-right">
                {/*
                  Bright at rest, not on hover. Text that only becomes readable
                  once you point at it is unreadable for anyone scanning the row,
                  and on touch there is no hover state at all.
                */}
                <div className="text-text text-xs md:text-sm mt-2 line-clamp-2">
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
