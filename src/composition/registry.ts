/**
 * COMPOSITION ROOT — Dependency Injection Registry.
 *
 * Wires concrete infrastructure implementations to the interfaces the use
 * cases depend on. Only the composition root, controllers, and tests may
 * import this file — never domain or use-case code.
 */

import type { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { InMemoryDeviceRepository } from '@/features/product-catalog/infrastructure/in-memory-device-repository'
import type { UserRepository } from '@/features/user-profile/use-cases/user-repository'
import { InMemoryUserRepository } from '@/features/user-profile/infrastructure/in-memory-user-repository'

export function createDeviceRepository(): DeviceRepository {
  // Swap for `new ApiDeviceRepository()` to serve the catalogue over HTTP
  // from the Route Handlers in src/app/api/products.
  return new InMemoryDeviceRepository()
}

export function createUserRepository(): UserRepository {
  return new InMemoryUserRepository()
}
