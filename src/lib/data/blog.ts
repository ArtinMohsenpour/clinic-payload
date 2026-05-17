import type { Blog, Media } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { lexicalToPlainText } from '@/lib/lexicalUtils'

export const getBlogPosts = async (search?: string): Promise<Blog[]> => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'blog',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
    overrideAccess: false,
  })

  if (!search) return docs

  const term = search.toLowerCase()
  return docs.filter((post) => {
    if (post.title.toLowerCase().includes(term)) return true
    const bodyText = lexicalToPlainText(post.text).toLowerCase()
    return bodyText.includes(term)
  })
}

export const getBlogPostBySlug = async (slug: string): Promise<Blog | null> => {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'blog',
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    overrideAccess: false,
  })
  return posts.docs[0] || null
}
