import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'
import { normalizeSlug } from '../hooks/normalizeToLatin'
import { seoFields } from '../fields/seo'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'createdAt'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
    pagination: {
      defaultLimit: 100,
    },
  },
  defaultSort: '-createdAt',
  labels: {
    singular: 'مقاله (Article)',
    plural: 'مقالات (Articles)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('blog')],
    afterDelete: [logDelete('blog')],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'نامک (Slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'نامک برای آدرس صفحه (مثلا diet-tips) — فقط حروف انگلیسی، اعداد و خط‌تیره',
        className: 'field-ltr',
      },
      hooks: {
        beforeChange: [normalizeSlug],
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'عنوان (Title)',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر شاخص (Thumbnail)',
      required: true,
      admin: {
        description: 'تصویر برای پس‌زمینه هیرو در صفحه جزئیات مقاله (Image for article hero)',
      },
    },
    {
      name: 'text',
      type: 'richText',
      label: 'متن مقاله (Article Content)',
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
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'نویسنده (Author)',
      hasMany: false,
      defaultValue: ({ req: { user } }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'منبع (Source)',
    },
    seoFields(),
  ],
  timestamps: true,
}
