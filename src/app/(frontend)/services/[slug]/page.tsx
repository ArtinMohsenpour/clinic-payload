import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServiceBySlug } from '@/lib/data/services'
import { RichText } from '@/components/RichText/RichText'
import { ImageGallery } from '@/components/ImageGallery/ImageGallery'
import { lexicalToPlainText } from '@/lib/lexicalUtils'
import type { Media } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'سرویس پیدا نشد',
    }
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const siteName = 'عصر سلامت'

  const title = service.seo?.metaTitle || `${service.title} | ${siteName}`
  const description =
    service.seo?.metaDescription ||
    lexicalToPlainText(service.description).substring(0, 160) ||
    `خدمات ${service.title} در مرکز جامع دیالیز و درمانگاه عصر سلامت`

  const ogImage = (service.seo?.ogImage || service.image) as Media
  const ogImageUrl = ogImage?.url
    ? ogImage.url.startsWith('http')
      ? ogImage.url
      : `${serverUrl}${ogImage.url}`
    : undefined

  const keywords = service.seo?.keywords?.map((k: any) => k.keyword) || []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: service.seo?.ogTitle || title,
      description: service.seo?.ogDescription || description,
      url: `${serverUrl}/services/${slug}`,
      siteName,
      locale: 'fa_IR',
      type: 'article',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    alternates: {
      canonical: `${serverUrl}/services/${slug}`,
    },
    robots: service.seo?.noIndex ? 'noindex' : 'index, follow',
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return notFound()
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const mainImage = service.image as Media
  const mainImageUrl = mainImage?.url
    ? mainImage.url.startsWith('http')
      ? mainImage.url
      : `${serverUrl}${mainImage.url}`
    : null

  return (
    <article className="pb-24 text-text" dir="rtl">
      {/* Hero Section */}
      <header className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {mainImageUrl && (
          <img
            src={mainImageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div 
          className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent"
          style={{ '--theme-color': service.themeColor || 'var(--primary)' } as React.CSSProperties}
        />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {service.title}
          </h1>
          <div className="max-w-2xl text-lg md:text-xl text-text/90 leading-relaxed drop-shadow-md">
            <RichText content={service.description} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {service.detailedDescription && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 rounded-full" style={{ backgroundColor: service.themeColor || 'var(--primary)' }} />
                توضیحات خدمات
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <RichText content={service.detailedDescription} />
              </div>
            </section>
          )}

          {service.history && (
            <section className="bg-card p-8 rounded-md border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">تاریخچه ما در این بخش</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <RichText content={service.history} />
              </div>
            </section>
          )}

          {service.gallery && service.gallery.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">گالری تصاویر</h2>
              <ImageGallery 
                images={service.gallery.map(item => {
                  const media = item.media as Media
                  return {
                    url: media?.url
                      ? media.url.startsWith('http')
                        ? media.url
                        : `${serverUrl}${media.url}`
                      : '',
                    alt: media?.alt || ''
                  }
                }).filter(img => img.url !== '')}
              />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div 
            className="p-8 rounded-md border-2 sticky top-24"
            style={{ borderColor: service.themeColor || 'var(--primary)' }}
          >
            <h3 className="text-xl font-bold mb-6">نیاز به مشاوره دارید؟</h3>
            <p className="mb-8 text-text/80">
              کارشناسان ما در بخش {service.title} آماده پاسخگویی به سوالات شما هستند.
            </p>
            <a
              href="/contact"
              className="block w-full text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: service.themeColor || 'var(--primary)',
                color: 'white'
              }}
            >
              تماس با ما
            </a>
          </div>
        </aside>
      </div>
    </article>
  )
}
