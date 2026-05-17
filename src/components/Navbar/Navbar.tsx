'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Media, Navbar as NavbarType } from '@/payload-types'

export const Navbar = ({ navbar }: { navbar: NavbarType }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const logo = navbar?.logo as Media
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const logoUrl = logo?.url ? (logo.url.startsWith('http') ? logo.url : `${serverUrl}${logo.url}`) : null

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`flex sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out py-5 ${
        scrolled ? 'bg-background/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container text-text flex items-center justify-between">
        {/* Navigation Items (Justified Right) */}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-12 list-none p-0 m-0">
            {navbar.navItems?.map((item) => {
              const { id, type } = item

              if (type === 'dropdown') {
                const isChildActive = item.dropdownItems?.some((dropdownItem) => {
                  const { link: subLink } = dropdownItem
                  const subHref = subLink.type === 'reference' ? `/${subLink.slug}` : subLink.url || '#'
                  return pathname === subHref
                })

                return (
                  <li key={id} className="relative group">
                    <button className={`text-base font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
                      isChildActive ? 'text-primary' : 'hover:text-secondary/80'
                    }`}>
                      {item.dropdownLabel}
                      <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 top-full pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                      <ul className="bg-card/95 backdrop-blur-md border border-border rounded-xl py-3 min-w-[200px] shadow-2xl list-none p-0 m-0 overflow-hidden">
                        {item.dropdownItems?.map((dropdownItem) => {
                          const { link: subLink, id: subId } = dropdownItem
                          const subHref =
                            subLink.type === 'reference' ? `/${subLink.slug}` : subLink.url || '#'
                          const isActive = pathname === subHref

                          return (
                            <li key={subId}>
                              <Link
                                href={subHref}
                                className={`block px-6 py-2.5 text-sm transition-colors duration-200 whitespace-nowrap text-right ${
                                  isActive 
                                    ? 'bg-primary text-white' 
                                    : 'hover:bg-primary hover:text-text'
                                }`}
                              >
                                {subLink.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </li>
                )
              }

              if (item.link) {
                const { link } = item
                const href = link.type === 'reference' ? `/${link.slug}` : link.url || '#'
                const isActive = pathname === href

                return (
                  <li key={id}>
                    <Link
                      href={href}
                      className={`text-base font-medium transition-colors duration-200 relative group ${
                        isActive ? 'text-primary' : 'hover:text-secondary/80'
                      }`}
                    >
                      {link.label}
                      <span className={`absolute -bottom-1 right-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </Link>
                  </li>
                )
              }

              return null
            })}
          </ul>
        </div>

        {/* Left side: Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center w-fit h-auto min-w-[120px] inline-block">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logo.alt || 'Logo'}
                width={logo.width || 180}
                height={logo.height || 60}
                className="object-contain h-12 w-auto transition-transform duration-300 hover:scale-105"
                style={{ width: 'auto', height: '48px', display: 'block' }}
                loading="eager"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tight">LOGO</span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(true)}
            className="text-text p-2 focus:outline-none hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer */}
        <div 
          className={`absolute top-0 right-0 h-full w-[300px] bg-card/98 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          dir="rtl"
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <span className="text-xl font-bold text-text">منوی اصلی</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-90"
              >
                <svg className="w-6 h-6 text-text/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {navbar.navItems?.map((item) => {
                  const { id, type } = item
                  const isDropdownOpen = openMobileDropdown === id

                  if (type === 'dropdown') {
                    const isChildActive = item.dropdownItems?.some((dropdownItem) => {
                      const { link: subLink } = dropdownItem
                      const subHref = subLink.type === 'reference' ? `/${subLink.slug}` : subLink.url || '#'
                      return pathname === subHref
                    })

                    return (
                      <li key={id} className="flex flex-col">
                        <button 
                          onClick={() => setOpenMobileDropdown(isDropdownOpen ? null : (id || null))}
                          className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 ${
                            isDropdownOpen || isChildActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-white/5'
                          }`}
                        >
                          <span className="text-lg font-bold">{item.dropdownLabel}</span>
                          <svg 
                            className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isDropdownOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="flex flex-col gap-1 list-none pr-4 mr-2 border-r-2 border-primary/20 m-0">
                            {item.dropdownItems?.map((dropdownItem) => {
                              const { link: subLink, id: subId } = dropdownItem
                              const subHref =
                                subLink.type === 'reference' ? `/${subLink.slug}` : subLink.url || '#'
                              const isActive = pathname === subHref

                              return (
                                <li key={subId}>
                                  <Link
                                    href={subHref}
                                    onClick={() => setIsOpen(false)}
                                    className={`block p-3 text-base rounded-lg transition-all ${
                                      isActive 
                                        ? 'text-primary bg-primary/5' 
                                        : 'text-text/70 hover:text-primary hover:bg-primary/5'
                                    }`}
                                  >
                                    {subLink.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </li>
                    )
                  }

                  if (item.link) {
                    const { link } = item
                    const href = link.type === 'reference' ? `/${link.slug}` : link.url || '#'
                    const isActive = pathname === href

                    return (
                      <li key={id}>
                        <Link
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={`block p-4 text-lg font-bold rounded-xl transition-all ${
                            isActive ? 'text-primary bg-primary/10' : 'text-text hover:text-primary hover:bg-white/5'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  }

                  return null
                })}
              </ul>
            </nav>
            
            {/* Optional Mobile Footer */}
            <div className="p-6 mt-auto border-t border-white/5">
              <p className="text-xs text-text/30 text-center">© ۲۰۲۶ عصر سلامت</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
