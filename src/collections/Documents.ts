import type { CollectionConfig } from 'payload'

import { adminCeoManagerEditor } from '../access/hasRole'
import { sanitizeFileName } from '../lib/upload/filename'
import { STORAGE_PREFIX, dateBasedPrefix } from '../lib/upload/prefix'

/**
 * Downloadable files — patient forms, price lists, consent sheets.
 *
 * Never image-processed, and unlike the image collections these keep Payload
 * access control in front of them: requests are served through the app so a
 * document can be made non-public later without changing any stored URL.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'سند (Document)',
    plural: 'اسناد (Documents)',
  },
  admin: {
    description: 'فرم‌ها، تعرفه‌ها و فایل‌های قابل دانلود (PDF، Word، Excel).',
    defaultColumns: ['filename', 'title', 'updatedAt'],
    group: 'رسانه (Media)',
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: adminCeoManagerEditor,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    beforeOperation: [sanitizeFileName],
    beforeChange: [dateBasedPrefix(STORAGE_PREFIX.documents)],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'عنوان سند (Document Title)',
      required: true,
    },
  ],
  upload: {
    crop: false,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
}
