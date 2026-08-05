import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'
import { seoFields } from '../fields/seo'

export const About: CollectionConfig = {
  slug: 'about',
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
    singular: 'درباره ما (About)',
    plural: 'درباره ما (About Sections)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('about')],
    afterDelete: [logDelete('about')],
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'عنوان (Title)',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'توضیحات (Description)',
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
      name: 'themeColor',
      type: 'text',
      label: 'رنگ تم (Theme Color)',
      admin: {
        components: {
          Field: '/components/ColorDot/ColorDot#ColorDot',
          Cell: '/components/ColorDot/ColorCell#ColorCell',
        },
      },
    },
    seoFields(),
  ],
  timestamps: true,
}
