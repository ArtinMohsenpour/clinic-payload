'use client'

import React from 'react'
import type { Brand, Insurance } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { RichText } from '@/components/RichText/RichText'

interface InsuranceCardProps {
  insurance: Insurance
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ insurance }) => {
  const logo = insurance.logo as Brand
  const logoUrl = mediaUrl(logo, 'small')

  const themeColor = insurance.themeColor || '#2563eb'

  return (
    <div 
      className="group relative flex flex-col bg-card border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[color:var(--theme-color)]/20 hover:-translate-y-1 h-full"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[50px] opacity-8 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: 'var(--theme-color)' }}
      />

      <div className="p-8 flex flex-col h-full relative z-10">
        {/* Logo Container - Square & Centered */}
        <div className="flex justify-center mb-8">
          <div className="relative aspect-square w-32 md:w-40 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 shadow-xl group-hover:scale-105">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={insurance.title}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain transition-transform duration-500"
              />
            ) : (
              <div className="text-text/20 text-xs text-center">No Logo</div>
            )}

          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:[text-shadow:0_0_15px_var(--theme-color)]">
            {insurance.title}
          </h3>
          <div 
            className="w-12 h-1 mx-auto mt-2 rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:w-20"
            style={{ backgroundColor: 'var(--theme-color)' }}
          />
        </div>

        {/* Description */}
        {insurance.description && (
          <div className="text-text-muted text-sm text-center mb-6 leading-relaxed">
            {insurance.description}
          </div>
        )}

        {/* Coverage - RichText */}
        {insurance.coverage && (
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }} />
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider">پوشش‌های بیمه‌ای</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 transition-colors duration-500 group-hover:bg-white/[0.08] group-hover:border-white/10">
              <RichText 
                content={insurance.coverage} 
                className="!p-0 !m-0 text-sm text-white/80 [&_ul]:list-disc [&_ul]:pr-4 [&_li]:mb-1" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div 
        className="h-1 w-0 group-hover:w-full transition-all duration-700 ease-in-out"
        style={{ backgroundColor: 'var(--theme-color)' }}
      />
    </div>
  )
}
