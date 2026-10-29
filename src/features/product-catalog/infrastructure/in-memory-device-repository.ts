/**
 * INFRASTRUCTURE LAYER — In-memory device repository.
 *
 * Simulates the original client-side APIs with their exact delays
 * (750ms list / 600ms detail) and always returns copies so callers can
 * never mutate the catalogue. Wired as the default implementation in the
 * composition registry.
 */

import { Device } from '../domain/device'
import { DeviceRepository } from '../use-cases/device-repository'
import { MOCK_DEVICES } from './mock-data'

const LIST_DELAY_MS = 750
const DETAIL_DELAY_MS = 600

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class InMemoryDeviceRepository implements DeviceRepository {
  private devices: Device[]

  constructor(initialData: Device[] = MOCK_DEVICES) {
    this.devices = [...initialData]
  }

  async getDevices(): Promise<Device[]> {
    await delay(LIST_DELAY_MS)
    return this.devices.map((device) => ({ ...device }))
  }

  async getDeviceById(id: string): Promise<Device | null> {
    await delay(DETAIL_DELAY_MS)
    const device = this.devices.find((d) => d.id === id)
    return device ? { ...device } : null
  }
}
