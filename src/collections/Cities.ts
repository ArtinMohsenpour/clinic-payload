import type { CollectionConfig } from 'payload'
import { adminCeoManager, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'

export const Cities: CollectionConfig = {
  slug: 'cities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager', 'content-editor'].includes(user.role as string)
    },
  },
  labels: {
    singular: 'شهر (City)',
    plural: 'شهرها (Cities)',
  },
  access: {
    create: adminCeoManager,
    read: anyone,
    update: adminCeoManager,
    delete: adminCeoManager,
  },
  hooks: {
    afterChange: [logChange('cities')],
    afterDelete: [logDelete('cities')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'نام شهر (City Name)',
      required: true,
    },
  ],
}
