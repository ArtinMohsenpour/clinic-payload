import crypto from 'crypto'
import path from 'path'

import type { CollectionBeforeOperationHook } from 'payload'

const MAX_BASE_LENGTH = 60

/**
 * Turns an uploaded filename into a key that is safe as an S3 object key and
 * as a public URL segment.
 *
 * The filename becomes the object key and the public URL verbatim, so spaces,
 * parentheses and non-Latin characters would produce percent-encoded URLs and
 * CDN cache mismatches. A short random token is appended so re-uploads never
 * collide (no more "logo (1).svg") and never serve a stale cached file.
 */
export const toSafeFileName = (originalName: string): string => {
  const rawExt = path.extname(originalName)
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, '')

  const slug = path
    .basename(originalName, rawExt)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining accent marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_BASE_LENGTH)
    .replace(/-+$/, '')

  const token = crypto.randomBytes(3).toString('hex')

  // Persian/Arabic filenames slugify to an empty string — fall back to "file"
  return `${slug || 'file'}-${token}${ext}`
}

/**
 * Collection hook: rewrites the incoming filename before Payload derives the
 * stored filename and the resized variants from it.
 */
export const sanitizeFileName: CollectionBeforeOperationHook = ({ operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return
  if (!req.file?.name) return

  req.file.name = toSafeFileName(req.file.name)
}
