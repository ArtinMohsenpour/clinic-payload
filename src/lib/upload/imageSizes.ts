import type { ImageSize } from 'payload'

const webp = (quality: number) =>
  ({ format: 'webp' as const, options: { quality } }) satisfies ImageSize['formatOptions']

/**
 * Social preview images. Kept as JPEG on purpose — Telegram, WhatsApp and some
 * link unfurlers still render WebP inconsistently.
 */
const ogSize: ImageSize = {
  name: 'og',
  width: 1200,
  height: 630,
  fit: 'cover',
  position: 'centre',
  formatOptions: { format: 'jpeg', options: { quality: 82 } },
}

/**
 * Content photography: news heroes, blog thumbnails, service and branch images.
 * The frontend always renders one of these variants, never the original.
 */
export const contentImageSizes: ImageSize[] = [
  { name: 'thumbnail', width: 400, withoutEnlargement: true, formatOptions: webp(78) },
  { name: 'card', width: 768, withoutEnlargement: true, formatOptions: webp(78) },
  { name: 'feature', width: 1280, withoutEnlargement: true, formatOptions: webp(76) },
  { name: 'hero', width: 1920, withoutEnlargement: true, formatOptions: webp(74) },
  ogSize,
]

/** Staff and doctor portraits — fixed aspect ratios so the team grid stays even. */
export const portraitImageSizes: ImageSize[] = [
  { name: 'avatar', width: 256, height: 256, fit: 'cover', position: 'centre', formatOptions: webp(80) },
  { name: 'card', width: 480, height: 600, fit: 'cover', position: 'centre', formatOptions: webp(78) },
  { name: 'portrait', width: 800, height: 1000, fit: 'cover', position: 'centre', withoutEnlargement: true, formatOptions: webp(78) },
]

/**
 * Logos. SVG uploads skip resizing entirely (Payload does not rasterise SVG),
 * so these variants only ever apply to raster logos.
 */
export const logoImageSizes: ImageSize[] = [
  { name: 'small', width: 320, withoutEnlargement: true, formatOptions: webp(85) },
  { name: 'medium', width: 640, withoutEnlargement: true, formatOptions: webp(85) },
]
