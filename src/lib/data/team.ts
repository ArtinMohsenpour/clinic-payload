import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

export async function getTeamMembers(): Promise<User[]> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'users',
    where: {
      showInTeam: {
        equals: true,
      },
    },
    depth: 1, // To get branch and department details
  })

  return docs
}
