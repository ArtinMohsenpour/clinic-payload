'use client'
import React from 'react'
import { useAuth } from '@payloadcms/ui'

export default function WelcomeMessage() {
  const { user } = useAuth()
  
  if (!user) return null

  const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email

  return (
    <div className="custom-welcome-message">
      {displayName} عزیز، خوش آمدید
    </div>
  )
}
