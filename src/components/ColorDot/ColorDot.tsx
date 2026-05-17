'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react'
import type { SelectFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

export const ColorDot: SelectFieldClientComponent = (props) => {
  const { path, field } = props
  const { label, options, required, admin } = field
  const description = admin?.description

  const { value, setValue } = useField<string>({ path })
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Default color options to use when field is 'text' instead of 'select'
  const defaultOptions = useMemo(() => [
    { label: 'Primary (#2563eb)', value: '#2563eb' },
    { label: 'Secondary (#3b82f6)', value: '#3b82f6' },
    { label: 'Success (#10b981)', value: '#10b981' },
    { label: 'Error (#ef4444)', value: '#ef4444' },
    { label: 'Text (#ffffff)', value: '#ffffff' },
    { label: 'Text Muted (#9ca3af)', value: '#9ca3af' },
    { label: 'Background (#111827)', value: '#111827' },
    { label: 'Card (#1f2937)', value: '#1f2937' },
    { label: 'Border (#374151)', value: '#374151' },
  ], [])

  const effectiveOptions = options || defaultOptions

  const selectedOption = useMemo(() => {
    return effectiveOptions.find((opt: any) => (typeof opt === 'string' ? opt === value : opt.value === value))
  }, [effectiveOptions, value])

  const selectedColor = typeof selectedOption === 'object' ? selectedOption?.value : (value as string)
  const selectedLabel = typeof selectedOption === 'object' ? (typeof selectedOption?.label === 'string' ? selectedOption.label : JSON.stringify(selectedOption.label)) : (value as string)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderLabel = (label: any) => {
    if (typeof label === 'string') return label
    if (typeof label === 'object' && label !== null) {
      // In Payload, labels can be objects for localization (e.g. { en: 'Primary', fa: 'اصلی' })
      // For now we'll just show the first available string or fall back to JSON
      return Object.values(label)[0] as string || JSON.stringify(label)
    }
    return String(label)
  }

  return (
    <div className="field-type select" style={{ marginBottom: '20px' }} ref={containerRef}>
      <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        {typeof label === 'string' ? label : (typeof label === 'object' ? renderLabel(label) : '')}
        {required && <span className="required" style={{ color: 'var(--theme-error-500)', marginLeft: '4px' }}>*</span>}
      </label>

      <div style={{ position: 'relative' }}>
        {/* Selection Display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
            fontSize: '1rem',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          {selectedColor && (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: selectedColor,
                border: '1px solid var(--theme-elevation-300)',
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ flex: 1 }}>{selectedLabel ? renderLabel(selectedLabel) : 'Select a color...'}</span>
          <svg
            style={{
              width: '16px',
              height: '16px',
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--theme-elevation-500)',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Custom Dropdown Menu */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {effectiveOptions.map((opt: any) => {
              const val = typeof opt === 'string' ? opt : opt.value
              const lab = typeof opt === 'string' ? opt : opt.label
              const isSelected = val === value

              return (
                <div
                  key={val}
                  onClick={() => {
                    setValue(val)
                    setIsOpen(false)
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-100)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? 'var(--theme-elevation-200)' : 'transparent')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--theme-elevation-200)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: val,
                      border: '1px solid var(--theme-elevation-300)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.95rem', color: isSelected ? 'var(--theme-text)' : 'var(--theme-elevation-800)' }}>
                    {renderLabel(lab)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {description && (
        <div className="field-description" style={{ marginTop: '8px', color: 'var(--theme-elevation-500)', fontSize: '0.875rem' }}>
          {typeof description === 'string' ? description : ''}
        </div>
      )}
    </div>
  )
}
