import { getPayload } from 'payload'
import config from '../../src/payload.config'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  role: 'admin',
} as const

export const seedUser = async () => {
  const payload = await getPayload({ config })

  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
    limit: 1,
  })

  if (existingUser.docs.length > 0) {
    await payload.delete({
      collection: 'users',
      id: existingUser.docs[0].id,
    })
  }

  return await payload.create({
    collection: 'users',
    data: {
      email: testUser.email,
      password: testUser.password,
      role: testUser.role,
    },
  })
}
