import { getPayload } from 'payload'
import config from '@payload-config'
import type { Branch } from '@/payload-types'

export const getBranchBySlug = async (slug: string): Promise<Branch | null> => {
  const payload = await getPayload({ config })
  const branches = await payload.find({
    collection: 'branches',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    overrideAccess: false,
    depth: 2,
  })

  return branches.docs[0] || null
}

export const getBranches = async (): Promise<Branch[]> => {
  const payload = await getPayload({ config })
  const branches = await payload.find({
    collection: 'branches',
    limit: 100,
    overrideAccess: false,
    depth: 1,
  })
  return branches.docs
}
