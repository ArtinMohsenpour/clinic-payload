import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'
import { normalizeSlug } from '../hooks/normalizeToLatin'
import { seoFields } from '../fields/seo'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['_order', 'title', 'createdAt'],
    hidden: ({ user }) => !user,
    pagination: {
      defaultLimit: 100,
    },
  },
  defaultSort: '_order',
  labels: {
    singular: 'سرویس (Service)',
    plural: 'سرویس‌ها (Services)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('services')],
    afterDelete: [logDelete('services')],
  },
  orderable: true,
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'نامک (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'نامک برای آدرس صفحه (مثلا dialysis) — فقط حروف انگلیسی، اعداد و خط‌تیره',
        className: 'field-ltr',
      },
      hooks: {
        beforeChange: [normalizeSlug],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'پیش‌نمایش (Preview)',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'عنوان (Title)',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'تصویر (Image)',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'توضیحات کوتاه (Short Description)',
              required: true,
            },
            {
              name: 'themeColor',
              type: 'text',
              label: 'رنگ تم (Theme Color)',
              admin: {
                components: {
                  Field: '/components/ColorDot/ColorDot#ColorDot',
                  Cell: '/components/ColorDot/ColorCell#ColorCell',
                },
                description: 'یک رنگ را از لیست انتخاب کنید (Select a color from the list)',
              },
            },
          ],
        },
        {
          label: 'جزئیات (Detailed Info)',
          fields: [
            {
              name: 'detailedDescription',
              type: 'richText',
              label: 'توضیحات کامل (Detailed Description)',
            },
            {
              name: 'history',
              type: 'richText',
              label: 'تاریخچه (History)',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'گالری تصاویر (Image Gallery)',
              labels: {
                singular: 'رسانه (Media)',
                plural: 'رسانه‌ها (Media)',
              },
              fields: [
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'انتخاب یا آپلود رسانه (Select or Upload Media)',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'سئو (SEO)',
          fields: [seoFields()],
        },
      ],
    },
  ],
  timestamps: true,
}
