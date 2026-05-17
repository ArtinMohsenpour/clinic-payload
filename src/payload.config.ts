import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { fa } from 'payload/i18n/fa'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  collections: [Users, Media, Departments, Cities, News, Blog, Services, Branches, AuditLogs, Insurances, About],
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
  plugins: [],
})
