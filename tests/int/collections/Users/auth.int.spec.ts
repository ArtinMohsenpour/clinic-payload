import { getPayload } from 'payload'
import config from '../../../../src/payload.config'
import { seedUser, testUser } from '../../../helpers/seedUser'
import { describe, it, expect, beforeAll } from 'vitest'

describe('Users Collection Authentication', () => {
  let payload: any

  beforeAll(async () => {
    payload = await getPayload({ config })
    await seedUser()
  })

  it('can login with seeded user', async () => {
    const result = await payload.login({
      collection: 'users',
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    })

    expect(result.user.email).toBe(testUser.email)
    expect(result.token).toBeDefined()
  })
})
