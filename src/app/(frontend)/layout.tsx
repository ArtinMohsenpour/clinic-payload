import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import { getNavbar } from '@/lib/data/navbar'
import { getFooter } from '@/lib/data/footer'
import { getSiteSettings } from '@/lib/data/siteSettings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const s = settings as any

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const siteName = s?.siteName || 'عصر سلامت'
  const description = s?.defaultMetaDescription || 'مرکز جامع دیالیز و درمانگاه عصر سلامت'
  const keywords = s?.defaultKeywords?.map((k: any) => k.keyword) ?? []
  const ogImageUrl = s?.defaultOgImage?.url
    ? s.defaultOgImage.url.startsWith('http')
      ? s.defaultOgImage.url
      : `${siteUrl}${s.defaultOgImage.url}`
    : undefined

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      siteName,
      description,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: s?.twitterHandle || undefined,
    },
    verification: s?.googleVerification
      ? { google: s.googleVerification }
      : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const [navbar, footer, settings] = await Promise.all([
    getNavbar(),
    getFooter(),
    getSiteSettings(),
  ])

  const s = settings as any
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://asrsalamat.ir'
  const org = s?.organization

  const orgJsonLd = org?.name
    ? {
        '@context': 'https://schema.org',
        '@type': org.schemaType || 'MedicalClinic',
        name: org.name,
        ...(org.legalName && { legalName: org.legalName }),
        ...(org.description && { description: org.description }),
        ...(org.url && { url: org.url }),
        ...(org.telephone && { telephone: org.telephone }),
        ...(org.email && { email: org.email }),
        ...(org.foundingDate && { foundingDate: org.foundingDate }),
        ...(org.logo?.url && {
          logo: {
            '@type': 'ImageObject',
            url: org.logo.url.startsWith('http') ? org.logo.url : `${siteUrl}${org.logo.url}`,
          },
        }),
        ...(org.address?.streetAddress && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: org.address.streetAddress,
            addressLocality: org.address.addressLocality,
            addressRegion: org.address.addressRegion,
            postalCode: org.address.postalCode,
            addressCountry: org.address.addressCountry || 'IR',
          },
        }),
        ...(org.sameAs?.length && {
          sameAs: org.sameAs.map((item: any) => item.url),
        }),
      }
    : null

  return (
    <html lang="fa" dir="rtl" className="antialiased">
      <head>
        {orgJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        )}
      </head>
      <body className="font-sans bg-background text-text">
        <Navbar navbar={navbar} />
        <main className="container pt-2 min-h-screen">{children}</main>
        <Footer footer={footer} />
      </body>
    </html>
  )
}
