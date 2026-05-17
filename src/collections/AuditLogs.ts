import type { CollectionConfig } from 'payload'
import { adminCeoManager } from '../access/hasRole'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collectionName', 'user', 'createdAt'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager'].includes(user.role as string)
    },
  },
  labels: {
    singular: 'گزارش حسابرسی (Audit Log)',
    plural: 'گزارشات حسابرسی (Audit Logs)',
  },
  access: {
    create: () => false, // Only system can create via hooks
    read: adminCeoManager,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'کاربر (User)',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collectionName',
      type: 'text',
      label: 'نام مجموعه (Collection Name)',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'docId',
      type: 'text',
      label: 'شناسه سند (Document ID)',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'docTitle',
      type: 'text',
      label: 'عنوان سند (Document Title)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'action',
      type: 'select',
      label: 'عملیات (Action)',
      required: true,
      options: [
        { label: 'ایجاد (Create)', value: 'create' },
        { label: 'ویرایش (Update)', value: 'update' },
        { label: 'حذف (Delete)', value: 'delete' },
        { label: 'انتشار (Publish)', value: 'publish' },
      ],
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
