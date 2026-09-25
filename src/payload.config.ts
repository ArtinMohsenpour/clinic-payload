import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { fa } from 'payload/i18n/fa'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Brand } from './collections/Brand'
import { People } from './collections/People'
import { Documents } from './collections/Documents'
import { Departments } from './collections/Departments'
import { Cities } from './collections/Cities'
import { News } from './collections/News'
import { Blog } from './collections/Blog'
import { Services } from './collections/Services'
import { Branches } from './collections/Branches'
import { AuditLogs } from './collections/AuditLogs'
import { Insurances } from './collections/Insurances'
import { About } from './collections/About'
import { Navbar } from './globals/Navbar'
import { Footer } from './globals/Footer'
import { Contact } from './globals/Contact'
import { Privacy } from './globals/Privacy'
import { OpeningHours } from './globals/OpeningHours'
import { SiteSettings } from './globals/SiteSettings'
import { STORAGE_PREFIX } from './lib/upload/prefix'
import { publicFileURL } from './lib/upload/publicUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Bucket = process.env.S3_BUCKET
const s3Enabled = Boolean(s3Bucket)

const s3ClientConfig = {
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.S3_ENDPOINT || '',
  region: process.env.S3_REGION || 'us-east-1',
  forcePathStyle: true,
}

/**
 * Liara's object storage refuses browser traffic on the bucket endpoint: a
 * request for a public object returns the bucket contents for `curl/*`, but a
 * bare `404 page not found` for any `Mozilla/*`, `Chrome/*`, `Safari/*` or
 * `Firefox/*` User-Agent. Nothing about the object or its ACL is involved —
 * the same key, in the same second, succeeds or fails on User-Agent alone.
 *
 * So image bytes must travel through the app: Payload registers its S3 static
 * handler at `/api/<collection>/file/<name>`, fetches from the bucket
 * server-side, and streams to the browser from our own origin. That handler
 * already supports ETag/304 and range requests.
 *
 * `S3_PUBLIC_URL` remains the opt-in for direct serving, for when a CDN or
 * custom domain that *does* answer browsers sits in front of the bucket. Do
 * not point it at `<bucket>.storage.c2.liara.site` — that is the blocked host.
 *
 * `alwaysInsertFields` keeps the `prefix` column in the schema even when S3 is
 * switched off locally, so migrations generated on a dev machine match what
 * production actually runs.
 */
const serveDirectFromBucket = Boolean(process.env.S3_PUBLIC_URL)

const publicCollection = (prefix: string) => ({
  prefix,
  ...(serveDirectFromBucket && {
    disablePayloadAccessControl: true as const,
    generateFileURL: publicFileURL,
  }),
})

const publicImageStorage = s3Storage({
  acl: 'public-read',
  alwaysInsertFields: true,
  bucket: s3Bucket || 'unused',
  clientCacheKey: 's3:public',
  config: s3ClientConfig,
  enabled: s3Enabled,
  collections: {
    media: publicCollection(STORAGE_PREFIX.media),
    brand: publicCollection(STORAGE_PREFIX.brand),
    people: publicCollection(STORAGE_PREFIX.people),
  },
})

/**
 * Documents keep Payload access control in front of them. The static handler
 * checks access and then 302-redirects to a short-lived presigned URL, so the
 * app authorises the request without ever streaming the file itself.
 */
const documentStorage = s3Storage({
  acl: 'private',
  alwaysInsertFields: true,
  bucket: process.env.S3_PRIVATE_BUCKET || s3Bucket || 'unused',
  clientCacheKey: 's3:documents',
  config: s3ClientConfig,
  enabled: s3Enabled,
  collections: {
    documents: {
      prefix: STORAGE_PREFIX.documents,
      signedDownloads: { expiresIn: 3600 },
    },
  },
})

export default buildConfig({
  /**
   * Payload defaults `serverURL` to `''`, and several of its URL helpers test
   * "is this link external?" with `url.startsWith(serverURL)` — which is true
   * for every string when the prefix is empty. Setting it explicitly keeps
   * bucket URLs from being rewritten into local `/api/.../file/...` paths.
   */
  serverURL: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ['/components/WelcomeMessage'],

    },
  },
  i18n: {
    supportedLanguages: { fa },
    fallbackLanguage: 'fa',
  },
  collections: [Users, Media, Brand, People, Documents, Departments, Cities, News, Blog, Services, Branches, AuditLogs, Insurances, About],
  globals: [Navbar, Footer, Contact, Privacy, OpeningHours, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'a-very-long-and-secure-secret-for-development',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  upload: {
    abortOnLimit: true,
    limits: { fileSize: 25 * 1024 * 1024 },
    responseOnLimit: 'حجم فایل نباید بیشتر از ۲۵ مگابایت باشد. (Maximum file size is 25MB.)',
  },
  plugins: [publicImageStorage, documentStorage],
})
