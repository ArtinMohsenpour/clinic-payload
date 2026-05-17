import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getNewsBySlug } from '@/lib/data/news'
import { RichText } from '@/components/RichText/RichText'
import { ImageGallery } from '@/components/ImageGallery/ImageGallery'
import { lexicalToPlainText } from '@/lib/lexicalUtils'
import type { Media, User } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    return { title: 'خبر پیدا نشد' }
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const title = `${news.title} | عصر سلامت`
  const description =
    lexicalToPlainText(news.text).substring(0, 160) || `${news.title} - خبر از عصر سلامت`

  const thumbnail = news.thumbnail as Media
  const ogImageUrl = thumbnail?.url
    ? thumbnail.url.startsWith('http')
      ? thumbnail.url
      : `${serverUrl}${thumbnail.url}`
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${serverUrl}/news/${slug}`,
      siteName: 'عصر سلامت',
      locale: 'fa_IR',
      type: 'article',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    alternates: {
      canonical: `${serverUrl}/news/${slug}`,
    },
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const thumbnail = news.thumbnail as Media
  const imageUrl = thumbnail?.url
    ? thumbnail.url.startsWith('http')
      ? thumbnail.url
      : `${serverUrl}${thumbnail.url}`
    : null

  const author = news.author as User
  const authorProfileImage = author?.profileImage as Media
  const authorImageUrl = authorProfileImage?.url
    ? authorProfileImage.url.startsWith('http')
      ? authorProfileImage.url
      : `${serverUrl}${authorProfileImage.url}`
    : null

  const formattedDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <article
      className="pb-24 text-text"
      dir="rtl"
      style={{ '--theme-color': news.themeColor || '#2563eb' } as React.CSSProperties}
    >
      {/* Hero Section */}
      <header className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="py-1 px-4 rounded-full backdrop-blur-md border text-sm font-bold"
              style={{
                backgroundColor: `${news.themeColor || '#2563eb'}30`,
                borderColor: `${news.themeColor || '#2563eb'}50`,
                color: news.themeColor || '#2563eb',
              }}
            >
              خبر
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg text-white">
            {news.title}
          </h1>
          {formattedDate && (
            <p className="text-white/70 text-sm md:text-base">{formattedDate}</p>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-1 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-lg dark:prose-invert max-w-none bg-card/30 p-8 md:p-12 rounded-md border border-white/5 backdrop-blur-sm">
            <RichText content={news.text} />
          </section>

          {/* Gallery */}
          {news.gallery && news.gallery.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: news.themeColor || 'var(--primary)' }}
                />
                گالری تصاویر
              </h2>
              <ImageGallery
                images={news.gallery
                  .map((item) => {
                    const media = item.media as Media
                    return {
                      url: media?.url
                        ? media.url.startsWith('http')
                          ? media.url
                          : `${serverUrl}${media.url}`
                        : '',
                      alt: media?.alt || '',
                    }
                  })
                  .filter((img) => img.url !== '')}
              />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Author Card */}
          {author && (
            <div className="bg-card/30 border border-white/5 rounded-md p-8 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">
                اطلاعات نویسنده
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                  {authorImageUrl ? (
                    <img src={authorImageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-primary font-bold">
                      {author.fullName?.charAt(0) || 'A'}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {author.fullName || 'نویسنده عصر سلامت'}
                  </h4>
                  <p className="text-xs text-text-muted mt-1">
                    {author.role === 'admin' ? 'مدیر سیستم' : 'ویراستار محتوا'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">تاریخ انتشار:</span>
                  <span className="text-sm text-white/80 font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Back to News + Contact CTA */}
          <div
            className="p-8 rounded-md border border-white/5 bg-card/30 backdrop-blur-sm sticky top-24 space-y-6"
            style={{ borderColor: `${news.themeColor || 'var(--primary)'}80` }}
          >
            <Link
              href="/news"
              className="flex items-center gap-2 text-text-muted hover:text-white transition-colors font-bold text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              بازگشت به اخبار
            </Link>

            <div className="border-t border-white/5 pt-6">
              <h3 className="text-xl font-bold mb-4">سوالات بیشتری دارید؟</h3>
              <p className="mb-6 text-text/80 text-sm">
                اگر در مورد این خبر یا سایر خدمات ما سوالی دارید، کارشناسان ما آماده پاسخگویی به شما
                هستند.
              </p>
              <a
                href="/contact"
                className="block w-full text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 bg-[#2D3047] text-[#F7F7FF] shadow-lg"
              >
                دریافت مشاوره رایگان
              </a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
