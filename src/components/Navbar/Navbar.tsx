'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Brand, Navbar as NavbarType } from '@/payload-types'
import { mediaUrl } from '@/lib/media'

export const Navbar = ({ navbar }: { navbar: NavbarType }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const logo = navbar?.logo as Brand
  const logoUrl = mediaUrl(logo, 'small')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={`flex sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out py-5 ${
          scrolled ? 'bg-background/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container text-text flex items-center justify-between relative">
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

          {/*
            Company name, centred on mobile only.

            Absolutely centred against the nav rather than placed as a flex
            item: the logo (89px) and the toggle (50px) are different widths, so
            a flex-distributed element would sit ~20px off true centre. Capped
            at 40% of the bar and clipped so a longer name can never collide
            with either end, and `pointer-events-none` keeps it from swallowing
            taps meant for the logo or the menu button. It is plain text, not a
            second link to "/", which would duplicate the logo's target — but it
            is NOT aria-hidden: the logo's alt text is the asset's own alt (e.g.
            "main-logo"), not the clinic's name, so this is the only place a
            screen reader hears it.
          */}
          <span
            className="lg:hidden pointer-events-none absolute left-1/2 -translate-x-1/2 max-w-[40%] truncate text-center text-lg font-bold tracking-tight text-text"
          >
            عصر سلامت
          </span>

          {/* Left side: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              {/*
                Desktop wordmark, part of the same home link as the logo so the
                pair reads as one brand lockup rather than two targets. It comes
                FIRST in DOM order because the row is RTL: the first flex item
                sits at the right, which places the name to the right of the
                logo — outward into the free space, not off the left edge. On
                mobile it is hidden and the centred span in the bar takes over.
              */}
              <span className="hidden lg:inline whitespace-nowrap text-xl font-bold tracking-tight text-text">
                عصر سلامت
              </span>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logo.alt || 'Logo'}
                  width={logo.width || 180}
                  height={logo.height || 60}
                  /*
                    The height stays definite. `w-auto` on a replaced element
                    inside a shrink-to-fit flex parent collapses to 0 unless one
                    axis is pinned, so swapping the height for `max-h-*` makes
                    the logo vanish entirely.

                    `max-w` then caps how far it can reach toward the centred
                    clinic name: 28vw tracks small screens (90px at 320, 105px
                    at 375) and the 116px ceiling covers larger phones. When the
                    cap bites, `object-contain` scales the artwork down inside
                    the box — the leftover space is vertical, so the logo still
                    sits flush against the left edge. Desktop is uncapped.
                  */
                  className="object-contain h-12 w-auto max-w-[min(116px,28vw)] lg:max-w-none transition-transform duration-300 hover:scale-105"
                  style={{ width: 'auto', height: '48px', display: 'block' }}
                  loading="eager"
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight">LOGO</span>
              )}
            </Link>
          </div>

          {/*
            Mobile menu toggle. `order-first` puts it at the RTL start — the
            right edge — leaving the logo at the left. Ordering only, so the DOM
            keeps logo-before-toggle for screen readers and keyboard order.
          */}
          <div className="lg:hidden order-first">
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
      </header>

      {/*
        Mobile menu overlay — deliberately a SIBLING of <header>, not a child.

        Once scrolled, the header gets `backdrop-blur-md`, and an element with a
        backdrop-filter becomes the containing block for its `position: fixed`
        descendants. Nested inside, this overlay resolved `inset-0` against the
        header instead of the viewport: it collapsed to header height (96px on a
        375x812 screen) so only the drawer's title bar rendered and the page
        showed through underneath. Reloading appeared to "fix" it only because
        that returns to scrollY 0, where the header has no backdrop-filter.
      */}
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
          className={`absolute top-0 right-0 h-full w-[300px] bg-card border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out ${
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
    </>
  )
}
