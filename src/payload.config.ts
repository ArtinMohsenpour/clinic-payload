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
 * Public image collections are served straight from object storage:
 * `disablePayloadAccessControl` makes the stored `url` point at the bucket, so
 * image bytes never travel through the app container.
 *
 * `alwaysInsertFields` keeps the `prefix` column in the schema even when S3 is
 * switched off locally, so migrations generated on a dev machine match what
 * production actually runs.
 */
const publicImageStorage = s3Storage({
  acl: 'public-read',
  alwaysInsertFields: true,
  bucket: s3Bucket || 'unused',
  clientCacheKey: 's3:public',
  config: s3ClientConfig,
  enabled: s3Enabled,
  collections: {
    media: {
      prefix: STORAGE_PREFIX.media,
      disablePayloadAccessControl: true,
      generateFileURL: publicFileURL,
    },
    brand: {
      prefix: STORAGE_PREFIX.brand,
      disablePayloadAccessControl: true,
      generateFileURL: publicFileURL,
    },
    people: {
      prefix: STORAGE_PREFIX.people,
      disablePayloadAccessControl: true,
      generateFileURL: publicFileURL,
    },
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
