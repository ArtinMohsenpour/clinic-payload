import type { CollectionConfig } from 'payload'

import { adminCeoManager } from '../access/hasRole'
import { logoImageSizes } from '../lib/upload/imageSizes'
import { sanitizeFileName } from '../lib/upload/filename'
import { adminThumbnail } from '../lib/upload/publicUrl'
import { immutableCacheHeaders } from '../lib/upload/cacheControl'

/**
 * Logos and identity assets — site logo, favicons, insurance company logos.
 *
 * This is the only collection that accepts SVG, and writes are limited to
 * admin/CEO/manager. An SVG can carry inline script, and once served from the
 * bucket origin rather than the app origin it cannot reach app cookies —
 * keeping it isolated here means content editors never widen that surface.
 */
export const Brand: CollectionConfig = {
  slug: 'brand',
  labels: {
    singular: 'لوگو و هویت بصری (Brand Asset)',
    plural: 'لوگوها و هویت بصری (Brand Assets)',
  },
  admin: {
    description: 'لوگوی سایت، فاوآیکون و لوگوی شرکت‌های بیمه. تنها مجموعه‌ای که SVG می‌پذیرد.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'رسانه (Media)',
  },
  access: {
    read: () => true,
    create: adminCeoManager,
    update: adminCeoManager,
    delete: adminCeoManager,
  },
  hooks: {
    beforeOperation: [sanitizeFileName],
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
    adminThumbnail: adminThumbnail('brand', 'small'),
    crop: false,
    imageSizes: logoImageSizes,
    // SVG is never rasterised by Payload, so this only caps raster logos.
    resizeOptions: {
      width: 1200,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true,
    },
    mimeTypes: ['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg'],
  },
}
