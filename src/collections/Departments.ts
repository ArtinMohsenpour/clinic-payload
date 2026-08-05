import type { CollectionConfig } from 'payload'
import { adminCeoManager, anyone } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    hidden: ({ user }) => !user,
  },
  labels: {
    singular: 'دپارتمان (Department)',
    plural: 'دپارتمان‌ها (Departments)',
  },
  access: {
    create: adminCeoManager,
    read: anyone,
    update: adminCeoManager,
    delete: adminCeoManager,
  },
  hooks: {
    afterChange: [logChange('departments')],
    afterDelete: [logDelete('departments')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'نام دپارتمان (Department Name)',
      required: true,
    },
  ],
}
