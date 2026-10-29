import { describe, it, expect } from 'vitest'
import { User, displayName } from './user'

const dilan: User = {
  id: 1,
  firstName: 'Dilan',
  lastName: 'Morgan',
  email: 'dilan.1995@email.com',
  membership: 'Orbit Plus',
  walletBalance: 1050,
}

describe('Domain: User', () => {
  it('should compose the full name as first name + last name', () => {
    expect(displayName(dilan)).toBe('Dilan Morgan')
  })
})
