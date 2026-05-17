import React from 'react'
import { getServices } from '@/lib/data/services'
import { ContentCard } from '@/components/ContentCard/ContentCard'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'خدمات ما | عصر سلامت',
  description: 'لیست کامل خدمات درمانی و کلینیکی مرکز عصر سلامت',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          خدمات درمانی ما
        </h1>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          ما در مرکز عصر سلامت با بهره‌گیری از تکنولوژی‌های روز دنیا و کادر مجرب، طیف وسیعی از خدمات تخصصی را به شما عزیزان ارائه می‌دهیم.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ContentCard 
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.image as Media}
            href={`/services/${service.slug || service.id}`}
            themeColor={service.themeColor || undefined}
            buttonText="مشاهده جزئیات"
          />
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
          <p className="text-text-muted text-xl">در حال حاضر خدماتی برای نمایش وجود ندارد.</p>
        </div>
      )}
    </div>
  )
}
