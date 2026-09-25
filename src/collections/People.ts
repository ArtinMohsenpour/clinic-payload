import type { CollectionConfig } from 'payload'

import { adminCeoManagerEditor } from '../access/hasRole'
import { portraitImageSizes } from '../lib/upload/imageSizes'
import { sanitizeFileName } from '../lib/upload/filename'
import { STORAGE_PREFIX, dateBasedPrefix } from '../lib/upload/prefix'
import { adminThumbnail } from '../lib/upload/publicUrl'
import { immutableCacheHeaders } from '../lib/upload/cacheControl'

/**
 * Staff and doctor portraits. Kept separate from content photography because
 * these are images of identifiable people: different retention expectations,
 * and fixed crops so the team grid stays even.
 */
export const People: CollectionConfig = {
  slug: 'people',
  labels: {
    singular: 'تصویر پرسنل (Staff Portrait)',
    plural: 'تصاویر پرسنل (Staff Portraits)',
  },
  admin: {
    description: 'عکس پرتره پزشکان و کارکنان. برش خودکار در نسبت‌های ثابت انجام می‌شود.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'رسانه (Media)',
  },
  access: {
    read: () => true,
    create: adminCeoManagerEditor,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    beforeOperation: [sanitizeFileName],
    beforeChange: [dateBasedPrefix(STORAGE_PREFIX.people)],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'متن جایگزین (Alt Text)',
      required: true,
    },
  ],
  upload: {
    modifyResponseHeaders: immutableCacheHeaders,
    adminThumbnail: adminThumbnail('people', 'avatar'),
    crop: true,
    focalPoint: true,
    imageSizes: portraitImageSizes,
    resizeOptions: {
      width: 2000,
      height: 2000,
      fit: 'inside',
      withoutEnlargement: true,
    },
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
}
