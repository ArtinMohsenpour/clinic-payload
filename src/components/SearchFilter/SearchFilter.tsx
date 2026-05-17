'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchFilterProps {
  basePath?: string
  placeholder?: string
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  basePath = '/blog',
  placeholder = 'جستجو در مقالات...',
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const initialSearch = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  // Sync state with URL when it changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`, { scroll: false })
    })
  }

  const handleClear = () => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    startTransition(() => {
      router.push(basePath, { scroll: false })
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchTerm)
            }
          }}
          placeholder={placeholder}
          className="w-full bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pr-12 pl-12 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
          dir="rtl"
        />

        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className={`w-5 h-5 ${isPending ? 'text-primary animate-pulse' : 'text-text-muted group-focus-within:text-primary'}`} />
        </div>

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => handleSearch(searchTerm)}
          disabled={isPending}
          className="bg-primary/20 hover:bg-primary/30 text-primary px-8 py-2.5 rounded-xl text-sm font-bold border border-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isPending ? 'در حال جستجو...' : 'جستجو'}
        </button>
      </div>
    </div>
  )
}
