'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

export const ColorCell: React.FC<DefaultCellComponentProps> = (props) => {
  const { cellData } = props

  if (!cellData) return null

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}
    >
      <div 
        style={{ 
          width: '16px', 
          height: '16px', 
          borderRadius: '50%', 
          backgroundColor: cellData as string,
          border: '1px solid var(--theme-elevation-200)',
          flexShrink: 0
        }} 
      />
      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
        {cellData as string}
      </span>
    </div>
  )
}
