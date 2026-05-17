import { getPayload } from 'payload'
import config from '../../../../src/payload.config'
import { seedUser, testUser } from '../../../helpers/seedUser'
import { describe, it, expect, beforeAll } from 'vitest'

describe('Users Collection', () => {
  let payload: any

  beforeAll(async () => {
    payload = await getPayload({ config })
    await seedUser()
  })

  it('allows an admin to create another user with a role', async () => {
    const newUserEmail = `new-user-${Date.now()}@example.com`
    const result = await payload.create({
      collection: 'users',
      data: {
        email: newUserEmail,
        password: 'password123',
        role: 'doctor',
      },
      // Admin context by default for Local API, but let's be explicit if we were testing access control
      // overrideAccess: false,
      // user: adminUser
    })

    expect(result.email).toBe(newUserEmail)
    expect(result.role).toBe('doctor')
  })
})
