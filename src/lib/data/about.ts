import { getPayload } from 'payload'
import config from '@payload-config'
import type { About as AboutType } from '@/payload-types'

export const getAboutSections = async (): Promise<AboutType[]> => {
  const payload = await getPayload({ config })
  const about = await payload.find({
    collection: 'about',
    depth: 1,
    limit: 100,
    sort: '_order',
    overrideAccess: false,
  })
  return about.docs
}
