import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'

export const Insurances: CollectionConfig = {
  slug: 'insurances',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['_order', 'title', 'createdAt'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
    pagination: {
      defaultLimit: 100,
    },
  },
  defaultSort: '_order',
  labels: {
    singular: 'بیمه (Insurance)',
    plural: 'بیمه‌ها (Insurances)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('insurances')],
    afterDelete: [logDelete('insurances')],
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'نام (Name/Title)',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیحات (Description)',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'لوگو (Logo)',
      required: true,
    },
    {
      name: 'coverage',
      type: 'richText',
      label: 'پوشش‌ها (Coverage)',
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
  timestamps: true,
}
