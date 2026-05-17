import type { GroupField } from 'payload'
import { normalizeSlug, normalizeToLatin } from '../hooks/normalizeToLatin'

export const linkField = (overrides: Partial<GroupField> & { name: string }): GroupField => {
  const field: GroupField = {
    ...overrides,
    type: 'group',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'متن نمایش (Display Text)',
        required: true,
      },
      {
        name: 'type',
        type: 'select',
        label: 'نوع لینک (Link Type)',
        options: [
          { label: 'آدرس مستقیم (Custom URL)', value: 'customUrl' },
          { label: 'ارجاع داخلی (Internal Reference)', value: 'reference' },
        ],
        defaultValue: 'reference',
        required: true,
      },
      {
        name: 'url',
        type: 'text',
        label: 'آدرس اینترنتی (URL)',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'customUrl',
          className: 'field-ltr',
          placeholder: 'https://example.com',
        },
        hooks: {
          beforeChange: [normalizeToLatin],
        },
      },
      {
        name: 'slug',
        type: 'text',
        label: 'نامک (Slug)',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'reference',
          className: 'field-ltr',
          placeholder: 'page-slug',
        },
        hooks: {
          beforeChange: [normalizeSlug],
        },
      },
    ],
  }

  return field
}
