/**
 * Image bytes are streamed by the app rather than the bucket (see the storage
 * comment in `payload.config.ts`), so every request costs the app container a
 * round trip to S3. Payload's static handler sets an ETag but no freshness
 * lifetime, which leaves browsers revalidating on every page view.
 *
 * Caching aggressively is safe here because filenames are immutable: every
 * upload gets a random token, so a given name always refers to the same bytes.
 * Replacing an image produces a new name, never new content under the old one.
 */
export const immutableCacheHeaders = ({ headers }: { headers: Headers }): Headers => {
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  return headers
}
