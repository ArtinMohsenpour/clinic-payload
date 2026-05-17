import type { Service, Media } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getServices = async (): Promise<Service[]> => {
  const payload = await getPayload({ config })
  const services = await payload.find({
    collection: 'services',
    depth: 1,
    limit: 100,
    sort: '_order',
    overrideAccess: false,
  })
  return services.docs
}

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const payload = await getPayload({ config })
  const services = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    overrideAccess: false,
  })
  return services.docs[0] || null
}
