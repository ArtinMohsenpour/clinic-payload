import type { CollectionConfig } from 'payload'
import { adminCeoManagerEditorMedical } from '../access/hasRole'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'رسانه (Media)',
    plural: 'رسانه‌ها (Media)',
  },
  admin: {},
  access: {
    read: () => true,
    create: adminCeoManagerEditorMedical,
    update: adminCeoManagerEditorMedical,
    delete: adminCeoManagerEditorMedical,
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
