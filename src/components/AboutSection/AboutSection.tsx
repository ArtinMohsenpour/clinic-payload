import React from 'react'
import { RichText } from '@/components/RichText/RichText'
import type { About, Media } from '@/payload-types'
import { CARD_VARIANTS, mediaSrcSet, mediaUrl } from '@/lib/media'

interface AboutSectionProps {
  sections: About[]
  sectionAnchorId?: string
  sectionHeading?: string
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  sections,
  sectionAnchorId = 'who-we-are',
  sectionHeading = 'ما که هستیم؟',
}) => {
  if (!sections || sections.length === 0) return null

  return (
    <section
      id={sectionAnchorId}
      aria-label={sectionHeading}
      className="relative py-24 overflow-hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-4 mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          {sectionHeading}
        </h2>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-32">
          {sections.map((section, index) => {
            const isEven = index % 2 === 0
            const isLast = index === sections.length - 1
            const image = section.image as Media
            const imageUrl = mediaUrl(image, 'card')
            const imageSrcSet = mediaSrcSet(image, CARD_VARIANTS)

            const themeColor = section.themeColor || (isEven ? '#2563eb' : '#e91e63')
            const seo = (section as any).seo
            const anchorId = seo?.anchorId || undefined

            return (
              <div
                key={section.id}
                id={anchorId}
                className="relative lg:pb-24 lg:mb-36"
              >
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/4 relative group z-10">
                    <div
                      className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-sm mx-auto">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          srcSet={imageSrcSet}
                          sizes="(max-width: 1024px) 100vw, 384px"
                          alt={seo?.metaDescription || section.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-2/3 space-y-4 text-right px-0 lg:px-8">
                    <div className="inline-flex items-center gap-3">
                      <div
                        className="w-12 h-1 rounded-full"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      <span
                        className="text-sm font-bold tracking-widest uppercase"
                        style={{ color: themeColor }}
                      >
                        بخش {index + 1}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                      {section.title}
                    </h3>

                    <div className="text-text-muted text-base leading-relaxed max-w-3xl">
                      <RichText content={section.description as any} />
                    </div>

                    <div
                      className="w-16 h-1 rounded-full opacity-30"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                  </div>
                </div>

                {/* Connector Line (Dashed) */}
                {!isLast && (
                  <div className="absolute top-[85%] left-0 w-full h-40 pointer-events-none z-0 hidden lg:block">
                    <svg
                      className="w-full h-full overflow-visible"
                      viewBox="0 0 1000 160"
                      preserveAspectRatio="none"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <marker
                          id={`arrowhead-${index}`}
                          markerWidth="12"
                          markerHeight="12"
                          refX="6"
                          refY="-4"
                          orient="360"
                        >
                          <path d="M2,2 L6,10 L10,2" stroke={themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
                        </marker>
                      </defs>
                      {isEven ? (
                        /* Image is on the LEFT (index 0, 2, ...) */
                        <path
                          d="M 166 0 C 166 80, 833 80, 833 150"
                          stroke={themeColor}
                          strokeWidth="2.5"
                          strokeDasharray="8 8"
                          className="opacity-20"
                          markerEnd={`url(#arrowhead-${index})`}
                        />
                      ) : (
                        /* Image is on the RIGHT (index 1, 3, ...) */
                        <path
                          d="M 833 0 C 833 80, 166 80, 166 150"
                          stroke={themeColor}
                          strokeWidth="2.5"
                          strokeDasharray="8 8"
                          className="opacity-20"
                          markerEnd={`url(#arrowhead-${index})`}
                        />
                      )}
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
