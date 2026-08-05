import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditor } from '../access/hasRole'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'رسانه (Media)',
    plural: 'رسانه‌ها (Media)',
  },
  admin: {},
  access: {
    read: () => true,
    create: adminCeoManagerEditor,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'متن جایگزین (Alt Text)',
      required: true,
    },
  ],
  upload: true,
}
