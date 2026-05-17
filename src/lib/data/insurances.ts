import type { Insurance } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getInsurances = async (): Promise<Insurance[]> => {
  const payload = await getPayload({ config })
  const insurances = await payload.find({
    collection: 'insurances',
    depth: 1,
    limit: 100,
    sort: '_order',
    overrideAccess: false,
  })
  return insurances.docs
}
