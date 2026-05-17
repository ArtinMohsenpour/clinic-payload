import React from 'react'
import { getContactData } from '@/lib/data/contact'
import { RichText } from '@/components/RichText/RichText'
import { Phone, Mail, MapPin, ExternalLink, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'تماس با ما | عصر سلامت',
  description: 'راه‌های ارتباطی با مرکز درمانی عصر سلامت',
}

export default async function ContactPage() {
  const contact = await getContactData()

  return (
    <div className="pb-24 pt-4 md:pt-10" dir="rtl">
      {/* Hero / Header Section */}
      <div className="relative mb-12 md:mb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight">
            {contact.pageTitle}
          </h1>
          <div className="w-16 md:w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          {contact.subtitle && (
            <p className="text-text-muted text-lg md:text-2xl font-medium px-4">
              {contact.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-md shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
             {/* Decorative Background Icon */}
            <Phone className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <Phone className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">شماره‌های تماس</h3>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {contact.phoneNumbers?.map((item) => (
                  <a 
                    key={item.id} 
                    href={`tel:${item.number}`}
                    className="flex items-center justify-between p-3 md:p-4 rounded-md bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group/item"
                  >
                    <span className="text-lg md:text-xl font-medium text-white/90 group-hover/item:text-white transition-colors">
                      {item.number}
                    </span>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all">
                      <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-md shadow-2xl relative overflow-hidden group hover:border-secondary/30 transition-all duration-500">
            <Mail className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">پست الکترونیک</h3>
              </div>
              
              <a 
                href={`mailto:${contact.emailAddress}`}
                className="flex items-center justify-between p-3 md:p-4 rounded-md bg-white/5 border border-white/5 hover:bg-secondary/10 hover:border-secondary/20 transition-all group/item"
              >
                <span className="text-base md:text-lg font-medium text-white/90 group-hover/item:text-white transition-colors truncate ml-2">
                  {contact.emailAddress}
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-secondary group-hover/item:text-white transition-all shrink-0">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Address and Description */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-card/30 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-md shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 md:w-2 md:h-8 bg-primary rounded-full"></span>
              درباره ارتباط با ما
            </h3>
            <div className="text-text-muted text-base md:text-lg leading-relaxed">
              {contact.description && <RichText content={contact.description as any} />}
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-md shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">نشانی مرکز</h3>
              </div>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-loose font-medium">
                {contact.address}
              </p>

              {contact.googleMapsLink?.url && (
                <a 
                  href={contact.googleMapsLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-md bg-primary text-white font-bold hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 text-sm md:text-base"
                >
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  <span>مشاهده روی نقشه گوگل</span>
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media / Quick Contact Placeholder */}
      <div className="mt-12 md:mt-20 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 md:p-8 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm mx-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
             </div>
             <span className="text-white/80 font-medium text-sm md:text-base">پاسخگویی در واتس‌اپ</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          <p className="text-text-muted text-sm md:text-base">شنبه تا پنجشنبه: ۸ صبح الی ۸ شب</p>
        </div>
      </div>
    </div>
  )
}
