/**
 * APPLICATION LAYER — Fetch the demo profile.
 */

import { User } from '../domain/user'
import { UserRepository } from './user-repository'

export async function getUser(repo: UserRepository): Promise<User> {
  return repo.getUser()
}
