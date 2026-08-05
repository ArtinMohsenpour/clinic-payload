import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'
import { normalizeSlug } from '../hooks/normalizeToLatin'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['_order', 'title', 'branch', 'themeColor', 'createdAt'],
    pagination: {
      defaultLimit: 100,
    },
  },
  defaultSort: '_order',
  labels: {
    singular: 'خبر (News)',
    plural: 'اخبار (News)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('news')],
    afterDelete: [logDelete('news')],
  },
  orderable: true,
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'نامک (Slug)',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'نامک برای آدرس صفحه (مثلا clinic-opening) — فقط حروف انگلیسی، اعداد و خط‌تیره',
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
      label: 'تصویر شاخص / هیرو (Thumbnail / Hero BG)',
      required: true,
      admin: {
        description: 'تصویر، گیف یا ویدیو برای پس‌زمینه هیرو در صفحه اصلی (Image, GIF, Video)',
      },
    },
    {
      name: 'text',
      type: 'richText',
      label: 'متن خبر (News Content)',
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
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      label: 'شعبه (Branch)',
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
  ],
  timestamps: true,
}
