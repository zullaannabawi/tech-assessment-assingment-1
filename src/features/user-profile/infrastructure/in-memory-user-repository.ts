/**
 * INFRASTRUCTURE LAYER — In-memory user repository.
 *
 * Simulates the original user API with its exact 450ms delay.
 */

import { User } from '../domain/user'
import { UserRepository } from '../use-cases/user-repository'
import { MOCK_USER } from './mock-user'

const USER_DELAY_MS = 450

export class InMemoryUserRepository implements UserRepository {
  async getUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, USER_DELAY_MS))
    return { ...MOCK_USER }
  }
}
