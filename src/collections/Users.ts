import type { CollectionConfig } from 'payload'
import { adminCeoManager } from '../access/hasRole'
import { logChange, logDelete } from '../hooks/logAudit'
import { normalizeToLatin } from '../hooks/normalizeToLatin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role', 'branch'],
    hidden: ({ user }) => {
      if (!user) return true
      return !['admin', 'ceo', 'manager'].includes(user.role as string)
    },
  },
  labels: {
    singular: 'کاربر (User)',
    plural: 'کاربران (Users)',
  },
  auth: true,
  access: {
    create: async ({ req }) => {
      const users = await req.payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: true,
      })
      if (users.totalDocs === 0) return true
      return adminCeoManager({ req })
    },
    read: () => true,
    update: adminCeoManager,
    delete: adminCeoManager,
    admin: ({ req: { user } }) => Boolean(user), // Allow all users to login to CMS
  },
  hooks: {
    afterChange: [logChange('users')],
    afterDelete: [logDelete('users')],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const users = await req.payload.find({
            collection: 'users',
            limit: 1,
            overrideAccess: true,
          })
          if (users.totalDocs === 0) {
            data.role = 'admin'
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'نام کامل (Full Name)',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const firstName = siblingData?.firstName || ''
            const lastName = siblingData?.lastName || ''
            return `${firstName} ${lastName}`.trim() || siblingData?.email
          },
        ],
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'نام (First Name)',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'نام خانوادگی (Last Name)',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'people',
      label: 'تصویر پروفایل (Profile Image)',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'شماره تلفن (Phone Number)',
      admin: {
        className: 'field-ltr',
        placeholder: '09123456789',
      },
      hooks: {
        beforeChange: [normalizeToLatin],
      },
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
      label: 'دپارتمان (Department)',
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      label: 'شعبه (Branch)',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'content-editor',
      options: [
        { label: 'مدیر سیستم (System Admin)', value: 'admin' },
        { label: 'مدیر عامل (CEO)', value: 'ceo' },
        { label: 'پرستار (Nurse)', value: 'nurse' },
        { label: 'پزشک (Doctor)', value: 'doctor' },
        { label: 'ویراستار محتوا (Content Editor)', value: 'content-editor' },
        { label: 'مدیر (Manager)', value: 'manager' },
        { label: 'حسابدار (Accountant)', value: 'accountant' },
        { label: 'انباردار (Stock Clerk)', value: 'stock-clerk' },
      ],
      label: 'نقش (Role)',
      saveToJWT: true,
    },
    {
      name: 'showInTeam',
      type: 'checkbox',
      label: 'نمایش در صفحه تیم (Show in Team Page)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
