import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTeamMembers } from '@/lib/data/team'
import type { Media, Branch, User } from '@/payload-types'

export const metadata: Metadata = {
  title: 'تیم ما',
  description: 'با متخصصان و کادر درمانی مجرب مرکز جامع دیالیز و درمانگاه عصر سلامت آشنا شوید.',
}

export default async function TeamPage() {
  const members = await getTeamMembers()

  return (
    <div className="flex flex-col gap-10 pb-16">
      <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">تیم متخصص ما</h1>
        <p className="text-text/70">
          ما در عصر سلامت افتخار همکاری با تیمی از مجرب‌ترین متخصصان و کادر درمانی را داریم که همواره برای ارائه بهترین خدمات به شما تلاش می‌کنند.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}

function TeamMemberCard({ member }: { member: User }) {
  const profileImage = member.profileImage as Media
  const branch = member.branch as Branch
  
  // Role labels in Persian
  const roleLabels: Record<string, string> = {
    admin: 'مدیر سیستم',
    ceo: 'مدیر عامل',
    nurse: 'پرستار',
    doctor: 'پزشک',
    'content-editor': 'ویراستار محتوا',
    manager: 'مدیر',
    accountant: 'حسابدار',
    'stock-clerk': 'انباردار',
  }

  const roleLabel = roleLabels[member.role] || member.role

  return (
    <div className="group relative aspect-square overflow-hidden bg-muted">
      {profileImage?.url ? (
        <Image
          src={profileImage.url}
          alt={member.fullName || ''}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-text/20">
          <svg
            className="w-1/3 h-1/3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white lg:inset-0 lg:bg-primary/80 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end lg:justify-center lg:text-center lg:translate-y-4 lg:group-hover:translate-y-0">
        <h3 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">{member.fullName}</h3>
        <div className="hidden lg:block w-10 h-0.5 bg-white/50 mb-3" />
        <p className="text-white/90 text-sm lg:text-base font-medium mb-1">{roleLabel}</p>
        {branch?.title && (
          <p className="text-white/80 text-xs lg:text-sm">
             {branch.title}
          </p>
        )}
      </div>
    </div>
  )
}
