import { describe, it, expect } from 'vitest'
import { getUserController } from './user-controller'

describe('Controller: user controller (registry wiring)', () => {
  it('should resolve the demo Dilan Morgan profile via the registry', async () => {
    const user = await getUserController()

    expect(user.firstName).toBe('Dilan')
    expect(user.email).toBe('dilan.1995@email.com')
    expect(user.membership).toBe('Orbit Plus')
    expect(user.walletBalance).toBe(1050)
  })
})
