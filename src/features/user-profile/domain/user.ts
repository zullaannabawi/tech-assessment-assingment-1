/**
 * DOMAIN LAYER — User Profile Bounded Context
 * Pure TypeScript: the demo user model. The wallet balance is part of the
 * profile; it stays fixed for the demo (purchases never deduct it).
 */

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  membership: string
  walletBalance: number
}

export function displayName(user: User): string {
  return user.firstName + ' ' + user.lastName
}
