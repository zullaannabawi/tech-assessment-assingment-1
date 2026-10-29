/**
 * CONTROLLER LAYER — Device catalogue entry points.
 *
 * Thin adapters that resolve dependencies from the registry and delegate to
 * the use cases. Presentation code calls these instead of touching
 * repositories directly.
 */

import { createDeviceRepository } from '@/composition/registry'
import { getDevices } from '../use-cases/get-devices'
import { getDeviceById } from '../use-cases/get-device-by-id'
import { Device } from '../domain/device'

export async function getDevicesController(): Promise<Device[]> {
  const repo = createDeviceRepository()
  return getDevices(repo)
}

export async function getDeviceByIdController(id: string): Promise<Device> {
  const repo = createDeviceRepository()
  return getDeviceById(repo, id)
}

export { DeviceNotFoundError } from '../use-cases/get-device-by-id'
