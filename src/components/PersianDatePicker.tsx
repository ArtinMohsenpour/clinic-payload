'use client'
import React, { useCallback } from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { useField } from '@payloadcms/ui'
import type { DateFieldClientComponent } from 'payload'

const PersianDatePicker: DateFieldClientComponent = (props) => {
  const { path, field } = props
  const { label, required } = field
  const { value, setValue } = useField<string | Date>({ path })

  const onChange = useCallback(
    (date: any) => {
      if (!date) {
        setValue(null)
        return
      }
      // Convert to standard JS Date to store in Payload (which uses UTC/ISO)
      const jsDate = date.toDate()
      setValue(jsDate)
    },
    [setValue],
  )

  return (
    <div className="field-type date">
      <label className="field-label">
        {typeof label === 'string' ? label : ''}
        {required && <span className="required">*</span>}
      </label>
      <div className="persian-datepicker-container" style={{ marginTop: '5px' }}>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={value ? new Date(value) : null}
          onChange={onChange}
          format="YYYY/MM/DD"
          calendarPosition="bottom-right"
          containerStyle={{
            width: '100%',
          }}
          inputClass="persian-datepicker-input"
          style={{
            width: '100%',
            height: '40px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
            backgroundColor: 'var(--theme-elevation-0)',
            color: 'var(--theme-text)',
            fontSize: '1rem',
          }}
        />
      </div>
    </div>
  )
}

export default PersianDatePicker
