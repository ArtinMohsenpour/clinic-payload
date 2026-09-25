import React from 'react'
import Link from 'next/link'
import { getAllNews } from '@/lib/data/news'
import { SearchFilter } from '@/components/SearchFilter/SearchFilter'
import { lexicalToPlainText } from '@/lib/lexicalUtils'
import type { Media } from '@/payload-types'
import { CARD_VARIANTS, HERO_VARIANTS, mediaSrcSet, mediaUrl } from '@/lib/media'

export const metadata = {
  title: 'اخبار | عصر سلامت',
  description: 'آخرین اخبار و رویدادهای مراکز درمانی عصر سلامت',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ITEMS_PER_PAGE = 10

function buildPageUrl(page: number, searchTerm?: string) {
  const params = new URLSearchParams()
  if (searchTerm) params.set('search', searchTerm)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/news${qs ? `?${qs}` : ''}`
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const searchTerm = typeof params.search === 'string' ? params.search : undefined
  const currentPage = Math.max(1, parseInt((typeof params.page === 'string' ? params.page : '1'), 10) || 1)

  const allNews = await getAllNews(searchTerm)
  const totalPages = Math.max(1, Math.ceil(allNews.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const news = allNews.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col md:gap-12 pb-12" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4 py-4">
        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">اخبار عصر سلامت</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          آخرین <span className="text-primary">رویدادها</span>
        </h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-text-muted max-w-xl mx-auto text-base">
          از جدیدترین اخبار و رویدادهای مراکز درمانی عصر سلامت مطلع شوید.
        </p>
      </div>

      {/* Search */}
      <SearchFilter basePath="/news" placeholder="جستجو در اخبار..." />

      {/* News List */}
      {news.length > 0 ? (
        <div className="flex flex-col gap-5">
          {news.map((item, index) => {
            const thumbnail = item.thumbnail as Media
            const isFeatured = index === 0
            const imageUrl = mediaUrl(thumbnail, isFeatured ? 'hero' : 'card')
            const imageSrcSet = mediaSrcSet(thumbnail, isFeatured ? HERO_VARIANTS : CARD_VARIANTS)
            const excerpt = lexicalToPlainText(item.text).substring(0, 240)
            const href = `/news/${item.slug || item.id}`
            const themeColor = item.themeColor || '#2563eb'
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''

            /* ── Featured (first item) ─────────────────────────────── */
            if (index === 0) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group relative w-full rounded-2xl overflow-hidden block"
                  style={{ '--theme-color': themeColor } as React.CSSProperties}
                >
                  {/* Background image */}
                  <div className="relative h-[420px] md:h-[520px] w-full">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        srcSet={imageSrcSet}
                        sizes="100vw"
                        alt=""
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-card" />
                    )}
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10" />
                    {/* Colored top edge */}
                    <div
                      className="absolute top-0 inset-x-0 h-1"
                      style={{ backgroundColor: themeColor }}
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-8 md:p-12">
                    {/* Tags row */}
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm"
                        style={{
                          backgroundColor: `${themeColor}25`,
                          borderColor: `${themeColor}60`,
                          color: themeColor,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        />
                        ویژه
                      </span>
                      {formattedDate && (
                        <span className="text-white/50 text-xs">{formattedDate}</span>
                      )}
                    </div>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight line-clamp-2 mb-4 drop-shadow-lg group-hover:[color:var(--theme-color)] transition-colors duration-300">
                      {item.title}
                    </h2>

                    {excerpt && (
                      <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-2 max-w-3xl mb-6">
                        {excerpt}
                      </p>
                    )}

                    <span
                      className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl border transition-all duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: `${themeColor}20`,
                        borderColor: `${themeColor}60`,
                        color: themeColor,
                      }}
                    >
                      مشاهده خبر
                      <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            }

            /* ── Regular card ──────────────────────────────────────── */
            return (
              <Link
                key={item.id}
                href={href}
                className="group relative flex flex-col md:flex-row bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl"
                style={
                  {
                    '--theme-color': themeColor,
                    '--shadow-color': `${themeColor}18`,
                  } as React.CSSProperties
                }
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 inset-x-0 h-[3px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to left, ${themeColor}, transparent 70%)` }}
                />

                {/* Image */}
                <div className="relative md:w-[340px] lg:w-[400px] shrink-0">
                  <div className="aspect-video md:aspect-auto md:h-full" style={{ minHeight: '200px' }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        srcSet={imageSrcSet}
                        sizes="(max-width: 768px) 100vw, 400px"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-background/40 flex items-center justify-center">
                        <svg className="w-10 h-10 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* subtle right fade into content on desktop */}
                    <div className="absolute inset-0 bg-linear-to-l from-card/60 via-transparent to-transparent hidden md:block pointer-events-none" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-6 md:p-8 lg:p-10">
                  <div className="flex flex-col gap-4">
                    {/* Badge + date */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
                        style={{
                          backgroundColor: `${themeColor}15`,
                          borderColor: `${themeColor}35`,
                          color: themeColor,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                        خبر
                      </span>
                      {formattedDate && (
                        <span className="text-xs text-text-muted">{formattedDate}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl lg:text-[1.6rem] font-extrabold text-white leading-snug line-clamp-2 group-hover:[color:var(--theme-color)] transition-colors duration-300">
                      {item.title}
                    </h2>

                    {/* Excerpt */}
                    {excerpt && (
                      <p className="text-text-muted text-sm md:text-base leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/5">
                    <span
                      className="text-sm font-bold flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                      style={{ color: themeColor }}
                    >
                      مشاهده خبر
                      <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div
                      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-15deg]"
                      style={{ borderColor: `${themeColor}35`, backgroundColor: `${themeColor}10` }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: themeColor }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="py-24 text-center bg-card/30 rounded-2xl border border-dashed border-white/10">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-text-muted text-xl mb-2">
            {searchTerm
              ? `نتیجه‌ای برای «${searchTerm}» یافت نشد.`
              : 'در حال حاضر خبری منتشر نشده است.'}
          </p>
          {searchTerm && (
            <a href="/news" className="inline-block mt-4 text-primary hover:underline font-bold text-sm">
              نمایش همه اخبار
            </a>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4" aria-label="صفحه‌بندی">
          {/* Prev */}
          {safePage > 1 ? (
            <Link
              href={buildPageUrl(safePage - 1, searchTerm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-text-muted hover:text-white hover:border-primary/50 transition-all text-sm font-bold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              قبلی
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card/40 border border-border/40 text-text-muted/30 text-sm font-bold cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              قبلی
            </span>
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-text-muted/50 text-sm select-none">
                    ···
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildPageUrl(p as number, searchTerm)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold border transition-all ${
                      p === safePage
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-card border-border text-text-muted hover:text-white hover:border-primary/50'
                    }`}
                  >
                    {p}
                  </Link>
                ),
              )}
          </div>

          {/* Next */}
          {safePage < totalPages ? (
            <Link
              href={buildPageUrl(safePage + 1, searchTerm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-text-muted hover:text-white hover:border-primary/50 transition-all text-sm font-bold"
            >
              بعدی
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card/40 border border-border/40 text-text-muted/30 text-sm font-bold cursor-not-allowed">
              بعدی
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          )}
        </nav>
      )}
    </div>
  )
}
