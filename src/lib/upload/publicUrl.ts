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
