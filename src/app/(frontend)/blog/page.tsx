import React from 'react'
import { getBlogPosts } from '@/lib/data/blog'
import { ContentCard } from '@/components/ContentCard/ContentCard'
import { SearchFilter } from '@/components/SearchFilter/SearchFilter'
import type { Blog, Media } from '@/payload-types'

export const metadata = {
  title: 'مقالات و اخبار سلامت | عصر سلامت',
  description: 'آخرین مقالات، اخبار و دانستنی‌های حوزه سلامت و دیالیز',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const searchTerm = typeof params.search === 'string' ? params.search : undefined
  const posts = await getBlogPosts(searchTerm)

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Header Section */}
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          مقالات و <span className="text-primary">اخبار سلامت</span>
        </h1>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          دانش خود را در مورد سلامت، پیشگیری و درمان بیماری‌های کلیوی و دیالیز افزایش دهید.
        </p>
      </div>

      {/* Search Section */}
      <SearchFilter basePath="/blog" placeholder="جستجو در مقالات..." />

      {/* Articles Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const formattedDate = post.createdAt 
              ? new Date(post.createdAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : undefined

            return (
              <ContentCard 
                key={post.id}
                title={post.title}
                image={post.thumbnail as Media}
                href={`/blog/${post.slug || post.id}`}
                date={formattedDate}
                themeColor={post.themeColor || undefined}
              />
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-card rounded-2xl border border-dashed border-white/10">
          <p className="text-text-muted text-xl">
            {searchTerm 
              ? `نتیجه‌ای برای "${searchTerm}" یافت نشد.` 
              : 'در حال حاضر مقاله‌ای منتشر نشده است.'}
          </p>
          {searchTerm && (
            <a 
              href="/blog" 
              className="inline-block mt-4 text-primary hover:underline font-bold"
            >
              نمایش همه مقالات
            </a>
          )}
        </div>
      )}
    </div>
  )
}
