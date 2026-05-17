import React from 'react'
import Link from 'next/link'
import type { Footer as FooterType, Media } from '@/payload-types'
import { RichText } from '../RichText/RichText'

export const Footer = ({ footer }: { footer: FooterType }) => {
  const logo = footer?.logo as Media
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const logoUrl = logo?.url ? (logo.url.startsWith('http') ? logo.url : `${serverUrl}${logo.url}`) : null

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 text-text" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 items-start">
          {/* Logo and About Column */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105 duration-300"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logo.alt || 'Logo'}
                  width={logo.width || 140}
                  height={logo.height || 54}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-3xl font-bold tracking-tight text-primary">عصر سلامت</span>
              )}
            </Link>
            <p className="text-text-muted text-base leading-relaxed max-w-xs">
              مرکز جامع دیالیز و درمانگاه عصر سلامت، با بهره‌گیری از کادری مجرب و تجهیزات پیشرفته،
              در خدمت مراجعین محترم است.
            </p>
          </div>

          {/* Dynamic Columns from Payload */}
          {footer.columns?.map((column, index) => (
            <div key={column.id || index} className="flex flex-col items-center text-center">
              <div className="flex flex-col gap-4 items-start text-start">
                {column.blocks?.map((block) => {
                  if (block.blockType === 'footerRichText') {
                    return (
                      <div key={block.id} className="text-text-muted text-base leading-loose">
                        <RichText content={block.content} />
                      </div>
                    )
                  }
                  if (block.blockType === 'footerLink') {
                    const { link } = block
                    const href = link.type === 'reference' ? `/${link.slug}` : link.url || '#'
                    return (
                      <Link
                        key={block.id}
                        href={href}
                        className="group relative text-text-muted hover:text-secondary/80 transition-all duration-300 text-base w-fit"
                      >
                        {link.label}
                        <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-text-muted">
          <p className="font-medium">
            <span className="font-[system-ui]"> © {new Date().getFullYear()} </span> مرکز جامع دیالیز عصر سلامت. تمامی حقوق محفوظ
            است.
          </p>
        </div>
      </div>
    </footer>
  )
}
