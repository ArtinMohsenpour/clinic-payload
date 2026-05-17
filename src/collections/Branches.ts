import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { linkField } from '../fields/link'
import { logChange, logDelete } from '../hooks/logAudit'
import { normalizeSlug, normalizeToLatin } from '../hooks/normalizeToLatin'
import { seoFields } from '../fields/seo'

export const Branches: CollectionConfig = {
  slug: 'branches',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'createdAt'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
  },
  labels: {
    singular: 'شعبه (Branch)',
    plural: 'شعب (Branches)',
  },
  access: {
    create: adminCeoManagerEditor,
    read: anyone,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    afterChange: [logChange('branches')],
    afterDelete: [logDelete('branches')],
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
        description: 'فقط حروف انگلیسی، اعداد و خط‌تیره (مثلا tabriz-branch)',
        className: 'field-ltr',
      },
      hooks: {
        beforeChange: [normalizeSlug],
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'عنوان شعبه (Branch Title)',
      required: true,
    },
    {
      name: 'bgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر پس‌زمینه (Background Image)',
      admin: {
        description: 'تصویر برای پس‌زمینه هیرو یا لیست شعب (Image for hero or branches list background)',
      },
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      label: 'شهر (City)',
      required: true,
    },
    {
      name: 'phones',
      type: 'array',
      label: 'شماره تماس‌ها (Phone Numbers)',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'برچسب (Label)',
          required: true,
        },
        {
          name: 'number',
          type: 'text',
          label: 'شماره تماس (Phone Number)',
          required: true,
          admin: {
            className: 'field-ltr',
            placeholder: '09123456789',
          },
          hooks: {
            beforeChange: [normalizeToLatin],
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'ایمیل (Email)',
    },
    {
      name: 'introduction',
      type: 'group',
      label: 'معرفی شعبه (Branch Introduction)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'عنوان (Title)',
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'زیرعنوان (Subtitle)',
        },
        {
          name: 'text',
          type: 'richText',
          label: 'متن معرفی (Introduction Text)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'تصویر معرفی (Introduction Image)',
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      label: 'آدرس (Address)',
      fields: [
        {
          name: 'text',
          type: 'richText',
          label: 'متن آدرس (Address Text)',
          required: true,
        },
        linkField({
          name: 'googleMapsLink',
          label: 'لینک گوگل مپ (Google Maps Link)',
        }),
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      label: 'سرویس‌ها (Services)',
      hasMany: true,
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
    seoFields(),
  ],
  timestamps: true,
}
