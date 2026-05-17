import { getPayload } from 'payload'
import config from '@payload-config'
import type { News } from '@/payload-types'
import { lexicalToPlainText } from '@/lib/lexicalUtils'

export const getHeroNews = async (limit = 5): Promise<News[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    limit,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
  })

  return docs
}

export const getNewsByBranch = async (branchId: string, limit = 5): Promise<News[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    where: {
      branch: {
        equals: branchId,
      },
    },
    limit,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
  })

  return docs
}

export const getAllNews = async (searchTerm?: string): Promise<News[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    limit: 100,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
  })

  if (!searchTerm) return docs

  const term = searchTerm.toLowerCase()
  return docs.filter((item) => {
    if (item.title.toLowerCase().includes(term)) return true
    const bodyText = lexicalToPlainText(item.text).toLowerCase()
    return bodyText.includes(term)
  })
}

export const getNewsBySlug = async (slugOrId: string): Promise<News | null> => {
  const payload = await getPayload({ config })

  // Try slug first
  const { docs } = await payload.find({
    collection: 'news',
    where: {
      slug: {
        equals: slugOrId,
      },
    },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  if (docs[0]) return docs[0]

  // Fallback: try numeric ID (for news items without a slug)
  const numericId = Number(slugOrId)
  if (!Number.isNaN(numericId)) {
    try {
      return await payload.findByID({
        collection: 'news',
        id: numericId,
        depth: 2,
        overrideAccess: false,
      })
    } catch {
      return null
    }
  }

  return null
}
