import type { CollectionConfig } from 'payload'

import { adminCeoManagerEditor } from '../access/hasRole'
import { contentImageSizes } from '../lib/upload/imageSizes'
import { sanitizeFileName } from '../lib/upload/filename'
import { STORAGE_PREFIX, dateBasedPrefix } from '../lib/upload/prefix'
import { adminThumbnail } from '../lib/upload/publicUrl'
import { immutableCacheHeaders } from '../lib/upload/cacheControl'

/**
 * Content photography — news and blog thumbnails, service and branch images,
 * galleries, Open Graph images. Stored under `media/<year>/<month>/`.
 *
 * Logos belong in `brand`, staff portraits in `people`, PDFs in `documents`.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'تصویر محتوا (Content Image)',
    plural: 'تصاویر محتوا (Content Images)',
  },
  admin: {
    description: 'عکس‌های خبر، مقاله، خدمات و گالری. لوگو، تصویر پرسنل و فایل PDF مجموعه‌ی جداگانه دارند.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'رسانه (Media)',
  },
  folders: true,
  access: {
    read: () => true,
    create: adminCeoManagerEditor,
    update: adminCeoManagerEditor,
    delete: adminCeoManagerEditor,
  },
  hooks: {
    beforeOperation: [sanitizeFileName],
    beforeChange: [dateBasedPrefix(STORAGE_PREFIX.media)],
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
    adminThumbnail: adminThumbnail('media', 'thumbnail'),
    crop: true,
    focalPoint: true,
    imageSizes: contentImageSizes,
    // Cap the stored original. Visitors are only ever served a variant, so a
    // 12MB camera JPEG is pure storage cost.
    resizeOptions: {
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    },
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
    ],
  },
}
