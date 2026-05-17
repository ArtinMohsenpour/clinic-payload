import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Navbar } from '@/payload-types'

export const getNavbar = async (): Promise<Navbar> => {
  const payload = await getPayload({ config })
  const navbar = await payload.findGlobal({
    slug: 'navbar',
    depth: 2,
  })

  return navbar
}
