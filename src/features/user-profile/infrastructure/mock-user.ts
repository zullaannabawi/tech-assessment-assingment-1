/**
 * INFRASTRUCTURE LAYER — Mock profile source.
 *
 * Keeps the raw snake_case payload exactly as the original inline "userApi"
 * returned it; the mapper below is the only place that translates the wire
 * format into the domain model.
 */

import { User } from '../domain/user'

interface UserApiResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  membership: string
  wallet_balance: number
}

const MOCK_USER_RESPONSE: UserApiResponse = {
  id: 1,
  first_name: 'Dilan',
  last_name: 'Morgan',
  email: 'dilan.1995@email.com',
  membership: 'Orbit Plus',
  wallet_balance: 1050,
}

export function mapUserResponse(response: UserApiResponse): User {
  return {
    id: response.id,
    firstName: response.first_name,
    lastName: response.last_name,
    email: response.email,
    membership: response.membership,
    walletBalance: response.wallet_balance,
  }
}

export const MOCK_USER: User = mapUserResponse(MOCK_USER_RESPONSE)
