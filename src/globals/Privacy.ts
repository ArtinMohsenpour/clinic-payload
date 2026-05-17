import type { GlobalConfig, Block } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'

const PrivacyBlock: Block = {
  slug: 'privacyBlock',
  labels: {
    singular: 'بخش (Block)',
    plural: 'بخش‌ها (Blocks)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'عنوان (Title)',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      label: 'متن (Body)',
      required: true,
    },
  ],
}

export const Privacy: GlobalConfig = {
  slug: 'privacy',
  label: 'حریم خصوصی (Data Privacy Page)',
  admin: {
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
  },
  access: {
    read: anyone,
    update: adminCeoManagerEditor,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      label: 'عنوان صفحه (Page Title)',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'عنوان فرعی (Subtitle)',
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'محتوا (Content)',
      blocks: [PrivacyBlock],
    },
  ],
}
