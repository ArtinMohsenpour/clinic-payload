'use client'

import React from 'react'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { RichText } from '@/components/RichText/RichText'

interface ContentCardProps {
  title: string
  description?: any
  image?: Media | string | null
  href: string
  date?: string
  themeColor?: string
  buttonText?: string
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  image,
  href,
  date,
  themeColor = '#2563eb',
  buttonText = 'ادامه مطلب',
}) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  
  let imageUrl = null
  if (typeof image === 'string') {
    imageUrl = image.startsWith('http') ? image : `${serverUrl}${image}`
  } else if (image && typeof image === 'object' && image.url) {
    imageUrl = image.url.startsWith('http') ? image.url : `${serverUrl}${image.url}`
  }

  const imageAlt = (typeof image === 'object' && (image as Media)?.alt) || title

  return (
    <div
      className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      <Link href={href} className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-background flex items-center justify-center">
              <span className="text-text/20 text-sm">فاقد تصویر</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

          {/* Date Badge */}
          {date && (
            <div className="absolute top-4 right-4 z-10">
              <div className="py-1 px-3 rounded-md text-[11px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/10">
                {date}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-3 text-white transition-colors duration-300 group-hover:[color:var(--theme-color)] line-clamp-3">
            {title}
          </h3>

          {description && (
            <div className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-5 transition-colors duration-300 group-hover:text-text/90">
              <RichText content={description} className="!p-0 !m-0" />
            </div>
          )}

          {/* Bottom Action */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-sm font-medium text-white transition-colors duration-300 group-hover:[color:var(--theme-color)]">
              {buttonText} ←
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-border transition-all duration-300 group-hover:bg-[color:var(--theme-color)] group-hover:border-[color:var(--theme-color)] group-hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
