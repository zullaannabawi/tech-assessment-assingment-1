import { describe, it, expect } from 'vitest'
import { getUser } from './get-user'
import { UserRepository } from './user-repository'
import { User } from '../domain/user'

const profile: User = {
  id: 1,
  firstName: 'Dilan',
  lastName: 'Morgan',
  email: 'dilan.1995@email.com',
  membership: 'Orbit Plus',
  walletBalance: 1050,
}

class MockUserRepository implements UserRepository {
  async getUser(): Promise<User> {
    return profile
  }
}

describe('Application: getUser use case', () => {
  it('should return the profile from the repository including the wallet balance', async () => {
    const result = await getUser(new MockUserRepository())

    expect(result.firstName).toBe('Dilan')
    expect(result.lastName).toBe('Morgan')
    expect(result.email).toBe('dilan.1995@email.com')
    expect(result.membership).toBe('Orbit Plus')
    expect(result.walletBalance).toBe(1050)
  })
})
