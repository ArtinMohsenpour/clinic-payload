import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Footer } from '@/payload-types'

export const getFooter = async (): Promise<Footer> => {
  const payload = await getPayload({ config })
  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
  })

  return footer
}
