import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBranchBySlug } from '@/lib/data/branches'
import { getNewsByBranch } from '@/lib/data/news'
import { HeroSlider } from '@/components/HeroSlider/HeroSlider'
import { CollectionCarousel } from '@/components/CollectionCarousel/CollectionCarousel'
import { ImageGallery } from '@/components/ImageGallery/ImageGallery'
import { RichText } from '@/components/RichText/RichText'
import { lexicalToPlainText } from '@/lib/lexicalUtils'
import type { Media, Branch } from '@/payload-types'

import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const branch = await getBranchBySlug(slug)

  if (!branch) {
    return {
      title: 'شعبه پیدا نشد',
    }
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const siteName = 'عصر سلامت'

  const title = branch.seo?.metaTitle || `${branch.title} | ${siteName}`
  const description =
    branch.seo?.metaDescription ||
    lexicalToPlainText(branch.address?.text).substring(0, 160) ||
    `شعبه ${branch.title} مرکز جامع دیالیز و درمانگاه عصر سلامت`

  const ogImage = (branch.seo?.ogImage || branch.bgImage) as Media
  const ogImageUrl = ogImage?.url
    ? ogImage.url.startsWith('http')
      ? ogImage.url
      : `${serverUrl}${ogImage.url}`
    : undefined

  const keywords = branch.seo?.keywords?.map((k: any) => k.keyword) || []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: branch.seo?.ogTitle || title,
      description: branch.seo?.ogDescription || description,
      url: `${serverUrl}/branches/${slug}`,
      siteName,
      locale: 'fa_IR',
      type: 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    alternates: {
      canonical: `${serverUrl}/branches/${slug}`,
    },
    robots: branch.seo?.noIndex ? 'noindex' : 'index, follow',
  }
}

export default async function BranchPage({ params }: PageProps) {
  const { slug } = await params
  const branch = await getBranchBySlug(slug)

  if (!branch) {
    notFound()
  }

  const news = await getNewsByBranch(String(branch.id))
  
  // Format gallery images for ImageGallery component
  const galleryImages = (branch.gallery?.map((item) => item.media as Media) || [])
    .filter(media => !!media?.url)
    .map(media => ({
      url: media.url as string,
      alt: media.alt || ''
    }))

  const bgImage = branch.bgImage as Media
  const bgImageUrl = bgImage?.url
    ? bgImage.url.startsWith('http')
      ? bgImage.url
      : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${bgImage.url}`
    : null

  return (
    <div className="relative min-h-screen flex flex-col gap-10 md:gap-16 pb-12 text-text overflow-hidden">
      {/* Page Background Image */}
      {bgImageUrl && (
        <div className="absolute inset-0 -z-20 w-full h-full">
          <img
            src={bgImageUrl}
            alt=""
            className="w-full h-full object-cover fixed opacity-10"
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] fixed"></div>
        </div>
      )}

      {/* Hero Slider Section with Branch News */}
      {news.length > 0 && <HeroSlider news={news} />}

      {/* Introduction Section */}
      {branch.introduction && branch.introduction.title && (
        <section className="relative w-full min-h-[500px] md:min-h-[650px] flex items-end overflow-hidden">
          {branch.introduction.image && (
            <div className="absolute inset-0 z-0">
              <img
                src={typeof branch.introduction.image === 'string' ? branch.introduction.image : (branch.introduction.image as Media).url || ''}
                alt={branch.introduction.title || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent"></div>
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10 pb-20 pt-32" dir="rtl">
            <div className="max-w-3xl">
              {branch.introduction.subtitle && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold mb-4 backdrop-blur-md border border-primary/30">
                  {branch.introduction.subtitle}
                </span>
              )}
              {branch.introduction.title && (
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {branch.introduction.title}
                </h2>
              )}
              {branch.introduction.text && (
                <div className="text-white/90 text-lg md:text-xl leading-relaxed">
                  <RichText content={branch.introduction.text} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Branch Info Section */}
      <section className="container mx-auto px-4" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {branch.phones && branch.phones.length > 0 && (
              <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-md shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                <Phone className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                      <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">شماره‌های تماس</h3>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    {branch.phones.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={`tel:${item.number}`}
                        className="flex items-center justify-between p-3 md:p-4 rounded-md bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group/item"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-primary/70 font-bold mb-1">{item.label}</span>
                          <span className="text-lg md:text-xl font-medium text-white/90 group-hover/item:text-white transition-colors">
                            {item.number}
                          </span>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all">
                          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {branch.email && (
              <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-md shadow-2xl relative overflow-hidden group hover:border-secondary/30 transition-all duration-500">
                <Mail className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                      <Mail className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">پست الکترونیک</h3>
                  </div>
                  
                  <a 
                    href={`mailto:${branch.email}`}
                    className="flex items-center justify-between p-3 md:p-4 rounded-md bg-white/5 border border-white/5 hover:bg-secondary/10 hover:border-secondary/20 transition-all group/item"
                  >
                    <span className="text-base md:text-lg font-medium text-white/90 group-hover/item:text-white transition-colors truncate ml-2">
                      {branch.email}
                    </span>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-secondary group-hover/item:text-white transition-all shrink-0">
                      <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Address and Maps */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card/30 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-md shadow-xl">
              <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
                <span className="w-1.5 h-6 md:w-2 md:h-8 bg-primary rounded-full"></span>
                {branch.title}
              </h1>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-md shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
              <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">نشانی شعبه</h3>
                </div>
                
                <div className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-loose font-medium">
                  <RichText content={branch.address?.text} />
                </div>

                {branch.address?.googleMapsLink?.url && (
                  <a 
                    href={branch.address.googleMapsLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-md bg-primary text-white font-bold hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 text-sm md:text-base"
                  >
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span>مشاهده روی نقشه گوگل</span>
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel Section */}
      {branch.services && branch.services.length > 0 && (
        <CollectionCarousel
          title="سرویس‌های این شعبه"
          items={branch.services}
          linkPrefix="services"
        />
      )}

      {/* Image Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="container mx-auto px-4" dir="rtl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">گالری تصاویر شعبه</h2>
          <ImageGallery images={galleryImages} />
        </section>
      )}
    </div>
  )
}
