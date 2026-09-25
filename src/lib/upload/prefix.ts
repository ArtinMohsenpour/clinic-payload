import type { CollectionBeforeChangeHook } from 'payload'

/**
 * S3 key prefixes. Each upload collection owns one top-level folder in the
 * bucket, so brand assets, portraits, documents and content photography never
 * mix and can be backed up or lifecycle-ruled independently.
 */
export const STORAGE_PREFIX = {
  media: 'media',
  brand: 'brand',
  people: 'people',
  documents: 'documents',
} as const

/**
 * Nests new uploads under `<root>/<year>/<month>/`.
 *
 * The plugin's static `prefix` option only supports a fixed string, but the
 * per-document `prefix` field it writes is what upload, delete and URL
 * generation all read — so overriding it here gives dated folders that stay
 * consistent for the life of the file.
 *
 * Only applied when a new file is actually being uploaded; editing metadata on
 * an existing document must not move its prefix away from where the object
 * really lives.
 */
export const dateBasedPrefix = (root: string): CollectionBeforeChangeHook => {
  return ({ data, req }) => {
    if (!req.file) return data

    const now = new Date()
    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')

    return { ...data, prefix: `${root}/${year}/${month}` }
  }
}
