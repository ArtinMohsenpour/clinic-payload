import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { getHeroNews } from '@/lib/data/news'
import { getServices } from '@/lib/data/services'
import { getBlogPosts } from '@/lib/data/blog'
import { getInsurances } from '@/lib/data/insurances'
import { getAboutSections } from '@/lib/data/about'
import { getSiteSettings } from '@/lib/data/siteSettings'
import { HeroSlider } from '@/components/HeroSlider/HeroSlider'
import { CollectionCarousel } from '@/components/CollectionCarousel/CollectionCarousel'
import { HighlightCarousel } from '@/components/HighlightCarousel/HighlightCarousel'
import { LogoCarousel } from '@/components/LogoCarousel/LogoCarousel'
import { AboutSection } from '@/components/AboutSection/AboutSection'
import type { Service, Media } from '@/payload-types'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, aboutSections] = await Promise.all([
    getSiteSettings(),
    getAboutSections(),
  ])

  const s = settings as any
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const siteName = s?.siteName || 'عصر سلامت'

  // Aggregate keywords from about sections + site defaults
  const sectionKeywords = aboutSections.flatMap(
    (sec: any) => sec.seo?.keywords?.map((k: any) => k.keyword) ?? [],
  )
  const globalKeywords = s?.defaultKeywords?.map((k: any) => k.keyword) ?? []
  const allKeywords = [...new Set([...globalKeywords, ...sectionKeywords])]

  const ogImageUrl = s?.defaultOgImage?.url
    ? s.defaultOgImage.url.startsWith('http')
      ? s.defaultOgImage.url
      : `${siteUrl}${s.defaultOgImage.url}`
    : undefined

  return {
    title: siteName,
    description: s?.defaultMetaDescription || 'مرکز جامع دیالیز و درمانگاه عصر سلامت',
    keywords: allKeywords,
    openGraph: {
      title: siteName,
      description: s?.defaultMetaDescription || 'مرکز جامع دیالیز و درمانگاه عصر سلامت',
      url: siteUrl,
      type: 'website',
      locale: 'fa_IR',
      siteName,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }]
        : [],
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const [news, services, posts, insurances, aboutSections, settings] = await Promise.all([
    getHeroNews(),
    getServices(),
    getBlogPosts(),
    getInsurances(),
    getAboutSections(),
    getSiteSettings(),
  ])

  const s = settings as any
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const org = s?.organization
  const aboutSeo = s?.aboutSection

  // AboutPage structured data for the "Who We Are" section
  const aboutPageJsonLd = aboutSections.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: aboutSeo?.heading || 'ما که هستیم؟',
        description: aboutSeo?.metaDescription || org?.description || '',
        url: `${siteUrl}/#${aboutSeo?.anchorId || 'who-we-are'}`,
        ...(org?.name && {
          about: {
            '@type': org.schemaType || 'MedicalClinic',
            name: org.name,
            ...(org.description && { description: org.description }),
            ...(org.url && { url: org.url }),
          },
        }),
        mainEntity: aboutSections.map((sec: any) => ({
          '@type': 'WebPageElement',
          name: sec.title,
          ...(sec.seo?.metaDescription && { description: sec.seo.metaDescription }),
          ...(sec.seo?.anchorId && { url: `${siteUrl}/#${sec.seo.anchorId}` }),
        })),
      }
    : null

  return (
    <>
      {aboutPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
        />
      )}
      <div className="flex flex-col gap-10 md:gap-16 pb-12 text-text">
        {/* Hero Slider Section */}
        <HeroSlider news={news} />

        {/* Services Carousel Section */}
        <CollectionCarousel
          title="خدمات ما"
          items={services}
          linkPrefix="services"
        />

        {/* Blog Articles Highlight Carousel */}
        <HighlightCarousel
          title="آخرین مقالات"
          items={posts}
          linkPrefix="blog"
        />

        {/* Insurances Logo Carousel */}
        <LogoCarousel
          title="بیمه‌های طرف قرارداد"
          items={insurances}
        />

        {/* About Sections Zigzag */}
        <AboutSection
          sections={aboutSections}
          sectionAnchorId={aboutSeo?.anchorId || 'who-we-are'}
          sectionHeading={aboutSeo?.heading || 'ما که هستیم؟'}
        />
      </div>
    </>
  )
}
