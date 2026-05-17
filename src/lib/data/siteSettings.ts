import { getPayload } from 'payload'
import config from '@payload-config'

export const getSiteSettings = async () => {
  const payload = await getPayload({ config })
  try {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    return settings
  } catch {
    return null
  }
}
