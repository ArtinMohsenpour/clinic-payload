import React from 'react'
import { getInsurances } from '@/lib/data/insurances'
import { InsuranceCard } from '@/components/InsuranceCard/InsuranceCard'

export const metadata = {
  title: 'بیمه‌های طرف قرارداد | عصر سلامت',
  description: 'لیست کامل بیمه‌های طرف قرارداد مرکز عصر سلامت',
}

export default async function InsurancesPage() {
  const insurances = await getInsurances()

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          بیمه‌های طرف قرارداد
        </h1>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          مرکز عصر سلامت با اکثر شرکت‌های بیمه پایه و تکمیلی جهت رفاه حال شما عزیزان قرارداد همکاری دارد.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {insurances.map((insurance) => (
          <InsuranceCard 
            key={insurance.id}
            insurance={insurance}
          />
        ))}
      </div>

      {/* Empty State */}
      {insurances.length === 0 && (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
          <p className="text-text-muted text-xl">در حال حاضر بیمه‌ای برای نمایش وجود ندارد.</p>
        </div>
      )}
    </div>
  )
}
