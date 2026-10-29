/**
 * APPLICATION LAYER — Device repository contract.
 *
 * Use cases speak to this interface only; concrete implementations
 * (InMemory, Api) live in infrastructure and are injected from the
 * composition root (dependency inversion).
 */

import { Device } from '../domain/device'

export interface DeviceRepository {
  getDevices(): Promise<Device[]>
  getDeviceById(id: string): Promise<Device | null>
}
