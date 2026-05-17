import type { GlobalConfig } from 'payload'
import { adminCeoManagerEditorMedical, anyone } from '../access/hasRole'
import { normalizeToLatin } from '../hooks/normalizeToLatin'

const days = [
  { label: 'شنبه (Saturday)', name: 'saturday' },
  { label: 'یکشنبه (Sunday)', name: 'sunday' },
  { label: 'دوشنبه (Monday)', name: 'monday' },
  { label: 'سه‌شنبه (Tuesday)', name: 'tuesday' },
  { label: 'چهارشنبه (Wednesday)', name: 'wednesday' },
  { label: 'پنجشنبه (Thursday)', name: 'thursday' },
  { label: 'جمعه (Friday)', name: 'friday' },
]

export const OpeningHours: GlobalConfig = {
  slug: 'opening-hours',
  label: 'ساعات کاری (Opening Hours)',
  admin: {},
  access: {
    read: anyone,
    update: adminCeoManagerEditorMedical,
  },
  fields: [
    {
      name: 'weeklySchedule',
      type: 'group',
      label: 'برنامه هفتگی (Weekly Schedule)',
      fields: days.map((day) => ({
        name: day.name,
        type: 'group',
        label: day.label,
        fields: [
          {
            name: 'isOpen',
            type: 'checkbox',
            label: 'باز است (Is Open)',
            defaultValue: day.name !== 'friday', // Default: open except Friday (adjusting for Iranian weekend)
          },
          {
            name: 'openTime',
            type: 'text',
            label: 'ساعت باز شدن (Open Time)',
            defaultValue: '08:00',
            admin: {
              condition: (data, siblingData) => siblingData?.isOpen,
              placeholder: 'HH:mm',
              className: 'field-ltr',
            },
            hooks: {
              beforeChange: [normalizeToLatin],
            },
          },
          {
            name: 'closeTime',
            type: 'text',
            label: 'ساعت بسته شدن (Close Time)',
            defaultValue: '18:00',
            admin: {
              condition: (data, siblingData) => siblingData?.isOpen,
              placeholder: 'HH:mm',
              className: 'field-ltr',
            },
            hooks: {
              beforeChange: [normalizeToLatin],
            },
          },
        ],
      })),
    },
    {
      name: 'exceptions',
      type: 'array',
      label: 'مناسبت‌ها و تعطیلات خاص (Exceptions & Holidays)',
      admin: {
        components: {
          RowLabel: '/components/ExceptionRowLabel',
        },
      },
      labels: {
        singular: 'مورد خاص (Exception)',
        plural: 'موارد خاص (Exceptions)',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'تاریخ (Date)',
          required: true,
          admin: {
            components: {
              Field: '/components/PersianDatePicker',
            },
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'yyyy/MM/dd',
            },
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          label: 'تعطیل است (Is Closed)',
          defaultValue: true,
        },
        {
          name: 'openTime',
          type: 'text',
          label: 'ساعت باز شدن (Open Time)',
          admin: {
            condition: (data, siblingData) => !siblingData?.isClosed,
            placeholder: 'HH:mm',
            className: 'field-ltr',
          },
          hooks: {
            beforeChange: [normalizeToLatin],
          },
        },
        {
          name: 'closeTime',
          type: 'text',
          label: 'ساعت بسته شدن (Close Time)',
          admin: {
            condition: (data, siblingData) => !siblingData?.isClosed,
            placeholder: 'HH:mm',
            className: 'field-ltr',
          },
          hooks: {
            beforeChange: [normalizeToLatin],
          },
        },
        {
          name: 'reason',
          type: 'text',
          label: 'علت (Reason)',
          admin: {
            placeholder: 'مثلا عید نوروز',
          },
        },
      ],
    },
  ],
}
