'use client'

import React from 'react'
import Link from 'next/link'
import { Carousel } from '../Carousel/Carousel'
import type { Media } from '@/payload-types'
import { CARD_VARIANTS, mediaAlt, mediaSrcSet, mediaUrl } from '@/lib/media'
import { lexicalToPlainText } from '@/lib/lexicalUtils'
import { ArrowLeft, CalendarDays } from 'lucide-react'

interface HighlightCarouselProps {
  title: string
  items: any[]
  linkPrefix: string
  viewAllLink?: string
}

const EXCERPT_LENGTH = 160

/**
 * Short teaser for the card body.
 *
 * `blog` has no dedicated summary field, so the excerpt comes from the article
 * body. Trimming on a word boundary avoids cutting a Persian word in half; the
 * clamp is a character budget rather than a line count so the text is already
 * short before CSS clamps it.
 */
const toExcerpt = (item: any): string => {
  const raw = lexicalToPlainText(item.text).replace(/\s+/g, ' ').trim()
  if (!raw) return ''
  if (raw.length <= EXCERPT_LENGTH) return raw

  const cut = raw.slice(0, EXCERPT_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')

  return `${(lastSpace > EXCERPT_LENGTH * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

export const HighlightCarousel: React.FC<HighlightCarouselProps> = ({
  title,
  items,
  linkPrefix,
  viewAllLink,
}) => {
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
          const imageUrl = mediaUrl(image, 'card')
          const imageSrcSet = mediaSrcSet(image, CARD_VARIANTS)
          const excerpt = toExcerpt(item)
          const themeColor = item.themeColor || '#E91E63'

          return (
            <article
              className="group h-full w-[280px] sm:w-[320px] lg:w-[360px]"
              style={{ '--theme-color': themeColor } as React.CSSProperties}
            >
              {/*
                The whole card is one link: a single crawlable target per
                article, and the entire surface is clickable rather than just a
                button. Nothing inside may be an <a>.
              */}
              <Link
                href={`/${linkPrefix}/${item.slug || item.id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--theme-color)]"
              >
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-background">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      srcSet={imageSrcSet}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                      alt={mediaAlt(image, item.title)}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm text-text/20">فاقد تصویر</span>
                    </div>
                  )}

                  {/* Accent rule that sweeps in from the right (RTL start). */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-right scale-x-0 bg-[color:var(--theme-color)] transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted md:text-xs">
                    {item.createdAt && (
                      <time
                        dateTime={new Date(item.createdAt).toISOString()}
                        className="inline-flex items-center gap-1.5 leading-none"
                      >
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                      </time>
                    )}
                    {item.source && (
                      <span className="inline-flex items-center leading-none before:ms-3 before:me-3 before:text-text-muted/40 before:content-['·']">
                        {item.source}
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-text transition-colors duration-300 group-hover:[color:var(--theme-color)] md:text-lg">
                    {item.title}
                  </h3>

                  {excerpt && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-text-muted md:text-sm">
                      {excerpt}
                    </p>
                  )}

                  {/*
                    White rather than the article's themeColor. The colour is
                    editor-supplied, so it can land anywhere on the wheel — a
                    dark or low-saturation pick drops this label to single-digit
                    contrast on the card. White is legible whatever the editor
                    chooses; the theme colour still shows in the accent rule
                    under the image, where legibility is not at stake.
                  */}
                  <span className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-bold text-text md:text-sm">
                    مشاهده جزئیات
                    <ArrowLeft
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </article>
          )
        }}
      />
    </div>
  )
}
