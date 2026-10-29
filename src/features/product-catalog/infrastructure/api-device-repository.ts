/**
 * INFRASTRUCTURE LAYER — HTTP device repository.
 *
 * Alternative to the InMemory repository: talks to the Route Handlers in
 * `src/app/api/products`. Not wired by default — the registry chooses the
 * implementation, which is the point of the repository abstraction.
 */

import { Device } from '../domain/device'
import { DeviceRepository } from '../use-cases/device-repository'

export class ApiDeviceRepository implements DeviceRepository {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  async getDevices(): Promise<Device[]> {
    const response = await fetch(`${this.baseUrl}/products`)
    if (!response.ok) {
      throw new Error('Failed to load devices.')
    }
    return response.json()
  }

  async getDeviceById(id: string): Promise<Device | null> {
    const response = await fetch(`${this.baseUrl}/products/${id}`)
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error('Failed to load the device.')
    }
    return response.json()
  }
}
