import type { GetAdminThumbnail } from 'payload'

type UploadedFile = {
  filename?: null | string
  url?: null | string
}

/**
 * Base URL that public assets are served from.
 *
 * Prefers `S3_PUBLIC_URL` so a CDN or custom domain can be put in front of the
 * bucket later without touching any stored document. Falls back to the
 * path-style bucket URL, which is what `forcePathStyle: true` uploads to.
 */
export const publicAssetBase = (): string => {
  const explicit = process.env.S3_PUBLIC_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const endpoint = (process.env.S3_ENDPOINT || '').replace(/\/+$/, '')
  const bucket = process.env.S3_BUCKET || ''

  return `${endpoint}/${bucket}`
}

/**
 * Builds the browser-facing URL for a stored object. Filenames are already
 * sanitised on upload, so encoding here is a no-op safety net; the prefix is
 * left alone because its slashes are meaningful path separators.
 */
export const publicFileURL = ({
  filename,
  prefix = '',
}: {
  filename: string
  prefix?: string
}): string => {
  const key = [prefix, encodeURIComponent(filename)].filter(Boolean).join('/')
  return `${publicAssetBase()}/${key}`
}

/**
 * Admin thumbnail resolver.
 *
 * Passing `adminThumbnail: 'small'` makes Payload run the size's stored URL
 * through `generateFilePathOrURL`, whose "is this external?" test is
 * `!url.startsWith(config.serverURL)` — and `''.startsWith('')` is true, so an
 * unset `serverURL` classifies every bucket URL as local and rewrites it to
 * `/api/<collection>/file/<name>`. That route 500s for collections using
 * `disablePayloadAccessControl`, because they have no static handler.
 *
 * Resolving the URL here skips that branch, so admin previews work whether or
 * not `serverURL` is configured. Relative URLs are rebuilt from the filename
 * rather than reused, because a document moved between collections by a
 * migration still carries the old collection's path in its stored `url`.
 */
export const adminThumbnail =
  (collectionSlug: string, size: string): GetAdminThumbnail =>
  ({ doc }) => {
    const sizes = doc?.sizes as Record<string, undefined | UploadedFile> | undefined
    // SVG and video are never resized — fall back to the original file.
    const file: undefined | UploadedFile = sizes?.[size]?.filename ? sizes[size] : (doc as UploadedFile)

    if (file?.url && /^https?:\/\//.test(file.url)) return file.url
    if (file?.filename) return `/api/${collectionSlug}/file/${encodeURIComponent(file.filename)}`

    return null
  }
