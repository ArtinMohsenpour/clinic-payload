import type { GlobalConfig, Block } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { linkField } from '../fields/link'

const FooterRichText: Block = {
  slug: 'footerRichText',
  labels: {
    singular: 'متن پیشرفته (Rich Text)',
    plural: 'متون پیشرفته (Rich Texts)',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'محتوا (Content)',
      required: true,
    },
  ],
}

const FooterLink: Block = {
  slug: 'footerLink',
  labels: {
    singular: 'لینک (Link)',
    plural: 'لینک‌ها (Links)',
  },
  fields: [
    linkField({
      name: 'link',
      label: 'لینک (Link)',
    }),
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'فوتر - بخش پایینی (Footer)',
  access: {
    read: anyone,
    update: adminCeoManagerEditor,
  },
  admin: {
    hideAPIURL: false,
    hidden: ({ user }) => !user,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      label: 'لوگو (Logo)',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'columns',
      type: 'array',
      label: 'ستون‌های فوتر (Footer Columns)',
      labels: {
        singular: 'ستون (Column)',
        plural: 'ستون‌ها (Columns)',
      },
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'blocks',
          type: 'blocks',
          label: 'بلوک‌های محتوا (Content Blocks)',
          blocks: [FooterRichText, FooterLink],
        },
      ],
    },
  ],
}
