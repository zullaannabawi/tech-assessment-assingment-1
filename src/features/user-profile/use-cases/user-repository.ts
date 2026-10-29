/**
 * APPLICATION LAYER — User repository contract.
 */

import { User } from '../domain/user'

export interface UserRepository {
  getUser(): Promise<User>
}
