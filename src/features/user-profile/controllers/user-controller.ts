/**
 * CONTROLLER LAYER — User profile entry point.
 */

import { createUserRepository } from '@/composition/registry'
import { getUser } from '../use-cases/get-user'
import { User } from '../domain/user'

export async function getUserController(): Promise<User> {
  const repo = createUserRepository()
  return getUser(repo)
}
