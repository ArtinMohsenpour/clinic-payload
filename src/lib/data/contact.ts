import type { Contact } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getContactData = async (): Promise<Contact> => {
  const payload = await getPayload({ config })
  const contact = await payload.findGlobal({
    slug: 'contact',
  })
  return contact
}
