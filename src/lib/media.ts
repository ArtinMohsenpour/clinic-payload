/**
 * Helpers for rendering uploads.
 *
 * Every image collection generates pre-resized WebP variants at upload time and
 * serves them straight from object storage. The frontend must therefore ask for
 * a *variant* rather than the original — rendering `doc.url` sends the full-size
 * file over the wire and skips the whole point of the resize step.
 */

type UploadSize = {
  url?: null | string
  width?: null | number
  height?: null | number
}

type UploadDoc = {
  alt?: null | string
  filename?: null | string
  height?: null | number
  mimeType?: null | string
  sizes?: null | Record<string, null | UploadSize>
  url?: null | string
  width?: null | number
}

export type MediaLike = null | number | string | undefined | UploadDoc

/** Variant ladders, widest last. */
export const CARD_VARIANTS = ['thumbnail', 'card', 'feature'] as const
export const HERO_VARIANTS = ['card', 'feature', 'hero'] as const
export const PORTRAIT_VARIANTS = ['avatar', 'card', 'portrait'] as const
export const LOGO_VARIANTS = ['small', 'medium'] as const

const absolute = (url: string): string => {
  if (/^https?:\/\//.test(url)) return url
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return `${serverUrl}${url}`
}

export const resolveUpload = (value: MediaLike): null | UploadDoc => {
  if (!value) return null
  if (typeof value === 'string') return { url: value }
  if (typeof value === 'number') return null
  return value
}

/**
 * URL for a single variant, falling back to the original when the variant does
 * not exist — which is the case for SVG logos and for video, neither of which
 * Payload resizes.
 */
export const mediaUrl = (value: MediaLike, variant?: string): null | string => {
  const doc = resolveUpload(value)
  if (!doc) return null

  const sized = variant ? doc.sizes?.[variant]?.url : null
  const url = sized || doc.url

  return url ? absolute(url) : null
}

/**
 * `srcset` across a variant ladder so the browser downloads the smallest file
 * that fits the slot. Returns undefined when there is nothing to choose from.
 */
export const mediaSrcSet = (
  value: MediaLike,
  variants: readonly string[],
): string | undefined => {
  const doc = resolveUpload(value)
  if (!doc?.sizes) return undefined

  const seen = new Set<string>()
  const entries: string[] = []

  for (const variant of variants) {
    const size = doc.sizes[variant]
    if (!size?.url || !size.width) continue
    if (seen.has(size.url)) continue

    seen.add(size.url)
    entries.push(`${absolute(size.url)} ${size.width}w`)
  }

  return entries.length > 1 ? entries.join(', ') : undefined
}

export const mediaAlt = (value: MediaLike, fallback = ''): string => {
  const doc = resolveUpload(value)
  return doc?.alt || fallback
}

export const isVideo = (value: MediaLike): boolean => {
  const doc = resolveUpload(value)
  return Boolean(doc?.mimeType?.startsWith('video/'))
}

export type GalleryImage = {
  /** Full-size variant, shown in the lightbox. */
  url: string
  /** Grid thumbnail. */
  thumbUrl?: string
  thumbSrcSet?: string
  alt?: string
}

/**
 * Maps a Payload gallery array into the shape `ImageGallery` renders, picking a
 * small variant for the grid and a large one for the lightbox — the grid should
 * never pay for full-resolution images the visitor may never open.
 */
export const toGalleryImages = (
  items?: null | ({ media?: MediaLike } | null)[],
): GalleryImage[] => {
  if (!items) return []

  return items.flatMap((item) => {
    const media = item?.media
    const url = mediaUrl(media, 'hero')
    if (!url) return []

    return [
      {
        url,
        thumbUrl: mediaUrl(media, 'card') ?? url,
        thumbSrcSet: mediaSrcSet(media, CARD_VARIANTS),
        alt: mediaAlt(media),
      },
    ]
  })
}
