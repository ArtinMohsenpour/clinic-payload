import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-secondary text-center px-4">
      <h1 className="text-9xl font-bold mb-4">۴۰۴</h1>
      <h2 className="text-3xl mb-8">صفحه مورد نظر یافت نشد</h2>
      <p className="text-lg mb-8 max-w-md">متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.</p>
      <Link 
        href="/"
        className="bg-secondary text-primary px-8 py-3 rounded-lg hover:opacity-90 transition-all font-bold"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  )
}
