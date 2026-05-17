import type { GlobalConfig } from 'payload'
import { adminCeoManagerEditor, anyone } from '../access/hasRole'
import { linkField } from '../fields/link'

export const Navbar: GlobalConfig = {
  slug: 'navbar',
  label: 'منوی اصلی ( Navbar )',
  access: {
    read: anyone,
    update: adminCeoManagerEditor,
  },
  admin: {
    hideAPIURL: false,
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
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
      name: 'navItems',
      type: 'array',
      label: 'گزینه‌های منو (Menu Items)',
      labels: {
        singular: 'گزینه (Item)',
        plural: 'گزینه‌ها (Items)',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'نوع آیتم (Item Type)',
          options: [
            { label: 'لینک تکی (Single Link)', value: 'link' },
            { label: 'منوی کشویی (Dropdown Menu)', value: 'dropdown' },
          ],
          defaultValue: 'link',
          required: true,
        },
        linkField({
          name: 'link',
          label: 'لینک (Link)',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
          },
        }),
        {
          name: 'dropdownLabel',
          type: 'text',
          label: 'برچسب منوی کشویی (Dropdown Label)',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'dropdownItems',
          type: 'array',
          label: 'آیتم‌های منوی کشویی (Dropdown Items)',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            linkField({
              name: 'link',
              label: 'لینک (Link)',
            }),
          ],
        },
      ],
    },
  ],
}
